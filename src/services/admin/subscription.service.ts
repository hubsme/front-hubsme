import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private api = inject(Api);

  plans(): Promise<ApiResponse<'subscription', 'plans'>> {
    return this.api.subscription.plans().then((response) => response.data);
  }

  findAll(query: ApiQuery<'subscription', 'findAll'> = {}): Promise<ApiResponse<'subscription', 'findAll'>> {
    return this.api.subscription.findAll(query).then((response) => response.data);
  }

  findOne(id: number): Promise<ApiResponse<'subscription', 'findOne'>> {
    return this.api.subscription.findOne({ id }).then((response) => response.data);
  }

  findByUser(userId: number): Promise<ApiResponse<'subscription', 'findByUser'>> {
    return this.api.subscription.findByUser({ userId }).then((response) => response.data);
  }

  upsert(data: ApiBody<'subscription', 'upsert'>): Promise<ApiResponse<'subscription', 'upsert'>> {
    return this.api.subscription.upsert(data).then((response) => response.data);
  }
}
