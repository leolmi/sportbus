import { Route } from '@angular/router';
import { SESSION_PAGE_ROUTE } from './session.manifest';
import { SessionComponent } from './session.component';

export const sessionRoutes: Route[] = [
  {
    path: `${SESSION_PAGE_ROUTE}/:id`,
    component: SessionComponent
  }
]
