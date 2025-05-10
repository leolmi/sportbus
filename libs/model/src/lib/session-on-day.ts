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
    this.passengersMap = i?.passengersMap||{};
    this.persons = (i?.persons||[]).map(p => new Person(p));
    this.shuttles = (i?.shuttles||[]).map(s => new Shuttle(s));
  }

  /**
   * lust-update time
   */
  lu: number;
  /**
   * data di riferimento
   */
  date: number;
  /**
   * sessione di riferimento
   */
  session: string;
  /**
   * elenco persone solo per questo giorno di sessione
   */
  persons: Person[];
  /**
   * mappa stato passeggeri
   */
  passengersMap: Dictionary<boolean>;
  /**
   * elenco navette
   */
  shuttles: Shuttle[];
}
