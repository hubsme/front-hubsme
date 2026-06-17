import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from '@guard/auth.guard';
import { PATH, getPath } from '@route/path.route';
import { SessionService } from '@service/session.service';

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
    path: getPath(PATH.pyme),
    loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
    canMatch: [matchPyme],
    children: [
      {
        path: getPath(PATH.pyme.dashboard),
        loadComponent: () => import('@module/admin/content/pyme/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: getPath(PATH.pyme.profile),
        loadComponent: () => import('@module/admin/content/pyme/profile/profile').then((m) => m.Profile),
      },
      {
        path: getPath(PATH.pyme.diagnostics),
        loadComponent: () => import('@module/admin/content/pyme/diagnostics/diagnostics').then((m) => m.Diagnostics),
      },
      {
        path: `${getPath(PATH.pyme.diagnostics)}/:id`,
        loadComponent: () => import('@module/admin/content/shared/diagnostic-detail/diagnostic-detail').then((m) => m.DiagnosticDetail),
      },
      {
        path: getPath(PATH.pyme.consultants),
        loadComponent: () => import('@module/admin/content/pyme/consultants/consultants').then((m) => m.Consultants),
      },
      {
        path: `${getPath(PATH.pyme.consultants)}/:id`,
        loadComponent: () => import('@module/admin/content/pyme/consultant-detail/consultant-detail').then((m) => m.ConsultantDetail),
      },
      {
        path: getPath(PATH.pyme.meetings),
        loadComponent: () => import('@module/admin/content/pyme/meetings/meetings').then((m) => m.Meetings),
      },
      {
        path: `${getPath(PATH.pyme.meetings)}/:id`,
        loadComponent: () => import('@module/admin/content/shared/meeting-detail/meeting-detail').then((m) => m.MeetingDetail),
      },
      {
        path: getPath(PATH.pyme.tasks),
        loadComponent: () => import('@module/admin/content/pyme/tasks/tasks').then((m) => m.Tasks),
      },
      {
        path: `${getPath(PATH.pyme.documents)}/diagnostic/:id`,
        loadComponent: () => import('@module/admin/content/shared/diagnostic-document-detail/diagnostic-document-detail').then((m) => m.DiagnosticDocumentDetail),
      },
      {
        path: `${getPath(PATH.pyme.documents)}/:id`,
        loadComponent: () => import('@module/admin/content/shared/meeting-minutes-detail/meeting-minutes-detail').then((m) => m.MeetingMinutesDetail),
      },
      {
        path: getPath(PATH.pyme.documents),
        loadComponent: () => import('@module/admin/content/pyme/documents/documents').then((m) => m.Documents),
      },
      { path: '**', redirectTo: getPath(PATH.pyme.dashboard), pathMatch: 'full' },
    ],
  },
  {
    path: getPath(PATH.consultor),
    loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
    canMatch: [matchConsultor],
    children: [
      {
        path: getPath(PATH.consultor.dashboard),
        loadComponent: () => import('@module/admin/content/consultor/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: getPath(PATH.consultor.profile),
        loadComponent: () => import('@module/admin/content/consultor/profile/profile').then((m) => m.Profile),
      },
      {
        path: getPath(PATH.consultor.pymes),
        loadComponent: () => import('@module/admin/content/consultor/pymes/pymes').then((m) => m.Pymes),
      },
      {
        path: getPath(PATH.consultor.meetings),
        loadComponent: () => import('@module/admin/content/consultor/meetings/meetings').then((m) => m.Meetings),
      },
      {
        path: `${getPath(PATH.consultor.meetings)}/:id`,
        loadComponent: () => import('@module/admin/content/shared/meeting-detail/meeting-detail').then((m) => m.MeetingDetail),
      },
      {
        path: getPath(PATH.consultor.tasks),
        loadComponent: () => import('@module/admin/content/consultor/tasks/tasks').then((m) => m.Tasks),
      },
      {
        path: `${getPath(PATH.consultor.documents)}/diagnostic/:id`,
        loadComponent: () => import('@module/admin/content/shared/diagnostic-document-detail/diagnostic-document-detail').then((m) => m.DiagnosticDocumentDetail),
      },
      {
        path: `${getPath(PATH.consultor.documents)}/:id`,
        loadComponent: () => import('@module/admin/content/shared/meeting-minutes-detail/meeting-minutes-detail').then((m) => m.MeetingMinutesDetail),
      },
      {
        path: getPath(PATH.consultor.documents),
        loadComponent: () => import('@module/admin/content/consultor/documents/documents').then((m) => m.Documents),
      },
      {
        path: getPath(PATH.consultor.subscription),
        loadComponent: () => import('@module/admin/content/consultor/subscription/subscription').then((m) => m.Subscription),
      },
      { path: '**', redirectTo: getPath(PATH.consultor.dashboard), pathMatch: 'full' },
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
