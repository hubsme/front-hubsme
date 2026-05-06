import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminConsultants } from './admin-consultants/admin-consultants';
import { ConsultorConsultants } from './consultor-consultants/consultor-consultants';
import { PymeConsultants } from './pyme-consultants/pyme-consultants';

@Component({
  selector: 'app-consultants',
  imports: [CommonModule, AdminConsultants, PymeConsultants, ConsultorConsultants],
  templateUrl: './consultants.html',
})
export class Consultants {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
