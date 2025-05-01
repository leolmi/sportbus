import { Person } from './person';
import { Shuttle } from './shuttle';
import { LastUpdate } from './last-update';
import { Dictionary } from './types';

/**
 * sessione giornaliera
 */
export class SessionOnDay implements LastUpdate {
  constructor(i?: Partial<SessionOnDay>) {
    this.lu = i?.lu||0;
    this.date = i?.date||0;
    this.session = i?.session||'';
    this.athletes = i?.athletes||{};
    this.shuttles = (i?.shuttles||[]).map(s => new Shuttle(s));
  }

  lu: number;
  date: number;
  session: string;
  athletes: Dictionary<boolean>;
  shuttles: Shuttle[];
}
