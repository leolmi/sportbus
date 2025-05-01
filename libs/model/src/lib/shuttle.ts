import { guid } from '../generic.helper';
import { Dictionary, ShuttleDirection } from './types';

/**
 * NAVETTA
 */
export class Shuttle {
  constructor(s?: Partial<Shuttle>) {
    this.code = s?.code || '';
    this.direction = s?.direction || 'A';
    this.time = s?.time || 0;
    this.target = s?.target || '';
    this.driver = s?.driver || '';
    this.athletes = s?.athletes || [];
    this.athletesTimesMap = s?.athletesTimesMap || {};
    this._temporary = !!s?._temporary;
  }

  /**
   * codice identificativo della navetta
   */
  code: string;
  /**
   * direzione della navetta
   */
  direction: ShuttleDirection;
  /**
   * orario di partenza
   */
  time: number;
  /**
   * target della navetta
   */
  target: string;
  /**
   * identificativo pilota
   */
  driver: string;
  /**
   * identificativi atleti
   */
  athletes: string[];
  /**
   * mappa degli orari per atleta
   */
  athletesTimesMap: Dictionary<number>;
  /**
   * temporanea
   */
  _temporary?: boolean;
}

