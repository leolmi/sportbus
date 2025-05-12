import {
  CalendarItem, DEFAULT_GROUP,
  Dictionary,
  getTimeString, isEmptyContext,
  Person,
  Session, SessionContext,
  SessionOnDay,
  Shuttle,
  ShuttleDirection
} from '@olmi/model';
import { chunk as _chunk, flatten as _flatten, keys as _keys, omit as _omit, reduce as _reduce } from 'lodash';
import { SessionManager } from '@olmi/common';

export class CalendarItemWrapper {
  target: string = '';
  start: string = '';
  end: string = '';
  group: string = '';
}

/**
 * vero se è un passeggero
 * @param p
 */
export const isPassenger = (p: Person): boolean => !p.isDriver || !!p.group;

export const allPersons = (context: SessionContext): Person[] => <Person[]>[...context.ses?.persons||[], ...context.sod?.persons||[]];

/**
 * restituisce l'elenco dei passeggeri presenti
 * @param context
 */
export const getActivePassengers = (context: SessionContext): Person[] =>
  allPersons(context).filter(p => isPassenger(p) && !!(<any>context.sod?.passengersMap || {})[p.code]);


/**
 * restituisce tutti i passeggeri inseriti nella direzione
 * @param sod
 * @param direction
 */
export const getDirectionPassengerCodes = (sod?: SessionOnDay, direction: ShuttleDirection = 'A') => {
  const dshs = (sod?.shuttles||[]).filter(s => s.direction === direction);
  return _flatten(dshs.map(s => s.passengers));
}

/**
 * elenco degli atleti presenti ma ancora non inseriti in navette nella direzione specificata
 * @param context
 * @param direction
 */
export const getMissingPassengers = (context: SessionContext, direction: ShuttleDirection): Person[] => {
  const aps = getActivePassengers(context);
  const dps = getDirectionPassengerCodes(context.sod, direction);
  return aps.filter(a => !dps.includes(a.code));
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
 * @param asDriver
 */
export const addShuttlePerson = (sod: SessionOnDay, prs: Person, shuttle: Shuttle|undefined, asDriver: boolean): boolean => {
  return withShuttle(sod, shuttle, (s) => {
    if (asDriver) {
      if (s.driver !== prs.code) {
        s.driver = prs.code;
        return true;
      }
    } else {
      if (!s.passengers.includes(prs.code)) {
        s.passengers.push(prs.code);
        return true;
      }
    }
    return false;
  })
}



/**
 * restituisce l'elenco delle persone per tipo
 * @param context
 * @param driver
 * @param sht
 */
export const getPersons = (context: SessionContext, driver: boolean, sht?: Shuttle): Person[] => {
  if (driver) {
    return allPersons(context).filter(p => p.isDriver);
  } else {
    return getMissingPassengers(context, sht?.direction||'A');
  }
}

export const getPersonName = (context: SessionContext, pcode?: string): string => {
  let prs = (context.ses?.persons || []).find(p => p.code === pcode||'');
  if (!prs) prs = (context.sod?.persons || []).find(p => p.code === pcode||'');
  return prs?.name || pcode || '';
}

export const getPersonIcon = (prs?: Person): string => {
  return prs?.isDriver ? 'sports_motorsports' : (prs ? 'person' : 'person_outline');
}

export const getGroupName = (context: SessionContext, gcode?: string): string => {
  return (context.ses?.groups || []).find(g => g.code === gcode||'')?.name || gcode || '';
}

const isDirectionPresent = (sod: SessionOnDay|undefined, acode: string, direction: ShuttleDirection): boolean =>
  !!(sod?.shuttles||[]).find(s => s.passengers.includes(acode) && s.direction === direction);

export const getPassengersMap = (sod: SessionOnDay|undefined): any => {
  return _reduce(sod?.passengersMap||{}, (m, p, n) => {
    const ready = isDirectionPresent(sod, n, 'A') && isDirectionPresent(sod, n, 'R');
    return { ...m, [n]: ready?'r':(p?'p':'a') };
  }, <any>{});
}

// export const getCalendarItemsWrappers = (items: CalendarItem[], session: Session|undefined): CalendarItemWrapper[] => {
//   return items.map(i => {
//     const g = (session?.groups||[]).find(sg => sg.code === i.group);
//     return <CalendarItemWrapper>{
//       group: g?.name||'',
//       start: getTimeString(i.start),
//       end: getTimeString(i.end),
//       target: i.target
//     }
//   })
// }

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


// const _addMissingPassengers = (m: any, ses: Session, sod: SessionOnDay, items: CalendarItem[], direction: ShuttleDirection) => {
//   const defGroup = ses.groups[0];
//   // navette già presenti nella direzione considerata
//   const xShuttles = sod.shuttles.filter(s => s.direction===direction);
//
//
//   getMissingPassengers(ses, sod, direction).forEach(a => {
//     const item = items.find(i => i.group === (a.group || defGroup?.code || ''));
//     const time = (direction==='A') ? item?.start : item?.end;
//     const code = getShuttleCode(time || 0, direction, item?.target || '');
//     m[code] = [...m[code]||[], a.code];
//   });
// }

/**
 * calcola la mappa dei codici navetta per utente
 * @param context
 * @param items
 */
const calcShuttlesPassengersMap = (context: SessionContext, items: CalendarItem[]): any => {
  const defGroup = (context.ses?.groups||[])[0];
  const passengers = getActivePassengers(context);
  return _reduce(passengers, (m, a) => {
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

/**
 *
 * @param passengersMap   mappa passeggeri per navetta
 * @param code            codice navetta
 * @param context
 */
const getEffectivePassengers = (passengersMap: any, code: string, context: SessionContext,): string[] => {
  const direction = <ShuttleDirection>code.charAt(0);
  const missa = getMissingPassengers(context, direction).map(a => a.code);
  const routea: string[] = passengersMap[code]||[];
  return routea.filter(a => missa.includes(a));
}

const getShuttlesCount = (sod: SessionOnDay|undefined, code: string): number => {
  const direction = <ShuttleDirection>code.charAt(0);
  return (sod?.shuttles||[]).filter(s => s.direction === direction).length;
}

/**
 * calcola le navette necessarie in base al numero ed i gruppi degli atleti presenti
 * @param context
 * @param items
 */
export const calcShuttles = (context: SessionContext, items: CalendarItem[]): Partial<Shuttle>[] => {
  if (isEmptyContext(context)) return [];

  // mappa delle navette necessarie di andata e ritorno sulla base solo dei tempi e target
  // { codice: shuttle }
  const shuttlesMap = calcShuttlesMap(items);
  // console.log('SHUTTLES MAP', shuttlesMap);

  // mappa dei codici navetta per atleta
  // { codice: [atl1, ..., atlN] }
  const passengersMap = calcShuttlesPassengersMap(context, items);
  // console.log('PASSENGERS MAP', passengersMap);

  const shuttles: Partial<Shuttle>[] = [];
  // sviluppo degli incastri navette sui tempi - navette sugli atleti
  _keys(passengersMap).forEach(code => {
    const eff_atls = getEffectivePassengers(passengersMap, code, context);
    // numero di atleti che necessitano della tratta
    const achunks: string[][] = _chunk(eff_atls, 4);
    achunks.forEach((c, i) => {
      const p = getShuttlesCount(context.sod, code);
      const base = shuttlesMap[code];
      const shCode = `${code}-${i+p}`;
      let exsh = shuttles.find(s => s.code === shCode);
      if (!exsh) {
        exsh = <Partial<Shuttle>>{ ...base, code: shCode, _temporary: true };
        shuttles.push(exsh);
      }
      exsh.passengers = [];
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

/**
 * vero se le navette sono completate nella direzione passata
 * @param sod
 * @param direction
 */
export const isReadyOnDirection = (sod: SessionOnDay|undefined, direction?: ShuttleDirection) => {
  const passengers_map = sod?.passengersMap || {};
  const eff_passengers = _keys(passengers_map).filter(a => passengers_map[a]);
  const shuttles = (sod?.shuttles || []).filter(s => s.direction === direction);
  const firstMissingPassenger = eff_passengers.find(a => !shuttles.find(s => s.passengers.includes(a)));
  const firstMissingDriver = shuttles.find(s => !s.driver);
  return !firstMissingPassenger && !firstMissingDriver;
}

/**
 * vero se entrambe le tratte sono soddisfatte
 * @param sod
 */
export const isComplete = (sod: SessionOnDay|undefined): boolean =>
  (sod?.shuttles||[]).length>0 && isReadyOnDirection(sod, 'A') && isReadyOnDirection(sod, 'R');
