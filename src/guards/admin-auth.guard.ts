import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { buildPath, PATH } from '@route/path.route';
import { AdminSessionService } from '@service/admin-session.service';

export const adminAuthGuard: CanActivateFn = () => {
  const sessionService = inject(AdminSessionService);
  const router = inject(Router);
  sessionService.restoreSession();

  return sessionService.session()
    ? true
    : router.createUrlTree([buildPath(PATH.backoffice.login)]);
};
