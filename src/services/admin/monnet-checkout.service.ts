import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class MonnetCheckoutService {
  private readonly api = inject(Api);

  createCheckout(data: ApiBody<'monnetCheckout', 'monnetcheckoutCreateCheckout'>) {
    return this.api.monnetCheckout
      .monnetcheckoutCreateCheckout(data)
      .then((response) => response.data);
  }

  findCheckout(id: number): Promise<ApiResponse<'monnetCheckout', 'monnetcheckoutFindCheckout'>> {
    return this.api.monnetCheckout
      .monnetcheckoutFindCheckout({ id })
      .then((response) => response.data);
  }

  prepareCheckoutPayment(
    id: number,
    data: ApiBody<'monnetCheckout', 'monnetcheckoutPrepareCheckoutPayment'>,
  ) {
    return this.api.monnetCheckout
      .monnetcheckoutPrepareCheckoutPayment({ id }, data)
      .then((response) => response.data);
  }

  syncCheckoutPayment(id: number) {
    return this.api.monnetCheckout
      .monnetcheckoutSyncCheckoutPayment({ id })
      .then((response) => response.data);
  }
}
