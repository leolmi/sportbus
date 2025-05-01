import { Person, Session, SessionOnDay, Shuttle, ShuttleDirection } from '@olmi/model';
import { flatten as _flatten, omit as _omit } from 'lodash';

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
export const getMissingAthletes = (ses?: Session, sod?: SessionOnDay, direction: ShuttleDirection = 'A'): Person[] => {
  const aas = getActiveAthletes(ses, sod);
  const das = getDirectionAthleteCodes(sod, direction);
  return aas.filter(a => !das.includes(a.code));
}

/**
 * numero di guidatori mancanti nella tratta
 * @param sod
 * @param direction
 */
export const getMissingDriversCount = (sod?: SessionOnDay, direction: ShuttleDirection = 'A'): number => {
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
      return getMissingAthletes(ses, sod, sht?.direction);
  }
}
