import os

ts_content = """import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

export const DIAGNOSTIC_STEPS = [
  {
    title: 'Perfil de Empresa',
    description: 'Información general sobre tu negocio.',
    questions: [
      {
        id: 'q_gen_1',
        text: '¿Cuantos años tiene en funcionamiento su empresa?',
        options: ['Menos de 1 año', '1 año', '2 años', '3 años', '4 años', '5 años', '5 a 10 años', '10 a 15 años', '15 años a mas']
      },
      {
        id: 'q_gen_2',
        text: '¿Que regimen tributario tiene su empresa?',
        options: ['DESCONOZCO', 'Nuevo Régimen Único Simplificado (NRUS)', 'Régimen Especial de Renta (RER)', 'Régimen MYPE Tributario (RMT)', 'Régimen General.']
      },
      {
        id: 'q_gen_3',
        text: '¿Que regimen laboral tiene su empresa?',
        options: ['DESCONOZCO', 'Régimen GENERAL', 'Régimen MYPE (MICRO EMPRESA)', 'Régimen MYPE (PEQUEÑA EMPRESA)', 'Régmen CONSTRUCCION CIVIL', 'Régmen AGRARIO', 'Régimen PORTUARIO', 'Régimen PESQUERO', 'Régimen ESTIBADORES TERRESTRES', 'Régimen MINERO', 'Régimen TRABAJADOR DE EXPORTACION NO TRADICIONAL', 'Régimen AUTONOMOS AMBULANTES', 'Régimen TRABAJADOR DEL HOGAR', 'Régimen GUARDIANES Y PORTEROS', 'Régimen TRABAJADORES DE SALUD', 'Régimen TRABAJADOR EXTRANJERO']
      },
      {
        id: 'q_gen_4',
        text: '¿Cual es su nivel de ventas (declaradas o no)?',
        options: ['Menos de s/8,000 por mes', 'Entre /8,001 y 43,750 por mes', 'Entre s/43,751 y s/68,750 por mes', 'Entre s/68,751 a s/750,000 por mes', 'Mas de s/750,000 por mes']
      }
    ]
  },
  {
    title: 'Estratégica y Finanzas',
    description: 'Dirección empresarial y gestión financiera.',
    questions: [
      {
        id: 'q_int_1',
        text: '¿La empresa tiene objetivos claros para los próximos 12 meses?',
        options: ['No tiene objetivos definidos', 'Tiene objetivos poco claros', 'Tiene objetivos claros y definidos']
      },
      {
        id: 'q_int_2',
        text: '¿La gerencia o dueño revisa periódicamente los resultados y números del negocio?',
        options: ['No revisa información', 'Revisa información ocasionalmente', 'Revisa y analiza información constantemente']
      },
      {
        id: 'q_int_3',
        text: '¿La empresa conoce realmente cuánto gana o pierde cada mes?',
        options: ['No conoce si gana o pierde dinero cada mes', 'Tiene una idea aproximada', 'Tiene control claro de ingresos, costos y ganancias']
      },
      {
        id: 'q_int_4',
        text: '¿La empresa controla adecuadamente sus pagos, cobranzas y flujo de dinero?',
        options: ['Tiene problemas frecuentes por falta de dinero', 'Tiene control parcial', 'Tiene control financiero ordenado']
      },
      {
        id: 'q_int_20',
        text: '¿La empresa considera que está preparada para crecer de manera sostenible?',
        options: ['No está preparada para crecer', 'Tiene preparación parcial', 'Tiene bases sólidas para crecer']
      }
    ]
  },
  {
    title: 'Comercial y Mercado',
    description: 'Ventas, marketing y servicio al cliente.',
    questions: [
      {
        id: 'q_int_5',
        text: '¿La empresa depende demasiado de pocos clientes o de una sola fuente de ingresos?',
        options: ['Depende excesivamente de pocos clientes', 'Tiene dependencia moderada', 'Tiene clientes e ingresos diversificados']
      },
      {
        id: 'q_int_6',
        text: '¿La empresa tiene un proceso ordenado para conseguir y atender clientes?',
        options: ['No tiene proceso de ventas definido', 'Tiene un proceso informal', 'Tiene un proceso comercial organizado']
      },
      {
        id: 'q_int_7',
        text: '¿La empresa realiza seguimiento a clientes potenciales y ventas pendientes?',
        options: ['No realiza seguimiento', 'Realiza seguimiento ocasional', 'Tiene seguimiento comercial constante y ordenado']
      },
      {
        id: 'q_int_8',
        text: '¿La empresa tiene presencia digital o realiza acciones de marketing para atraer clientes?',
        options: ['No realiza acciones de marketing', 'Tiene presencia digital básica', 'Tiene presencia y acciones comerciales activas']
      },
      {
        id: 'q_int_9',
        text: '¿La empresa mide o recibe retroalimentación sobre la satisfacción de sus clientes?',
        options: ['No mide satisfacción del cliente', 'Lo hace ocasionalmente', 'Gestiona activamente la satisfacción de sus clientes']
      }
    ]
  },
  {
    title: 'Operaciones',
    description: 'Procesos, inventarios y calidad.',
    questions: [
      {
        id: 'q_int_10',
        text: '¿Los procesos principales de trabajo están ordenados y son claros?',
        options: ['Existe mucho desorden operativo', 'Algunos procesos están definidos', 'Los procesos funcionan de manera ordenada']
      },
      {
        id: 'q_int_11',
        text: '¿La empresa controla adecuadamente inventarios, producción o tiempos de atención?',
        options: ['Desconozco sobre este tema y no hay nadie en mi empresa que lo vea', 'Existe control parcial', 'Existe control adecuado y constante']
      },
      {
        id: 'q_int_12',
        text: '¿La empresa tiene problemas frecuentes de errores, retrasos o reprocesos?',
        options: ['Desconozco sobre este tema y no hay nadie en mi empresa que lo vea', 'Tiene problemas frecuentes que afectan la calidad', 'Opera de manera estable y eficiente']
      }
    ]
  },
  {
    title: 'Organización y RR.HH.',
    description: 'Equipo, roles y cultura interna.',
    questions: [
      {
        id: 'q_int_13',
        text: '¿Las funciones y responsabilidades del personal están claras?',
        options: ['Desconozco sobre este tema y no hay nadie en mi empresa que lo vea', 'Existe desorden de funciones', 'Roles y responsabilidades están definidos']
      },
      {
        id: 'q_int_14',
        text: '¿La empresa depende demasiado del dueño para operar diariamente?',
        options: ['Todo depende del dueño', 'Algunas áreas funcionan solas', 'La empresa funciona organizadamente']
      },
      {
        id: 'q_int_15',
        text: '¿La empresa capacita o guía constantemente a su personal?',
        options: ['No capacita al personal', 'Capacita ocasionalmente', 'Capacita y desarrolla constantemente al personal']
      },
      {
        id: 'q_int_16',
        text: '¿La empresa utiliza sistemas, software o herramientas digitales para gestionar información?',
        options: ['Todo se maneja manualmente', 'Usa herramientas básicas como Excel', 'Usa sistemas organizados de gestión (ERP, CRM u otros)']
      }
    ]
  },
  {
    title: 'Legal y Cumplimiento',
    description: 'Documentación, tributos y obligaciones laborales.',
    questions: [
      {
        id: 'q_int_17',
        text: '¿La empresa mantiene ordenados sus documentos, contratos y registros importantes?',
        options: ['Existe desorden documental', 'Tiene orden parcial', 'Tiene documentación organizada']
      },
      {
        id: 'q_int_18',
        text: '¿La empresa cumple adecuadamente con pagos, contratos y obligaciones laborales?',
        options: ['Tiene incumplimientos o informalidad laboral', 'Cumple parcialmente con las obligaciones laborales', 'Cumple adecuadamente con sus obligaciones laborales']
      },
      {
        id: 'q_int_19',
        text: '¿La empresa cumple adecuadamente con sus obligaciones tributarias y contables?',
        options: ['Tiene desorden o contingencias tributarias', 'Tiene cumplimiento parcial', 'Tiene cumplimiento ordenado y completo']
      }
    ]
  }
];

@Component({
  selector: 'app-pyme-diagnostics',
  imports: [CommonModule, FormsModule],
  templateUrl: './pyme-diagnostics.html',
})
export class PymeDiagnostics implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  diagnostics = signal<ApiResponse<'diagnostic', 'findAll'>['data']>([]);
  latest = signal<ApiResponse<'diagnostic', 'generate'> | null>(null);
  loading = signal(false);
  generating = signal(false);
  
  steps = DIAGNOSTIC_STEPS;
  currentStepIndex = signal(0);
  
  responses = signal<Record<string, string>>({});
  
  // To keep compatibility with backend payload if needed
  pymeId = signal(0);

  ngOnInit() {
    const user = this.hubsme.currentUser();
    if (user.role === 'pyme') {
      this.pymeId.set(user.id);
    }
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listDiagnostics()
      .then((res) => this.diagnostics.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  setResponse(questionId: string, answer: string) {
    this.responses.update(current => ({ ...current, [questionId]: answer }));
  }

  progress() {
    const totalSteps = this.steps.length;
    return `${((this.currentStepIndex() + 1) / totalSteps) * 100}%`;
  }
  
  isStepComplete() {
    const step = this.steps[this.currentStepIndex()];
    return step.questions.every(q => this.responses()[q.id]);
  }

  nextStep() {
    if (!this.isStepComplete()) {
      this.toastService.error('Por favor responde todas las preguntas de esta sección.');
      return;
    }
    
    if (this.currentStepIndex() < this.steps.length - 1) {
      this.currentStepIndex.update((i) => i + 1);
      return;
    }

    this.generate();
  }

  previousStep() {
    this.currentStepIndex.update((i) => Math.max(0, i - 1));
  }

  generate() {
    if (!this.pymeId()) {
      this.toastService.error('Indica el ID de usuario PYME');
      return;
    }

    this.generating.set(true);
    
    // Map responses to readable format for AI
    const mappedResponses: Record<string, string> = {};
    for (const step of this.steps) {
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
        this.latest.set(res.data);
        this.toastService.success('Diagnóstico generado con éxito');
        this.load();
        // Reset form
        this.currentStepIndex.set(0);
        this.responses.set({});
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.generating.set(false));
  }
}
"""

html_content = """<div class="space-y-6 font-inter-regular text-text">
  <header>
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-[1.9rem] leading-tight font-plus-jakarta-sans font-bold capitalize">Diagnóstico Rápido Integral</h1>
        <p class="mt-1 text-[0.92rem] text-muted">Paso {{ currentStepIndex() + 1 }} de {{ steps.length }}: {{ steps[currentStepIndex()].title }}</p>
      </div>
      <p class="text-[0.82rem] text-text font-inter-semibold">{{ progress() }} completado</p>
    </div>
    <div class="mt-5 h-1 rounded-full bg-border">
      <div class="h-1 rounded-full bg-text transition-all duration-300" [style.width]="progress()"></div>
    </div>
  </header>

  <section class="rounded-2xl border border-border bg-surface p-5 lg:p-8 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
    <div class="mb-8 border-b border-border pb-6">
      <h2 class="text-xl font-anton lowercase text-text">{{ steps[currentStepIndex()].title }}</h2>
      <p class="mt-1 text-[0.82rem] text-muted">{{ steps[currentStepIndex()].description }}</p>
    </div>

    <div class="space-y-8">
      @for (question of steps[currentStepIndex()].questions; track question.id) {
        <div>
          <h3 class="text-[0.9rem] font-inter-semibold mb-4">{{ question.text }}</h3>
          <div class="grid grid-cols-1 gap-2">
            @for (option of question.options; track option) {
              <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-slate-50"
                     [class.bg-slate-50]="responses()[question.id] === option"
                     [class.border-primary]="responses()[question.id] === option">
                <div class="relative flex h-5 w-5 items-center justify-center rounded-full border border-border"
                     [class.border-primary]="responses()[question.id] === option">
                  @if (responses()[question.id] === option) {
                    <div class="h-2.5 w-2.5 rounded-full bg-primary"></div>
                  }
                </div>
                <span class="text-[0.85rem]">{{ option }}</span>
                <input type="radio" [name]="question.id" [value]="option" 
                       (change)="setResponse(question.id, option)"
                       class="hidden" />
              </label>
            }
          </div>
        </div>
      }
    </div>

    <div class="mt-10 border-t border-border pt-6">
      <div class="flex items-center justify-between gap-3">
        <button
          type="button"
          (click)="previousStep()"
          [disabled]="currentStepIndex() === 0"
          class="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[0.85rem] text-muted font-inter-semibold transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <i class="fas fa-arrow-left text-xs"></i>
          Anterior
        </button>
        <button
          type="button"
          (click)="nextStep()"
          [disabled]="generating()"
          class="inline-flex h-10 min-w-40 items-center justify-center gap-2 rounded-xl bg-text px-6 text-[0.85rem] text-background font-inter-bold transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          @if (generating()) {
          <i class="fas fa-spinner fa-spin text-xs"></i>Analizando...
          } @else if (currentStepIndex() === steps.length - 1) {
          Generar diagnóstico <i class="fas fa-arrow-right text-xs"></i>
          } @else {
          Siguiente <i class="fas fa-arrow-right text-xs"></i>
          }
        </button>
      </div>
    </div>
  </section>

  @if (latest()) {
  <section class="rounded-2xl border border-success/20 bg-success/5 p-6 mt-8">
    <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
      <div class="flex-1">
        <h2 class="text-xl font-anton lowercase text-text">Resultado del Diagnóstico</h2>
        <p class="mt-3 text-[0.88rem] leading-relaxed text-slate-700">{{ latest()?.result?.resumenEjecutivo }}</p>
        
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (area of latest()?.result?.areasEvaluadas; track area.area) {
            <div class="rounded-xl border border-success/20 bg-white p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[0.8rem] font-inter-bold uppercase tracking-wide text-text">{{ area.area }}</span>
                <span class="text-xs font-inter-semibold text-muted">{{ area.puntaje }}/100</span>
              </div>
              <p class="text-[0.8rem] text-slate-600">{{ area.hallazgo }}</p>
            </div>
          }
        </div>
      </div>
      <div class="rounded-2xl bg-text px-8 py-6 text-center text-background w-full lg:w-auto shrink-0">
        <p class="text-[0.7rem] uppercase tracking-widest opacity-80 mb-1">Nivel Hubsme</p>
        <p class="text-5xl font-inter-bold">{{ latest()?.score }}</p>
        <p class="text-[0.7rem] uppercase tracking-widest opacity-80 mt-2">Puntaje Total</p>
      </div>
    </div>
  </section>
  }
</div>
"""

with open('src/modules/admin/content/pyme/diagnostics/pyme-diagnostics/pyme-diagnostics.ts', 'w') as f:
    f.write(ts_content)

with open('src/modules/admin/content/pyme/diagnostics/pyme-diagnostics/pyme-diagnostics.html', 'w') as f:
    f.write(html_content)

print("Files rewritten successfully.")
