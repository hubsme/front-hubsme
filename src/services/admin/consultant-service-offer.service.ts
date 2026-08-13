import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiQuery, ApiResponse } from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class ConsultantServiceOfferService {
  private readonly api = inject(Api);

  findAll(
    query: ApiQuery<'serviceOffer', 'serviceofferFindAll'> = {},
  ): Promise<ApiResponse<'serviceOffer', 'serviceofferFindAll'>> {
    return this.api.serviceOffer.serviceofferFindAll(query).then((response) => response.data);
  }

  findMine(
    query: ApiQuery<'serviceOffer', 'serviceofferFindMine'> = {},
  ): Promise<ApiResponse<'serviceOffer', 'serviceofferFindMine'>> {
    return this.api.serviceOffer.serviceofferFindMine(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'serviceOffer', 'serviceofferFindOne'>> {
    return this.api.serviceOffer.serviceofferFindOne({ id }).then((response) => response.data);
  }

  create(
    data: ApiBody<'serviceOffer', 'serviceofferCreate'>,
  ): Promise<ApiResponse<'serviceOffer', 'serviceofferCreate'>> {
    return this.api.serviceOffer.serviceofferCreate(data).then((response) => response.data);
  }

  update(
    id: number,
    data: ApiBody<'serviceOffer', 'serviceofferUpdate'>,
  ): Promise<ApiResponse<'serviceOffer', 'serviceofferUpdate'>> {
    return this.api.serviceOffer.serviceofferUpdate({ id }, data).then((response) => response.data);
  }

  setActive(
    id: number,
    data: ApiBody<'serviceOffer', 'serviceofferSetActive'>,
  ): Promise<ApiResponse<'serviceOffer', 'serviceofferSetActive'>> {
    return this.api.serviceOffer
      .serviceofferSetActive({ id }, data)
      .then((response) => response.data);
  }

  remove(id: number): Promise<ApiResponse<'serviceOffer', 'serviceofferRemove'>> {
    return this.api.serviceOffer.serviceofferRemove({ id }).then((response) => response.data);
  }
}
