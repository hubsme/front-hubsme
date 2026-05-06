import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminTasks } from './admin-tasks/admin-tasks';
import { ConsultorTasks } from './consultor-tasks/consultor-tasks';
import { PymeTasks } from './pyme-tasks/pyme-tasks';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, AdminTasks, PymeTasks, ConsultorTasks],
  templateUrl: './tasks.html',
})
export class Tasks {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
