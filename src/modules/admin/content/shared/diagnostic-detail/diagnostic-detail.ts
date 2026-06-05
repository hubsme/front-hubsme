import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type Diagnostic = ApiResponse<'diagnostic', 'findOne'>;
type ResponseEntry = {
  label: string;
  value: string;
};

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

@Component({
  selector: 'app-diagnostic-detail',
  imports: [CommonModule],
  templateUrl: './diagnostic-detail.html',
})
export class DiagnosticDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  diagnostic = signal<Diagnostic | null>(null);
  loading = signal(false);

  responseEntries = computed<ResponseEntry[]>(() => {
    const current = this.diagnostic();
    if (!current) return [];

    return Object.entries(current.responses)
      .map(([key, value]) => ({
        label: RESPONSE_LABELS[key] ?? key,
        value: this.responseValue(value),
      }))
      .filter((entry) => entry.value && entry.value !== 'No respondido');
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.toastService.error('Diagnostico no encontrado');
      return;
    }

    this.loading.set(true);
    this.hubsme
      .getDiagnostic(id)
      .then((diagnosticRes) => {
        this.diagnostic.set(diagnosticRes.data);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  date(value: string | Date | null | undefined) {
    if (!value) return 'Sin fecha';
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  scoreClass(score: number) {
    if (score >= 75) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  }

  downloadPdf() {
    const current = this.diagnostic();
    if (!current) return;

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 42;
    const width = pdf.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    const addText = (text: string, size = 10, weight: 'normal' | 'bold' = 'normal') => {
      pdf.setFont('helvetica', weight);
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, width) as string[];
      if (y + lines.length * (size + 5) > 780) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(lines, margin, y);
      y += lines.length * (size + 5) + 8;
    };

    addText('Resultado del diagnostico', 18, 'bold');
    addText(`${this.date(current.createdAt)} | Puntaje ${current.score}/100`, 10);

    addText('Areas evaluadas', 13, 'bold');
    for (const area of current.result.areasEvaluadas) {
      addText(`${area.area}: ${area.puntaje}/100. ${area.hallazgo}`, 10);
    }

    addText('Diagnostico general', 13, 'bold');
    addText(current.result.feedbackIa, 10);

    addText('Respuestas registradas', 13, 'bold');
    for (const entry of this.responseEntries()) {
      addText(`${entry.label}: ${entry.value}`, 9);
    }

    pdf.save(`diagnostico-${current.id}.pdf`);
  }

  private responseValue(value: unknown) {
    if (value === null || value === undefined) return 'No respondido';
    if (typeof value === 'string') return value.trim() || 'No respondido';
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return JSON.stringify(value);
  }
}
