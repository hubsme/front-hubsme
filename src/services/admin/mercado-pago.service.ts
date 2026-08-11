import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiQuery, ApiResponse } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private api = inject(Api);

  authUrl(
    query: ApiQuery<'mercadoPago', 'mercadopagoAuthUrl'>,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoAuthUrl'>> {
    return this.api.mercadoPago.mercadopagoAuthUrl(query).then((response) => response.data);
  }

  status(
    query: ApiQuery<'mercadoPago', 'mercadopagoStatus'>,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoStatus'>> {
    return this.api.mercadoPago.mercadopagoStatus(query).then((response) => response.data);
  }

  disconnect(
    query: ApiQuery<'mercadoPago', 'mercadopagoDisconnect'>,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoDisconnect'>> {
    return this.api.mercadoPago.mercadopagoDisconnect(query).then((response) => response.data);
  }

  createCheckout(
    data: ApiBody<'mercadoPago', 'mercadopagoCreateCheckout'>,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoCreateCheckout'>> {
    return this.api.mercadoPago.mercadopagoCreateCheckout(data).then((response) => response.data);
  }

  findCheckout(id: number): Promise<ApiResponse<'mercadoPago', 'mercadopagoFindCheckout'>> {
    return this.api.mercadoPago.mercadopagoFindCheckout({ id }).then((response) => response.data);
  }

  findPayments(
    query: ApiQuery<'mercadoPago', 'mercadopagoFindPayments'>,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoFindPayments'>> {
    return this.api.mercadoPago.mercadopagoFindPayments(query).then((response) => response.data);
  }

  findPayment(id: number): Promise<ApiResponse<'mercadoPago', 'mercadopagoFindPayment'>> {
    return this.api.mercadoPago.mercadopagoFindPayment({ id }).then((response) => response.data);
  }

  prepareCheckoutPayment(
    id: number,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoPrepareCheckoutPayment'>> {
    return this.api.mercadoPago
      .mercadopagoPrepareCheckoutPayment({ id })
      .then((response) => response.data);
  }

  prepareServicePayment(
    id: number,
    installmentIndex?: number,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoPrepareServicePayment'>> {
    return this.api.mercadoPago
      .mercadopagoPrepareServicePayment({ id }, { installmentIndex })
      .then((response) => response.data);
  }

  syncServicePayment(
    id: number,
    installmentIndex?: number | null,
  ): Promise<ApiResponse<'mercadoPago', 'mercadopagoSyncServicePayment'>> {
    return this.api.mercadoPago
      .mercadopagoSyncServicePayment({ id }, { installmentIndex: installmentIndex ?? undefined })
      .then((response) => response.data);
  }
}
