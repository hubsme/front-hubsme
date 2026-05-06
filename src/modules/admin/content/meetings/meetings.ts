import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminMeetings } from './admin-meetings/admin-meetings';
import { ConsultorMeetings } from './consultor-meetings/consultor-meetings';
import { PymeMeetings } from './pyme-meetings/pyme-meetings';

@Component({
  selector: 'app-meetings',
  imports: [CommonModule, AdminMeetings, PymeMeetings, ConsultorMeetings],
  templateUrl: './meetings.html',
})
export class Meetings {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
