import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ConsultantService } from '@service/admin/consultant.service';
import { PATH, buildPath } from '@route/path.route';
import { downloadPdf } from '../../../functions/download-pdf';
import { downloadWord } from '../../../functions/download-word';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './documents.html',
})
export class Documents implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private consultantService = inject(ConsultantService);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

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

  downloadPdf(diagnostic: any) {
    if (!diagnostic) return;
    try {
      downloadPdf(diagnostic);
    } catch (err) {
      console.error('Error generating PDF', err);
      this.toastService.error('Ocurrió un error al generar el PDF.');
    }
  }

  downloadWord(diagnostic: any) {
    if (!diagnostic) return;
    try {
      downloadWord(diagnostic);
    } catch (err) {
      console.error('Error generating Word', err);
      this.toastService.error('Ocurrió un error al generar el archivo Word.');
    }
  }

  date(value: string | Date | null | undefined) {
    if (!value) return 'Sin fecha';
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  responseEntries(diagnostic: any) {
    const RESPONSE_LABELS: Record<string, string> = {
      q_gen_1: 'Antiguedad',
      q_gen_2: 'Regimen tributario',
      q_gen_3: 'Regimen laboral',
      q_gen_4: 'Nivel de ventas',
      q_gen_5: 'Modelo de negocio',
      q_int_1: 'Objetivos',
      q_int_2: 'Revision de resultados',
      q_int_3: 'Control de ganancias',
      q_int_4: 'Caja y cobranzas',
      q_int_5: 'Dependencia comercial',
      q_int_6: 'Proceso comercial',
      q_int_7: 'Seguimiento comercial',
      q_int_8: 'Marketing',
      q_int_9: 'Satisfaccion del cliente',
      q_int_10: 'Procesos',
      q_int_11: 'Inventarios o produccion',
      q_int_12: 'Errores o retrasos',
      q_int_13: 'Funciones',
      q_int_14: 'Dependencia del dueno',
      q_int_15: 'Capacitacion',
      q_int_16: 'Herramientas digitales',
      q_int_17: 'Documentacion',
      q_int_18: 'Cumplimiento laboral',
      q_int_19: 'Cumplimiento tributario',
      q_int_20: 'Preparacion para crecer',
      q_int_21: 'Objetivo financiero',
      q_int_22: 'Problema comercial',
      q_int_23: 'Proceso critico',
      q_int_24: 'Rol dependiente',
      q_int_25: 'Riesgo prioritario',
    };
    return Object.entries(diagnostic.responses || {})
      .map(([key, value]) => ({
        label: RESPONSE_LABELS[key] ?? key,
        value: this.responseValue(value),
      }))
      .filter((entry) => entry.value && entry.value !== 'No respondido');
  }

  private responseValue(value: unknown) {
    if (value === null || value === undefined) return 'No respondido';
    if (typeof value === 'string') return value.trim() || 'No respondido';
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return JSON.stringify(value);
  }
}
