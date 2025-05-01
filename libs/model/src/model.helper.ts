import { ButtonsStatus, Dictionary, LastUpdate } from './lib';
import { cloneDeep as _clone, forOwn as _forOwn } from 'lodash';
import { BehaviorSubject } from 'rxjs';

/**
 * verifica la sintassi del codice
 * @param code
 */
export const isRightCode = (code?: string): boolean =>
  /^([0-9A-Z]{3})-([0-9A-Z]{3})-([0-9A-Z]{3})$/gi.test(`${code||''}`);


/**
 * integra i valori passati senza alterare gli esistenti
 * @param os
 * @param chs
 */
export const mergeStatus = (os: ButtonsStatus, chs: Partial<ButtonsStatus>): ButtonsStatus => {
  const res = _clone(os);
  _forOwn(res, (v: Dictionary<any>, k: string) =>
    (<any>res)[k||''] = {...(<any>res)[k||''], ...(<any>chs)[k||''] });
  return res;
}

const getLu = <T extends LastUpdate>(o: T|undefined): number|undefined => !!o ? o.lu||0 : undefined;

/**
 * aggiorna l'oggetto solo se è cambiato
 * @param o$
 * @param no
 * @param changed
 */
export const updateIfLuChanged = <T extends LastUpdate>(o$: BehaviorSubject<T|undefined>,
                                                        no: T|undefined,
                                                        changed?: (o1: T|undefined, o2: T|undefined) => boolean) => {
  const o1 = o$.value||undefined;
  const o2 = no||undefined;
  if (getLu(o1) !== getLu(o2) && (!changed || changed(o1, o2))) o$.next(no);
}

