import { Component, inject } from '@angular/core';
import { ConsultantServiceOfferForm } from './components/service-offer-form/service-offer-form';
import { ConsultantServiceFilters } from './layout/service-filters/service-filters';
import { ConsultantServiceList } from './layout/service-list/service-list';
import { ConsultantServiceOfferList } from './layout/service-offer-list/service-offer-list';
import { ConsultantServicesStore } from './services.store';

@Component({
  selector: 'app-consultant-services',
  imports: [
    ConsultantServiceFilters,
    ConsultantServiceList,
    ConsultantServiceOfferList,
    ConsultantServiceOfferForm,
  ],
  providers: [ConsultantServicesStore],
  templateUrl: './services.html',
})
export class ConsultantServices {
  readonly store = inject(ConsultantServicesStore);
}
