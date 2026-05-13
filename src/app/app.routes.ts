import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from '@guard/auth.guard';
import { PATH, getPath } from '@route/path.route';
import { SessionService } from '@service/session.service';

type AppRole = 'pyme' | 'consultor';

const roleMatch = (role: AppRole) => () => {
  const sessionService = inject(SessionService);
  sessionService.restoreSession();
  return sessionService.session()?.user.role === role;
};

const workspaceRoutes = (role: AppRole): Routes => {
  const path = PATH[role];
  return [
    {
      path: getPath(path),
      loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
      canActivate: [authGuard],
      canMatch: [roleMatch(role)],
      children: [
        {
          path: getPath(path.dashboard),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/dashboard/pyme-dashboard/pyme-dashboard').then((m) => m.PymeDashboard)
              : import('@module/admin/content/consultor/dashboard/consultor-dashboard/consultor-dashboard').then(
                  (m) => m.ConsultorDashboard,
                ),
        },
        {
          path: getPath(path.pymes),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/pymes/pyme-pymes/pyme-pymes').then((m) => m.PymePymes)
              : import('@module/admin/content/consultor/pymes/consultor-pymes/consultor-pymes').then(
                  (m) => m.ConsultorPymes,
                ),
        },
        {
          path: getPath(path.consultants),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/consultants/pyme-consultants/pyme-consultants').then(
                  (m) => m.PymeConsultants,
                )
              : import('@module/admin/content/consultor/consultants/consultor-consultants/consultor-consultants').then(
                  (m) => m.ConsultorConsultants,
                ),
        },
        {
          path: getPath(path.inbox),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/inbox/pyme-inbox/pyme-inbox').then((m) => m.PymeInbox)
              : import('@module/admin/content/consultor/inbox/consultor-inbox/consultor-inbox').then(
                  (m) => m.ConsultorInbox,
                ),
        },
        {
          path: getPath(path.meetings),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/meetings/pyme-meetings/pyme-meetings').then((m) => m.PymeMeetings)
              : import('@module/admin/content/consultor/meetings/consultor-meetings/consultor-meetings').then(
                  (m) => m.ConsultorMeetings,
                ),
        },
        {
          path: getPath(path.tasks),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/tasks/pyme-tasks/pyme-tasks').then((m) => m.PymeTasks)
              : import('@module/admin/content/consultor/tasks/consultor-tasks/consultor-tasks').then(
                  (m) => m.ConsultorTasks,
                ),
        },
        {
          path: getPath(path.documents),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/documents/pyme-documents/pyme-documents').then((m) => m.PymeDocuments)
              : import('@module/admin/content/consultor/documents/consultor-documents/consultor-documents').then(
                  (m) => m.ConsultorDocuments,
                ),
        },
        {
          path: getPath(path.diagnostics),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/diagnostics/pyme-diagnostics/pyme-diagnostics').then(
                  (m) => m.PymeDiagnostics,
                )
              : import('@module/admin/content/consultor/diagnostics/consultor-diagnostics/consultor-diagnostics').then(
                  (m) => m.ConsultorDiagnostics,
                ),
        },
        {
          path: getPath(path.subscription),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/subscription/pyme-subscription/pyme-subscription').then(
                  (m) => m.PymeSubscription,
                )
              : import('@module/admin/content/consultor/subscription/consultor-subscription/consultor-subscription').then(
                  (m) => m.ConsultorSubscription,
                ),
        },
        {
          path: getPath(path.profile),
          loadComponent: () =>
            role === 'pyme'
              ? import('@module/admin/content/pyme/profile/pyme-profile/pyme-profile').then((m) => m.PymeProfile)
              : import('@module/admin/content/consultor/profile/consultor-profile/consultor-profile').then(
                  (m) => m.ConsultorProfile,
                ),
        },
        { path: '**', redirectTo: getPath(path.dashboard), pathMatch: 'full' },
      ],
    },
  ];
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@module/landing/landing').then((m) => m.Landing),
  },
  ...workspaceRoutes('pyme'),
  ...workspaceRoutes('consultor'),
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
