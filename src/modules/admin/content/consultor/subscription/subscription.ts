import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiResponse } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { AnalyticsService } from '@service/analytics.service';

type SubscriptionPlan = ApiResponse<'subscription', 'plans'>[number];

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, ModalForm],
  templateUrl: './subscription.html',
})
export class Subscription implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private analyticsService = inject(AnalyticsService);

  plans = signal<ApiResponse<'subscription', 'plans'>>([]);
  selectedPlan = signal<string | null>(null);
  loading = signal(false);
  developmentModalOpen = signal(false);
  developmentPlan = signal<SubscriptionPlan | null>(null);

  ngOnInit() {
    this.loadPlans();
    this.loadActiveSubscription();
  }

  loadPlans() {
    this.loading.set(true);
    this.hubsme
      .getPlans()
      .then((res) => this.plans.set(res.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  loadActiveSubscription() {
    const user = this.hubsme.currentUser();
    this.hubsme
      .getSubscriptionByUserId(user.id)
      .then((res) => {
        if (res.data) {
          this.selectedPlan.set(res.data.plan);
        }
      })
      .catch((error) => {
        console.warn('No active subscription found for user', error);
      });
  }

  choose(plan: SubscriptionPlan) {
    this.analyticsService.trackSubscriptionPlanClick(plan);
    this.developmentPlan.set(plan);
    this.developmentModalOpen.set(true);
  }

  closeDevelopmentModal() {
    this.developmentModalOpen.set(false);
    this.developmentPlan.set(null);
  }

  isFeatured(plan: SubscriptionPlan) {
    return this.selectedPlan() === plan.id;
  }

  planIcon(plan: SubscriptionPlan) {
    if (plan.id === 'free') return 'far fa-star';
    if (plan.id === 'basic') return 'fas fa-bolt';
    if (plan.id === 'pro') return 'fas fa-bolt';
    return 'fas fa-crown';
  }

  iconClass(plan: SubscriptionPlan) {
    if (plan.id === 'expert') return 'bg-accent/10 text-accent';
    if (plan.id === 'basic') return 'bg-secondary/8 text-secondary';
    return 'bg-slate-100 text-slate-700';
  }
}
