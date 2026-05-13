import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { SessionService } from '@service/session.service';

@Injectable({
  providedIn: 'root',
})
export class HubsmeService {
  private api = inject(Api);
  private sessionService = inject(SessionService);

  currentUser(): ApiResponse<'auth', 'login'>['user'] {
    const session = this.sessionService.session();
    if (!session) {
      throw new Error('No hay una sesion activa');
    }
    return session.user;
  }

  dashboardSummary() {
    const user = this.currentUser();
    return this.api.dashboard.summary({ userId: user.id, role: user.role });
  }

  listPymes(search = '', page = 1, limit = 10) {
    return this.api.pyme.findAll({ page, limit, search: search || undefined });
  }

  listConsultants(search = '', page = 1, limit = 10, active?: 'true' | 'false') {
    return this.api.consultant.findAll({ page, limit, search: search || undefined, active });
  }

  listMeetings(page = 1, limit = 20) {
    const user = this.currentUser();
    return this.api.meeting.findAll({
      page,
      limit,
      pymeId: user.role === 'pyme' ? user.id : undefined,
      consultantId: user.role === 'consultor' ? user.id : undefined,
    });
  }

  createMeeting(data: ApiBody<'meeting', 'create'>) {
    return this.api.meeting.create(data);
  }

  updateMeeting(id: number, data: ApiBody<'meeting', 'update'>) {
    return this.api.meeting.update({ id }, data);
  }

  finalizeMeeting(id: number, description: string) {
    return this.api.meeting.finalize({ id }, { description });
  }

  listTasks(page = 1, limit = 100, status?: ApiBody<'task', 'updateStatus'>['status']) {
    const user = this.currentUser();
    return this.api.task.findAll({
      page,
      limit,
      pymeId: user.role === 'pyme' ? user.id : undefined,
      consultantId: user.role === 'consultor' ? user.id : undefined,
      status,
    });
  }

  createTask(data: ApiBody<'task', 'create'>) {
    return this.api.task.create(data);
  }

  updateTaskStatus(id: number, status: ApiBody<'task', 'updateStatus'>['status']) {
    return this.api.task.updateStatus({ id }, { status });
  }

  listDiagnostics(page = 1, limit = 10) {
    const user = this.currentUser();
    return this.api.diagnostic.findAll({
      page,
      limit,
      pymeId: user.role === 'pyme' ? user.id : undefined,
    });
  }

  generateDiagnostic(data: ApiBody<'diagnostic', 'generate'>) {
    return this.api.diagnostic.generate(data);
  }

  getPlans() {
    return this.api.subscription.plans();
  }

  upsertSubscription(data: ApiBody<'subscription', 'upsert'>) {
    return this.api.subscription.upsert(data);
  }

  listMatches(page = 1, limit = 100, status?: ApiBody<'pymeConsultantMatch', 'pymeconsultantmatchUpdate'>['status']) {
    const user = this.currentUser();
    return this.api.pymeConsultantMatch.pymeconsultantmatchFindAll({
      page,
      limit,
      pymeId: user.role === 'pyme' ? user.id : undefined,
      consultantId: user.role === 'consultor' ? user.id : undefined,
      status,
    });
  }

  createMatch(consultantId: number) {
    const user = this.currentUser();
    return this.api.pymeConsultantMatch.pymeconsultantmatchCreate({
      pymeId: user.id,
      consultantId,
      status: 'pendiente',
      source: 'marketplace',
    });
  }

  updateMatch(id: number, status: ApiBody<'pymeConsultantMatch', 'pymeconsultantmatchUpdate'>['status']) {
    return this.api.pymeConsultantMatch.pymeconsultantmatchUpdate({ id }, { status });
  }

  listMatchMessages(matchId: number) {
    return this.api.pymeConsultantMessage.pymeconsultantmessageFindAll({ matchId });
  }

  sendMatchMessage(matchId: number, message: string) {
    const user = this.currentUser();
    return this.api.pymeConsultantMessage.pymeconsultantmessageCreate({
      matchId,
      senderId: user.id,
      message,
    });
  }

  getErrorMessage(error: unknown): string {
    const apiError = error as { error?: { message?: string | string[] }; message?: string };
    const message = apiError.error?.message || apiError.message || 'Ocurrio un error inesperado';
    return Array.isArray(message) ? message[0] : message;
  }
}
