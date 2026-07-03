import { inject, Injectable } from '@angular/core';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class PromotionCodeService {
  private readonly api = inject(Api);

  redeem(
    data: ApiBody<'promotionCode', 'promotioncodeRedeem'>,
  ): Promise<ApiResponse<'promotionCode', 'promotioncodeRedeem'>> {
    return this.api.promotionCode
      .promotioncodeRedeem(data)
      .then((response) => response.data);
  }
}
