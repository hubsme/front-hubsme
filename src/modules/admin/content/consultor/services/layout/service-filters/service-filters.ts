import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsultantServicesStore } from '../../services.store';

@Component({
  selector: 'app-consultant-service-filters',
  imports: [FormsModule],
  templateUrl: './service-filters.html',
})
export class ConsultantServiceFilters {
  readonly store = inject(ConsultantServicesStore);
}
