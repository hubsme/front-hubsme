export type DiagnosticQuestion =
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

export type DiagnosticStep = {
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
        text: '¿Cuántos años tiene en funcionamiento su empresa?',
        options: [
          'Menos de 1 año',
          '1 año',
          '2 años',
          '3 años',
          '4 años',
          '5 años',
          '5 a 10 años',
          '10 a 15 años',
          '15 años a más'
        ]
      },
      {
        id: 'q_gen_2',
        text: '¿A qué industria o rubro pertenece su empresa?',
        options: [
          'Comercio (compra y venta de productos)',
          'Servicios profesionales (consultoría, legal, contable, salud, educación)',
          'Construcción y obras civiles',
          'Manufactura y producción',
          'Transporte y logística',
          'Gastronomía y hostelería',
          'Tecnología y servicios digitales',
          'Agropecuario y pesca',
          'Otro (especificar)'
        ]
      },
      {
        id: 'q_gen_3',
        text: '¿Qué régimen tributario tiene su empresa?',
        options: [
          'Desconozco',
          'Nuevo RUS',
          'Régimen Especial de Renta (RER)',
          'Régimen MYPE Tributario (RMT)',
          'Régimen General'
        ]
      },
      {
        id: 'q_gen_4',
        text: '¿Qué régimen laboral tiene su empresa?',
        options: [
          'No sé / no tenemos trabajadores en planilla',
          'Régimen MYPE - Microempresa',
          'Régimen MYPE - Pequeña empresa',
          'Régimen General',
          'Régimen especial (agrario, construcción, pesquero u otro)'
        ]
      },
      {
        id: 'q_gen_5',
        text: '¿Cuál es su nivel de ventas mensual (aproximado)?',
        options: [
          'Menos de S/ 8,000',
          'Entre S/ 8,001 y S/ 43,750',
          'Entre S/ 43,751 y S/ 68,750',
          'Entre S/ 68,751 y S/ 750,000',
          'Más de S/ 750,000'
        ]
      }
    ]
  },
  {
    title: 'Estratégica y Finanzas',
    description: 'Dirección empresarial y gestión financiera.',
    questions: [
      {
        id: 'q_int_1',
        text: '¿La empresa tiene objetivos claros y documentados para los próximos 12 meses?',
        options: [
          'No tiene objetivos definidos (1)',
          'Tiene objetivos en mente pero no escritos ni comunicados al equipo (3)',
          'Tiene objetivos escritos, comunicados y con seguimiento periódico (5)'
        ]
      },
      {
        id: 'q_int_2',
        text: '¿El dueño o gerencia revisa periódicamente los resultados del negocio?',
        options: [
          'No revisa - opera de manera reactiva (1)',
          'Revisa ocasionalmente o cuando hay problemas (3)',
          'Revisa mensualmente con indicadores definidos (5)'
        ]
      },
      {
        id: 'q_int_3',
        text: '¿La empresa está preparada para crecer de manera sostenible?',
        options: [
          'No - hay demasiados problemas internos por resolver primero (1)',
          'Tiene bases parciales pero falta estructura para escalar (3)',
          'Tiene sistemas, equipo y procesos listos para crecer (5)'
        ]
      },
      {
        id: 'q_int_4',
        text: '¿La empresa sabe con exactitud cuánto gana o pierde cada mes?',
        options: [
          'No - mezcla gastos personales y del negocio o no lleva registros (1)',
          'Tiene una idea aproximada pero sin registros formales (3)',
          'Tiene control claro con registros de ingresos, costos y utilidad (5)'
        ]
      },
      {
        id: 'q_int_5',
        text: '¿La empresa controla adecuadamente su flujo de caja, cobranzas y pagos?',
        options: [
          'Tiene problemas frecuentes de liquidez o no puede pagar a tiempo (1)',
          'Tiene control parcial, con algunos atrasos o deudas (3)',
          'Tiene control financiero ordenado, sin sorpresas de liquidez (5)'
        ]
      },
      {
        id: 'q_int_6',
        text: '¿Cómo financia la empresa su operación o crecimiento cuando necesita capital?',
        options: [
          'Con dinero del dueño o préstamos informales (familia, ahorros personales) (1)',
          'Con créditos bancarios, pero con dificultades para acceder o cumplir los pagos (3)',
          'Tiene acceso ordenado a financiamiento formal y lo usa de manera planificada (5)'
        ]
      }
    ]
  },
  {
    title: 'Comercial y Mercado',
    description: 'Ventas, marketing y servicio al cliente.',
    questions: [
      {
        id: 'q_int_7',
        text: '¿La empresa depende de pocos clientes o de una sola fuente de ingresos?',
        options: [
          'Más del 70% de las ventas dependen de 1 o 2 clientes o fuentes (1)',
          'Tiene dependencia moderada - podría resistir perder a uno (3)',
          'Tiene clientes e ingresos bien diversificados (5)'
        ]
      },
      {
        id: 'q_int_8',
        text: '¿La empresa tiene un proceso ordenado para conseguir, cotizar y cerrar clientes?',
        options: [
          'No - cada venta depende del momento o del dueño (1)',
          'Tiene un proceso informal que varía según quien atiende (3)',
          'Tiene un proceso comercial documentado y seguido por el equipo (5)'
        ]
      },
      {
        id: 'q_int_9',
        text: '¿La empresa hace seguimiento a clientes potenciales y oportunidades de venta pendientes?',
        options: [
          'No - si el cliente no llama, se pierde (1)',
          'Lo hace de manera ocasional e informal (3)',
          'Tiene seguimiento constante con registro de clientes potenciales (5)'
        ]
      },
      {
        id: 'q_int_10',
        text: '¿La empresa tiene presencia digital activa y realiza acciones para atraer clientes?',
        options: [
          'No tiene presencia digital ni realiza acciones de marketing (1)',
          'Tiene redes sociales o web básicas pero sin estrategia ni frecuencia (3)',
          'Tiene marketing digital activo con resultados medibles (5)'
        ]
      },
      {
        id: 'q_int_11',
        text: '¿La empresa mide o gestiona activamente la satisfacción de sus clientes?',
        options: [
          'No - sabe que hay quejas pero no las gestiona (1)',
          'Lo hace ocasionalmente o solo responde cuando el cliente reclama (3)',
          'Gestiona activamente la satisfacción con procesos de postventa definidos (5)'
        ]
      }
    ]
  },
  {
    title: 'Operaciones',
    description: 'Procesos, inventarios y calidad.',
    questions: [
      {
        id: 'q_int_12',
        text: '¿Los procesos principales de trabajo están ordenados, documentados y son repetibles?',
        options: [
          'Existe mucho desorden operativo - cada vez se hace diferente o depende de quien está (1)',
          'Algunos procesos están claros pero otros no están documentados (3)',
          'Los procesos están documentados y funcionan de manera ordenada (5)'
        ]
      },
      {
        id: 'q_int_13',
        text: '¿La empresa controla sus inventarios, tiempos de entrega o producción?',
        options: [
          'No aplica (la empresa no requiere área de producción ni inventarios)',
          'No hay control - hay pérdidas, demoras o sobrestock frecuentes (1)',
          'Hay control parcial con algunos problemas ocasionales (3)',
          'Existe control adecuado y constante con registros actualizados (5)'
        ]
      },
      {
        id: 'q_int_14',
        text: '¿La empresa tiene problemas frecuentes de errores, retrasos o reprocesos que afectan al cliente?',
        options: [
          'Sí - son frecuentes y afectan la reputación y los costos (1)',
          'Ocurren ocasionalmente y los resuelve pero sin atacar la causa raíz (3)',
          'Opera de manera estable con muy pocos errores y mecanismos de mejora continua (5)'
        ]
      }
    ]
  },
  {
    title: 'Organización y RR.HH.',
    description: 'Equipo, roles y cultura interna.',
    questions: [
      {
        id: 'q_int_15',
        text: '¿Las funciones y responsabilidades del personal están claramente definidas?',
        options: [
          'No - hay confusión de roles, duplicidad o áreas sin responsable claro (1)',
          'Están claras para algunos pero no para todo el equipo (3)',
          'Todos saben qué hacer, a quién reportar y cómo se mide su desempeño (5)'
        ]
      },
      {
        id: 'q_int_16',
        text: '¿La empresa puede operar con normalidad si el dueño no está presente por una semana?',
        options: [
          'No - sin el dueño todo se detiene o hay caos (1)',
          'Algunas áreas funcionan solas pero hay decisiones que solo el dueño toma (3)',
          'La empresa funciona con autonomía - el dueño lidera sin tener que operar el día a día (5)'
        ]
      },
      {
        id: 'q_int_17',
        text: '¿La empresa capacita o desarrolla a su personal de manera continua?',
        options: [
          'No - el personal aprende de manera empírica o no recibe formación (1)',
          'Capacita ocasionalmente sin un plan formal (3)',
          'Tiene un plan de capacitación activo y evalúa el desempeño del equipo (5)'
        ]
      },
      {
        id: 'q_int_18',
        text: '¿Qué herramientas digitales usa la empresa para gestionar su información y procesos?',
        options: [
          'Todo manual - cuadernos, WhatsApp o la memoria del dueño (1)',
          'Usa Excel o Google Sheets sin automatizaciones (2)',
          'Usa aplicaciones básicas (facturación electrónica, POS, apps de delivery) (3)',
          'Usa software especializado por área (contabilidad, ventas, inventario) (4)',
          'Usa un sistema integrado (ERP, CRM) que conecta las áreas (5)'
        ]
      }
    ]
  },
  {
    title: 'Legal y Cumplimiento',
    description: 'Documentación, tributos y obligaciones laborales.',
    questions: [
      {
        id: 'q_int_19',
        text: '¿La empresa mantiene ordenados sus contratos, documentos legales y registros importantes?',
        options: [
          'Existe desorden - contratos vencidos, perdidos o que nunca se firmaron (1)',
          'Tiene orden parcial en algunos documentos pero no en todos (3)',
          'Tiene documentación organizada, digitalizada y actualizada (5)'
        ]
      },
      {
        id: 'q_int_20',
        text: '¿La empresa cumple con sus obligaciones laborales (planilla, beneficios, contratos de trabajo)?',
        options: [
          'Tiene incumplimientos - trabajadores sin contrato o en informalidad total (1)',
          'Cumple parcialmente - algunos trabajadores formales, otros no (3)',
          'Cumple adecuadamente con toda la planilla y los beneficios de ley (5)'
        ]
      },
      {
        id: 'q_int_21',
        text: '¿La empresa cumple con sus obligaciones tributarias y contables ante SUNAT?',
        options: [
          'Tiene desorden, multas o contingencias tributarias pendientes (1)',
          'Cumple parcialmente - hay declaraciones atrasadas o errores frecuentes (3)',
          'Tiene cumplimiento ordenado, sin contingencias y con contabilidad al día (5)'
        ]
      },
      {
        id: 'q_int_22',
        text: '¿Cuáles son los 2 o 3 problemas principales que más le preocupan o quisiera resolver en su empresa?',
        type: 'open',
        placeholder: 'Ejemplos: "No tenemos control de lo que entra y sale de caja", "Dependemos de un solo cliente grande", "El personal no sabe bien qué hacer", "No sabemos si somos rentables", "Tenemos deudas con SUNAT sin resolver"'
      }
    ]
  }
];

// Normalize the types
for (const step of DIAGNOSTIC_STEPS) {
  for (const question of step.questions) {
    if (!('type' in question)) {
      question.type = 'closed';
    }
  }
}
