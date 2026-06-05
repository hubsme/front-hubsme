import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { SessionService } from '@service/session.service';

type MatchStatus = ApiResponse<'pyme', 'consultantContacts'>['data'][number]['status'];
type MatchContact = Pick<
  ApiResponse<'pyme', 'consultantContacts'>['data'][number],
  'pymeId' | 'consultantId'
>;

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

  getMeeting(id: number) {
    return this.api.meeting.findOne({ id });
  }

  createMeeting(data: ApiBody<'meeting', 'create'>) {
    return this.api.meeting.create(data);
  }

  updateMeeting(id: number, data: ApiBody<'meeting', 'update'>) {
    return this.api.meeting.update({ id }, data);
  }

  confirmMeeting(id: number) {
    return this.api.meeting.confirm({ id });
  }

  finalizeMeeting(id: number, data: ApiBody<'meeting', 'finalize'>) {
    return this.api.meeting.finalize({ id }, data);
  }

  createTeamsJoinToken(id: number, data: ApiBody<'meeting', 'createTeamsJoinToken'>) {
    return this.api.meeting.createTeamsJoinToken({ id }, data);
  }

  getMeetingRecordings(id: number) {
    return this.api.meeting.getRecordings({ id });
  }

  getCopilotSummary(id: number) {
    return this.api.meeting.getCopilotSummary({ id });
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

  updateTask(id: number, data: ApiBody<'task', 'update'>) {
    return this.api.task.update({ id }, data);
  }

  updateTaskStatus(id: number, status: ApiBody<'task', 'updateStatus'>['status']) {
    return this.api.task.updateStatus({ id }, { status });
  }

  listDiagnostics(page = 1, limit = 10, pymeId?: number) {
    const user = this.currentUser();
    return this.api.diagnostic.findAll({
      page,
      limit,
      pymeId: user.role === 'pyme' ? user.id : pymeId,
    });
  }

  getDiagnostic(id: number) {
    return this.api.diagnostic.findOne({ id });
  }

  listDiagnosticDocuments(page = 1, limit = 100, pymeId?: number, diagnosticId?: number) {
    const user = this.currentUser();
    return this.api.diagnosticDocument.diagnosticdocumentFindAll({
      page,
      limit,
      pymeId: user.role === 'pyme' ? user.id : pymeId,
      diagnosticId,
    });
  }

  getDiagnosticDocument(id: number) {
    return this.api.diagnosticDocument.diagnosticdocumentFindOne({ id });
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

  listMatches(
    page = 1,
    limit = 100,
    status?: MatchStatus,
    search?: string,
  ) {
    const user = this.currentUser();
    const cleanSearch = search?.trim() || undefined;

    return user.role === 'pyme'
      ? this.api.pyme.consultantContacts({ page, limit, pymeId: user.id, status, search: cleanSearch })
      : this.api.consultant.pymeContacts({
          page,
          limit,
          consultantId: user.id,
          status,
          search: cleanSearch,
        });
  }

  createMatch(consultantId: number) {
    const user = this.currentUser();
    return this.api.pyme.contactConsultant({ pymeId: user.id, consultantId });
  }

  updateMatch(match: MatchContact, status: MatchStatus) {
    const user = this.currentUser();
    if (status === 'aceptado') {
      return user.role === 'pyme'
        ? this.api.pyme.acceptConsultantContact({
            pymeId: user.id,
            consultantId: match.consultantId,
          })
        : this.api.consultant.acceptPymeContact({
            consultantId: user.id,
            pymeId: match.pymeId,
          });
    }

    if (status === 'rechazado') {
      return user.role === 'pyme'
        ? this.api.pyme.rejectConsultantContact({
            pymeId: user.id,
            consultantId: match.consultantId,
          })
        : this.api.consultant.rejectPymeContact({
            consultantId: user.id,
            pymeId: match.pymeId,
          });
    }

    throw new Error('Solo se puede aceptar o rechazar un contacto desde este modulo');
  }

  listMatchMessages(match: MatchContact) {
    const user = this.currentUser();
    return user.role === 'pyme'
      ? this.api.pyme.consultantMessages({
          pymeId: user.id,
          consultantId: match.consultantId,
        })
      : this.api.consultant.pymeMessages({
          consultantId: user.id,
          pymeId: match.pymeId,
        });
  }

  sendMatchMessage(match: MatchContact, message: string) {
    const user = this.currentUser();
    return user.role === 'pyme'
      ? this.api.pyme.sendConsultantMessage({
          pymeId: user.id,
          consultantId: match.consultantId,
          message,
        })
      : this.api.consultant.sendPymeMessage({
          consultantId: user.id,
          pymeId: match.pymeId,
          message,
        });
  }

  getErrorMessage(error: unknown): string {
    const apiError = error as { error?: { message?: string | string[] }; message?: string };
    const message = apiError.error?.message || apiError.message || 'Ocurrio un error inesperado';
    return Array.isArray(message) ? message[0] : message;
  }
}
