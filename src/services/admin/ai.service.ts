import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly api = inject(Api);

  continueServiceRequestChat(
    data: ApiBody<'ia', 'runServiceRequestChat'>,
  ): Promise<ApiResponse<'ia', 'runServiceRequestChat'>> {
    return this.api.ia.runServiceRequestChat(data).then((response) => response.data);
  }

  matchServiceConsultants(
    data: ApiBody<'ia', 'runServiceConsultantMatches'>,
  ): Promise<ApiResponse<'ia', 'runServiceConsultantMatches'>> {
    return this.api.ia.runServiceConsultantMatches(data).then((response) => response.data);
  }

  recommendServicePaymentPlan(
    data: ApiBody<'ia', 'runServicePaymentPlan'>,
  ): Promise<ApiResponse<'ia', 'runServicePaymentPlan'>> {
    return this.api.ia.runServicePaymentPlan(data).then((response) => response.data);
  }
}
