import { Component, inject } from '@angular/core';
import { ServicePaymentPlanResultDto } from 'api/backend.api';
import { PymeServicesStore } from '../../../../services.store';

@Component({
  selector: 'app-service-payment-plan-step',
  templateUrl: './payment-plan-step.html',
})
export class ServicePaymentPlanStep {
  readonly store = inject(PymeServicesStore);

  strategyLabel(strategy: ServicePaymentPlanResultDto['strategy']): string {
    const labels: Record<ServicePaymentPlanResultDto['strategy'], string> = {
      single: 'Pago único',
      initial_final: 'Pago inicial y final',
      milestone_installments: 'Cuotas por hitos',
    };
    return labels[strategy];
  }

  milestoneLabel(milestoneIndex: number): string {
    return (
      this.store.normalizedDraftMilestonesForView()[milestoneIndex]?.title ??
      `Hito ${milestoneIndex + 1}`
    );
  }

  installmentAmountLabel(percentage: number): string {
    const minimumAmount = Number(this.store.budgetMin());
    const maximumAmount = Number(this.store.budgetMax());
    if (!Number.isFinite(minimumAmount) || minimumAmount <= 0) return '';

    const minimumInstallment = (minimumAmount * percentage) / 100;
    if (
      this.store.budgetType() !== 'range' ||
      !Number.isFinite(maximumAmount) ||
      maximumAmount < minimumAmount
    ) {
      return this.formatMoney(minimumInstallment);
    }
    return `${this.formatMoney(minimumInstallment)} – ${this.formatMoney(
      (maximumAmount * percentage) / 100,
    )}`;
  }

  formatMoney(value: string | number): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
      Number(value),
    );
  }

  readNumber(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
