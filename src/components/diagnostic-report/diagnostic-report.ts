import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { DiagnosticResultDto } from 'api/backend.api';
import { marked } from 'marked';
import { NgApexchartsModule } from 'ng-apexcharts';
import { downloadPdf } from '@module/admin/functions/download-pdf';
import { downloadWord, ChartImages } from '@module/admin/functions/download-word';
import {
  CriticalArea,
  RecommendedConsultant,
  recommendConsultantsByArea,
} from '@module/admin/functions/recommend-consultants';

@Component({
  selector: 'app-diagnostic-report',
  imports: [CommonModule, RouterLink, NgApexchartsModule],
  templateUrl: './diagnostic-report.html',
  host: { class: 'block min-w-0' },
})
export class DiagnosticReport {
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly barChartCapture = viewChild<ElementRef<HTMLElement>>('barChartCapture');
  private readonly radarChartCapture = viewChild<ElementRef<HTMLElement>>('radarChartCapture');

  readonly diagnostic = input<DiagnosticResultDto | null>(null);
  readonly loading = input(false);
  readonly consultants = input<RecommendedConsultant[]>([]);
  readonly consultantsLoading = input(false);
  readonly allowConsultantActions = input(true);
  readonly autoDownloadPdf = input(false);
  readonly automaticDownloadComplete = output<void>();
  readonly downloadingPdf = signal(false);
  readonly downloadingWord = signal(false);
  readonly isDownloading = computed(() => this.downloadingPdf() || this.downloadingWord());
  readonly areaConsultantsMap = computed(() =>
    recommendConsultantsByArea(
      this.consultants(),
      this.getMainAreas(this.diagnostic()?.result.areasEvaluadas ?? []),
    ),
  );
  readonly PATH = PATH;
  readonly buildPath = buildPath;
  readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    effect((onCleanup) => {
      if (!this.isBrowser || !this.autoDownloadPdf() || this.loading() || !this.diagnostic())
        return;

      const startedAt = Date.now();
      let cancelled = false;
      let timer: ReturnType<typeof setTimeout>;
      const checkAndDownload = () => {
        const chartsReady =
          this.barChartCapture()?.nativeElement.querySelector('svg') &&
          this.radarChartCapture()?.nativeElement.querySelector('svg');
        if (chartsReady || Date.now() - startedAt > 5000) {
          timer = setTimeout(() => {
            void this.downloadPdf().then(() => {
              if (!cancelled) this.automaticDownloadComplete.emit();
            });
          }, 500);
        } else {
          timer = setTimeout(checkAndDownload, 100);
        }
      };
      timer = setTimeout(checkAndDownload, 200);
      onCleanup(() => {
        cancelled = true;
        clearTimeout(timer);
      });
    });
  }

  priorityLevel = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60 ? 'Alta' : score < 75 ? 'Media' : 'Baja';
  });

  priorityClass = computed(() => {
    const level = this.priorityLevel();
    return level === 'Alta' ? 'text-danger' : level === 'Media' ? 'text-warning' : 'text-success';
  });

  priorityBadge = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60 ? 'Atención prioritaria' : score < 75 ? 'Mejora continua' : 'Mantener nivel';
  });

  priorityBadgeClass = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60
      ? 'bg-danger/10 text-danger border-danger/20'
      : score < 75
        ? 'bg-warning/10 text-warning border-warning/20'
        : 'bg-success/10 text-success border-success/20';
  });

  improvementPotential = computed(() => {
    const score = this.diagnostic()?.score ?? 50;
    return score < 60 ? 'Alto' : score < 75 ? 'Medio' : 'Bajo';
  });

  barChartOptions = computed(() => {
    const current = this.diagnostic();
    const areas = current?.result?.areasEvaluadas || [];

    return {
      series: [
        {
          name: 'Tu Negocio',
          data: areas.map((a) => a.puntaje),
        },
        {
          name: 'Promedio Sector',
          data: areas.map((a) => {
            const name = a.area.toLowerCase();
            if (name.includes('finan')) return 60;
            if (name.includes('operac')) return 55;
            if (name.includes('equip') || name.includes('rrhh') || name.includes('organi'))
              return 65;
            return 58;
          }),
        },
      ],
      chart: {
        type: 'bar' as const,
        height: 340,
        toolbar: { show: false },
        animations: { enabled: false },
      },
      colors: ['#0870f7', '#94a3b8'],
      plotOptions: {
        bar: {
          columnWidth: '55%',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}`,
        style: {
          fontSize: '11px',
          fontWeight: 'bold',
          colors: ['#334155'],
        },
      },
      xaxis: {
        categories: areas.map((a) => a.area),
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Inter Medium, sans-serif',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          style: {
            fontSize: '10px',
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#e2e8f0',
        strokeDashArray: 4,
      },
      legend: {
        show: true,
        position: 'top' as const,
        horizontalAlign: 'center' as const,
      },
    };
  });

  radarChartOptions = computed(() => {
    const current = this.diagnostic();
    const areas = current?.result?.areasEvaluadas || [];
    const getScore = (name: string) => {
      const area = areas.find((a) => {
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
      series: [
        {
          name: 'Capacidad',
          data: [estrategia, finanzas, operaciones, equipo, mercado, clientes],
        },
      ],
      chart: {
        type: 'radar' as const,
        height: 220,
        toolbar: { show: false },
        animations: { enabled: false },
      },
      colors: ['#0870f7'],
      xaxis: {
        categories: ['Estrategia', 'Finanzas', 'Operaciones', 'Talento', 'Mercado', 'Clientes'],
        labels: {
          style: {
            fontSize: '9px',
            fontFamily: 'Inter Medium, sans-serif',
          },
        },
      },
      yaxis: {
        max: 100,
        tickAmount: 4,
        show: false,
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: '#e2e8f0',
            connectorColors: '#e2e8f0',
          },
        },
      },
      markers: {
        size: 4,
        colors: ['#0870f7'],
        strokeWidth: 2,
      },
    };
  });

  areaDescription(areaName: string): string {
    const name = areaName.toLowerCase();
    if (name.includes('finan')) return 'Mejora tu rentabilidad y flujo de caja.';
    if (name.includes('operac')) return 'Optimiza procesos y eleva la eficiencia.';
    if (name.includes('equip') || name.includes('rrhh') || name.includes('organiza'))
      return 'Fortalece capacidades y alineación del equipo.';
    if (name.includes('merca') || name.includes('comerc'))
      return 'Aprovecha oportunidades y crece con foco.';
    if (name.includes('tecnol')) return 'Impulsa tu digitalización y adopción de herramientas.';
    if (name.includes('legal')) return 'Asegura tu cumplimiento normativo y contratos.';
    if (name.includes('labor')) return 'Gestiona el cumplimiento de obligaciones con tu equipo.';
    if (name.includes('tribut') || name.includes('contab'))
      return 'Optimiza tus obligaciones tributarias y contabilidad.';
    if (name.includes('estrat')) return 'Define objetivos claros y dirección de tu negocio.';
    if (name.includes('servi') || name.includes('client'))
      return 'Mejora la satisfacción y retención de tus clientes.';
    return 'Optimiza el rendimiento estratégico de esta área.';
  }

  consultantPhoto(consultant: RecommendedConsultant): string {
    return (
      consultant.photoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName || consultant.firstName || 'User')}`
    );
  }

  getMainAreas(areas: CriticalArea[]): CriticalArea[] {
    if (!areas) return [];
    return [...areas].sort((a, b) => a.puntaje - b.puntaje).slice(0, 3);
  }

  async downloadPdf() {
    if (!this.isBrowser || this.isDownloading()) return;
    const current = this.diagnostic();
    if (!current) return;

    this.downloadingPdf.set(true);
    try {
      downloadPdf(current, await this.captureCharts());
    } catch {
      this.toastService.error('Ocurrió un error al generar el PDF.');
    } finally {
      this.downloadingPdf.set(false);
    }
  }

  async downloadWord() {
    if (!this.isBrowser || this.isDownloading()) return;
    const current = this.diagnostic();
    if (!current) return;

    this.downloadingWord.set(true);
    try {
      downloadWord(current, await this.captureCharts());
    } catch {
      this.toastService.error('Ocurrió un error al generar el archivo Word.');
    } finally {
      this.downloadingWord.set(false);
    }
  }

  private async captureCharts(): Promise<ChartImages> {
    const chartImages: ChartImages = {};
    if (!this.isBrowser) return chartImages;

    const { default: capture } = await import('html2canvas');
    const charts = [
      { key: 'barChart' as const, element: this.barChartCapture()?.nativeElement },
      { key: 'radarChart' as const, element: this.radarChartCapture()?.nativeElement },
    ];
    for (const { key, element } of charts) {
      if (!element) continue;
      try {
        const canvas = await capture(element, {
          backgroundColor: '#ffffff',
          scale: 1,
          useCORS: true,
          logging: false,
        });
        chartImages[key] = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error capturing diagnostic chart', key, error);
      }
    }
    return chartImages;
  }

  renderMarkdown(text: string | null | undefined): string {
    if (!text) return '';
    return marked
      .parse(text, { async: false })
      .replace(/<strong>/g, '<strong class="font-inter-bold">')
      .replace(/<b>/g, '<b class="font-inter-bold">');
  }
}
