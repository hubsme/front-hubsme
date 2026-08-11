import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ServiceRequestResultDto } from 'api/backend.api';

@Component({
  selector: 'app-consultant-quote-form',
  imports: [FormsModule],
  templateUrl: './consultant-quote-form.html',
})
export class ConsultantQuoteForm {
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);

  readonly service = input.required<ServiceRequestResultDto>();
  readonly proposalSent = output<ServiceRequestResultDto>();
  readonly declineRequested = output<void>();
  readonly price = signal('');
  readonly message = signal('');
  readonly selectedMeetingTime = signal('');
  readonly submitting = signal(false);

  async submit(): Promise<void> {
    const current = this.service();
    const amount = Number(this.price());
    if (current.status !== 'requested') return;
    if (!Number.isFinite(amount) || amount < 1) {
      this.toastService.warning('Ingresa un precio válido mayor o igual a S/ 1.00');
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(this.price().trim())) {
      this.toastService.warning('El precio puede tener como máximo dos decimales');
      return;
    }
    if (!this.selectedMeetingTime() && current.initialMeetingProposedStartTimes.length) {
      this.toastService.warning('Selecciona el horario de la reunión inicial');
      return;
    }

    this.submitting.set(true);
    try {
      const updated = await this.serviceRequestService.sendProposal(current.id, {
        price: amount,
        message: this.message().trim() || undefined,
        ...(this.selectedMeetingTime()
          ? { selectedInitialMeetingStartTime: this.selectedMeetingTime() }
          : {}),
      });
      this.toastService.success('Cotización enviada a la PYME');
      this.proposalSent.emit(updated);
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }

  formatMeetingOption(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Horario no válido';
    return new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  pricePlaceholder(): string {
    const current = this.service();
    const minimumPrice = Number(current.budgetMin);
    if (!Number.isFinite(minimumPrice) || minimumPrice <= 0) return '0.00';

    const formatter = new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const maximumPrice = Number(current.budgetMax);
    if (
      current.budgetType === 'range' &&
      Number.isFinite(maximumPrice) &&
      maximumPrice >= minimumPrice
    ) {
      return `Sugerido ${formatter.format(minimumPrice)} – ${formatter.format(maximumPrice)}`;
    }
    return `Sugerido ${formatter.format(minimumPrice)}`;
  }

  installmentAmount(installmentIndex: number): string {
    const current = this.service();
    const totalPrice = Number(this.price());
    if (!Number.isFinite(totalPrice) || totalPrice <= 0) return '—';

    const installments = current.paymentPlan.installments;
    const totalCents = Math.round(totalPrice * 100);
    let allocatedCents = 0;
    for (let index = 0; index <= installmentIndex; index += 1) {
      const installment = installments[index];
      if (!installment) return '—';
      const installmentCents =
        index === installments.length - 1
          ? totalCents - allocatedCents
          : Math.round((totalCents * installment.percentage) / 100);
      if (index === installmentIndex) {
        return this.formatMoney(installmentCents / 100, current.currency);
      }
      allocatedCents += installmentCents;
    }
    return '—';
  }

  private formatMoney(value: number, currency: string): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(value);
  }
}
