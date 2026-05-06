import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminPymes } from './admin-pymes/admin-pymes';
import { ConsultorPymes } from './consultor-pymes/consultor-pymes';
import { PymePymes } from './pyme-pymes/pyme-pymes';

@Component({
  selector: 'app-pymes',
  imports: [CommonModule, AdminPymes, PymePymes, ConsultorPymes],
  templateUrl: './pymes.html',
})
export class Pymes {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
