import { Route } from '@angular/router';
import { MANAGEMENT_PAGE_ROUTE } from './management.manifest';
import { ManagementComponent } from './management.component';
import { environment } from '../../../environment/environment';

export const managementRoutes: Route[] = environment.management ?
  [
    {
      path: `${MANAGEMENT_PAGE_ROUTE}`,
      component: ManagementComponent
    },
  ] :
  [];
