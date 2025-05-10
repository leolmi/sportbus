import { Route } from '@angular/router';
import { SESSION_PAGE_ROUTE } from './session.manifest';
import { SessionComponent } from './session.component';
import { SessionEditorComponent, SettingsEditorComponent } from '@olmi/components';

export const sessionRoutes: Route[] = [
  {
    path: `${SESSION_PAGE_ROUTE}/:id`,
    component: SessionComponent,
    children: [
      {
        path: '',
        component: SessionEditorComponent
      },
      {
        path: 'settings',
        component: SettingsEditorComponent
      }
    ]
  }
]
