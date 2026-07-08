import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from '@guard/auth.guard';
import { PATH, getPath } from '@route/path.route';
import { SessionService } from '@service/session.service';
import { adminAuthGuard } from '@guard/admin-auth.guard';

const matchPyme = () => {
  const sessionService = inject(SessionService);
  sessionService.restoreSession();
  return sessionService.session()?.user.role === 'pyme';
};

const matchConsultor = () => {
  const sessionService = inject(SessionService);
  sessionService.restoreSession();
  return sessionService.session()?.user.role === 'consultor';
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@module/landing/landing').then((m) => m.Landing),
  },
  {
    path: getPath(PATH.policyPrivacy),
    loadComponent: () =>
      import('@module/policy-privacy/policy-privacy').then((m) => m.PolicyPrivacy),
  },
  {
    path: getPath(PATH.termsConditions),
    loadComponent: () =>
      import('@module/terms-conditions/terms-conditions').then((m) => m.TermsConditions),
  },
  {
    path: getPath(PATH.diagnostic),
    canActivate: [authGuard],
    loadComponent: () => import('@module/diagnostic/diagnostic').then((m) => m.Diagnostic),
  },
  {
    path: getPath(PATH.backoffice),
    children: [
      {
        path: '',
        canActivate: [adminAuthGuard],
        loadComponent: () => import('@module/backoffice/backoffice').then((m) => m.Backoffice),
        children: [
          {
            path: getPath(PATH.backoffice.promotionCodes),
            loadComponent: () =>
              import('@module/backoffice/components/codes/codes').then((m) => m.Codes),
          },
          {
            path: getPath(PATH.backoffice.pymes),
            loadComponent: () =>
              import('@module/backoffice/components/pymes/pymes').then((m) => m.Pymes),
          },
          {
            path: getPath(PATH.backoffice.consultants),
            loadComponent: () =>
              import('@module/backoffice/components/consultores/consultores').then(
                (m) => m.Consultores,
              ),
          },
          {
            path: getPath(PATH.backoffice.meetings),
            loadComponent: () =>
              import('@module/backoffice/components/reuniones/reuniones').then((m) => m.Reuniones),
          },
          {
            path: '',
            redirectTo: getPath(PATH.backoffice.promotionCodes),
            pathMatch: 'full',
          },
          {
            path: '**',
            redirectTo: getPath(PATH.backoffice.promotionCodes),
          },
        ],
      },
    ],
  },
  {
    path: getPath(PATH.admin),
    canActivate: [authGuard],
    children: [
      {
        path: getPath(PATH.admin.pyme),
        loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
        canMatch: [matchPyme],
        children: [
          {
            path: getPath(PATH.admin.pyme.dashboard),
            loadComponent: () =>
              import('@module/admin/content/pyme/dashboard/dashboard').then((m) => m.Dashboard),
          },
          {
            path: getPath(PATH.admin.pyme.profile),
            loadComponent: () =>
              import('@module/admin/content/pyme/profile/profile').then((m) => m.Profile),
          },
          {
            path: getPath(PATH.admin.pyme.diagnostics),
            loadComponent: () =>
              import('@module/admin/content/pyme/diagnostics/diagnostics').then(
                (m) => m.Diagnostics,
              ),
          },
          {
            path: `${getPath(PATH.admin.pyme.diagnostics)}/:id`,
            loadComponent: () =>
              import('@module/admin/content/shared/diagnostic-detail/diagnostic-detail').then(
                (m) => m.DiagnosticDetail,
              ),
          },
          {
            path: getPath(PATH.admin.pyme.consultants),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('@module/admin/content/pyme/consultants/consultants').then(
                    (m) => m.Consultants,
                  ),
              },
              {
                path: `${getPath(PATH.admin.pyme.consultants.agendar)}/:id`,
                loadComponent: () =>
                  import('@module/admin/content/pyme/consultants/content/consultant-detail/consultant-detail').then(
                    (m) => m.ConsultantDetail,
                  ),
              },
              {
                path: `${getPath(PATH.admin.pyme.consultants.profile)}/:id`,
                loadComponent: () =>
                  import('@module/admin/content/pyme/consultants/content/consultant-profile/consultant-profile').then(
                    (m) => m.ConsultantProfile,
                  ),
              },
              {
                path: `${getPath(PATH.admin.pyme.consultants.checkout)}/:id`,
                loadComponent: () =>
                  import('@module/admin/content/pyme/consultants/content/checkout/checkout').then(
                    (m) => m.Checkout,
                  ),
              },
            ],
          },
          {
            path: getPath(PATH.admin.pyme.meetings),
            loadComponent: () =>
              import('@module/admin/content/pyme/meetings/meetings').then((m) => m.Meetings),
          },
          {
            path: `${getPath(PATH.admin.pyme.meetings)}/:id`,
            loadComponent: () =>
              import('@module/admin/content/shared/meeting-detail/meeting-detail').then(
                (m) => m.MeetingDetail,
              ),
          },
          {
            path: getPath(PATH.admin.pyme.tasks),
            loadComponent: () =>
              import('@module/admin/content/pyme/tasks/tasks').then((m) => m.Tasks),
          },
          {
            path: `${getPath(PATH.admin.pyme.documents)}/diagnostic/:id`,
            loadComponent: () =>
              import('@module/admin/content/shared/diagnostic-document-detail/diagnostic-document-detail').then(
                (m) => m.DiagnosticDocumentDetail,
              ),
          },
          {
            path: `${getPath(PATH.admin.pyme.documents)}/:id`,
            loadComponent: () =>
              import('@module/admin/content/shared/meeting-minutes-detail/meeting-minutes-detail').then(
                (m) => m.MeetingMinutesDetail,
              ),
          },
          {
            path: getPath(PATH.admin.pyme.documents),
            loadComponent: () =>
              import('@module/admin/content/pyme/documents/documents').then((m) => m.Documents),
          },
          { path: '**', redirectTo: getPath(PATH.admin.pyme.dashboard), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.consultor),
        loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
        canMatch: [matchConsultor],
        children: [
          {
            path: getPath(PATH.admin.consultor.dashboard),
            loadComponent: () =>
              import('@module/admin/content/consultor/dashboard/dashboard').then(
                (m) => m.Dashboard,
              ),
          },
          {
            path: getPath(PATH.admin.consultor.profile),
            loadComponent: () =>
              import('@module/admin/content/consultor/profile/profile').then((m) => m.Profile),
          },
          {
            path: getPath(PATH.admin.consultor.pymes),
            loadComponent: () =>
              import('@module/admin/content/consultor/pymes/pymes').then((m) => m.Pymes),
          },
          {
            path: getPath(PATH.admin.consultor.meetings),
            loadComponent: () =>
              import('@module/admin/content/consultor/meetings/meetings').then((m) => m.Meetings),
          },
          {
            path: `${getPath(PATH.admin.consultor.meetings)}/:id`,
            loadComponent: () =>
              import('@module/admin/content/shared/meeting-detail/meeting-detail').then(
                (m) => m.MeetingDetail,
              ),
          },
          {
            path: getPath(PATH.admin.consultor.tasks),
            loadComponent: () =>
              import('@module/admin/content/consultor/tasks/tasks').then((m) => m.Tasks),
          },
          {
            path: `${getPath(PATH.admin.consultor.documents)}/diagnostic/:id`,
            loadComponent: () =>
              import('@module/admin/content/shared/diagnostic-document-detail/diagnostic-document-detail').then(
                (m) => m.DiagnosticDocumentDetail,
              ),
          },
          {
            path: `${getPath(PATH.admin.consultor.documents)}/:id`,
            loadComponent: () =>
              import('@module/admin/content/shared/meeting-minutes-detail/meeting-minutes-detail').then(
                (m) => m.MeetingMinutesDetail,
              ),
          },
          {
            path: getPath(PATH.admin.consultor.documents),
            loadComponent: () =>
              import('@module/admin/content/consultor/documents/documents').then(
                (m) => m.Documents,
              ),
          },
          {
            path: getPath(PATH.admin.consultor.subscription),
            loadComponent: () =>
              import('@module/admin/content/consultor/subscription/subscription').then(
                (m) => m.Subscription,
              ),
          },
          { path: '**', redirectTo: getPath(PATH.admin.consultor.dashboard), pathMatch: 'full' },
        ],
      },
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
        path: getPath(PATH.auth.adminLogin),
        loadComponent: () =>
          import('@module/auth/admin-login/admin-login').then((m) => m.AdminLogin),
      },
      {
        path: getPath(PATH.auth.signUp),
        loadComponent: () => import('@module/auth/sing-up/sing-up').then((m) => m.SingUp),
      },
      {
        path: getPath(PATH.auth.forgotPassword),
        loadComponent: () =>
          import('@module/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
      {
        path: getPath(PATH.auth.resetPassword),
        loadComponent: () =>
          import('@module/auth/reset-password/reset-password').then((m) => m.ResetPassword),
      },
      { path: '**', redirectTo: getPath(PATH.auth.signIn), pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
