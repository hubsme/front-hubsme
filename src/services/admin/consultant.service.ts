import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class ConsultantService {
  private api = inject(Api);

  findAll(query: ApiQuery<'consultant', 'findAll'> = {}): Promise<ApiResponse<'consultant', 'findAll'>> {
    return this.api.consultant.findAll(query).then((response) => response.data);
  }

  meetingPymes(query: ApiQuery<'consultant', 'meetingPymes'> = {}): Promise<ApiResponse<'consultant', 'meetingPymes'>> {
    return this.api.consultant.meetingPymes(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'consultant', 'findOne'>> {
    return this.api.consultant.findOne({ id }).then((response) => response.data);
  }

  findByUser(userId: number): Promise<ApiResponse<'consultant', 'findByUser'>> {
    return this.api.consultant.findByUser({ userId }).then((response) => response.data);
  }

  create(data: ApiBody<'consultant', 'create'>): Promise<ApiResponse<'consultant', 'create'>> {
    return this.api.consultant.create(data).then((response) => response.data);
  }

  update(id: number, data: ApiBody<'consultant', 'update'>): Promise<ApiResponse<'consultant', 'update'>> {
    return this.api.consultant.update({ id }, data).then((response) => response.data);
  }

  delete(id: number): Promise<ApiResponse<'consultant', 'remove'>> {
    return this.api.consultant.remove({ id }).then((response) => response.data);
  }
}
