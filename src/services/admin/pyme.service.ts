import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class PymeService {
  private api = inject(Api);

  findAll(query: ApiQuery<'pyme', 'findAll'> = {}): Promise<ApiResponse<'pyme', 'findAll'>> {
    return this.api.pyme.findAll(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'pyme', 'findOne'>> {
    return this.api.pyme.findOne({ id }).then((response) => response.data);
  }

  findByUser(userId: number): Promise<ApiResponse<'pyme', 'findByUser'>> {
    return this.api.pyme.findByUser({ userId }).then((response) => response.data);
  }

  meetingDocuments(query: ApiQuery<'pyme', 'meetingDocuments'> = {}): Promise<ApiResponse<'pyme', 'meetingDocuments'>> {
    return this.api.pyme.meetingDocuments(query).then((response) => response.data);
  }

  diagnosticDocuments(query: ApiQuery<'pyme', 'diagnosticDocuments'> = {}): Promise<ApiResponse<'pyme', 'diagnosticDocuments'>> {
    return this.api.pyme.diagnosticDocuments(query).then((response) => response.data);
  }

  meetingConsultants(
    query: ApiQuery<'pyme', 'meetingConsultants'> = {},
  ): Promise<ApiResponse<'pyme', 'meetingConsultants'>> {
    return this.api.pyme.meetingConsultants(query).then((response) => response.data);
  }

  create(data: ApiBody<'pyme', 'create'>): Promise<ApiResponse<'pyme', 'create'>> {
    return this.api.pyme.create(data).then((response) => response.data);
  }

  update(id: number, data: ApiBody<'pyme', 'update'>): Promise<ApiResponse<'pyme', 'update'>> {
    return this.api.pyme.update({ id }, data).then((response) => response.data);
  }

  delete(id: number): Promise<ApiResponse<'pyme', 'remove'>> {
    return this.api.pyme.remove({ id }).then((response) => response.data);
  }
}
