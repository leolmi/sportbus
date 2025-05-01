import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import {
  BUS_PREFIX, getDayNumber,
  LocalContext,
  NotificationType,
  Session, SessionOnDay,
  SPORTBUS_SESSION_POLLING_TIMEOUT,
  SPORTBUS_USER_OPTIONS_FEATURE, updateIfChanged
} from '@olmi/model';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, of, take } from 'rxjs';
import { AppUserOptions, SPORTBUS_API, SPORTBUS_MANAGER } from '@olmi/common';
import { FALLBACK_PAGE_ROUTE } from '../default.routes';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  EditorBase,
  FooterToolbarComponent,
  SessionEditorComponent,
  SessionHeaderComponent,
  SettingsEditorComponent
} from '@olmi/components';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    FlexModule,
    SessionHeaderComponent,
    FooterToolbarComponent,
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    SettingsEditorComponent,
    SessionEditorComponent
  ],
  selector: 'sportbus-session',
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionComponent extends EditorBase implements OnDestroy {
  readonly code$: BehaviorSubject<string>;
  readonly opening$: BehaviorSubject<boolean>;
  private _timeout: any;

  constructor() {
    super();
    this.opening$ = new BehaviorSubject<boolean>(true);
    const o = AppUserOptions.getFeatures<any>(SPORTBUS_USER_OPTIONS_FEATURE);
    LocalContext.onLevel('debug').do(() =>
      console.log(...BUS_PREFIX, 'init session to last storage value >', o.session || ''));
    this.code$ = new BehaviorSubject<string>(o.session || '');

    const route = inject(ActivatedRoute);
    route.params.subscribe(p => {
      const sid = (<any>p)?.id || '';
      if (sid) {
        LocalContext.onLevel('debug').do(() =>
          console.log(...BUS_PREFIX, 'set session to url value >', sid));
        this.code$.next(sid);
      }
    });

    this.code$
      .pipe(filter(code => !!code), take(1))
      .subscribe(() => this._refreshSession(true));

    combineLatest([this.code$, this.manager.date$])
      .pipe(distinctUntilChanged(([c1, d1], [c2, d2]) => c1 === c2))
      .subscribe(() => this._refreshSessionOnDay());
  }

  private _fallBack(message?: string, type = NotificationType.error) {
    if (message) this.notifier.notify(message, type);
    AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { session: '' });
    this._router.navigate([FALLBACK_PAGE_ROUTE]);
  }

  private _resetTimeout(handler?: TimerHandler) {
    if (this._timeout) clearTimeout(this._timeout);
    const timeout = this.state.info.pollingTimeout || SPORTBUS_SESSION_POLLING_TIMEOUT;
    if (handler) this._timeout = setTimeout(handler, timeout);
  }

  private _refreshSession(first = false) {
    // se la sessione esiste la apre altrimenti dirotta sulla FALLBACK
    this.interaction.getSession(this.code$.value)
      .pipe(catchError(err => {
        console.error(...BUS_PREFIX, 'error while opening session', err);
        return of(undefined);
      }))
      .subscribe((ss: Session|undefined) => {
        if (!ss) return this._fallBack(`session not accessible`);
        this.manager.open(ss);
        this._refreshSessionOnDay(first);
        if (first) {
          AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { session: ss._id });
          this.opening$.next(false);
        }
        this._resetTimeout(() => this._refreshSession());
      });
  }

  private _refreshSessionOnDay(opening = false) {
    const date = this.manager.date$.value;
    const session = this.code$.value;
    this.interaction.getSessionOnDay(session, date)
      .pipe(catchError(err => {
        console.error(...BUS_PREFIX, 'error while opening session on day', err);
        return of(undefined);
      }))
      .subscribe((ss: SessionOnDay|undefined) => {
        ss = ss || new SessionOnDay({ date: getDayNumber(date), session })
        this.manager.openSod(ss);
      });
  }


  override ngOnDestroy() {
    super.ngOnDestroy();
    this._resetTimeout();
  }

  exitSession() {
    this._resetTimeout();
    this._fallBack();
    this.manager.close();
  }

  share() {

  }

  onchange(e: any) {
    const v = e.target.value;
  }
}
