import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private api = inject(Api);

  findAll(query: ApiQuery<'meeting', 'findAll'> = {}): Promise<ApiResponse<'meeting', 'findAll'>> {
    return this.api.meeting.findAll(query).then((response) => response.data);
  }

  calendar(query: ApiQuery<'meeting', 'calendar'>): Promise<ApiResponse<'meeting', 'calendar'>> {
    return this.api.meeting.calendar(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'meeting', 'findOne'>> {
    return this.api.meeting.findOne({ id }).then((response) => response.data);
  }

  access(id: number): Promise<ApiResponse<'meeting', 'access'>> {
    return this.api.meeting.access({ id }).then((response) => response.data);
  }

  create(data: ApiBody<'meeting', 'create'>): Promise<ApiResponse<'meeting', 'create'>> {
    return this.api.meeting.create(data).then((response) => response.data);
  }

  update(id: number, data: ApiBody<'meeting', 'update'>): Promise<ApiResponse<'meeting', 'update'>> {
    return this.api.meeting.update({ id }, data).then((response) => response.data);
  }

  finalize(id: number, data: ApiBody<'meeting', 'finalize'>): Promise<ApiResponse<'meeting', 'finalize'>> {
    return this.api.meeting.finalize({ id }, data).then((response) => response.data);
  }

  confirmOption(
    id: number,
    data: ApiBody<'meeting', 'confirmOption'>,
  ): Promise<ApiResponse<'meeting', 'confirmOption'>> {
    return this.api.meeting.confirmOption({ id }, data).then((response) => response.data);
  }

  cancelByConsultant(
    id: number,
    data: ApiBody<'meeting', 'cancelByConsultant'>,
  ): Promise<ApiResponse<'meeting', 'cancelByConsultant'>> {
    return this.api.meeting.cancelByConsultant({ id }, data).then((response) => response.data);
  }

  delete(id: number): Promise<ApiResponse<'meeting', 'remove'>> {
    return this.api.meeting.remove({ id }).then((response) => response.data);
  }
}
