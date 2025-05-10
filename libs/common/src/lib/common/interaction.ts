import { inject, InjectionToken } from '@angular/core';
import { combine, dayToString, Environment, Session, SessionOnDay } from '@olmi/model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { getManagementKey } from './user-options';

const API: any = {
  info: 'info',
  session: 'session',
  create: 'create',
  sessionOnDay: 'session-on-day',
  delete: 'delete',
  deleteSod: 'delete-sod',
  deleteAllSod: 'delete-all-sod',
  sessions: 'sessions',
  checkManagement: 'ping',
}

export class Interaction {
  readonly http: HttpClient;

  constructor(public env: Environment) {
    this.http = inject(HttpClient);
  }

  private _url(api: string, ...args: string[]): string {
    return combine(`${this.env.baseUrl}`, api, ...args);
  }

  ping(): Observable<any> {
    return this.http.get(this._url(API.info));
  }

  getSession(code: string): Observable<Session|undefined> {
    return this.http.get<Session>(this._url(API.session, code));
  }

  updateSession(session: Session): Observable<Session|undefined> {
    return this.http.post<Session>(this._url(API.session), session);
  }

  createSession(): Observable<Session|undefined> {
    return this.http.get<Session>(this._url(API.create));
  }

  getSessionOnDay(session: string, date: Date): Observable<SessionOnDay|undefined> {
    return this.http.get<SessionOnDay>(this._url(API.sessionOnDay, session, dayToString(date)));
  }

  updateSessionOnDay(sod: SessionOnDay): Observable<SessionOnDay|undefined> {
    return this.http.post<SessionOnDay>(this._url(API.sessionOnDay), sod);
  }

  deleteSession(session: Session): Observable<any> {
    return this.http.delete(this._url(API.delete, session.code));
  }

  getSessionUrl(code: string): string {
    return combine(`${window.location.protocol}://${window.location.host}`, 'session', code);
  }

  deleteAllSod(): Observable<any> {
    return this.http.delete(this._url(API.deleteAllSod));
  }

  deleteSod(code: string): Observable<any> {
    return this.http.delete(this._url(API.deleteSod, code));
  }

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this._url(API.sessions));
  }

  checkManagementAuth() : Observable<any>{
    if (!getManagementKey()) return of(false);
    return this.http.get<any>(this._url(API.checkManagement));
  }
}

export const SPORTBUS_API = new InjectionToken<Interaction>('SPORTBUS_API');
