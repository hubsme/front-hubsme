import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-consultor-documents',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './consultor-documents.html',
})
export class ConsultorDocuments implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  meetingDocuments = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  diagnostics = signal<ApiResponse<'diagnostic', 'findAll'>['data']>([]);
  pymeLogos = signal<Record<number, string | null>>({});
  pymeNames = signal<Record<number, string>>({});
  search = signal('');
  loading = signal(false);
  activeTab = signal<'meetings' | 'diagnostics'>('meetings');

  filteredMeetingDocuments = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return this.meetingDocuments();
    return this.meetingDocuments().filter((document) =>
      [document.title, document.description, document.status].some((value) => value?.toLowerCase().includes(query)),
    );
  });

  filteredDiagnosticDocuments = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return this.diagnostics();
    return this.diagnostics().filter((diagnostic) =>
      [diagnostic.summary, diagnostic.result.feedbackIa, String(diagnostic.score)].some((value) => value.toLowerCase().includes(query)),
    );
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme.listMatches(1, 100, 'aceptado')
      .then((matchesRes) => {
        const matches = matchesRes.data.data;
        const pymeIds = [...new Set(matches.map((match) => match.pymeId))];

        const logos: Record<number, string | null> = {};
        const names: Record<number, string> = {};
        matches.forEach((match) => {
          logos[match.pymeId] = match.pymeLogoUrl || null;
          names[match.pymeId] = match.pymeName || 'PYME';
        });
        this.pymeLogos.set(logos);
        this.pymeNames.set(names);

        return Promise.all([
          this.hubsme.listMeetings(1, 100),
          Promise.all(pymeIds.map((pymeId) => this.hubsme.listDiagnostics(1, 100, pymeId)))
        ]).then(([meetingsRes, diagnosticsResponses]) => {
          const filteredMeetings = meetingsRes.data.data.filter((meeting) =>
            (meeting.status === 'finalizada' || meeting.description) && pymeIds.includes(meeting.pymeId)
          );
          this.meetingDocuments.set(filteredMeetings);

          const allDiagnostics = diagnosticsResponses.flatMap((response) => response.data.data);
          this.diagnostics.set(allDiagnostics);
        });
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  documentTitle(document: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return document.title || 'Acta de Reunion';
  }

  consultantName() {
    return this.hubsme.currentUser().name;
  }
}
