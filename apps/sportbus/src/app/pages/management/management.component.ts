import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { DateFormatPipe, EditorBase, MainToolbarComponent } from '@olmi/components';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  LocalContext,
  NotificationType,
  Session,
  SPORTBUS_USER_OPTIONS_FEATURE,
  SYSTEM_MENU_ITEMS,
  THEME_DARK,
  THEME_ICON,
  THEME_LIGHT
} from '@olmi/model';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, map, Observable, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppUserOptions, I18nDirective, I18nPipe } from '@olmi/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import KEYS from '../../../../../../resources.keys';

@Component({
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    DateFormatPipe,
    I18nDirective,
    I18nPipe,
    MatMenu
  ],
  selector: 'sportbus-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementComponent extends EditorBase {
  protected readonly SYSTEM_MENU_ITEMS = SYSTEM_MENU_ITEMS;
  protected readonly THEME_DARK = THEME_DARK;

  private _sessions$: BehaviorSubject<Session[]>;
  filterText$: BehaviorSubject<string>;
  sessions$: Observable<Session[]>;
  accessKey$: BehaviorSubject<string>;
  isAuthenticated$: BehaviorSubject<boolean>;

  constructor() {
    super();
    this.handleMenu = true;
    this._sessions$ = new BehaviorSubject<Session[]>([]);
    this.filterText$ = new BehaviorSubject<string>('');
    this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
    this.accessKey$ = new BehaviorSubject<string>('');
    this.sessions$ = combineLatest([this._sessions$, this.filterText$])
      .pipe(map(([ss, txt]: [Session[], string]) =>
        ss.filter(s => isMatch(s, txt))));

    this._checkAuthentication();
    this.isAuthenticated$
      .pipe(distinctUntilChanged(), filter(a => !!a))
      .subscribe(() => {
        this.accessKey$.next('');
        this._refresh();;
      });
  }

  private _checkAuthentication() {
    this.interaction.checkManagementAuth()
      .pipe(catchError((err) => {
        console.error('error while check management access', err);
        return of(false);
      }))
      .subscribe(r => this.isAuthenticated$.next(!!r));
  }

  private _refresh() {
    this.interaction.getSessions().subscribe(ss => this._sessions$.next(ss));
  }

  logout() {
    AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { managementKey: '' });
    this._checkAuthentication();
  }

  updateAccessKey(e: any) {
    this.accessKey$.next(e.target.value||'');
    AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { managementKey: this.accessKey$.value });
    this._checkAuthentication();
  }

  updateFilter(e: any) {
    this.filterText$.next(e.target.value||'');
  }

  clearFilter() {
    this.filterText$.next('');
  }

  exit() {
    this._router.navigate(['']);
  }

  deleteAllSod() {
    this._confirm.showYesNo(`Delete all session-an-day?`, () =>
      this.interaction.deleteAllSod().subscribe(dr => {
        if (dr) {
          this.notifier.notify('session-on-days deleted successfully', NotificationType.success);
        } else {
          this.notifier.notify('cannot delete session-on-days', NotificationType.warning);
        }
      }));
  }

  toggleDebug() {
    LocalContext.toggleLevel('debug');
  }

  deleteSession(ses: Session) {
    this._confirm.showYesNo(`Delete session "${ses.code}" (${new Date(ses.lu).toLocaleDateString()})?`, () =>
      this.interaction.deleteSession(ses).subscribe(dr => {
        if (dr) {
          this.notifier.notify(`session ${ses.code} deleted successfully`, NotificationType.success);
          this._refresh();
        } else {
          this.notifier.notify('cannot delete session', NotificationType.warning);
        }
      }));
  }

  deleteSessionSods(ses: Session) {
    this._confirm.showYesNo(`Delete all session-on-day data for session "${ses.code}"?`, () =>
      this.interaction.deleteSod(ses.code).subscribe(dr => {
        if (dr) {
          this.notifier.notify(`session-on-day for session ${ses.code} deleted successfully`, NotificationType.success);
        } else {
          this.notifier.notify('cannot delete session-on-day data', NotificationType.warning);
        }
      }));
  }

  openSession(ses: Session) {
    window.open(`./session/${ses.code}`, "_blank");
  }

  protected readonly KEYS = KEYS;
}


const isMatch = (ses: Session, txt: string): boolean => {
  return !txt || `${ses.code||''}`.toLowerCase().includes(`${txt||''}`.toLowerCase());
}
