import { MenuItemColor } from './types';

export class MenuItem {
  constructor(i?: Partial<MenuItem>) {
    Object.assign(<any>this, i || {});
  }
  separator?: boolean;
  hidden?: boolean;
  active?: boolean;
  disabled?: boolean;
  routeActive?: boolean;
  code?: string;
  icon?: string;
  textAsIcon?: boolean;
  text?: string;
  logic?: 'toggle'|'switch'|'navigate'|'execute'|'private'|'system';
  property?: string;
  owner?: string;
  color?: MenuItemColor;
  operation?: string;
  subMenu?: MenuItem[];
}
