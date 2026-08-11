import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PymeServicesStore } from '../../services.store';

@Component({
  selector: 'app-pyme-service-filters',
  imports: [FormsModule],
  templateUrl: './service-filters.html',
})
export class PymeServiceFilters {
  readonly store = inject(PymeServicesStore);
}
