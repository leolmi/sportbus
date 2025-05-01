import { SportbusPageManifest } from '@olmi/common';
import { MAIN } from './session.menu';

export const SESSION_PAGE_ROUTE = 'session';

export class SessionPageManifest extends SportbusPageManifest {
  title = 'Session';
  route = SESSION_PAGE_ROUTE;
  menu = MAIN;
  narrowMenu = MAIN;
  icon = 'departure_board';
}
