import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-pyme-documents',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pyme-documents.html',
})
export class PymeDocuments implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  documents = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  loading = signal(false);
  search = signal('');

  filteredDocuments = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.documents();

    return this.documents().filter((document) => document.title.toLowerCase().includes(term));
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
          res.data.data.filter((meeting) => meeting.status === 'finalizada'),
        ),
      )
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }
}
