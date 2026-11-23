import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class MonnetCheckoutService {
  private readonly api = inject(Api);

  createServiceCheckout(id: number, installmentIndex: number) {
    return this.api.monnetCheckout.monnetcheckoutCreateServiceCheckout({ id }, { installmentIndex })
      .then((response) => response.data);
  }

  createCheckout(data: ApiBody<'monnetCheckout', 'monnetcheckoutCreateCheckout'>) {
    return this.api.monnetCheckout
      .monnetcheckoutCreateCheckout(data)
      .then((response) => response.data);
  }

  findCheckout(
    id: number,
    signal?: AbortSignal,
  ): Promise<ApiResponse<'monnetCheckout', 'monnetcheckoutFindCheckout'>> {
    return this.api.monnetCheckout
      .monnetcheckoutFindCheckout({ id }, { signal })
      .then((response) => response.data);
  }

  lookupDni(documentNumber: string, signal: AbortSignal) {
    return this.api.identityVerification
      .identityverificationLookupDni({ documentNumber }, { signal })
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

  syncCheckoutPayment(id: number, signal?: AbortSignal) {
    return this.api.monnetCheckout
      .monnetcheckoutSyncCheckoutPayment({ id }, { signal })
      .then((response) => response.data);
  }
}
