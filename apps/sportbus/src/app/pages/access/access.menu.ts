import { MenuItem, SYSTEM_MENU_ITEMS } from '@olmi/model';
import { environment } from '../../../environment/environment';

export const MAIN = <MenuItem[]>[
  SYSTEM_MENU_ITEMS.lightTheme,
  SYSTEM_MENU_ITEMS.darkTheme,
  ...(environment.management?[
    SYSTEM_MENU_ITEMS.management
  ]:[])
];
