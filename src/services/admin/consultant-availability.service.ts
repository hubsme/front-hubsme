import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiQuery, ApiResponse } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class ConsultantAvailabilityService {
  private api = inject(Api);

  findAll(
    query: ApiQuery<'consultantAvailability', 'consultant-availabilityFindAll'> = {},
  ): Promise<ApiResponse<'consultantAvailability', 'consultant-availabilityFindAll'>> {
    return this.api.consultantAvailability['consultant-availabilityFindAll'](query).then((response) => response.data);
  }

  findMonth(
    query: ApiQuery<'consultantAvailability', 'consultant-availabilityFindMonth'>,
  ): Promise<ApiResponse<'consultantAvailability', 'consultant-availabilityFindMonth'>> {
    return this.api.consultantAvailability['consultant-availabilityFindMonth'](query).then((response) => response.data);
  }

  visibleMonth(
    query: ApiQuery<'consultantAvailability', 'consultant-availabilityVisibleMonth'>,
  ): Promise<ApiResponse<'consultantAvailability', 'consultant-availabilityVisibleMonth'>> {
    return this.api.consultantAvailability['consultant-availabilityVisibleMonth'](query).then((response) => response.data);
  }

  create(
    data: ApiBody<'consultantAvailability', 'consultant-availabilityCreate'>,
  ): Promise<ApiResponse<'consultantAvailability', 'consultant-availabilityCreate'>> {
    return this.api.consultantAvailability['consultant-availabilityCreate'](data).then((response) => response.data);
  }

  replaceMonth(
    data: ApiBody<'consultantAvailability', 'consultant-availabilityReplaceMonth'>,
  ): Promise<ApiResponse<'consultantAvailability', 'consultant-availabilityReplaceMonth'>> {
    return this.api.consultantAvailability['consultant-availabilityReplaceMonth'](data).then((response) => response.data);
  }

  update(
    id: number,
    data: ApiBody<'consultantAvailability', 'consultant-availabilityUpdate'>,
  ): Promise<ApiResponse<'consultantAvailability', 'consultant-availabilityUpdate'>> {
    return this.api.consultantAvailability['consultant-availabilityUpdate']({ id }, data).then((response) => response.data);
  }

  delete(id: number): Promise<ApiResponse<'consultantAvailability', 'consultant-availabilityRemove'>> {
    return this.api.consultantAvailability['consultant-availabilityRemove']({ id }).then((response) => response.data);
  }
}
