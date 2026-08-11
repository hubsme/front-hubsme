import { Component, inject } from '@angular/core';
import { PymeRequestService } from './components/request-service/request-service';
import { PymeServiceFilters } from './layout/service-filters/service-filters';
import { PymeServiceList } from './layout/service-list/service-list';
import { PymeServicesStore } from './services.store';

@Component({
  selector: 'app-pyme-services',
  imports: [PymeRequestService, PymeServiceFilters, PymeServiceList],
  providers: [PymeServicesStore],
  templateUrl: './services.html',
})
export class PymeServices {
  readonly store = inject(PymeServicesStore);
}
