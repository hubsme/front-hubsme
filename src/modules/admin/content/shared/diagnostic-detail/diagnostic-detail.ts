import { Component, OnInit, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { NgApexchartsModule } from 'ng-apexcharts';
import { downloadPdf } from '../../../functions/download-pdf';
import { downloadWord, ChartImages } from '../../../functions/download-word';

type Diagnostic = ApiResponse<'diagnostic', 'findOne'>;
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

@Component({
  selector: 'app-diagnostic-detail',
  imports: [CommonModule, RouterLink, NgApexchartsModule],
  templateUrl: './diagnostic-detail.html',
})
export class DiagnosticDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  diagnostic = signal<Diagnostic | null>(null);
  loading = signal(false);
  downloadingPdf = signal(false);
  downloadingWord = signal(false);
  isDownloading = computed(() => this.downloadingPdf() || this.downloadingWord());

  consultants = signal<any[]>([]);

  readonly PATH = PATH;
  readonly buildPath = buildPath;

  isBrowser = isPlatformBrowser(this.platformId);

  priorityLevel = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60 ? 'Alta' : (score < 75 ? 'Media' : 'Baja');
  });

  priorityClass = computed(() => {
    const level = this.priorityLevel();
    return level === 'Alta' ? 'text-danger' : (level === 'Media' ? 'text-warning' : 'text-success');
  });

  priorityBadge = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60 ? 'Atención prioritaria' : (score < 75 ? 'Mejora continua' : 'Mantener nivel');
  });

  priorityBadgeClass = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60 ? 'bg-danger/10 text-danger border-danger/20' : (score < 75 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20');
  });

  improvementPotential = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60 ? 'Alto' : (score < 75 ? 'Medio' : 'Bajo');
  });

  barChartOptions = computed(() => {
    const current = this.diagnostic();
    const areas = current?.result?.areasEvaluadas || [];
    
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
        height: 480,
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
    const current = this.diagnostic();
    const areas = current?.result?.areasEvaluadas || [];
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

  lineChartOptions = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
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
    if (name.includes('tecnol')) return 'Impulsa tu digitalización y adopción de herramientas.';
    if (name.includes('legal')) return 'Asegura tu cumplimiento normativo y contratos.';
    if (name.includes('labor')) return 'Gestiona el cumplimiento de obligaciones con tu equipo.';
    if (name.includes('tribut') || name.includes('contab')) return 'Optimiza tus obligaciones tributarias y contabilidad.';
    if (name.includes('estrat')) return 'Define objetivos claros y dirección de tu negocio.';
    if (name.includes('servi') || name.includes('client')) return 'Mejora la satisfacción y retención de tus clientes.';
    return 'Optimiza el rendimiento estratégico de esta área.';
  }

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
        this.loadSuggestedConsultants();

        const isDownloadMode = this.route.snapshot.queryParamMap.get('download') === 'true';
        if (isDownloadMode && this.isBrowser) {
          const startTime = Date.now();
          const checkAndDownload = () => {
            const svgs = document.querySelectorAll('apx-chart svg');
            if (svgs.length >= 3 || Date.now() - startTime > 5000) {
              setTimeout(() => {
                this.downloadPdf();
                setTimeout(() => {
                  window.close();
                }, 1000);
              }, 500);
            } else {
              setTimeout(checkAndDownload, 100);
            }
          };
          setTimeout(checkAndDownload, 200);
        }
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  loadSuggestedConsultants() {
    this.hubsme.listConsultants('', 1, 20, 'true')
      .then((res) => {
        const all = res.data.data;
        const areas = this.diagnostic()?.result?.areasEvaluadas || [];
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

  async downloadPdf() {
    if (!this.isBrowser || this.downloadingPdf()) return;

    const current = this.diagnostic();
    if (!current) return;

    console.log('downloadPdf initiated. Diagnostic ID:', current.id);
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

  async downloadWord() {
    if (this.downloadingWord()) return;

    const diagnostic = this.diagnostic();
    if (!diagnostic) {
      console.warn('downloadWord: No diagnostic found');
      return;
    }

    console.log('downloadWord initiated. Diagnostic ID:', diagnostic.id);
    this.downloadingWord.set(true);

    try {
      const chartImages = await this.captureCharts();
      console.log('downloadWord: calling downloadWord helper function. Chart images length:', {
        barChart: chartImages.barChart?.length || 0,
        radarChart: chartImages.radarChart?.length || 0,
        lineChart: chartImages.lineChart?.length || 0
      });
      downloadWord(diagnostic, chartImages);
    } catch (err) {
      console.error('Error generating Word', err);
      this.toastService.error('Ocurrió un error al generar el archivo Word.');
    } finally {
      this.downloadingWord.set(false);
    }
  }

  private async captureCharts(): Promise<ChartImages> {
    const chartImages: ChartImages = { barChart: '', radarChart: '', lineChart: '' };

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
      const line = getChartContainer(2, 'Proyección de evolución');

      console.log('captureCharts: identified elements to capture - bar:', !!bar, 'radar:', !!radar, 'line:', !!line);

      if (bar) {
        console.log('captureCharts: capturing bar chart...');
        chartImages.barChart = await this.captureElement(capture, bar, 'barChart');
      }
      if (radar) {
        console.log('captureCharts: capturing radar chart...');
        chartImages.radarChart = await this.captureElement(capture, radar, 'radarChart');
      }
      if (line) {
        console.log('captureCharts: capturing line chart...');
        chartImages.lineChart = await this.captureElement(capture, line, 'lineChart');
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

  getMainAreas(areas: any[]): any[] {
    if (!areas) return [];
    return [...areas]
      .sort((a, b) => a.puntaje - b.puntaje)
      .slice(0, 4);
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
}
