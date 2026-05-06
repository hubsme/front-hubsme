import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { ConsultorDashboard } from './consultor-dashboard/consultor-dashboard';
import { PymeDashboard } from './pyme-dashboard/pyme-dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AdminDashboard, PymeDashboard, ConsultorDashboard],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
