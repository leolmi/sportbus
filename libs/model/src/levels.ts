import { remove as _remove} from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { SPORTBUS_DEBUG_LEVELS_KEY } from './lib';

const sanitizeLevel = (l: string): string => `${l||''}`.trim().toLowerCase();

const getLevels = (): string[] => {
  const levels = localStorage.getItem(SPORTBUS_DEBUG_LEVELS_KEY)||'';
  return levels
    .split(',')
    .map(l => sanitizeLevel(l))
    .filter(l => !!l);
}

const setLevels = (levels: string[]) => localStorage.setItem(SPORTBUS_DEBUG_LEVELS_KEY, levels.join(','));

export class DebugContext {
  private readonly _ls: string[] = [];
  constructor(...ls: string[]) {
    this._ls = ls;
  }

  do(handler: () => any) {
    if (LocalContext.isLevel(...this._ls)) handler();
  }
}

/**
 * contesto per le opzioni utente
 */
export class LocalContext {
  static changed$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  static toggleLevel = (...ls: string[]) => {
    const levels = getLevels();
    ls.map(l => sanitizeLevel(l)).forEach(sl => {
      if (levels.includes(sl)) {
        _remove(levels, (l: string) => l === sl);
      } else {
        levels.push(sl);
      }
    });
    setLevels(levels);
    this.changed$.next({});
  }

  static clear = () => {
    localStorage.removeItem(SPORTBUS_DEBUG_LEVELS_KEY);
    this.changed$.next({});
  }

  /**
   * vero se almeno uno dei livelli `ls` è attivo
   * @param ls
   */
  static isLevel = (...ls: string[]): boolean => {
    const levels = getLevels();
    return !!(ls || []).find(l => levels.includes(sanitizeLevel(l)));
  }

  /**
   * restituisce un contesto di debug
   * @param ls
   */
  static onLevel = (...ls: string[]) => new DebugContext(...ls);
}


