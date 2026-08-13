import { Component, inject } from '@angular/core';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { PymeServicesStore } from '../../services.store';

@Component({
  selector: 'app-pyme-service-catalog',
  imports: [PaginationComponent],
  templateUrl: './service-catalog.html',
})
export class PymeServiceCatalog {
  readonly store = inject(PymeServicesStore);
}
