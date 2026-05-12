import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticService {
  private api = inject(Api);

  findAll(query: ApiQuery<'diagnostic', 'findAll'> = {}): Promise<ApiResponse<'diagnostic', 'findAll'>> {
    return this.api.diagnostic.findAll(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'diagnostic', 'findOne'>> {
    return this.api.diagnostic.findOne({ id }).then((response) => response.data);
  }

  generate(data: ApiBody<'diagnostic', 'generate'>): Promise<ApiResponse<'diagnostic', 'generate'>> {
    return this.api.diagnostic.generate(data).then((response) => response.data);
  }

  delete(id: number): Promise<ApiResponse<'diagnostic', 'remove'>> {
    return this.api.diagnostic.remove({ id }).then((response) => response.data);
  }
}
