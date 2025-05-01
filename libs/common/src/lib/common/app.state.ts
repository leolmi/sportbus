import { inject, InjectionToken } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, map, Observable, take } from 'rxjs';
import { keys as _keys, values as _values } from 'lodash';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  BUS_PREFIX,
  ButtonsStatus,
  DEFAULT_THEME,
  Dictionary,
  Layout,
  LocalContext, MenuItem, mergeStatus, Session,
  setBodyClass,
  SPORTBUS_USER_OPTIONS_FEATURE, SportbusInfo, SYSTEM_MENU_CODE,
  THEME_CLASS, THEME_DARK, THEME_LIGHT,
  THEME_OTHER,
  toggleClass
} from '@olmi/model';
import { AppUserOptions } from './user-options';
import { DOCUMENT } from '@angular/common';
import { SPORTBUS_API } from './interaction';
import { SPORTBUS_PAGES, SportbusPageManifest } from './sportbus-page.manifest';

const MAX_WIDTH = 1400;
const COMPACT_WIDTH = 800;
const MATCHES: Dictionary<string> = {
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  narrow: `(max-width: ${MAX_WIDTH}px)`,
  compact: `(max-width: ${COMPACT_WIDTH}px)`,
}

export class SportbusState {
  static version: string = '';

  private readonly _router = inject(Router);
  private readonly _doc = inject(DOCUMENT);
  private readonly _manifests = inject(SPORTBUS_PAGES);
  private readonly _layout = inject(BreakpointObserver);
  private readonly _interaction = inject(SPORTBUS_API);
  private readonly _changed$: BehaviorSubject<any>;

  private  _info$: BehaviorSubject<SportbusInfo>;
  layout$: BehaviorSubject<Layout>;
  theme$: BehaviorSubject<string>;
  title$: BehaviorSubject<string>;
  isDebugMode$: Observable<boolean>;
  manifest$: BehaviorSubject<SportbusPageManifest|undefined>;
  menu$: BehaviorSubject<MenuItem[]>;
  status$: BehaviorSubject<ButtonsStatus>;

  menuHandler?: (item: MenuItem) => void;

  get pages() {
    return (this._manifests||[]).filter(m => !m.disabled);
  }

  constructor() {
    this._changed$ = new BehaviorSubject<any>({});
    this._info$ = new BehaviorSubject<SportbusInfo>(new SportbusInfo());
    this.layout$ = new BehaviorSubject<Layout>({});
    this.manifest$ = new BehaviorSubject<SportbusPageManifest|undefined>(this._manifests.find(m => m.default));
    this.menu$ = new BehaviorSubject<MenuItem[]>([]);
    this.status$ = new BehaviorSubject<ButtonsStatus>(new ButtonsStatus());
    const o = AppUserOptions.getFeatures(SPORTBUS_USER_OPTIONS_FEATURE, { theme: DEFAULT_THEME });
    this.theme$ = new BehaviorSubject<string>(o.theme);
    this.title$ = new BehaviorSubject<string>('');
    this.isDebugMode$ = LocalContext.changed$.pipe(map(() => LocalContext.isLevel('debug')));


    this._layout
      .observe(_values(MATCHES))
      .subscribe(s => {
        const l: Layout = {};
        _keys(MATCHES).forEach(k => (<any>l)[k] = s.breakpoints[MATCHES[k]]);
        this.layout$.next(l);
      });


    this.theme$.subscribe(theme => {
      const other = THEME_OTHER[theme];
      setBodyClass(this._doc, THEME_CLASS[theme], THEME_CLASS[other]);
      AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { theme });
    });

    combineLatest([this.theme$, LocalContext.changed$])
      .subscribe(([t, c]) => this.updateStatus(calcStatusForSystemMenu(t)));

    this.layout$.subscribe(l =>
      _keys(l).forEach(k =>
        toggleClass(this._doc.body, `layout-${k}`, (<any>l)[k])));

    this._router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects))
      .subscribe(url => {
        const manifest = this.pages.find(m => !!m.route && url.startsWith(`/${m.route}`));
        if (manifest && this.manifest$.value?.route !== manifest.route) this.manifest$.next(manifest);
      });

    combineLatest([this.manifest$, this._info$, this.layout$, this.status$, this._changed$]).pipe(
      filter(([m,i,l,s,c]) => !!m && !!i))
      .subscribe(([manifest, info, layout, status, c]) => {
        const menu = (!!layout?.narrow) ? manifest?.narrowMenu : manifest?.menu;
        if (manifest) {
          this.title$.next(`${manifest.title} ${info.version||''}`);
        }
        this._updateMenuStatus(menu, status);
        this.menu$.next(menu||[]);
      })

    this._interaction.ping()
      .pipe(filter(i => !!i), take(1))
      .subscribe((i: SportbusInfo) =>
        this._info$.next(i));
  }

  get info() {
    return this._info$.value;
  }

  private _updateMenuStatus(menu?: MenuItem[], status?: ButtonsStatus) {
    const s = status || this.status$.value || new ButtonsStatus();
    (menu||[]).forEach(mi => {
      mi.hidden = !!s.hidden[mi.code||''];
      mi.disabled = !!s.disabled[mi.code||''];
      mi.active = !!s.active[mi.code||''];
      mi.routeActive = !!s.routeActive[mi.code||''];
      if (!!s.text[mi.code||'']) mi.text = s.text[mi.code||''];
      if (!!s.icon[mi.code||'']) mi.icon = s.icon[mi.code||''];
      if (!!s.color[mi.code||'']) mi.color = s.color[mi.code||''];
      if ((mi.subMenu || []).length > 0) {
        this._updateMenuStatus(mi.subMenu, s);
      }
    });
  }

  private _handleSystemMenu(item: MenuItem) {
    switch (item.code) {
      case SYSTEM_MENU_CODE.restoreSettings:
        AppUserOptions.reset();
        break;
      case SYSTEM_MENU_CODE.darkTheme:
        this.theme$.next(THEME_DARK);
        break;
      case SYSTEM_MENU_CODE.lightTheme:
        this.theme$.next(THEME_LIGHT);
        break;
      case SYSTEM_MENU_CODE.globalDebug:
        LocalContext.toggleLevel('debug');
        break;
      case SYSTEM_MENU_CODE.management:
        this._router.navigate(['management'])
        break;
      case SYSTEM_MENU_CODE.home:
        this._router.navigate(['access'])
        break;
      default:
        console.warn(...BUS_PREFIX, 'unknown system menu item', item);
        break
    }
  }

  closeSession() {
    AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { session: '' });
    this._router.navigate(['access']);
  }

  updateStatus(chs: Partial<ButtonsStatus>) {
    this.status$.next(mergeStatus(this.status$.value, chs));
  }

  handleMenuItem(item?: MenuItem) {
    if (!item) return;
    switch (item.logic) {
      case 'system':
        this._handleSystemMenu(item);
        break;
      default:
        if (this.menuHandler) {
          this.menuHandler(item);
        } else {
          console.warn(...BUS_PREFIX, 'unknown page menu item', item);
        }
        break;
    }
  }
}

export const SPORTBUS_STATE = new InjectionToken<SportbusState>('SPORTBUS_STATE');


export const calcStatusForSystemMenu = (theme: string): Partial<ButtonsStatus> => {
  return {
    hidden: {
      [SYSTEM_MENU_CODE.darkTheme]: theme === THEME_DARK,
      [SYSTEM_MENU_CODE.lightTheme]: theme === THEME_LIGHT,
    },
    active: {
      [SYSTEM_MENU_CODE.globalDebug]: LocalContext.isLevel('debug')
    }
  }
}
