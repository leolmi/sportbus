import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  Pipe,
  PipeTransform,
  Renderer2
} from '@angular/core';
import { DEFAULT_LOCALE, Locale, Locales, SPORTBUS_USER_OPTIONS_FEATURE } from '@olmi/model';
import { AppUserOptions } from '@olmi/common';
import RESOURCES from '../../../../../resources';
import KEYS from '../../../../../resources.keys';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

export const getNavigatorCompatibleLocale = (ul: string): Locale => {
  let xl = Locales.find(l => l === ul);
  const nl = (navigator.language||'').split('-')[0];
  if (!xl) xl = Locales.find(l => l === nl);
  return xl || DEFAULT_LOCALE;
}

const getLocale = (): Locale => {
  const o = AppUserOptions.getFeatures(SPORTBUS_USER_OPTIONS_FEATURE, { locale: '' });
  return getNavigatorCompatibleLocale(o.locale);
}

export const dateLocaleFactory = () => {
  const locale = getLocale();
  return `${locale.toLowerCase()}-${locale.toUpperCase()}`;
}

export class i18n {
  private readonly doc = inject(DOCUMENT);
  locale$: BehaviorSubject<Locale>;

  constructor() {
    const locale = getLocale();
    this.locale$ = new BehaviorSubject<Locale>(locale);
    // imposta la localizzazione globale
    (<any>window)['LOCALIZE'] = this.localize;
    this.doc.documentElement.lang = locale;
  }

  get locale() {
    return this.locale$.value;
  }

  setLocale(locale: Locale) {
    this.locale$.next(locale);
    AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { locale });
  }

  localize(key: string, ...args: any[]) {
    const base: any = (<any>RESOURCES)[this.locale$.value]||{};
    key = (<any>KEYS)[key]||key;
    let result: string = base[key]||key;
    (args||[]).forEach((a, i) => {
      const rgx = new RegExp('\{${i}}', 'gm');
      result = result.replace(rgx, `${a||''}`);
    });
    return result;
  }
}

export const SPORTBUS_I18N = new InjectionToken<i18n>('SPORTBUS_I18N');


@Pipe({
  name: 'i18n',
  standalone: true
})
export class I18nPipe implements PipeTransform {
  i18n = inject(SPORTBUS_I18N);

  transform(key: string, args?: any[]): string {
    return this.i18n.localize(key, ...args||[]);
  }
}

@Directive({
  standalone: true,
  selector: '[spb-i18n]'
})
export class I18nDirective implements AfterViewInit {
  renderer = inject(Renderer2);
  i18n = inject(SPORTBUS_I18N);
  host = inject(ElementRef);

  ngAfterViewInit() {
    const target = this.host.nativeElement;
    if (target) {
      const text = this.i18n.localize(target.textContent || '');
      setTimeout(() => this.renderer.setProperty(target, 'textContent', text));
    }
  }
}


