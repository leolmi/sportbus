import { SportbusPageManifest } from '@olmi/common';
import { MAIN } from './management.menu';

export const MANAGEMENT_PAGE_ROUTE = 'management';

export class ManagementPageManifest extends SportbusPageManifest {
  title = 'Management';
  route = MANAGEMENT_PAGE_ROUTE;
  menu = MAIN;
  narrowMenu = MAIN;
  icon = 'settings';
}
