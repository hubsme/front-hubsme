import { Injectable, inject } from '@angular/core';
import {
  Api,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ServiceRequestCreateMultipartDto,
} from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private readonly api = inject(Api);

  findAll(query: ApiQuery<'service', 'findAll'> = {}): Promise<ApiResponse<'service', 'findAll'>> {
    return this.api.service.findAll(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'service', 'findOne'>> {
    return this.api.service.findOne({ id }).then((response) => response.data);
  }

  create(data: FormData): Promise<ApiResponse<'service', 'create'>> {
    return this.api.service
      .create(data as unknown as ServiceRequestCreateMultipartDto)
      .then((response) => response.data);
  }

  sendProposal(
    id: number,
    data: ApiBody<'service', 'sendProposal'>,
  ): Promise<ApiResponse<'service', 'sendProposal'>> {
    return this.api.service.sendProposal({ id }, data).then((response) => response.data);
  }

  decline(
    id: number,
    data: ApiBody<'service', 'decline'>,
  ): Promise<ApiResponse<'service', 'decline'>> {
    return this.api.service.decline({ id }, data).then((response) => response.data);
  }

  scheduleMilestoneMeeting(
    id: number,
    data: ApiBody<'service', 'scheduleMilestoneMeeting'>,
  ): Promise<ApiResponse<'service', 'scheduleMilestoneMeeting'>> {
    return this.api.service.scheduleMilestoneMeeting({ id }, data).then((response) => response.data);
  }
}
