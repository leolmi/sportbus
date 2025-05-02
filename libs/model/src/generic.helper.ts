import { BehaviorSubject, Observable, take, takeUntil } from 'rxjs';
import {
  cloneDeep as _clone,
  isFunction as _isFunction,
  isNaN as _isNaN,
  isNull as _isNull,
  isNumber as _isNumber,
  isString as _isString,
  isUndefined as _isUndefined,
  padStart as _padStart
} from 'lodash';
import { ValueType } from './lib';
import equal from 'fast-deep-equal';

export const guid = (template = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'): string => {
  return template.replace(/[x]/g, c => {
    /* tslint:disable */
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
    /* tslint:enable */
  });
}

export const getHash = (o: any): number => {
  o = o || '';
  if (!_isString(o)) {
    o = JSON.stringify(o);
  }
  let hash = 0, i, chr;
  if (o.length === 0) {
    return hash;
  }
  for (i = 0; i < o.length; i++) {
    chr = o.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

/**
 * verifica che il valore sia un numero e nel range definito
 * @param v
 * @param min
 * @param max
 */
export const checkNumber = (v: any, min: number, max: number): number => {
  const n = _isNumber(v) ? <number>v : 0;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/**
 * compara due elementi come stringhe (lower case / trim)
 * @param v1
 * @param v2
 */
export const isEqualCaseInsensitive = (v1: any, v2: any): boolean =>
  `${v1||''}`.toLowerCase().trim() === `${v2||''}`.toLowerCase().trim();

/**
 * vero se v2 è vaòorizzato e v1 contiene v2 (lower case / trim)
 * @param v1
 * @param v2
 */
export const containsCaseInsensitive = (v1: any, v2: any): boolean => {
  const v1_str = `${v1 || ''}`.toLowerCase().trim();
  const v2_str = `${v2 || ''}`.toLowerCase().trim();
  return !!v2_str && v1_str.includes(v2_str);
}

/**
 * vero se null, undefined o NaN
 * @param v
 */
export const isNullOrUndefined = (v: any): boolean => _isNull(v) || _isUndefined(v) || _isNaN(v);

/**
 * permette di utilizzare il valore attuale dell'observable o gestire il fatto che non sia valorizzata
 * @param o$
 * @param handler
 * @param handlerEmpty
 * @param destroyer$
 */
export const use = <T>(o$: Observable<T|undefined>, handler?: (o:T) => any, handlerEmpty?: () => any, destroyer$?: Observable<any>): any =>
  o$.pipe(destroyer$?takeUntil(destroyer$):take(1))
    .subscribe(o => {
      if (isNullOrUndefined(o)) {
        return handlerEmpty ? handlerEmpty() : null;
      } else {
        return handler ? handler(o!) : null;
      }
    });


/**
 * update behavior-subject with passes partial
 * @param o$
 * @param chs
 */
export const update = <T>(o$: BehaviorSubject<T>, chs: Partial<T>) => o$.next({ ...o$.value, ...chs });

/**
 * aggiorna l'observable solo quando il valore cambia
 * @param o$
 * @param value
 */
export const updateOnChanges = <T>(o$: BehaviorSubject<T>, value: T) =>
  (o$.value !== value) ? o$.next(value) : null;

/**
 * update behavior-subject with passes partial
 * @param o$
 * @param handler
 */
export const handleUpdate = <T>(o$: BehaviorSubject<T>, handler: (co: T) => boolean) => {
  const co = _clone(o$.value);
  if (handler(co)) o$.next(co);
}

/**
 * aggiorna l'oggetto solo se è mutato
 * @param o$
 * @param no
 */
export const updateIfChanged = (o$: BehaviorSubject<any>, no: any) => {
  const o1 = o$.value||undefined;
  const o2 = no||undefined;
  if (!equal(o1, o2)) o$.next(no);
}

/**
 * Alterna l'applicazione della classe secondo il booleano
 * @param e
 * @param className
 * @param apply
 */
export const toggleClass = (e: HTMLElement|null|undefined, className: string, apply = true) => {
  if (!e || !e.classList) return;
  if (apply) {
    if (!e.classList.contains(className)) e.classList.add(className);
  } else {
    if (e.classList.contains(className)) e.classList.remove(className);
  }
}

/**
 * Alterna l'applicazione della classe sul body
 * @param doc
 * @param cl1
 * @param cl2
 * @param handler
 */
export const toggleBodyClass = (doc: Document, cl1: string, cl2: string, handler?: (ac: string) => void) => {
  if (doc.body.classList.contains(cl1)) {
    doc.body.classList.replace(cl1, cl2);
    if (handler) handler(cl2);
  } else {
    doc.body.classList.replace(cl2, cl1);
    if (handler) handler(cl1);
  }
}

export const toggleBodyClass2 = (doc: Document, cl_true: string, cl_false: string, apply = true) => {
  if (apply) {
    doc.body.classList.replace(cl_false, cl_true);
  } else {
    doc.body.classList.replace(cl_true, cl_false);
  }
}


export const setBodyClass = (doc: Document, clin: string, clout: string) => {
  doc.body.classList.replace(clout, clin);
}


export const clearObject = (o?: any) => {
  if (!o) return;
  for (const m in o) delete o[m];
}


export const breakOn = (condition: () => boolean) => {
  if (condition()) {
    debugger;
  }
}

export const getTypedValue = (v: any, type?: ValueType): any => {
  switch (type) {
    case 'string': return `${v||''}`;
    case 'integer': return parseInt(`${v||0}`, 10);
    case 'number': return parseFloat(`${v||0}`);
    default: return v;
  }
}

export const isJsonType = (type: string): boolean => type === 'application/json';

export const getFirstJsonFile = (files: any) => {
  return Array.from(files||[]).find((i: any) => isJsonType(i?.type));
}

export const stopEvent = (e: any) => {
  if (_isFunction(e?.preventDefault)) e.preventDefault();
  if (_isFunction(e?.stopPropagation)) e.stopPropagation();
}

export const combine = (...paths: string[]) => {
  return paths.join('/').replace(/[^:]\/{2,}/g, '/');
}


export const scrollToElement = (doc: Document, id: string, position: ScrollLogicalPosition = 'center') => {
  const ele = doc.getElementById(id);
  if (ele) {
    ele.scrollIntoView({
      behavior: 'smooth',
      block: position,
      inline: 'nearest'
    });
  }
}

export const getDayNumber = (day: Date): number =>
  (day.getFullYear() * 10000) + ((day.getMonth() + 1) * 100) + day.getDate();

export const dayToString = (day: Date): string => `${getDayNumber(day)}`;

export const getTimeString = (t: number): string => {
  const tc = (s: any) => _padStart(`${s}`, 2, '0');
  if (t > (60 * 1000)) {
    const mm = Math.floor((t / 1000) / 60);
    const hh = Math.floor(mm / 60);
    // console.log(`${t}     =>    MM=${mm}  HH=${hh}`);
    return (hh > 0) ? `${hh.toFixed(0)}:${tc((mm - hh * 60).toFixed(0))}` : `00:${tc(mm.toFixed(0))}`;
  } else {
    return '';
  }
}

const getTimeValues = (v: string): string[] => {
  const rgx = /(\d{1,2}).*?(\d{1,2})/g;
  const m = rgx.exec(v);
  return (m && m.length > 2) ? [m[1], m[2]] : [];
}

export const getTimeMlsValue = (t: string): number => {
  const vs = getTimeValues(t);
  if (vs.length !== 2) return 0;
  const hh = parseInt(vs[0], 10) || 0;
  const mm = parseInt(vs[1], 10) || 0;
  return hh * 60 * 60 * 1000 + mm * 60 * 1000;
}

export const stringToDay = (day?: string): Date => {
  const str = (day || '');
  if (str.length !== 8) return new Date();
  const y = parseInt(str.substring(0, 4), 10);
  const m = parseInt(str.substring(4, 2), 10);
  const d = parseInt(str.substring(6, 2), 10);
  return new Date(y, m - 1, d);
}

export const isTheSameDay = (d1?: Date, d2?: Date): boolean =>
  !!d1 && !!d2 &&
  d1.getDay() === d2.getDay() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();


/**
 * Sposta un elemento della collezione da un indice ad un altro.
 * Modifica la collezione originale.
 * Restituisce l'elemento spostato.
 * @param arr
 * @param fromIndex
 * @param toIndex
 */
export const move = (arr: any[], fromIndex: number, toIndex: number): boolean => {
  const item = arr.splice(fromIndex, 1);
  if (fromIndex < toIndex) toIndex--;
  if (item) arr.splice(toIndex, 0, item[0]);
  return !!item;
}
