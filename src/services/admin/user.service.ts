import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(Api);

  findAll(query: ApiQuery<'user', 'findAll'> = {}): Promise<ApiResponse<'user', 'findAll'>> {
    return this.api.user.findAll(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'user', 'findOne'>> {
    return this.api.user.findOne({ id }).then((response) => response.data);
  }

  create(data: ApiBody<'user', 'create'>): Promise<ApiResponse<'user', 'create'>> {
    return this.api.user.create(data).then((response) => response.data);
  }

  update(id: number, data: ApiBody<'user', 'update'>): Promise<ApiResponse<'user', 'update'>> {
    return this.api.user.update({ id }, data).then((response) => response.data);
  }

  delete(id: number): Promise<ApiResponse<'user', 'remove'>> {
    return this.api.user.remove({ id }).then((response) => response.data);
  }
}
