import { ApiBody } from 'api/backend.api';

export type ConsultantDiagnosticArea = NonNullable<
  ApiBody<'consultant', 'create'>['diagnosticAreas']
>[number];

export const CONSULTANT_DIAGNOSTIC_AREAS = [
  'Estratégica',
  'Financiera',
  'Comercial / Ventas',
  'Marketing',
  'Servicio al cliente',
  'Operaciones',
  'Organizacional / RRHH',
  'Tecnología',
  'Legal',
  'Laboral',
  'Tributario / Contable',
] as const satisfies readonly ConsultantDiagnosticArea[];
