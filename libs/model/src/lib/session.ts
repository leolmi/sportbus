import { Person } from './person';
import { CalendarItem } from './calendar-item';
import { Shuttle } from './shuttle';
import { Group } from './group';
import { LastUpdate } from './last-update';

export class Session implements LastUpdate {
  constructor(s?: Partial<Session>) {
    this._id = s?._id||'';
    this.lu = s?.lu||0;
    this.code = s?.code||'';
    this.name = s?.name||'';
    this.description = s?.description||'';
    this.icon = s?.icon||'';
    this.groups = (s?.groups||[]).map(g => new Group(g));
    this.persons = (s?.persons||[]).map(p => new Person(p));
    this.calendar = (s?.calendar||[]).map(c => new CalendarItem(c));
    this.lastUpdate = Date.now();
  }

  lu: number;
  _id: string;
  code: string;
  lastUpdate: number;
  name: string;
  description: string;
  icon: string;
  /**
   * gruppi
   */
  groups: Group[];
  /**
   * elenco persone (atleti/autisti)
   */
  persons: Person[];
  /**
   * calendario impegni settimanali
   */
  calendar: CalendarItem[];
}
