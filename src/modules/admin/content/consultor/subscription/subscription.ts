import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Api, ApiResponse } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, ModalForm],
  templateUrl: './subscription.html',
})
export class Subscription implements OnInit {
  private hubsme = inject(HubsmeService);
  private api = inject(Api);
  private toastService = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  plans = signal<ApiResponse<'subscription', 'plans'>>([]);
  selectedPlan = signal<string | null>(null);
  loading = signal(false);
  processing = signal(false);

  paymentModalOpen = signal(false);
  paymentUrl = signal<string | null>(null);

  paymentFrameUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.paymentUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

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

  choose(plan: ApiResponse<'subscription', 'plans'>[number]) {
    const user = this.hubsme.currentUser();

    if (plan.id === 'free') {
      this.hubsme
        .upsertSubscription({ userId: user.id, plan: plan.id, status: 'active' })
        .then(() => {
          this.selectedPlan.set(plan.id);
          this.toastService.success(`Plan ${plan.name} activado`);
        })
        .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
      return;
    }

    // Paid plans: create MP preference and open modal
    this.processing.set(true);
    this.api.subscription
      .createCheckout({ planId: plan.id })
      .then((res) => {
        const checkout = res.data;
        this.paymentUrl.set(checkout.initPoint || checkout.sandboxInitPoint);
        this.paymentModalOpen.set(true);
      })
      .catch((error) => {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      })
      .finally(() => this.processing.set(false));
  }

  closePaymentModal() {
    this.paymentModalOpen.set(false);
    this.paymentUrl.set(null);
    // Reload subscription to check if webhook already activated the plan
    this.loadActiveSubscription();
  }

  isFeatured(plan: ApiResponse<'subscription', 'plans'>[number]) {
    return this.selectedPlan() === plan.id;
  }

  planIcon(plan: ApiResponse<'subscription', 'plans'>[number]) {
    if (plan.id === 'free') return 'far fa-star';
    if (plan.id === 'basic') return 'fas fa-bolt';
    if (plan.id === 'pro') return 'fas fa-bolt';
    return 'fas fa-crown';
  }

  iconClass(plan: ApiResponse<'subscription', 'plans'>[number]) {
    if (plan.id === 'expert') return 'bg-accent/10 text-accent';
    if (plan.id === 'basic') return 'bg-secondary/8 text-secondary';
    return 'bg-slate-100 text-slate-700';
  }
}
