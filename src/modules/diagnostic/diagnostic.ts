import { Component, OnInit, inject, signal, computed, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { DIAGNOSTIC_STEPS } from './diagnostic.constants';
import { NgApexchartsModule } from 'ng-apexcharts';

type DiagnosticResult = ApiResponse<'diagnostic', 'findOne'>;

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

type FlatDiagnosticQuestion = {
  id: string;
  text: string;
  type?: 'closed' | 'open';
  options?: string[];
  placeholder?: string;
  stepTitle: string;
  stepDescription: string;
  stepIndex: number;
};

@Component({
  selector: 'app-diagnostic',
  imports: [CommonModule, FormsModule, RouterLink, NgApexchartsModule],
  templateUrl: './diagnostic.html',
})
export class Diagnostic implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);

  pymeId = signal(0);
  generating = signal(false);
  isAdminMode = signal(false);

  // Results State
  showResult = signal(false);
  diagnosticResult = signal<DiagnosticResult | null>(null);
  consultants = signal<any[]>([]);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  isBrowser = isPlatformBrowser(this.platformId);

  priorityLevel = computed(() => {
    const score = this.diagnosticResult()?.score ?? 50;
    return score < 60 ? 'Alta' : (score < 75 ? 'Media' : 'Baja');
  });

  priorityClass = computed(() => {
    const level = this.priorityLevel();
    return level === 'Alta' ? 'text-danger' : (level === 'Media' ? 'text-warning' : 'text-success');
  });

  priorityBadge = computed(() => {
    const score = this.diagnosticResult()?.score ?? 50;
    return score < 60 ? 'Atención prioritaria' : (score < 75 ? 'Mejora continua' : 'Mantener nivel');
  });

  priorityBadgeClass = computed(() => {
    const score = this.diagnosticResult()?.score ?? 50;
    return score < 60 ? 'bg-danger/10 text-danger border-danger/20' : (score < 75 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20');
  });

  improvementPotential = computed(() => {
    const score = this.diagnosticResult()?.score ?? 50;
    return score < 60 ? 'Alto' : (score < 75 ? 'Medio' : 'Bajo');
  });

  barChartOptions = computed(() => {
    const result = this.diagnosticResult();
    const areas = result?.result?.areasEvaluadas || [];
    
    return {
      series: [
        {
          name: 'Tu Negocio',
          data: areas.map(a => a.puntaje)
        },
        {
          name: 'Promedio Sector',
          data: areas.map(a => {
            const name = a.area.toLowerCase();
            if (name.includes('finan')) return 60;
            if (name.includes('operac')) return 55;
            if (name.includes('equip') || name.includes('rrhh') || name.includes('organi')) return 65;
            return 58;
          })
        }
      ],
      chart: {
        type: 'bar' as const,
        height: 220,
        toolbar: { show: false },
        animations: { enabled: false }
      },
      colors: ['#0870f7', '#94a3b8'],
      plotOptions: {
        bar: {
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => `${val}`,
        style: {
          fontSize: '11px',
          fontWeight: 'bold',
          colors: ['#334155']
        }
      },
      xaxis: {
        categories: areas.map(a => a.area),
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Inter Medium, sans-serif'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          style: {
            fontSize: '10px'
          }
        }
      },
      grid: {
        show: true,
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      },
      legend: {
        show: true,
        position: 'top' as const,
        horizontalAlign: 'center' as const
      }
    };
  });

  radarChartOptions = computed(() => {
    const result = this.diagnosticResult();
    const areas = result?.result?.areasEvaluadas || [];
    const getScore = (name: string) => areas.find(a => a.area.toLowerCase() === name.toLowerCase())?.puntaje ?? 50;
    
    const finanzas = getScore('finanzas');
    const operaciones = getScore('operaciones');
    const equipo = getScore('equipo');
    const mercado = getScore('mercado');
    const estrategia = Math.round((finanzas + mercado) / 2);
    const clientes = Math.round((mercado + operaciones) / 2);

    return {
      series: [{
        name: 'Capacidad',
        data: [estrategia, finanzas, operaciones, equipo, mercado, clientes]
      }],
      chart: {
        type: 'radar' as const,
        height: 220,
        toolbar: { show: false },
        animations: { enabled: false }
      },
      colors: ['#0870f7'],
      xaxis: {
        categories: ['Estrategia', 'Finanzas', 'Operaciones', 'Talento', 'Mercado', 'Clientes'],
        labels: {
          style: {
            fontSize: '9px',
            fontFamily: 'Inter Medium, sans-serif'
          }
        }
      },
      yaxis: {
        max: 100,
        tickAmount: 4,
        show: false
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: '#e2e8f0',
            connectorColors: '#e2e8f0'
          }
        }
      },
      markers: {
        size: 4,
        colors: ['#0870f7'],
        strokeWidth: 2
      }
    };
  });

  lineChartOptions = computed(() => {
    const score = this.diagnosticResult()?.score ?? 50;
    const p2 = Math.min(100, Math.round(score + (100 - score) * 0.15));
    const p3 = Math.min(100, Math.round(score + (100 - score) * 0.3));
    const p4 = Math.min(100, Math.round(score + (100 - score) * 0.5));

    return {
      series: [{
        name: 'Puntaje Proyectado',
        data: [score, p2, p3, p4]
      }],
      chart: {
        type: 'line' as const,
        height: 220,
        toolbar: { show: false },
        animations: { enabled: false }
      },
      colors: ['#0870f7'],
      stroke: {
        curve: 'smooth' as const,
        width: 3
      },
      markers: {
        size: 5,
        colors: ['#0870f7'],
        strokeWidth: 2
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => `${val}`,
        style: {
          fontSize: '11px',
          fontWeight: 'bold',
          colors: ['#334155']
        }
      },
      xaxis: {
        categories: ['Actual', '3 meses', '6 meses', '12 meses'],
        labels: {
          style: {
            fontSize: '10px',
            fontFamily: 'Inter Medium, sans-serif'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          style: {
            fontSize: '10px'
          }
        }
      },
      grid: {
        show: true,
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      }
    };
  });

  areaDescription(areaName: string): string {
    const name = areaName.toLowerCase();
    if (name.includes('finan')) return 'Mejora tu rentabilidad y flujo de caja.';
    if (name.includes('operac')) return 'Optimiza procesos y eleva la eficiencia.';
    if (name.includes('equip') || name.includes('rrhh') || name.includes('organiza')) return 'Fortalece capacidades y alineación del equipo.';
    if (name.includes('merca') || name.includes('comerc')) return 'Aprovecha oportunidades y crece con foco.';
    return 'Optimiza el rendimiento estratégico de esta área.';
  }

  // Flat list of questions for a step-by-step experience
  questions = computed<FlatDiagnosticQuestion[]>(() => {
    return DIAGNOSTIC_STEPS.flatMap((step, stepIndex) =>
      step.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type ?? 'closed',
        options: 'options' in q ? q.options : undefined,
        placeholder: 'placeholder' in q ? q.placeholder : undefined,
        stepTitle: step.title,
        stepDescription: step.description,
        stepIndex: stepIndex,
      }))
    );
  });

  currentQuestionIndex = signal(0);
  responses = signal<Record<string, string>>({});

  currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()]);
  progressPercentage = computed(() => {
    const total = this.questions().length;
    if (total === 0) return 0;
    return Math.round((this.currentQuestionIndex() / total) * 100);
  });

  currentStepIndex = computed(() => this.currentQuestion()?.stepIndex ?? 0);
  currentStepTitle = computed(() => this.currentQuestion()?.stepTitle ?? '');
  currentStepDescription = computed(() => this.currentQuestion()?.stepDescription ?? '');

  // Check if current question is answered
  isCurrentAnswered = computed(() => {
    const q = this.currentQuestion();
    if (!q) return false;
    const answer = this.responses()[q.id];
    return !!(answer && answer.trim());
  });

  responseEntries = computed<ResponseEntry[]>(() => {
    const current = this.diagnosticResult();
    if (!current) return [];

    return Object.entries(current.responses)
      .map(([key, value]) => ({
        label: RESPONSE_LABELS[key] ?? key,
        value: this.responseValue(value),
      }))
      .filter((entry) => entry.value && entry.value !== 'No respondido');
  });

  constructor() {
    // Auto-save draft whenever answers or index change, but only if not showing result
    effect(() => {
      if (isPlatformBrowser(this.platformId) && !this.showResult()) {
        const data = {
          responses: this.responses(),
          index: this.currentQuestionIndex(),
        };
        localStorage.setItem('diagnostic_draft', JSON.stringify(data));
      }
    });
  }

  ngOnInit() {
    // Auth validation
    try {
      const user = this.hubsme.currentUser();
      if (user.role === 'pyme') {
        this.pymeId.set(user.id);
      } else {
        this.router.navigate(['/']);
        return;
      }
    } catch {
      this.router.navigate([buildPath(PATH.auth.signIn)]);
      return;
    }

    // Check query params to load diagnostic from URL
    this.route.queryParams.subscribe((params) => {
      if (params['type'] === 'admin') {
        this.isAdminMode.set(true);
      }
      
      const id = Number(params['id']);
      if (id && Number.isFinite(id)) {
        this.hubsme.getDiagnostic(id)
          .then((res) => {
            this.diagnosticResult.set(res.data);
            this.showResult.set(true);
            this.loadSuggestedConsultants();
          })
          .catch((err) => {
            console.error('Error loading diagnostic from URL ID', err);
          });
      } else {
        // Load draft from localStorage only if not viewing a specific diagnostic
        if (isPlatformBrowser(this.platformId)) {
          const saved = localStorage.getItem('diagnostic_draft');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed && typeof parsed === 'object') {
                this.responses.set(parsed.responses || {});
                const idx = Math.min(Math.max(0, parsed.index || 0), this.questions().length - 1);
                this.currentQuestionIndex.set(idx);
              }
            } catch (e) {
              console.error('Error restoring diagnostic draft', e);
            }
          }
        }
      }
    });
  }

  selectOption(questionId: string, option: string) {
    this.responses.update((current) => ({ ...current, [questionId]: option }));
    // Wait slightly for feedback animation, then advance
    setTimeout(() => {
      this.nextQuestion();
    }, 280);
  }

  setOpenResponse(questionId: string, answer: string) {
    this.responses.update((current) => ({ ...current, [questionId]: answer }));
  }

  autofill() {
    const autoResponses: Record<string, string> = {};
    for (const q of this.questions()) {
      if (q.type === 'open') {
        autoResponses[q.id] = 'Esta es una respuesta automática de prueba de Hubsme IA para validar la generación correcta de los informes.';
      } else {
        autoResponses[q.id] = q.options && q.options.length > 0 ? q.options[0] : 'Sí';
      }
    }
    this.responses.set(autoResponses);
    this.currentQuestionIndex.set(this.questions().length - 1);
    this.toastService.success('Respuestas autocompletadas. Ya puedes enviar el diagnóstico.');
  }

  nextQuestion() {
    if (!this.isCurrentAnswered()) {
      this.toastService.error('Por favor responde la pregunta antes de continuar.');
      return;
    }

    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
    } else {
      this.generateReport();
    }
  }

  prevQuestion() {
    this.currentQuestionIndex.update((i) => Math.max(0, i - 1));
  }

  exitToDashboard() {
    if (confirm('¿Estás seguro de que deseas salir? Tu progreso se guardará automáticamente.')) {
      this.router.navigate([buildPath(PATH.admin.pyme.dashboard)]);
    }
  }

  generateReport() {
    if (!this.pymeId()) {
      this.toastService.error('No se pudo encontrar el ID de la PYME');
      return;
    }

    this.generating.set(true);

    const mappedResponses: Record<string, string> = {};
    for (const step of DIAGNOSTIC_STEPS) {
      for (const q of step.questions) {
        mappedResponses[q.text] = this.responses()[q.id] || 'No respondido';
      }
    }

    this.hubsme
      .generateDiagnostic({
        pymeId: this.pymeId(),
        pymeData: {
          name: this.hubsme.currentUser().name,
        },
        responses: mappedResponses,
      })
      .then((res) => {
        // Fetch full diagnostic result details
        return this.hubsme.getDiagnostic(res.data.id);
      })
      .then((detailRes) => {
        this.toastService.success('Diagnóstico generado con éxito');
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('diagnostic_draft');
        }
        this.diagnosticResult.set(detailRes.data);
        this.showResult.set(true);
        this.loadSuggestedConsultants();
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { id: detailRes.data.id },
          queryParamsHandling: 'merge',
        });
      })
      .catch((error) => {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      })
      .finally(() => {
        this.generating.set(false);
      });
  }

  goToAdmin() {
    this.router.navigate([buildPath(PATH.admin.pyme.diagnostics)]);
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
    if (score >= 75) return 'text-success bg-success/10 border-success/20';
    if (score >= 60) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-danger bg-danger/10 border-danger/20';
  }

  downloadPdf() {
    const current = this.diagnosticResult();
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

    addText('Recomendaciones prioritarias', 13, 'bold');
    for (const rec of current.result.recomendaciones) {
      addText(`- ${rec.accion} (${rec.prioridad}, plazo: ${rec.plazo}): ${rec.beneficioEsperado}`, 10);
    }
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

  loadSuggestedConsultants() {
    this.hubsme.listConsultants('', 1, 20, 'true')
      .then((res) => {
        const all = res.data.data;
        const areas = this.diagnosticResult()?.result?.areasEvaluadas || [];
        const criticalAreas = areas.filter(a => a.puntaje < 75).map(a => a.area.toLowerCase());

        if (criticalAreas.length === 0) {
          this.consultants.set(all.slice(0, 3));
          return;
        }

        const areaKeywords: Record<string, string[]> = {
          finanzas: ['finan', 'estrateg', 'caja', 'costo', 'tribut', 'presupuest'],
          operaciones: ['operac', 'logist', 'proces', 'suminist', 'calidad', 'inventar'],
          equipo: ['rrhh', 'talent', 'organiza', 'cultur', 'equip', 'funcion', 'rol'],
          mercado: ['market', 'vent', 'comerc', 'satisfac', 'lead', 'client', 'publicid']
        };

        const ranked = all.map((c: any) => {
          let matches = 0;
          const specialties = (c.specialties || []).map((s: string) => s.toLowerCase());
          
          for (const area of criticalAreas) {
            const keywords = areaKeywords[area] || [area];
            const hasMatch = keywords.some(keyword => 
              specialties.some((spec: string) => spec.includes(keyword))
            );
            if (hasMatch) matches += 2;
          }
          return { consultant: c, matches };
        });

        ranked.sort((a, b) => b.matches - a.matches);
        this.consultants.set(ranked.map(r => r.consultant).slice(0, 3));
      })
      .catch(err => {
        console.error('Error loading suggested consultants', err);
      });
  }

  consultantPhoto(consultant: any): string {
    return (
      consultant.photoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName || consultant.firstName || 'User')}`
    );
  }
}
