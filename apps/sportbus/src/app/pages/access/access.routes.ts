import { Route } from '@angular/router';
import { ACCESS_PAGE_ROUTE } from './access.manifest';
import { AccessComponent } from './access.component';

export const accessRoutes: Route[] = [
  {
    path: `${ACCESS_PAGE_ROUTE}`,
    component: AccessComponent
  },
]
