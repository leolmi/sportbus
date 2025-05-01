import { InjectionToken } from '@angular/core';
import { MenuItem } from '@olmi/model';


export abstract class SportbusPageManifest {
  abstract title: string;
  abstract route: string;
  abstract icon: string;
  abstract menu?: MenuItem[];
  abstract narrowMenu?: MenuItem[];
  lastRoute?: string;
  disabled?: boolean;
  default?: boolean;
}

export const SPORTBUS_PAGES = new InjectionToken<SportbusPageManifest[]>('SPORTBUS_PAGES');
