import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { buildPath, PATH } from '@route/path.route';
import { Api, HttpClient } from 'api/backend.api';
import { AdminSessionService } from './admin-session.service';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly adminSession = inject(AdminSessionService);

  readonly api = new Api(
    new HttpClient({
      baseUrl: environment.baseUrl,
      securityWorker: async () => {
        const token = this.adminSession.session()?.accessToken;
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      },
      customFetch: async (input, init) => {
        const response = await fetch(input, init);
        if (response.status === 401 && isPlatformBrowser(this.platformId)) {
          this.adminSession.removeSession();
          await this.router.navigate([buildPath(PATH.auth.adminLogin)]);
        }
        return response;
      },
    }),
  );
}
