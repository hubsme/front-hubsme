import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse } from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class PaymentHistoryService {
  private readonly api = inject(Api);

  findPayments(
    query: ApiQuery<'paymentHistory', 'paymenthistoryFindAll'>,
  ): Promise<ApiResponse<'paymentHistory', 'paymenthistoryFindAll'>> {
    return this.api.paymentHistory.paymenthistoryFindAll(query).then((response) => response.data);
  }

  findPayment(id: number): Promise<ApiResponse<'paymentHistory', 'paymenthistoryFindOne'>> {
    return this.api.paymentHistory.paymenthistoryFindOne({ id }).then((response) => response.data);
  }
}
