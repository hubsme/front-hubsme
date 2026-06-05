import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type DiagnosticQuestion =
  | {
      id: string;
      text: string;
      type?: 'closed';
      options: string[];
    }
  | {
      id: string;
      text: string;
      type: 'open';
      placeholder: string;
    };

type DiagnosticStep = {
  title: string;
  description: string;
  questions: DiagnosticQuestion[];
};

export const DIAGNOSTIC_STEPS: DiagnosticStep[] = [
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
      },
      {
        id: 'q_gen_5',
        text: 'Describe brevemente el modelo de negocio, principales productos o servicios y tipo de cliente que atiendes.',
        type: 'open',
        placeholder: 'Ejemplo: vendemos a restaurantes, atendemos por pedidos recurrentes y nuestro principal canal es WhatsApp...'
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
      },
      {
        id: 'q_int_21',
        text: '¿Cuál es el principal objetivo financiero o estratégico que quieres lograr en los próximos 6 meses?',
        type: 'open',
        placeholder: 'Ejemplo: ordenar caja, subir margen, abrir un canal de ventas, reducir deuda...'
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
      },
      {
        id: 'q_int_22',
        text: '¿Qué problema comercial te preocupa más hoy y qué intentaste hacer para resolverlo?',
        type: 'open',
        placeholder: 'Ejemplo: baja recompra, pocos leads, clientes piden descuentos, no sabemos medir campañas...'
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
      },
      {
        id: 'q_int_23',
        text: 'Menciona un proceso interno que hoy genera más retrasos, errores o dependencia de una sola persona.',
        type: 'open',
        placeholder: 'Ejemplo: compras, despacho, inventario, aprobaciones, facturación, atención postventa...'
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
      },
      {
        id: 'q_int_24',
        text: '¿Qué rol, función o decisión depende demasiado del dueño o de una persona clave?',
        type: 'open',
        placeholder: 'Ejemplo: ventas, pagos, compras, atención a clientes, aprobación de descuentos...'
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
      },
      {
        id: 'q_int_25',
        text: '¿Hay algún riesgo legal, laboral, tributario o documental que quieras que el consultor revise primero?',
        type: 'open',
        placeholder: 'Ejemplo: contratos vencidos, deuda tributaria, trabajadores sin documentación, permisos pendientes...'
      }
    ]
  }
];

for (const step of DIAGNOSTIC_STEPS) {
  for (const question of step.questions) {
    if (!('type' in question)) {
      question.type = 'closed';
    }
  }
}

@Component({
  selector: 'app-pyme-diagnostics',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pyme-diagnostics.html',
})
export class PymeDiagnostics implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  diagnostics = signal<ApiResponse<'diagnostic', 'findAll'>['data']>([]);
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
    const pct = ((this.currentStepIndex() + 1) / totalSteps) * 100;
    return `${pct.toFixed(2)}%`;
  }
  
  isStepComplete() {
    const step = this.steps[this.currentStepIndex()];
    return step.questions.every(q => this.responses()[q.id]?.trim());
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
        this.toastService.success('Diagnóstico generado con éxito');
        this.load();
        this.currentStepIndex.set(0);
        this.responses.set({});
        this.router.navigate(['/pyme/diagnostics', res.data.id]);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.generating.set(false));
  }
}
