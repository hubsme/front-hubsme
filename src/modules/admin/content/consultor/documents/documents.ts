import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PymeService } from '@service/admin/pyme.service';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './documents.html',
})
export class Documents implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private pymeService = inject(PymeService);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

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
    Promise.all([this.hubsme.listMeetings(1, 100), this.pymeService.findAll({ page: 1, limit: 100 })])
      .then(([meetingsRes, pymesRes]) => {
        const pymeIds = [...new Set(meetingsRes.data.data.map((meeting) => meeting.pymeId))];
        const pymes = pymesRes.data.filter((pyme) => pymeIds.includes(pyme.userId));
        const logos: Record<number, string | null> = {};
        const names: Record<number, string> = {};
        pymes.forEach((pyme) => {
          logos[pyme.userId] = null;
          names[pyme.userId] = pyme.name || 'PYME';
        });
        this.pymeLogos.set(logos);
        this.pymeNames.set(names);

        return Promise.all(pymeIds.map((pymeId) => this.hubsme.listDiagnostics(1, 100, pymeId))).then((diagnosticsResponses) => {
          const filteredMeetings = meetingsRes.data.data.filter((meeting) => meeting.status === 'finalizada' || meeting.description);
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
