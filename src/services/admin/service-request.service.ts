import { Injectable, inject } from '@angular/core';
import {
  Api,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ServiceRequestCreateMultipartDto,
  ServiceRequestEvidenceMultipartDto,
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

  completeService(id: number): Promise<ApiResponse<'service', 'completeService'>> {
    return this.api.service.completeService({ id }).then((response) => response.data);
  }

  scheduleMilestoneMeeting(
    id: number,
    data: ApiBody<'service', 'scheduleMilestoneMeeting'>,
  ): Promise<ApiResponse<'service', 'scheduleMilestoneMeeting'>> {
    return this.api.service
      .scheduleMilestoneMeeting({ id }, data)
      .then((response) => response.data);
  }

  updateMilestone(
    id: number,
    index: number,
    data: ApiBody<'service', 'updateMilestone'>,
  ): Promise<ApiResponse<'service', 'updateMilestone'>> {
    return this.api.service.updateMilestone({ id, index }, data).then((response) => response.data);
  }

  removeMilestone(
    id: number,
    index: number,
  ): Promise<ApiResponse<'service', 'removeMilestone'>> {
    return this.api.service.removeMilestone({ id, index }).then((response) => response.data);
  }

  addExtraMilestoneMeeting(
    id: number,
    data: ApiBody<'service', 'addExtraMilestoneMeeting'>,
  ): Promise<ApiResponse<'service', 'addExtraMilestoneMeeting'>> {
    return this.api.service
      .addExtraMilestoneMeeting({ id }, data)
      .then((response) => response.data);
  }

  uploadEvidence(id: number, data: FormData): Promise<ApiResponse<'service', 'uploadEvidence'>> {
    return this.api.service
      .uploadEvidence({ id }, data as unknown as ServiceRequestEvidenceMultipartDto)
      .then((response) => response.data);
  }

  deleteEvidence(
    id: number,
    attachmentId: string,
  ): Promise<ApiResponse<'service', 'deleteEvidence'>> {
    return this.api.service.deleteEvidence({ id, attachmentId }).then((response) => response.data);
  }
}
