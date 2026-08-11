import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PymeServicesStore } from '../../../../services.store';

@Component({
  selector: 'app-service-request-review-step',
  imports: [FormsModule],
  templateUrl: './review-step.html',
})
export class ServiceRequestReviewStep {
  readonly store = inject(PymeServicesStore);
}

