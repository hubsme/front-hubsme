import { Routes } from '@angular/router';
import { authGuard } from '@guard/auth.guard';
import { PATH, getPath } from '@route/path.route';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@module/landing/landing').then((m) => m.Landing),
  },
  {
    path: getPath(PATH.admin),
    loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
    children: [
      {
        path: getPath(PATH.admin.dashboard),
        loadComponent: () => import('@module/admin/content/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: getPath(PATH.admin.pymes),
        loadComponent: () => import('@module/admin/content/pymes/pymes').then((m) => m.Pymes),
      },
      {
        path: getPath(PATH.admin.consultants),
        loadComponent: () =>
          import('@module/admin/content/consultants/consultants').then((m) => m.Consultants),
      },
      {
        path: getPath(PATH.admin.meetings),
        loadComponent: () => import('@module/admin/content/meetings/meetings').then((m) => m.Meetings),
      },
      {
        path: getPath(PATH.admin.tasks),
        loadComponent: () => import('@module/admin/content/tasks/tasks').then((m) => m.Tasks),
      },
      {
        path: getPath(PATH.admin.documents),
        loadComponent: () => import('@module/admin/content/documents/documents').then((m) => m.Documents),
      },
      {
        path: getPath(PATH.admin.diagnostics),
        loadComponent: () =>
          import('@module/admin/content/diagnostics/diagnostics').then((m) => m.Diagnostics),
      },
      {
        path: getPath(PATH.admin.subscription),
        loadComponent: () =>
          import('@module/admin/content/subscription/subscription').then((m) => m.Subscription),
      },
      { path: '**', redirectTo: getPath(PATH.admin.dashboard), pathMatch: 'full' },
    ],
  },
  {
    path: getPath(PATH.auth),
    children: [
      {
        path: getPath(PATH.auth.signIn),
        loadComponent: () => import('@module/auth/sing-in/sing-in').then((m) => m.SingIn),
      },
      {
        path: getPath(PATH.auth.signUp),
        loadComponent: () => import('@module/auth/sing-up/sing-up').then((m) => m.SingUp),
      },
      { path: '**', redirectTo: getPath(PATH.auth.signIn), pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
