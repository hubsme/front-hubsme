import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { SessionService } from '@service/session.service';

registerLocaleData(localeEsPE, 'es-PE');

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { Api, HttpClient } from 'api/backend.api';
import { buildPath, PATH } from '@route/path.route';
import { environment } from '@environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // agregado
    {
      provide: Api,
      useFactory: () => {
        const router = inject(Router);
        const platformId = inject(PLATFORM_ID);
        const sessionService = inject(SessionService);
        const http = new HttpClient({
          baseUrl: environment.baseUrl,
          securityWorker: async () => {
            if (isPlatformBrowser(platformId)) {
              const session = localStorage.getItem('user_session');
              if (session) {
                const token = JSON.parse(session).accessToken;
                return { headers: { Authorization: `Bearer ${token}` } };
              }
            }
            return {};
          },
          customFetch: async (input, init) => {
            const response = await fetch(input, init);
            if (response.status === 401) {
              if (isPlatformBrowser(platformId)) {
                sessionService.removeSession();
                router.navigate([buildPath(PATH.auth.signIn)]);
              }
            }
            return response;
          },
        });
        return new Api(http);
      },
    },
  ],
};
