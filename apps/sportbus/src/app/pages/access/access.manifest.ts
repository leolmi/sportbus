import { SportbusPageManifest } from '@olmi/common';
import { MAIN } from './access.menu';

export const ACCESS_PAGE_ROUTE = 'access';

export class AccessPageManifest extends SportbusPageManifest {
  title = 'Access';
  route = ACCESS_PAGE_ROUTE;
  menu = MAIN;
  narrowMenu = MAIN;
  icon = 'supervised_user_circle';
  override default = true;
}
