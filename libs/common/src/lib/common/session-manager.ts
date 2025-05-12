import { BehaviorSubject, catchError, combineLatest, map, Observable, of } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { cloneDeep as _clone, extend as _extend, get as _get, set as _set } from 'lodash';
import {
  BUS_PREFIX,
  CalendarItem,
  getDayNumber, isEmptyCalendarItem, isEmptyString,
  LocalContext, Message,
  NotificationType, Person,
  Session, SessionContext,
  SessionOnDay, SPORTBUS_USER_OPTIONS_FEATURE,
  updateIfLuChanged, use
} from '@olmi/model';
import { SPORTBUS_API } from './interaction';
import { SPORTBUS_NOTIFIER } from './notifier';
import { SPORTBUS_STATE } from './app.state';
import { ConfirmDialogUtility } from '@olmi/components';
import { Clipboard } from '@angular/cdk/clipboard';
import { AppUserOptions } from './user-options';
import { SPORTBUS_I18N } from './i18n';

export class SessionManager {
  private readonly _clipboard = inject(Clipboard);
  private readonly _interaction = inject(SPORTBUS_API);
  private readonly _notifier = inject(SPORTBUS_NOTIFIER);
  private readonly _state = inject(SPORTBUS_STATE);
  private readonly _i18n = inject(SPORTBUS_I18N);
  private readonly _confirm = inject(ConfirmDialogUtility);
  private _loadingSod$: BehaviorSubject<number>;

  session$: BehaviorSubject<Session|undefined>;
  sessionOnDay$: BehaviorSubject<SessionOnDay|undefined>;
  context$: Observable<SessionContext>;
  date$: BehaviorSubject<Date>;
  userName$: BehaviorSubject<string>;
  chatPlaceholder$: Observable<string>;
  tempMessage$: BehaviorSubject<string>;

  isLoadingSod$: Observable<boolean>;

  dayCalendarItems$: Observable<CalendarItem[]>;
  dayHasCalendarItems$: Observable<boolean>;

  constructor() {
    this.session$ = new BehaviorSubject<Session | undefined>(undefined);
    const today = new Date(Date.now());
    this.date$ = new BehaviorSubject<Date>(today);
    this.sessionOnDay$ = new BehaviorSubject<SessionOnDay|undefined>(undefined);
    this._loadingSod$ = new BehaviorSubject<number>(0);
    const o = AppUserOptions.getFeatures<any>(SPORTBUS_USER_OPTIONS_FEATURE);
    this.userName$ = new BehaviorSubject<string>(o.userName||'');
    this.tempMessage$ = new BehaviorSubject<string>('');

    this.chatPlaceholder$ = this.userName$.pipe(map(un =>
      isEmptyString(un)? this._i18n.localize('your name is undefined') : ''))
    this.context$ = combineLatest([this.session$, this.sessionOnDay$])
      .pipe(map(([ses, sod]) => <SessionContext>{ ses, sod }));

    this.isLoadingSod$ = this._loadingSod$.pipe(map((n) => !!n));

    this.dayCalendarItems$ = combineLatest([this.session$, this.sessionOnDay$, this.date$]).pipe(
      map(([ses, sod, date]: [Session | undefined, SessionOnDay | undefined, Date]) => {
        return [
          ...(ses?.calendar || []).filter(i => i.dayOfWeek === date.getDay() && !isEmptyCalendarItem(i)),
          ...(sod?.calendar || []).filter(i => i.dayOfWeek === date.getDay() && !isEmptyCalendarItem(i))
        ];
      }));
    this.dayHasCalendarItems$ = this.dayCalendarItems$.pipe(map(items =>
      !!items.find(i => !isEmptyCalendarItem(i))));
    // il cambio data annulla il sessionOnDay
    this.date$
      .subscribe((d) => {
        this.sessionOnDay$.next(undefined);
        this._loadingSod$.next(getDayNumber(d));
      });
  }

  private _save(session: Session|undefined) {
    if (session) this._interaction.updateSession(session)
      .pipe(catchError(err => {
        const message = 'error while saving changes';
        console.error(...BUS_PREFIX, message, err);
        this._notifier.notify(message, NotificationType.error);
        return of(undefined)
      }))
      .subscribe(r => {
        if (r) {
          LocalContext.onLevel('debug').do(() =>
            console.log(...BUS_PREFIX, 'session updated', r));
        }
      });
  }

  private _saveSod(sod: SessionOnDay|undefined) {
    if (sod) this._interaction.updateSessionOnDay(sod)
      .pipe(catchError(err => {
        const message = 'error while saving day changes';
        console.error(...BUS_PREFIX, message, err);
        this._notifier.notify(message, NotificationType.error);
        return of(undefined)
      }))
      .subscribe(r => {
        if (r) {
          LocalContext.onLevel('debug').do(() =>
            console.log(...BUS_PREFIX, 'session-on-day updated', r));
        }
      });
  }

  get session() {
    return this.session$.value;
  }

  get sessionOnDay() {
    return this.sessionOnDay$.value;
  }

  updateSession(handler: (s: Session) => boolean) {
    const cs = _clone(this.session$.value);
    if (cs && handler(cs)) {
      cs.lu = Date.now();
      this.session$.next(cs);
      this._save(cs);
    }
  }

  updateSessionOnDay(handler: (s: SessionOnDay) => boolean) {
    let cs = _clone(this.sessionOnDay$.value);
    if (!cs) cs = new SessionOnDay();
    if (handler(cs)) {
      cs.lu = Date.now();
      cs.date = getDayNumber(this.date$.value);
      cs.session = this.session?.code||'';
      this.sessionOnDay$.next(cs);
      this._saveSod(cs);
    }
  }

  updateUserName(v: any, path?: string) {
    const userName = path ? _get(v, path)||'' : `${v||''}`;
    // TODO:  potrebbe validare il nome su quelli già presenti con dei messaggi
    //        in chat, evitando che possa mettere un nome già in uso
    this.userName$.next(userName);
    AppUserOptions.updateFeature(SPORTBUS_USER_OPTIONS_FEATURE, { userName });
  }

  updateValue(v: any, path: string, sourcePath?: string) {
    this.updateSession((s) => {
      if (sourcePath) v = _get(v, sourcePath);
      if (s) _set(s, path, v);
      return !!s;
    });
  }

  open(ss: Session) {
    updateIfLuChanged(this.session$, ss, (s1, s2) =>
      s1?.code !== s2?.code);
  }

  openSod(sod: SessionOnDay|undefined) {
    updateIfLuChanged(this.sessionOnDay$, sod, (s1, s2) =>
      s1?.session !== s2?.session || s1?.date !== s2?.date);
    if (sod?.date === this._loadingSod$.value) this._loadingSod$.next(0);
  }

  close() {
    this._confirm.showYesNo('Do you want to close the current session?', () => {
      // resetta la sessione
      this.session$.next(undefined);
      // resetta il giorno
      const today = new Date(Date.now());
      this.date$.next(today);
      this._state.closeSession();
    });
  }

  share() {
    this._clipboard.copy(this._interaction.getSessionUrl(this.session?.code||''));
    this._notifier.notify('url copied successfully', NotificationType.success);
  }

  setDate(d: Date) {
    this.date$.next(d);
  }

  /**
   * aggiona il soggetto sia che faccia parte della sessione o della sessione-giornaliera
   * @param prs
   */
  updatePerson(prs: Person) {
    if (!!(this.session?.persons||[]).find(p => p.code === prs.code)) {
      this.updateSession((ses) => {
        const op = ses.persons.find(p => p.code === prs.code);
        _extend(op, prs);
        return true;
      });
    } else {
      this.updateSessionOnDay((sod) => {
        let op = sod.persons.find(p => p.code === prs.code);
        if (!op) {
          sod.persons.push(prs);
        } else {
          _extend(op, prs);
        }
        return true;
      });
    }
  }

  updateTempMessage(e: any) {
    this.tempMessage$.next(e.target.value||'');
  }

  send() {
    if (isEmptyString(this.tempMessage$.value) || isEmptyString(this.userName$.value)) return;
    this.updateSessionOnDay((sod) => {
      sod.messages.push(new Message({
        date: Date.now(),
        owner: this.userName$.value,
        text: this.tempMessage$.value
      }));
      this.tempMessage$.next('');
      return true;
    });
  }

  log() {
    console.log('SESSION', this.session);
    console.log('SESSION-ON-DAY', this.sessionOnDay);
  }
}

export const SPORTBUS_MANAGER = new InjectionToken<SessionManager>('SPORTBUS_MANAGER');
