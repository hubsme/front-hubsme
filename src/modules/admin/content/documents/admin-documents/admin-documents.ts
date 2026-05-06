import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-admin-documents',
  imports: [CommonModule],
  templateUrl: './admin-documents.html',
})
export class AdminDocuments implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  documents = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  loading = signal(false);

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
}
