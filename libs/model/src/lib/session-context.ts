import { Session } from './session';
import { SessionOnDay } from './session-on-day';


export interface SessionContext {
  ses?: Session;
  sod?: SessionOnDay;
}
