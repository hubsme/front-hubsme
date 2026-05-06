import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminSubscription } from './admin-subscription/admin-subscription';
import { ConsultorSubscription } from './consultor-subscription/consultor-subscription';
import { PymeSubscription } from './pyme-subscription/pyme-subscription';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, AdminSubscription, PymeSubscription, ConsultorSubscription],
  templateUrl: './subscription.html',
})
export class Subscription {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
