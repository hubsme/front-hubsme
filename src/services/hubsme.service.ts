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

  currentOrganization(): NonNullable<ApiResponse<'auth', 'login'>['organization']> {
    const organization = this.sessionService.session()?.organization;
    if (!organization) {
      throw new Error('No hay una empresa asociada a la sesion');
    }
    return organization;
  }

  currentPymeId(): number {
    const session = this.sessionService.session();
    if (session?.organization) return session.organization.id;
    if (session?.user.role === 'pyme') return session.user.id;
    throw new Error('No hay una empresa asociada a la sesion');
  }

  canManageOrganization(): boolean {
    return this.sessionService.session()?.organization?.membershipRole === 'owner';
  }

  dashboardSummary() {
    const user = this.currentUser();
    return this.api.dashboard.summary({
      userId: user.role === 'pyme' ? this.currentPymeId() : user.id,
      role: user.role,
    });
  }

  listPymes(search = '', page = 1, limit = 10) {
    return this.api.pyme.findAll({ page, limit, search: search || undefined });
  }

  listConsultants(
    search = '',
    page = 1,
    limit = 10,
    active: 'true' | 'false' = 'true',
    validated: 'true' | 'false' = 'true',
  ) {
    return this.api.consultant.findAll({
      page,
      limit,
      search: search || undefined,
      active,
      validated,
    });
  }

  listMeetings(page = 1, limit = 20) {
    const user = this.currentUser();
    return this.api.meeting.findAll({
      page,
      limit,
      pymeId: user.role === 'pyme' ? this.currentPymeId() : undefined,
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

  confirmMeetingOption(id: number, data: ApiBody<'meeting', 'confirmOption'>) {
    return this.api.meeting.confirmOption({ id }, data);
  }

  finalizeMeeting(id: number, data: ApiBody<'meeting', 'finalize'>) {
    return this.api.meeting.finalize({ id }, data);
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
      pymeId: user.role === 'pyme' ? this.currentPymeId() : undefined,
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
      pymeId: user.role === 'pyme' ? this.currentPymeId() : pymeId,
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
      pymeId: user.role === 'pyme' ? this.currentPymeId() : pymeId,
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

  getSubscriptionByUserId(userId: number) {
    return this.api.subscription.findByUser({ userId });
  }

  getErrorMessage(error: unknown): string {
    const apiError = error as { error?: { message?: string | string[] }; message?: string };
    const message = apiError.error?.message || apiError.message || 'Ocurrio un error inesperado';
    return Array.isArray(message) ? message[0] : message;
  }
}
