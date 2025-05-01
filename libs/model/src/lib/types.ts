/**
 * dizionario tipizzato
 */
export type Dictionary<T> = { [key: string]: T; }

/**
 * tipologie basiche di dato
 */
export type ValueType = 'string'|'integer'|'number';

/**
 * tipologie di persone
 */
export type PersonType = 'driver'|'athlete';

/**
 * tipologie di persone
 */
export type ShuttleDirection = 'A'|'R';

/**
 * colori disponibili per le voci di menu
 */
export type MenuItemColor = 'error'|'warning'|'success'|'accent'|'secondary';
