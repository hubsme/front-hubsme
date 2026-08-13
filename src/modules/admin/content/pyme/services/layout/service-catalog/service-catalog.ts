import { Component, inject, signal } from '@angular/core';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { ConsultantServiceOfferResultDto } from 'api/backend.api';
import { PymeServiceOfferDetail } from '../../components/service-offer-detail/service-offer-detail';
import { PymeServicesStore } from '../../services.store';

@Component({
  selector: 'app-pyme-service-catalog',
  imports: [PaginationComponent, PymeServiceOfferDetail],
  templateUrl: './service-catalog.html',
})
export class PymeServiceCatalog {
  readonly store = inject(PymeServicesStore);
  readonly detailOffer = signal<ConsultantServiceOfferResultDto | null>(null);

  openDetail(offer: ConsultantServiceOfferResultDto) {
    this.detailOffer.set(offer);
  }

  closeDetail() {
    this.detailOffer.set(null);
  }

  requestOffer(offer: ConsultantServiceOfferResultDto) {
    this.closeDetail();
    this.store.openCreateFromOffer(offer);
  }
}
