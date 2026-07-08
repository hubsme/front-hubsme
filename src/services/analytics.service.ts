import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { SessionService } from '@service/session.service';

type AnalyticsValue = string | number | boolean | null;

type AnalyticsProperties = Record<string, AnalyticsValue>;

type PosthogCapturePayload = {
  api_key: string;
  event: string;
  distinct_id: string;
  properties: AnalyticsProperties;
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly sessionService = inject(SessionService);
  private readonly anonymousIdKey = 'hubsme_analytics_id';

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  track(event: string, properties: AnalyticsProperties = {}) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!environment.posthogApiKey || !environment.posthogApiHost) return;

    const session = this.sessionService.session();
    const distinctId = session?.user.id ? String(session.user.id) : this.getAnonymousId();
    const payload: PosthogCapturePayload = {
      api_key: environment.posthogApiKey,
      event,
      distinct_id: distinctId,
      properties: {
        ...properties,
        distinct_id: distinctId,
        user_id: session?.user.id ?? null,
        user_role: session?.user.role ?? null,
        user_email: session?.user.email ?? null,
        current_url: window.location.href,
        page_path: window.location.pathname,
      },
    };

    void fetch(`${environment.posthogApiHost.replace(/\/$/, '')}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  }

  trackSubscriptionPlanClick(plan: {
    id: string;
    name: string;
    price: number;
    description: string;
  }) {
    this.track('subscription_plan_click', {
      plan_id: plan.id,
      plan_name: plan.name,
      plan_price: plan.price,
      plan_description: plan.description,
    });
  }

  private getAnonymousId() {
    const stored = localStorage.getItem(this.anonymousIdKey);
    if (stored) return stored;

    const id = crypto.randomUUID();
    localStorage.setItem(this.anonymousIdKey, id);
    return id;
  }
}
