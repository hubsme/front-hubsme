import { Component, OnInit, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { NgApexchartsModule } from 'ng-apexcharts';
import { downloadPdf } from '../../../functions/download-pdf';
import { downloadWord } from '../../../functions/download-word';

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
    const current = this.diagnostic();
    const areas = current?.result?.areasEvaluadas || [];
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
    if (!this.isBrowser) return;

    const current = this.diagnostic();
    if (!current) return;

    this.loading.set(true);

    try {
      downloadPdf(current);
    } catch (err) {
      console.error('Error generating PDF', err);
      this.toastService.error('Ocurrió un error al generar el PDF.');
    } finally {
      this.loading.set(false);
    }
  }

  downloadWord() {
    const diagnostic = this.diagnostic();
    if (!diagnostic) return;
    try {
      downloadWord(diagnostic);
    } catch (err) {
      console.error('Error generating Word', err);
      this.toastService.error('Ocurrió un error al generar el archivo Word.');
    }
  }

  private responseValue(value: unknown) {
    if (value === null || value === undefined) return 'No respondido';
    if (typeof value === 'string') return value.trim() || 'No respondido';
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return JSON.stringify(value);
  }
}
