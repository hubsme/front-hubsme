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

  findOne(id: number): Promise<ApiResponse<'meeting', 'findOne'>> {
    return this.api.meeting.findOne({ id }).then((response) => response.data);
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

  delete(id: number): Promise<ApiResponse<'meeting', 'remove'>> {
    return this.api.meeting.remove({ id }).then((response) => response.data);
  }
}
