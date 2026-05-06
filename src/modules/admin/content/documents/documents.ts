import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { SessionService } from '@service/session.service';
import { AdminDocuments } from './admin-documents/admin-documents';
import { ConsultorDocuments } from './consultor-documents/consultor-documents';
import { PymeDocuments } from './pyme-documents/pyme-documents';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, AdminDocuments, PymeDocuments, ConsultorDocuments],
  templateUrl: './documents.html',
})
export class Documents {
  private sessionService = inject(SessionService);

  role = computed(() => this.sessionService.session()?.user.role ?? 'admin');
}
