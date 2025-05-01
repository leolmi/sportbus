import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import {
  Interaction,
  Notifier,
  SessionManager,
  SPORTBUS_API,
  SPORTBUS_MANAGER,
  SPORTBUS_NOTIFIER,
  SPORTBUS_PAGES,
  SPORTBUS_STATE,
  SportbusState
} from '@olmi/common';
import { environment } from '../environment/environment';
import { AccessPageManifest } from './pages/access/access.manifest';
import { SessionPageManifest } from './pages/session/session.manifest';
import { ManagementPageManifest } from './pages/management/management.manifest';
import { provideEnvironmentNgxMask } from 'ngx-mask';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    { provide: SPORTBUS_API, useFactory: () => new Interaction(environment)},
    { provide: SPORTBUS_NOTIFIER, useClass: Notifier },
    { provide: SPORTBUS_PAGES, useClass: AccessPageManifest, multi: true },
    { provide: SPORTBUS_PAGES, useClass: SessionPageManifest, multi: true },
    { provide: SPORTBUS_PAGES, useClass: ManagementPageManifest, multi: true },
    { provide: SPORTBUS_STATE, useClass: SportbusState },
    { provide: SPORTBUS_MANAGER, useClass: SessionManager },
  ],
};
