import { Shuttle } from './shuttle';
import { Dictionary } from './types';
import { SessionBase } from './session';
import { Message } from './message';

/**
 * SESSIONE GIORNALIERA
 */
export class SessionOnDay extends SessionBase {
  constructor(i?: Partial<SessionOnDay>) {
    super(i);
    this.date = i?.date || 0;
    this.session = i?.session || '';
    this.passengersMap = i?.passengersMap || {};
    this.shuttles = (i?.shuttles || []).map(s => new Shuttle(s));
    this.messages = (i?.messages || []).map(m => new Message(m));
  }

  /**
   * data di riferimento
   */
  date: number;
  /**
   * sessione di riferimento
   */
  session: string;
  /**
   * mappa stato passeggeri
   */
  passengersMap: Dictionary<boolean>;
  /**
   * elenco navette
   */
  shuttles: Shuttle[];
  /**
   * messaggi della sessione giornaliera
   */
  messages: Message[];
}
