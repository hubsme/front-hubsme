import { Component, input, output } from '@angular/core';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ConsultantServiceOfferResultDto } from 'api/backend.api';

@Component({
  selector: 'app-pyme-service-offer-detail',
  imports: [ModalForm],
  templateUrl: './service-offer-detail.html',
})
export class PymeServiceOfferDetail {
  readonly offer = input.required<ConsultantServiceOfferResultDto>();
  readonly closed = output<void>();
  readonly requested = output<ConsultantServiceOfferResultDto>();

  requestService() {
    this.requested.emit(this.offer());
  }

  formatMoney(): string {
    const currentOffer = this.offer();
    const amount = Number(currentOffer.price);
    const formattedAmount = Number.isFinite(amount)
      ? new Intl.NumberFormat('es-PE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)
      : currentOffer.price;

    return `${this.currencySymbol(currentOffer.currency)} ${formattedAmount}`;
  }

  pricePeriodLabel(): string {
    const labels: Record<ConsultantServiceOfferResultDto['pricePeriod'], string> = {
      one_time: 'Pago único',
      monthly: 'Mensual',
      hourly: 'Por hora',
    };
    return labels[this.offer().pricePeriod];
  }

  private currencySymbol(currency: string): string {
    if (currency === 'PEN') return 'S/';
    if (currency === 'USD') return '$';
    return currency;
  }
}
