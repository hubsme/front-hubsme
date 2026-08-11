import { Component, input, output } from '@angular/core';
import { ServiceRequestResultDto } from 'api/backend.api';

type PaymentScheduleItem = ServiceRequestResultDto['paymentSchedule'][number];

@Component({
  selector: 'app-service-payment-plan-summary',
  templateUrl: './payment-plan-summary.html',
})
export class ServicePaymentPlanSummary {
  readonly service = input.required<ServiceRequestResultDto>();
  readonly showPaymentActions = input(false);
  readonly payInstallment = output<PaymentScheduleItem>();

  strategyLabel(strategy: ServiceRequestResultDto['paymentPlan']['strategy']): string {
    const labels: Record<ServiceRequestResultDto['paymentPlan']['strategy'], string> = {
      single: 'Pago único',
      initial_final: 'Pago inicial y final',
      milestone_installments: 'Cuotas por hitos',
    };
    return labels[strategy];
  }

  milestoneLabel(milestoneIndex: number): string {
    return this.service().milestones[milestoneIndex]?.title ?? `Hito ${milestoneIndex + 1}`;
  }

  statusLabel(status: PaymentScheduleItem['status']): string {
    const labels: Record<PaymentScheduleItem['status'], string> = {
      not_started: 'Pendiente',
      created: 'Preparando pago',
      pending: 'Pago en proceso',
      approved: 'Pagada',
      rejected: 'Reintentar pago',
      cancelled: 'Pago cancelado',
      expired: 'Pago vencido',
    };
    return labels[status];
  }

  statusClass(status: PaymentScheduleItem['status']): string {
    if (status === 'approved') return 'bg-success/10 text-success';
    if (status === 'pending' || status === 'created') return 'bg-warning/10 text-warning';
    if (status === 'rejected' || status === 'cancelled' || status === 'expired') {
      return 'bg-danger/10 text-danger';
    }
    return 'bg-text/5 text-muted';
  }

  formatMoney(value: string | null | undefined): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: this.service().currency,
    }).format(Number(value ?? 0));
  }
}
