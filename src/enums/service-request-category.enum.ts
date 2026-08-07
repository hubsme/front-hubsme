import type { ServiceRequestDraftDto } from 'api/backend.api';

export type ServiceRequestCategory = Exclude<ServiceRequestDraftDto['category'], ''>;

export const SERVICE_REQUEST_CATEGORY_OPTIONS: ReadonlyArray<{
  category: ServiceRequestCategory;
  subcategories: readonly string[];
}> = [
  {
    category: 'Estratégica',
    subcategories: ['Planificación estratégica', 'Modelo de negocio', 'Transformación empresarial'],
  },
  {
    category: 'Financiera',
    subcategories: ['Planeamiento financiero', 'Costos y presupuestos', 'Financiamiento'],
  },
  {
    category: 'Comercial / Ventas',
    subcategories: ['Estrategia comercial', 'Proceso de ventas', 'CRM'],
  },
  {
    category: 'Marketing',
    subcategories: [
      'Redes sociales',
      'Branding / Diseño',
      'Marketing digital',
      'Investigación de mercado',
    ],
  },
  {
    category: 'Servicio al cliente',
    subcategories: ['Experiencia del cliente', 'Atención y soporte', 'Fidelización'],
  },
  {
    category: 'Operaciones',
    subcategories: ['Mejora de procesos', 'Logística', 'Calidad'],
  },
  {
    category: 'Organizacional / RRHH',
    subcategories: ['Selección', 'Capacitación', 'Cultura y clima'],
  },
  {
    category: 'Tecnología',
    subcategories: [
      'Desarrollo web',
      'Software / Automatización',
      'Datos / Analítica',
      'Ciberseguridad',
    ],
  },
  {
    category: 'Legal',
    subcategories: ['Contratos', 'Corporativo', 'Propiedad intelectual'],
  },
  {
    category: 'Laboral',
    subcategories: [
      'Cumplimiento laboral',
      'Gestión de planillas',
      'Seguridad y salud en el trabajo',
    ],
  },
  {
    category: 'Tributario / Contable',
    subcategories: [
      'Contabilidad',
      'Declaraciones tributarias',
      'Facturación / SUNAT',
      'Auditoría',
    ],
  },
] as const;
