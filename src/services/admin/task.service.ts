import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private api = inject(Api);

  findAll(query: ApiQuery<'task', 'findAll'> = {}): Promise<ApiResponse<'task', 'findAll'>> {
    return this.api.task.findAll(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'task', 'findOne'>> {
    return this.api.task.findOne({ id }).then((response) => response.data);
  }

  create(data: ApiBody<'task', 'create'>): Promise<ApiResponse<'task', 'create'>> {
    return this.api.task.create(data).then((response) => response.data);
  }

  update(id: number, data: ApiBody<'task', 'update'>): Promise<ApiResponse<'task', 'update'>> {
    return this.api.task.update({ id }, data).then((response) => response.data);
  }

  updateStatus(id: number, data: ApiBody<'task', 'updateStatus'>): Promise<ApiResponse<'task', 'updateStatus'>> {
    return this.api.task.updateStatus({ id }, data).then((response) => response.data);
  }

  delete(id: number): Promise<ApiResponse<'task', 'remove'>> {
    return this.api.task.remove({ id }).then((response) => response.data);
  }
}
