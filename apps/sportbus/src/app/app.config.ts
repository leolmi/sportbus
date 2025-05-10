import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  i18n,
  Interaction,
  Notifier,
  SessionManager,
  SPORTBUS_API,
  SPORTBUS_I18N,
  SPORTBUS_MANAGER,
  SPORTBUS_NOTIFIER,
  SPORTBUS_PAGES,
  SPORTBUS_STATE,
  SportbusState
} from '@olmi/common';
import { environment } from '../environment/environment';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { AccessPageManifest } from './pages/access/access.manifest';
import { SessionPageManifest } from './pages/session/session.manifest';
import { ManagementPageManifest } from './pages/management/management.manifest';
import { managementAuthInterceptor } from './app.interceptors';
import { provideNativeDateAdapter } from '@angular/material/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptors([managementAuthInterceptor])),
    provideEnvironmentNgxMask(),
    provideNativeDateAdapter(),
    { provide: SPORTBUS_API, useFactory: () => new Interaction(environment)},
    { provide: SPORTBUS_I18N, useClass: i18n },
    { provide: SPORTBUS_NOTIFIER, useClass: Notifier },
    { provide: SPORTBUS_PAGES, useClass: AccessPageManifest, multi: true },
    { provide: SPORTBUS_PAGES, useClass: SessionPageManifest, multi: true },
    { provide: SPORTBUS_PAGES, useClass: ManagementPageManifest, multi: true },
    { provide: SPORTBUS_STATE, useClass: SportbusState },
    { provide: SPORTBUS_MANAGER, useClass: SessionManager },
  ],
};
