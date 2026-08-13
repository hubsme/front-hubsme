import { Component, inject } from '@angular/core';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { ConsultantServiceOfferResultDto } from 'api/backend.api';
import { ConsultantServicesStore } from '../../services.store';

@Component({
  selector: 'app-consultant-service-offer-list',
  imports: [PaginationComponent],
  templateUrl: './service-offer-list.html',
})
export class ConsultantServiceOfferList {
  readonly store = inject(ConsultantServicesStore);

  formatMoney(offer: ConsultantServiceOfferResultDto): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: offer.currency,
      maximumFractionDigits: 2,
    }).format(Number(offer.price));
  }

  periodLabel(period: ConsultantServiceOfferResultDto['pricePeriod']): string {
    return { one_time: 'pago único', monthly: 'al mes', hourly: 'por hora' }[period];
  }
}
