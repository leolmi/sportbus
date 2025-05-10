import { BUS_PREFIX, SPORTBUS_APP_USER_OPTIONS_KEY, SPORTBUS_USER_OPTIONS_FEATURE } from '@olmi/model';
import { BehaviorSubject } from 'rxjs';
import { isBoolean as _isBoolean, isString as _isString } from 'lodash';

export class AppUserOptions {
  static firstAccess$: BehaviorSubject<boolean|undefined> = new BehaviorSubject<boolean | undefined>(undefined);

  private static getOptions = () => {
    const o = localStorage.getItem(SPORTBUS_APP_USER_OPTIONS_KEY);
    if (!_isBoolean(this.firstAccess$.value)) this.firstAccess$.next(!_isString(o));
    try {
      return <any>JSON.parse(o || '{}') || {};
    } catch (err) {
      console.error(...BUS_PREFIX, 'error while deserializing user options', err);
    }
    return <any>{};
  }

  static getFeatures<T>(key: string, def?: Partial<T>): T {
    const o = this.getOptions();
    return <T>o[key] || <T>def || <T>{};
  }

  static updateFeature(key: string, chs: any) {
    const o: any = this.getOptions() || {};
    o[key] = { ...o[key], ...chs };
    localStorage.setItem(SPORTBUS_APP_USER_OPTIONS_KEY, JSON.stringify(o));
  }

  static reset() {
    localStorage.removeItem(SPORTBUS_APP_USER_OPTIONS_KEY);
    location.reload();
  }
}

export const getManagementKey = (): string =>
  AppUserOptions.getFeatures(SPORTBUS_USER_OPTIONS_FEATURE, { managementKey: '' }).managementKey||'';
