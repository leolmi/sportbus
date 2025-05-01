import { SPORTBUS_SESSION_POLLING_TIMEOUT } from './consts';

export class SportbusInfo {
  constructor(i?: Partial<SportbusInfo>) {
    Object.assign(<any>this, i || {});
    this.pollingTimeout = i?.pollingTimeout||SPORTBUS_SESSION_POLLING_TIMEOUT;
  }
  version?: string;
  pollingTimeout?: number;
  author?: string;
  title?: string;
  sessionType?: string;
}
