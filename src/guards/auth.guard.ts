import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, type CanActivateFn } from '@angular/router';
import { canAccessRoute, getDefaultRoute, buildPath, PATH } from '@route/path.route';
import { SessionService } from '@service/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  sessionService.restoreSession();

  if (!sessionService.session()) {
    return router.createUrlTree([buildPath(PATH.auth.signIn)], {
      queryParams: { returnUrl: state.url },
    });
  }

  const user = sessionService.session();
  const currentPath = state.url.split('?')[0].replace(/^\//, '');

  if (user && user.user.role && !canAccessRoute(currentPath, [user.user.role])) {
    const defaultRoute = getDefaultRoute([user.user.role]);
    router.navigate([defaultRoute]);
    return false;
  }

  return true;
};
