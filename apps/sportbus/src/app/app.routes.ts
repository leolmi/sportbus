import { Route } from '@angular/router';
import { accessRoutes } from './pages/access/access.routes';
import { defaultRoutes } from './pages/default.routes';
import { sessionRoutes } from './pages/session/session.routes';
import { managementRoutes } from './pages/management/management.routes';


export const appRoutes: Route[] = [
  ...accessRoutes,
  ...sessionRoutes,
  ...managementRoutes,
  ...defaultRoutes
];
