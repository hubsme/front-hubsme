import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ConsultantService } from '@service/admin/consultant.service';

@Component({
  selector: 'app-pyme-documents',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pyme-documents.html',
})
export class PymeDocuments implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private consultantService = inject(ConsultantService);

  meetingDocuments = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  diagnostics = signal<ApiResponse<'diagnostic', 'findAll'>['data']>([]);
  consultantPhotos = signal<Record<number, string | null>>({});
  consultantNames = signal<Record<number, string>>({});
  loading = signal(false);
  search = signal('');
  activeTab = signal<'meetings' | 'diagnostics'>('meetings');

  filteredMeetingDocuments = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.meetingDocuments();

    return this.meetingDocuments().filter((document) =>
      [document.title, document.description, document.status].some((value) => value?.toLowerCase().includes(term)),
    );
  });

  filteredDiagnosticDocuments = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.diagnostics();

    return this.diagnostics().filter((diagnostic) =>
      [diagnostic.summary, diagnostic.result.feedbackIa, String(diagnostic.score)].some((value) => value.toLowerCase().includes(term)),
    );
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    Promise.all([this.hubsme.listMeetings(1, 100), this.hubsme.listDiagnostics(1, 100)])
      .then(([meetingsRes, diagnosticsRes]) => {
        const filteredMeetings = meetingsRes.data.data.filter((meeting) => meeting.status === 'finalizada' || meeting.description);
        this.meetingDocuments.set(filteredMeetings);
        this.diagnostics.set(diagnosticsRes.data.data);
        this.loadConsultantDetails(filteredMeetings);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private loadConsultantDetails(meetings: ApiResponse<'meeting', 'findAll'>['data']) {
    const uniqueIds = [...new Set(meetings.map((m) => m.consultantId))];
    uniqueIds.forEach((id) => {
      this.consultantService
        .findByUser(id)
        .then((consultant) => {
          this.consultantPhotos.update((current) => ({ ...current, [id]: consultant.photoUrl }));
          this.consultantNames.update((current) => ({ ...current, [id]: consultant.fullName }));
        })
        .catch(() => {
          this.consultantPhotos.update((current) => ({ ...current, [id]: null }));
          this.consultantNames.update((current) => ({ ...current, [id]: 'Consultor asignado' }));
        });
    });
  }

  meetingTitle(document: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return document.title || 'Acta de Reunion';
  }

  consultantName() {
    return 'Consultor asignado';
  }
}
