import { Component } from '@angular/core';
import { ConsultantServiceFilters } from './layout/service-filters/service-filters';
import { ConsultantServiceList } from './layout/service-list/service-list';
import { ConsultantServicesStore } from './services.store';

@Component({
  selector: 'app-consultant-services',
  imports: [ConsultantServiceFilters, ConsultantServiceList],
  providers: [ConsultantServicesStore],
  templateUrl: './services.html',
})
export class ConsultantServices {}
