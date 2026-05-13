import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-consultor-documents',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultor-documents.html',
})
export class ConsultorDocuments implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  documents = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  search = signal('');
  loading = signal(false);
  filteredDocuments = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return this.documents();
    return this.documents().filter((document) =>
      [document.title, document.description, document.status].some((value) => value?.toLowerCase().includes(query)),
    );
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listMeetings(1, 100)
      .then((res) =>
        this.documents.set(
          res.data.data.filter((meeting) => meeting.status === 'finalizada' || meeting.minutes),
        ),
      )
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  documentTitle(document: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return document.minutes?.titulo || document.title || 'Acta de Reunion';
  }

  consultantName() {
    return this.hubsme.currentUser().name;
  }
}
