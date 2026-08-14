import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  PLATFORM_ID,
  LOCALE_ID,
  inject,
  Injector,
} from '@angular/core';
import { PreloadAllModules, provideRouter, Router, withPreloading } from '@angular/router';
import { DATE_PIPE_DEFAULT_OPTIONS, isPlatformBrowser, registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { SessionService } from '@service/session.service';
import { PERU_TIME_ZONE } from '@function/date.function';

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
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(withEventReplay()),
    { provide: LOCALE_ID, useValue: 'es-PE' },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { timezone: PERU_TIME_ZONE },
    },

    // agregado
    {
      provide: Api,
      useFactory: () => {
        const router = inject(Router);
        const platformId = inject(PLATFORM_ID);
        const injector = inject(Injector);
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
                const returnUrl = router.url;
                const sessionService = injector.get(SessionService);
                sessionService.removeSession();
                const signInPath = `/${buildPath(PATH.auth.signIn)}`;
                if (returnUrl.split('?')[0] !== signInPath) {
                  router.navigate([buildPath(PATH.auth.signIn)], {
                    queryParams: { returnUrl },
                  });
                }
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
