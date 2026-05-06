import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminDiagnostics } from './admin-diagnostics/admin-diagnostics';
import { ConsultorDiagnostics } from './consultor-diagnostics/consultor-diagnostics';
import { PymeDiagnostics } from './pyme-diagnostics/pyme-diagnostics';

@Component({
  selector: 'app-diagnostics',
  imports: [CommonModule, AdminDiagnostics, PymeDiagnostics, ConsultorDiagnostics],
  templateUrl: './diagnostics.html',
})
export class Diagnostics {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
