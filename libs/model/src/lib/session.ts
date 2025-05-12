import { Person } from './person';
import { CalendarItem } from './calendar-item';
import { Group } from './group';
import { LastUpdate } from './last-update';

/**
 * SESSIONE BASE
 */
export class SessionBase implements LastUpdate {
  constructor(s?: Partial<SessionBase>) {
    this.lu = s?.lu||0;
    this.persons = (s?.persons||[]).map(p => new Person(p));
    this.calendar = (s?.calendar||[]).map(c => new CalendarItem(c));
  }

  /**
   * lust-update time
   */
  lu: number;
  /**
   * elenco persone (passeggeri/autisti)
   */
  persons: Person[];
  /**
   * calendario impegni settimanali
   */
  calendar: CalendarItem[];
}


/**
 * SESSIONE
 */
export class Session extends SessionBase {
  constructor(s?: Partial<Session>) {
    super(s);
    this._id = s?._id||'';
    this.code = s?.code||'';
    this.name = s?.name||'';
    this.description = s?.description||'';
    this.icon = s?.icon||'';
    this.groups = (s?.groups||[]).map(g => new Group(g));
  }

  _id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  /**
   * gruppi
   */
  groups: Group[];
}
