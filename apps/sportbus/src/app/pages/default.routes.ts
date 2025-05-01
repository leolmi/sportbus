import { Route } from '@angular/router';
import { ACCESS_PAGE_ROUTE } from './access/access.manifest';

export const FALLBACK_PAGE_ROUTE = ACCESS_PAGE_ROUTE;

export const defaultRoutes: Route[] = [
  {
    path: '',
    redirectTo: `/${FALLBACK_PAGE_ROUTE}`,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: `/${FALLBACK_PAGE_ROUTE}`,
    pathMatch: 'full'
  },
]
