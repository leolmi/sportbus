import {
  CalendarItem,
  Dictionary,
  getTimeString,
  Person,
  Session,
  SessionOnDay,
  Shuttle,
  ShuttleDirection
} from '@olmi/model';
import { chunk as _chunk, flatten as _flatten, keys as _keys, omit as _omit, reduce as _reduce } from 'lodash';

export class CalendarItemWrapper {
  target: string = '';
  start: string = '';
  end: string = '';
  group: string = '';
}


/**
 * restituisce l'elenco degli atleti presenti
 * @param ses
 * @param sod
 */
export const getActiveAthletes = (ses?: Session, sod?: SessionOnDay): Person[] =>
  (ses?.persons||[]).filter(p => p.type === 'athlete' && !!(<any>sod?.athletes || {})[p.code]);


/**
 * restituisce tutti gli atleti inseriti nella direzione
 * @param sod
 * @param direction
 */
export const getDirectionAthleteCodes = (sod?: SessionOnDay, direction: ShuttleDirection = 'A') => {
  const dshs = (sod?.shuttles||[]).filter(s => s.direction === direction);
  return _flatten(dshs.map(s => s.athletes));
}

/**
 * elenco degli atleti presenti ma ancora non inseriti in navette nella direzione specificata
 * @param ses
 * @param sod
 * @param direction
 */
export const getMissingAthletes = (ses: Session|undefined, sod: SessionOnDay|undefined, direction: ShuttleDirection): Person[] => {
  const aas = getActiveAthletes(ses, sod);
  const das = getDirectionAthleteCodes(sod, direction);
  return aas.filter(a => !das.includes(a.code));
}

/**
 * numero di guidatori mancanti nella tratta
 * @param sod
 * @param direction
 */
export const getMissingDriversCount = (sod: SessionOnDay|undefined, direction: ShuttleDirection): number => {
  const dshs = (sod?.shuttles||[]).filter(s => s.direction === direction);
  return dshs.filter(s => !s.driver).length;
}

/**
 * gestione della navetta sui dati di sessione
 * @param sod
 * @param shuttle
 * @param handler
 */
export const withShuttle = (sod: SessionOnDay, shuttle: Shuttle|undefined, handler: (s: Shuttle) => boolean): boolean => {
  if (shuttle) {
    let sh = sod.shuttles.find(s => s.code === shuttle.code);
    if (!sh) {
      sh = new Shuttle(_omit(shuttle, ['_temporary']));
      sod.shuttles.push(sh);
    }
    return handler(sh);
  }
  return false;
}

/**
 * aggiunge o modifica una persona nella navetta
 * @param sod
 * @param prs
 * @param shuttle
 */
export const addShuttlePerson = (sod: SessionOnDay, prs: Person, shuttle: Shuttle|undefined): boolean => {
  return withShuttle(sod, shuttle, (s) => {
    switch (prs.type) {
      case 'driver':
        if (s.driver !== prs.code) {
          s.driver = prs.code;
          return true;
        }
        break;
      case 'athlete':
      default:
        if (!s.athletes.includes(prs.code)) {
          s.athletes.push(prs.code);
          return true;
        }
        break;
    }
    return false;
  })
}

/**
 * restituisce l'elenco delle persone per tipo
 * @param ses
 * @param type
 * @param sod
 * @param sht
 */
export const getPersons = (ses: Session|undefined, type: string, sod: SessionOnDay, sht: Shuttle|undefined): Person[] => {
  switch (type) {
    case 'driver':
      return (ses?.persons||[]).filter(p => p.type === type);
    case 'athlete':
    default:
      return getMissingAthletes(ses, sod, sht?.direction||'A');
  }
}

export const getPersonName = (session: Session|undefined, pcode?: string): string => {
  return (session?.persons || []).find(p => p.code === pcode||'')?.name || pcode || '';
}

export const getGroupName = (session: Session|undefined, gcode?: string): string => {
  return (session?.groups || []).find(g => g.code === gcode||'')?.name || gcode || '';
}

const isDirectionPresent = (sod: SessionOnDay|undefined, acode: string, direction: ShuttleDirection): boolean =>
  !!(sod?.shuttles||[]).find(s => s.athletes.includes(acode) && s.direction === direction);

export const getAthletesMap = (sod: SessionOnDay|undefined): any => {
  return _reduce(sod?.athletes||{}, (m, p, n) => {
    const ready = isDirectionPresent(sod, n, 'A') && isDirectionPresent(sod, n, 'R');
    return { ...m, [n]: ready?'r':(p?'p':'a') };
  }, <any>{});
}

export const getCalendarItemsWrappers = (items: CalendarItem[], session: Session|undefined): CalendarItemWrapper[] => {
  return items.map(i => {
    const g = (session?.groups||[]).find(sg => sg.code === i.group);
    return <CalendarItemWrapper>{
      group: g?.name||'',
      start: getTimeString(i.start),
      end: getTimeString(i.end),
      target: i.target
    }
  })
}

const getShuttleCode = (time: number, direction: ShuttleDirection, target: string): string => `${direction}${time}@${target}`;

/**
 * restituisce la  mappa delle navette necessarie di andata e ritorno sulla base solo dei tempi e target
 */
const calcShuttlesMap = (items: CalendarItem[]): {[code: string]: Partial<Shuttle>} => {
  return _reduce(items, (m, i) => ({
    ...m,
    [getShuttleCode(i.start, 'A', i.target)]: <Partial<Shuttle>>{ time: i.start, direction: 'A', code: `A${i.start}`, target: i.target },
    [getShuttleCode(i.end, 'R', i.target)]: <Partial<Shuttle>>{ time: i.end, direction: 'R', code: `R${i.end}`, target: i.target  }
  }), <Dictionary<any>>{});
}


// const _addMissingAthletes = (m: any, ses: Session, sod: SessionOnDay, items: CalendarItem[], direction: ShuttleDirection) => {
//   const defGroup = ses.groups[0];
//   // navette già presenti nella direzione considerata
//   const xShuttles = sod.shuttles.filter(s => s.direction===direction);
//
//
//   getMissingAthletes(ses, sod, direction).forEach(a => {
//     const item = items.find(i => i.group === (a.group || defGroup?.code || ''));
//     const time = (direction==='A') ? item?.start : item?.end;
//     const code = getShuttleCode(time || 0, direction, item?.target || '');
//     m[code] = [...m[code]||[], a.code];
//   });
// }

/**
 * calcola la mappa dei codici navetta per utente
 */
const calcShuttlesAthletesMap = (ses: Session, sod: SessionOnDay, items: CalendarItem[]): any => {
  const defGroup = ses.groups[0];
  const athletes = getActiveAthletes(ses, sod);
  return _reduce(athletes, (m, a) => {
    // item di calendario competente per l'atleta
    const item = items.find(i => i.group === (a.group||defGroup?.code||''));
    const codeA = getShuttleCode(item?.start||0, 'A', item?.target||'');
    const codeR = getShuttleCode(item?.end||0, 'R', item?.target||'');
    return {
      ...m,
      [codeA]: [ ...m[codeA]||[], a.code ],
      [codeR]: [ ...m[codeR]||[], a.code ],
    }
  }, <any>{});
}

const getEffectiveAthletes = (athletesMap: any, code: string, ses: Session, sod: SessionOnDay): string[] => {
  const direction = <ShuttleDirection>code.charAt(0);
  const missa = getMissingAthletes(ses, sod, direction).map(a => a.code);
  const routea: string[] = athletesMap[code]||[];
  return routea.filter(a => missa.includes(a));
}

const getShuttlesCount = (sod: SessionOnDay, code: string): number => {
  const direction = <ShuttleDirection>code.charAt(0);
  return (sod.shuttles||[]).filter(s => s.direction === direction).length;
}

/**
 * calcola le navette necessarie in base al numero ed i gruppi degli atleti presenti
 * @param ses
 * @param sod
 * @param items
 */
export const calcShuttles = (ses: Session|undefined, sod: SessionOnDay|undefined, items: CalendarItem[]): Partial<Shuttle>[] => {
  if (!ses || !sod) return [];

  // mappa delle navette necessarie di andata e ritorno sulla base solo dei tempi e target
  // { codice: shuttle }
  const shuttlesMap = calcShuttlesMap(items);
  // console.log('SHUTTLES MAP', shuttlesMap);

  // mappa dei codici navetta per atleta
  // { codice: [atl1, ..., atlN] }
  const athletesMap = calcShuttlesAthletesMap(ses, sod, items);
  // console.log('ATHLETES MAP', athletesMap);

  const shuttles: Partial<Shuttle>[] = [];
  // sviluppo degli incastri navette sui tempi - navette sugli atleti
  _keys(athletesMap).forEach(code => {
    const eff_atls = getEffectiveAthletes(athletesMap, code, ses, sod);
    // numero di atleti che necessitano della tratta
    const achunks: string[][] = _chunk(eff_atls, 4);
    achunks.forEach((c, i) => {
      const p = getShuttlesCount(sod, code);
      const base = shuttlesMap[code];
      const shCode = `${code}-${i+p}`;
      let exsh = shuttles.find(s => s.code === shCode);
      if (!exsh) {
        exsh = <Partial<Shuttle>>{ ...base, code: shCode, _temporary: true };
        shuttles.push(exsh);
      }
      exsh.athletes = [];
    });
  });

  // elenco delle navette disponibili per ogni atleta e tratta
  // console.log('CALC SHUTTLES', shuttles);
  return shuttles;
}


/**
 * considera l'insieme delle navette calcolate e effettive
 * @param ds
 * @param cs
 */
export const mergeShuttles = (ds: Shuttle[], cs: Partial<Shuttle>[]): Shuttle[] => {
  const dscodes = ds.map(s => s.code);
  const css = cs
    .filter(s => !dscodes.includes(s.code||''))
    .map(s => new Shuttle(s));
  return [...ds, ...css];
}
