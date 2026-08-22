import { Component, OnInit, inject, signal, computed, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { marked } from 'marked';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { downloadPdf, ChartImages } from '../admin/functions/download-word';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { DIAGNOSTIC_STEPS } from './diagnostic.constants';
import { NgApexchartsModule } from 'ng-apexcharts';
import { formatInPeru } from '@function/date.function';
import {
  AreaConsultantsMap,
  CriticalArea,
  RecommendedConsultant,
  recommendConsultantsByArea,
} from '../admin/functions/recommend-consultants';

type DiagnosticResult = ApiResponse<'diagnostic', 'findOne'>;

type ResponseEntry = {
  label: string;
  value: string;
};

const RESPONSE_LABELS: Record<string, string> = {
  q_gen_1: 'Años en funcionamiento',
  q_gen_2: 'Industria o rubro',
  q_gen_3: 'Régimen tributario',
  q_gen_4: 'Régimen laboral',
  q_gen_5: 'Nivel de ventas mensual',
  q_int_1: 'Objetivos (Estratégica)',
  q_int_2: 'Revisión de resultados (Estratégica)',
  q_int_3: 'Preparación para crecer (Estratégica)',
  q_int_4: 'Control de ganancias (Financiera)',
  q_int_5: 'Flujo de caja y cobranzas (Financiera)',
  q_int_6: 'Financiamiento del crecimiento (Financiera)',
  q_int_7: 'Dependencia de clientes (Comercial)',
  q_int_8: 'Proceso comercial (Comercial)',
  q_int_9: 'Seguimiento de oportunidades (Comercial)',
  q_int_10: 'Marketing y presencia digital (Marketing)',
  q_int_11: 'Satisfacción del cliente (Servicio al cliente)',
  q_int_12: 'Procesos documentados (Operaciones)',
  q_int_13: 'Control de inventarios y tiempos (Operaciones)',
  q_int_14: 'Errores y reprocesos (Operaciones)',
  q_int_15: 'Funciones y roles definidos (Organizacional)',
  q_int_16: 'Operación sin el dueño (Organizacional)',
  q_int_17: 'Capacitación y desarrollo (Organizacional)',
  q_int_18: 'Herramientas digitales (Tecnología)',
  q_int_19: 'Documentos y contratos (Legal)',
  q_int_20: 'Obligaciones laborales (Laboral)',
  q_int_21: 'Obligaciones tributarias (Tributario / Contable)',
  q_int_22: 'Problemas preocupantes (Cierre)',
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
  downloadingPdf = signal(false);
  isAdminMode = signal(false);

  // Results State
  showResult = signal(false);
  diagnosticResult = signal<DiagnosticResult | null>(null);
  areaConsultantsMap = signal<AreaConsultantsMap>({});
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
        height: 340,
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
        formatter: (val: number) => `${val}`,
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
    const getScore = (name: string) => {
      const area = areas.find(a => {
        const normalized = a.area.toLowerCase();
        const search = name.toLowerCase();
        return normalized === search || normalized.includes(search);
      });
      return area ? area.puntaje : 50;
    };
    
    const finanzas = getScore('financiera');
    const operaciones = getScore('operaciones');
    const equipo = getScore('organizacional');
    const mercado = getScore('comercial');
    const estrategia = getScore('estratégica');
    const clientes = getScore('servicio');

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


  areaDescription(areaName: string): string {
    const name = areaName.toLowerCase();
    if (name.includes('finan')) return 'Mejora tu rentabilidad y flujo de caja.';
    if (name.includes('operac')) return 'Optimiza procesos y eleva la eficiencia.';
    if (name.includes('equip') || name.includes('rrhh') || name.includes('organiza')) return 'Fortalece capacidades y alineación del equipo.';
    if (name.includes('merca') || name.includes('comerc')) return 'Aprovecha oportunidades y crece con foco.';
    if (name.includes('tecnol')) return 'Impulsa tu digitalización y adopción de herramientas.';
    if (name.includes('legal')) return 'Asegura tu cumplimiento normativo y contratos.';
    if (name.includes('labor')) return 'Gestiona el cumplimiento de obligaciones con tu equipo.';
    if (name.includes('tribut') || name.includes('contab')) return 'Optimiza tus obligaciones tributarias y contabilidad.';
    if (name.includes('estrat')) return 'Define objetivos claros y dirección de tu negocio.';
    if (name.includes('servi') || name.includes('client')) return 'Mejora la satisfacción y retención de tus clientes.';
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
        this.pymeId.set(this.hubsme.currentPymeId());
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
    return formatInPeru(value, {
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

  async downloadPdf() {
    if (this.downloadingPdf()) return;

    const current = this.diagnosticResult();
    if (!current) return;

    if (!this.isBrowser) return;

    console.log('downloadPdf initiated from wizard. Diagnostic ID:', current.id);
    this.downloadingPdf.set(true);

    try {
      const chartImages = await this.captureCharts();
      downloadPdf(current, chartImages);
    } catch (err) {
      console.error('Error generating PDF', err);
      this.toastService.error('Ocurrió un error al generar el PDF.');
    } finally {
      this.downloadingPdf.set(false);
    }
  }

  private async captureCharts(): Promise<ChartImages> {
    const chartImages: ChartImages = { barChart: '', radarChart: '' };

    if (!this.isBrowser) return chartImages;

    try {
      const html2canvasModule = await import('html2canvas');
      const capture = (html2canvasModule.default ?? html2canvasModule) as
        (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>;

      const getChartContainer = (index: number, titleText: string): HTMLElement | null => {
        const headings = Array.from(document.querySelectorAll('h3'));
        const heading = headings.find(h => h.textContent?.trim().toLowerCase() === titleText.toLowerCase());
        if (heading && heading.parentElement) {
          const card = heading.parentElement;
          const container = card.querySelector('.flex-1') as HTMLElement | null;
          if (container) {
            console.log(`getChartContainer [${titleText}]: found via heading -> .flex-1`);
            return container;
          }
          console.log(`getChartContainer [${titleText}]: found via heading -> card fallback`);
          return card;
        }

        const canvases = document.querySelectorAll('.apexcharts-canvas');
        if (canvases.length > index) {
          console.log(`getChartContainer [${titleText}]: found via .apexcharts-canvas at index ${index}`);
          return canvases[index] as HTMLElement;
        }

        const apxCharts = document.querySelectorAll('apx-chart');
        if (apxCharts.length > index) {
          console.log(`getChartContainer [${titleText}]: found via apx-chart at index ${index}`);
          return apxCharts[index] as HTMLElement;
        }

        console.warn(`getChartContainer [${titleText}]: not found using any selector`);
        return null;
      };

      const bar = getChartContainer(0, 'Desempeño por áreas');
      const radar = getChartContainer(1, 'Capacidades del negocio');

      console.log('captureCharts: identified elements to capture - bar:', !!bar, 'radar:', !!radar);

      if (bar) {
        console.log('captureCharts: capturing bar chart...');
        chartImages.barChart = await this.captureElement(capture, bar, 'barChart');
      }
      if (radar) {
        console.log('captureCharts: capturing radar chart...');
        chartImages.radarChart = await this.captureElement(capture, radar, 'radarChart');
      }
    } catch (captureErr) {
      console.error('captureCharts: Error during chart capture phase:', captureErr);
    }

    return chartImages;
  }

  private async captureElement(
    capture: (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>,
    element: HTMLElement,
    name: string
  ): Promise<string> {
    try {
      console.log(`captureElement [${name}]: start capture on element:`, element.tagName, 'classes:', element.className);
      const canvas = await capture(element, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      console.log(`captureElement [${name}]: successfully captured. Data URL length:`, dataUrl.length);
      return dataUrl;
    } catch (e) {
      console.error(`captureElement [${name}]: Error capturing element:`, e);
      return '';
    }
  }

  cleanOption(value: string): string {
    if (typeof value !== 'string') return String(value ?? '');
    return value
      .replace(/\s*\(\d\)$/, '')
      .replace(/\s*\(N\/A\s*-\s*se\s+excluye\s+del\s+calculo\)$/i, ' (N/A)');
  }

  getMainAreas(areas: CriticalArea[]): CriticalArea[] {
    if (!areas) return [];
    return [...areas]
      .sort((a, b) => a.puntaje - b.puntaje)
      .slice(0, 3);
  }

  private responseValue(value: unknown) {
    if (value === null || value === undefined) return 'No respondido';
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? this.cleanOption(trimmed) : 'No respondido';
    }
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return JSON.stringify(value);
  }

  loadSuggestedConsultants() {
    this.hubsme.listConsultants('', 1, 100, 'true')
      .then((res) => {
        const all = res.data.data;
        const areas = this.diagnosticResult()?.result?.areasEvaluadas || [];
        this.areaConsultantsMap.set(
          recommendConsultantsByArea(all, this.getMainAreas(areas)),
        );
      })
      .catch(err => {
        console.error('Error loading suggested consultants', err);
      });
  }

  consultantPhoto(consultant: RecommendedConsultant): string {
    return (
      consultant.photoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName || consultant.firstName || 'User')}`
    );
  }

  renderMarkdown(text: string | null | undefined): string {
    if (!text) return '';
    const rawHtml = marked.parse(text, { async: false }) as string;
    return rawHtml
      .replace(/<strong>/g, '<strong class="font-inter-bold" style="font-weight: 700;">')
      .replace(/<b>/g, '<b class="font-inter-bold" style="font-weight: 700;">');
  }
}
