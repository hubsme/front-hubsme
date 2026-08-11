import { Component, inject } from '@angular/core';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PymeServicesStore } from '../../services.store';
import { ServiceRequestChatStep } from './layout/chat-step/chat-step';
import { ConsultantSelectionStep } from './layout/consultant-selection-step/consultant-selection-step';
import { ServicePaymentPlanStep } from './layout/payment-plan-step/payment-plan-step';
import { ServiceRequestReviewStep } from './layout/review-step/review-step';

@Component({
  selector: 'app-pyme-request-service',
  imports: [
    ConsultantSelectionStep,
    ModalForm,
    ServicePaymentPlanStep,
    ServiceRequestChatStep,
    ServiceRequestReviewStep,
  ],
  templateUrl: './request-service.html',
})
export class PymeRequestService {
  readonly store = inject(PymeServicesStore);
}
