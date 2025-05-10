import { MenuItem, SYSTEM_MENU_ITEMS } from '@olmi/model';
import { environment } from '../../../environment/environment';

export const MAIN = <MenuItem[]>[
  SYSTEM_MENU_ITEMS.locale_en,
  SYSTEM_MENU_ITEMS.locale_it,
  SYSTEM_MENU_ITEMS.info,
  SYSTEM_MENU_ITEMS.lightTheme,
  SYSTEM_MENU_ITEMS.darkTheme,
];
