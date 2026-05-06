import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-admin-subscription',
  imports: [CommonModule],
  templateUrl: './admin-subscription.html',
})
export class AdminSubscription implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  plans = signal<ApiResponse<'subscription', 'plans'>>([]);
  selectedPlan = signal<string | null>(null);
  loading = signal(false);

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading.set(true);
    this.hubsme
      .getPlans()
      .then((res) => this.plans.set(res.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  choose(plan: ApiResponse<'subscription', 'plans'>[number]) {
    const user = this.hubsme.currentUser();
    this.hubsme
      .upsertSubscription({ userId: user.id, plan: plan.id, status: 'active' })
      .then(() => {
        this.selectedPlan.set(plan.id);
        this.toastService.success(`Plan ${plan.name} activado`);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }
}
