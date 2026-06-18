/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginDto {
  /**
   * User email address
   * @example "miguel.salinas@hubsme.com"
   */
  email: string;
  /**
   * User password
   * @example "123456"
   */
  password: string;
}

export interface UserResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  /** @example "consultor@hubsme.com" */
  email: string;
  /** @example "Carlos Mendoza" */
  name: string;
  firstName: string | null;
  lastName: string | null;
  role: "admin" | "pyme" | "consultor";
  authProvider: "local" | "google";
  googleId: string | null;
  isActive: "true" | "false";
}

export interface LoginResponseDto {
  /**
   * JWT access token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
  /** User information */
  user: UserResultDto;
}

export interface HttpErrorDto {
  /**
   * Error message(s)
   * @example ["password must be longer than or equal to 6 characters"]
   */
  message: string | string[];
  /**
   * Error type
   * @example "Bad Request"
   */
  error: string;
  /**
   * Status code
   * @example 400
   */
  statusCode: number;
}

export interface RegisterDto {
  /**
   * User email address
   * @example "maria@empresa.com"
   */
  email: string;
  /**
   * User password, minimum 6 characters
   * @example "123456"
   */
  password: string;
  /**
   * User or business display name
   * @example "Textiles del Sur SAC"
   */
  name: string;
  /**
   * Consultant first name or PYME owner first name
   * @example "Maria"
   */
  firstName?: string;
  /**
   * Consultant last name or PYME owner last name
   * @example "Torres"
   */
  lastName?: string;
  /**
   * PYME RUC
   * @example "20600000001"
   */
  ruc?: string;
  /**
   * PYME owner phone
   * @example "+51999888777"
   */
  ownerPhone?: string;
  /**
   * PYME owner position
   * @example "Gerente general"
   */
  ownerPosition?: string;
  /** @default "pyme" */
  role: "pyme" | "consultor";
}

export interface GoogleAuthUrlResponseDto {
  /** @example "https://accounts.google.com/o/oauth2/v2/auth?..." */
  url: string;
}

export interface UserListItemDto {
  id: number;
  email: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  role: "admin" | "pyme" | "consultor";
  authProvider: "local" | "google";
  isActive: "true" | "false";
  /** @format date-time */
  createdAt: string;
}

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserListDto {
  data: UserListItemDto[];
  meta: PaginationMetaDto;
}

export interface UserCreateDto {
  /** @example "consultor@hubsme.com" */
  email: string;
  /**
   * @minLength 6
   * @example "123456"
   */
  password: string;
  /** @example "Carlos Mendoza" */
  name: string;
  /** @example "Carlos" */
  firstName?: string;
  /** @example "Mendoza" */
  lastName?: string;
  /** @default "pyme" */
  role: "admin" | "pyme" | "consultor";
}

export interface UserUpdateDto {
  /** @example "consultor@hubsme.com" */
  email?: string;
  /**
   * @minLength 6
   * @example "123456"
   */
  password?: string;
  /** @example "Carlos Mendoza" */
  name?: string;
  /** @example "Carlos" */
  firstName?: string;
  /** @example "Mendoza" */
  lastName?: string;
  role?: "admin" | "pyme" | "consultor";
  isActive?: "true" | "false";
}

export interface PymeListItemDto {
  id: number;
  userId: number;
  name: string;
  ruc: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerEmail: string | null;
  sector: string | null;
  numEmployees: number | null;
  /** @format date-time */
  createdAt: string;
}

export interface PymeListDto {
  data: PymeListItemDto[];
  meta: PaginationMetaDto;
}

export interface PymeResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  userId: number;
  name: string;
  ruc: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerEmail: string | null;
  ownerPhone: string | null;
  ownerPosition: string | null;
  sector: string | null;
  numEmployees: number | null;
  yearsInOperation: number | null;
  description: string | null;
  logoUrl: string | null;
}

export interface PymeCreateDto {
  /** @example 2 */
  userId: number;
  /** @example "Textiles del Sur SAC" */
  name: string;
  /** @example "20600000001" */
  ruc?: string;
  /** @example "Maria" */
  ownerFirstName?: string;
  /** @example "Torres" */
  ownerLastName?: string;
  /** @example "maria@empresa.com" */
  ownerEmail?: string;
  /** @example "+51999888777" */
  ownerPhone?: string;
  /** @example "Gerente general" */
  ownerPosition?: string;
  /** @example "Manufactura" */
  sector?: string;
  /** @example 24 */
  numEmployees?: number;
  /** @example 7 */
  yearsInOperation?: number;
  /** @example "PYME textil peruana en proceso de digitalizacion." */
  description?: string;
  /** @example "https://storage.example.com/pymes/logo.jpg" */
  logoUrl?: string;
}

export interface PymeUpdateDto {
  /** @example 2 */
  userId?: number;
  /** @example "Textiles del Sur SAC" */
  name?: string;
  /** @example "20600000001" */
  ruc?: string;
  /** @example "Maria" */
  ownerFirstName?: string;
  /** @example "Torres" */
  ownerLastName?: string;
  /** @example "maria@empresa.com" */
  ownerEmail?: string;
  /** @example "+51999888777" */
  ownerPhone?: string;
  /** @example "Gerente general" */
  ownerPosition?: string;
  /** @example "Manufactura" */
  sector?: string;
  /** @example 24 */
  numEmployees?: number;
  /** @example 7 */
  yearsInOperation?: number;
  /** @example "PYME textil peruana en proceso de digitalizacion." */
  description?: string;
  /** @example "https://storage.example.com/pymes/logo.jpg" */
  logoUrl?: string;
}

export interface ConsultantListItemDto {
  id: number;
  userId: number;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  specialties: string[];
  sectors: string[];
  photoUrl: string | null;
  videoUrl: string | null;
  pricePerHour: string;
  rating: string;
  totalReviews: number;
  active: "true" | "false";
  /** @format date-time */
  createdAt: string;
}

export interface ConsultantListDto {
  data: ConsultantListItemDto[];
  meta: PaginationMetaDto;
}

export interface ConsultantResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  userId: number;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  specialties: string[];
  sectors: string[];
  photoUrl: string | null;
  videoUrl: string | null;
  pricePerHour: string;
  rating: string;
  totalReviews: number;
  active: "true" | "false";
  validated: "true" | "false";
}

export interface ConsultantCreateDto {
  /** @example 3 */
  userId: number;
  /** @example "Carlos" */
  firstName?: string;
  /** @example "Mendoza" */
  lastName?: string;
  /** @example "Carlos Mendoza" */
  fullName?: string;
  /** @example "Consultor en transformacion digital para PYMES." */
  bio?: string;
  /** @example ["Tecnologia","Operaciones"] */
  specialties?: string[];
  /** @example ["Retail","Manufactura"] */
  sectors?: string[];
  /** @example "https://storage.example.com/consultants/photo.jpg" */
  photoUrl?: string;
  /** @example "https://storage.example.com/consultants/video.mp4" */
  videoUrl?: string;
  /** @example 150 */
  pricePerHour?: number;
  /** @default "true" */
  active?: "true" | "false";
  /** @default "false" */
  validated?: "true" | "false";
}

export interface ConsultantUpdateDto {
  /** @example 3 */
  userId?: number;
  /** @example "Carlos" */
  firstName?: string;
  /** @example "Mendoza" */
  lastName?: string;
  /** @example "Carlos Mendoza" */
  fullName?: string;
  /** @example "Consultor en transformacion digital para PYMES." */
  bio?: string;
  /** @example ["Tecnologia","Operaciones"] */
  specialties?: string[];
  /** @example ["Retail","Manufactura"] */
  sectors?: string[];
  /** @example "https://storage.example.com/consultants/photo.jpg" */
  photoUrl?: string;
  /** @example "https://storage.example.com/consultants/video.mp4" */
  videoUrl?: string;
  /** @example 150 */
  pricePerHour?: number;
  /** @default "true" */
  active?: "true" | "false";
  /** @default "false" */
  validated?: "true" | "false";
}

export interface TaskResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  meetingId: number | null;
  pymeId: number;
  consultantId: number | null;
  title: string;
  description: string;
  assignedTo: "pyme" | "consultor";
  priority: "alta" | "media" | "baja";
  status: "pendiente" | "en_progreso" | "completada" | "bloqueada";
  /** @format date-time */
  dueDate: string | null;
}

export interface MeetingResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  pymeId: number;
  consultantId: number;
  title: string;
  /** @format date-time */
  startTime: string;
  durationMinutes: number;
  meetingUrl: string | null;
  teamsOnlineMeetingId: string | null;
  status:
    | "solicitada"
    | "pago_pendiente"
    | "confirmada"
    | "finalizada"
    | "cancelada";
  requestedBy: "pyme" | "consultor";
  description: string | null;
  /** @format date-time */
  completedAt: string | null;
  tasks?: TaskResultDto[];
}

export interface MeetingListDto {
  data: MeetingResultDto[];
  meta: PaginationMetaDto;
}

export interface MeetingCreateDto {
  /** @example 2 */
  pymeId: number;
  /** @example 3 */
  consultantId: number;
  /** @example "Sesion de diagnostico empresarial" */
  title: string;
  /**
   * @format date-time
   * @example "2026-05-10T15:00:00.000Z"
   */
  startTime: string;
  /** @example 60 */
  durationMinutes?: number;
  /** @example "Revisar objetivos, contexto y dudas principales para la sesion." */
  description?: string;
  /** @default "pyme" */
  requestedBy?: "pyme" | "consultor";
}

export interface MeetingTeamsJoinDto {
  /** @example "Maria Torres" */
  displayName?: string;
}

export interface MeetingTeamsJoinResponseDto {
  /** @example 12 */
  meetingId: number;
  /** @example "https://teams.microsoft.com/l/meetup-join/..." */
  meetingUrl: string;
  /** @example "8:acs:00000000-0000-0000-0000-000000000000_00000000-0000-0000-0000-000000000000" */
  acsUserId: string;
  /** @example "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..." */
  token: string;
  /**
   * @format date-time
   * @example "2026-05-19T18:30:00.000Z"
   */
  expiresOn: string;
  /** @example "Maria Torres" */
  displayName?: string;
}

export interface MeetingRecordingOrganizerUserDto {
  id: string;
  displayName: string | null;
  userIdentityType: string;
  tenantId: string;
}

export interface MeetingRecordingOrganizerDto {
  application: object | null;
  device: object | null;
  user: MeetingRecordingOrganizerUserDto | null;
}

export interface MeetingRecordingDto {
  id: string;
  meetingId: string;
  callId: string;
  contentCorrelationId: string;
  /** @format date-time */
  createdDateTime: string;
  /** @format date-time */
  endDateTime: string;
  recordingContentUrl: string;
  /** OneDrive/SharePoint browser URL for the recording file. It can still require Microsoft sign-in. */
  webUrl: string | null;
  /** Anonymous read-only sharing URL for the recording file, when tenant sharing policy allows it. */
  publicUrl: string | null;
  /** Short-lived preauthenticated download URL generated by Microsoft Graph for immediate playback. */
  downloadUrl: string | null;
  driveId: string | null;
  driveItemId: string | null;
  fileName: string | null;
  meetingOrganizer: MeetingRecordingOrganizerDto | null;
}

export interface TaskSuggestionDto {
  /** Título accionable de la tarea sugerida */
  title: string;
  /** Descripción detallada de la tarea */
  description: string;
  /** Responsable asignado */
  assignedTo: "pyme" | "consultor";
  /** Prioridad de la tarea */
  priority: "alta" | "media" | "baja";
  /**
   * Fecha límite sugerida en formato YYYY-MM-DD
   * @example "2026-06-15"
   */
  dueDate?: string;
}

export interface MeetingCopilotSummaryDto {
  /** Acta de reunion estructurada en Markdown */
  summary: string;
  /** Listado de compromisos sugeridos para la PYME */
  tasks: TaskSuggestionDto[];
}

export interface MeetingUpdateDto {
  /** @example "Sesion de diagnostico empresarial" */
  title?: string;
  /**
   * @format date-time
   * @example "2026-05-10T15:00:00.000Z"
   */
  startTime?: string;
  /** @example 60 */
  durationMinutes?: number;
  /** @example "Revisar objetivos, contexto y dudas principales para la sesion." */
  description?: string;
  status?:
    | "solicitada"
    | "pago_pendiente"
    | "confirmada"
    | "finalizada"
    | "cancelada";
}

export interface MeetingFinalizeTaskDto {
  /** @example "Preparar propuesta de optimizacion" */
  title: string;
  /** @example "Detallar alcance, tiempos y siguientes pasos." */
  description: string;
  /** @example "consultor" */
  assignedTo: "pyme" | "consultor";
  /** @example "media" */
  priority: "alta" | "media" | "baja";
  /** @example "2026-05-23T00:00:00.000Z" */
  dueDate?: string;
}

export interface MeetingFinalizeDto {
  /**
   * Acta completa en formato Markdown.
   * @example "## Resumen
   * Se reviso el estado actual del negocio.
   *
   * ## Acuerdos
   * - El consultor preparara una propuesta."
   */
  description: string;
  tasks?: MeetingFinalizeTaskDto[];
}

export interface MeetingFinalizeResultDto {
  meeting: MeetingResultDto;
  tasks: TaskResultDto[];
}

export interface HubsmeAiRunDto {
  /** Texto de la transcripción a procesar */
  text: string;
  /** Instrucciones o prompt opcional para el modelo de IA */
  prompt?: string;
}

export interface HubsmeAiResultDto {
  /** Acta de reunion estructurada en Markdown */
  summary: string;
  /** Listado de compromisos sugeridos para la PYME */
  tasks: TaskSuggestionDto[];
}

export interface ConsultantAvailabilityResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  consultantId: number;
  /**
   * @format date
   * @example "2026-06-01"
   */
  month: string;
  /** @example {"23":["08:00","08:30"]} */
  availableSchedule: Record<string, string[]>;
}

export interface ConsultantAvailabilityListDto {
  data: ConsultantAvailabilityResultDto[];
  meta: PaginationMetaDto;
}

export interface ConsultantAvailabilityMonthDto {
  data: ConsultantAvailabilityResultDto[];
}

export interface ConsultantAvailabilityCreateDto {
  /** @example 3 */
  consultantId: number;
  /**
   * @format date
   * @example "2026-06-01"
   */
  month: string;
  /**
   * Dias del mes con horas disponibles en bloques de 30 minutos. Cada hora representa el inicio del bloque.
   * @example {"23":["08:00","08:30"]}
   */
  availableSchedule: Record<string, string[]>;
}

export interface ConsultantAvailabilityReplaceMonthDto {
  /** @example 3 */
  consultantId: number;
  /** @example 2026 */
  year: number;
  /** @example 6 */
  month: number;
  /**
   * Dias del mes con horas disponibles en bloques de 30 minutos. Cada hora representa el inicio del bloque.
   * @example {"23":["08:00","08:30"]}
   */
  availableSchedule: Record<string, string[]>;
}

export interface ConsultantAvailabilityUpdateDto {
  /** @example 3 */
  consultantId?: number;
  /**
   * @format date
   * @example "2026-06-01"
   */
  month?: string;
  /**
   * Dias del mes con horas disponibles en bloques de 30 minutos. Cada hora representa el inicio del bloque.
   * @example {"23":["08:00","08:30"]}
   */
  availableSchedule?: Record<string, string[]>;
}

export interface ConsultantGoogleCalendarAuthUrlResponseDto {
  /** @example "https://accounts.google.com/o/oauth2/v2/auth?..." */
  url: string;
}

export interface ConsultantGoogleCalendarStatusDto {
  /** @example true */
  connected: boolean;
  /** @example "consultor@gmail.com" */
  googleEmail: string | null;
  /** @example "primary" */
  googleCalendarId: string | null;
  /**
   * @format date-time
   * @example "2026-06-11T15:00:00.000Z"
   */
  connectedAt: string | null;
}

export interface ConsultantGoogleCalendarBusyItemDto {
  /** @example "google-calendar-event-id" */
  id: string;
  /** @example "Reunion privada" */
  summary: string | null;
  /**
   * @format date-time
   * @example "2026-06-11T14:00:00.000Z"
   */
  startTime: string;
  /**
   * @format date-time
   * @example "2026-06-11T15:00:00.000Z"
   */
  endTime: string;
  /** @example "google-calendar" */
  source: string;
}

export interface ConsultantGoogleCalendarBusyMonthResponseDto {
  data: ConsultantGoogleCalendarBusyItemDto[];
}

export interface TaskListDto {
  data: TaskResultDto[];
  meta: PaginationMetaDto;
}

export interface TaskCreateDto {
  /** @example 1 */
  meetingId?: number;
  /** @example 2 */
  pymeId: number;
  /** @example 3 */
  consultantId?: number;
  /** @example "Implementar CRM de ventas" */
  title: string;
  /** @example "Configurar pipeline comercial y migrar la base de datos actual." */
  description: string;
  /** @default "pyme" */
  assignedTo: "pyme" | "consultor";
  /** @default "media" */
  priority: "alta" | "media" | "baja";
  /** @default "pendiente" */
  status?: "pendiente" | "en_progreso" | "completada" | "bloqueada";
  /**
   * @format date-time
   * @example "2026-05-20T00:00:00.000Z"
   */
  dueDate?: string;
}

export interface TaskUpdateDto {
  /** @example 1 */
  meetingId?: number;
  /** @example 2 */
  pymeId?: number;
  /** @example 3 */
  consultantId?: number;
  /** @example "Implementar CRM de ventas" */
  title?: string;
  /** @example "Configurar pipeline comercial y migrar la base de datos actual." */
  description?: string;
  /** @default "pyme" */
  assignedTo?: "pyme" | "consultor";
  /** @default "media" */
  priority?: "alta" | "media" | "baja";
  /** @default "pendiente" */
  status?: "pendiente" | "en_progreso" | "completada" | "bloqueada";
  /**
   * @format date-time
   * @example "2026-05-20T00:00:00.000Z"
   */
  dueDate?: string;
}

export interface TaskStatusDto {
  status: "pendiente" | "en_progreso" | "completada" | "bloqueada";
}

export interface DiagnosticAreaDto {
  area: string;
  puntaje: number;
  estado: string;
  hallazgo: string;
}

export interface DiagnosticProblemDto {
  problema: string;
  impacto: string;
  urgencia: "alta" | "media" | "baja";
}

export interface DiagnosticRecommendationDto {
  accion: string;
  beneficioEsperado: string;
  plazo: string;
  prioridad: "alta" | "media" | "baja";
}

export interface DiagnosticPayloadDto {
  resumenEjecutivo: string;
  puntajeGeneral: number;
  feedbackIa: string;
  areasEvaluadas: DiagnosticAreaDto[];
  problemasCriticos: DiagnosticProblemDto[];
  recomendaciones: DiagnosticRecommendationDto[];
  proximosPasos: string[];
}

export interface DiagnosticResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  pymeId: number;
  responses: object;
  result: DiagnosticPayloadDto;
  score: number;
  summary: string;
}

export interface DiagnosticListDto {
  data: DiagnosticResultDto[];
  meta: PaginationMetaDto;
}

export interface DiagnosticGenerateDto {
  /** @example 2 */
  pymeId: number;
  /** @example {"name":"Textiles del Sur SAC","sector":"Manufactura"} */
  pymeData?: object;
  /** @example {"revenue":"600000","techLevel":6,"challenges":"Falta de liquidez"} */
  responses: object;
}

export interface DiagnosticDocumentResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  diagnosticId: number;
  pymeId: number;
  title: string;
  type: "informe" | "plan_accion" | "respuestas";
  content: string;
}

export interface DiagnosticDocumentListDto {
  data: DiagnosticDocumentResultDto[];
  meta: PaginationMetaDto;
}

export interface PlanResultDto {
  id: "free" | "basic" | "pro" | "expert";
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface SubscriptionResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  userId: number;
  plan: "free" | "basic" | "pro" | "expert";
  status: "active" | "paused" | "cancelled" | "expired";
  /** @format date-time */
  startedAt: string;
  /** @format date-time */
  expiresAt: string | null;
}

export interface SubscriptionListDto {
  data: SubscriptionResultDto[];
  meta: PaginationMetaDto;
}

export interface SubscriptionUpsertDto {
  /** @example 3 */
  userId: number;
  plan: "free" | "basic" | "pro" | "expert";
  /** @default "active" */
  status?: "active" | "paused" | "cancelled" | "expired";
  /**
   * @format date-time
   * @example "2026-06-04T00:00:00.000Z"
   */
  expiresAt?: string;
}

export interface DashboardStatsDto {
  clients: number;
  meetings: number;
  tasks: number;
  diagnostics: number;
  billableHours: number;
}

export interface DashboardTaskStatusDto {
  pendiente: number;
  enProgreso: number;
  completada: number;
  bloqueada: number;
}

export interface DashboardMeetingDto {
  id: number;
  title: string;
  /** @format date-time */
  startTime: string;
  status: string;
}

export interface DashboardWorkloadClientDto {
  pymeId: number;
  name: string;
  total: number;
  completed: number;
}

export interface DashboardAlertDto {
  id: number;
  client: string;
  message: string;
  tone: "danger" | "warning" | "info";
}

export interface DashboardResponseDto {
  stats: DashboardStatsDto;
  taskStatus: DashboardTaskStatusDto;
  upcomingMeetings: DashboardMeetingDto[];
  workloadByClient: DashboardWorkloadClientDto[];
  alerts: DashboardAlertDto[];
}

export interface StorageResultDto {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  resourceType: string;
  createdAt: string;
}

export interface MercadoPagoAuthUrlResponseDto {
  /** @example "https://auth.mercadopago.com/authorization?..." */
  url: string;
}

export interface MercadoPagoStatusDto {
  /** @example true */
  connected: boolean;
  /** @example "123456789" */
  mercadoPagoUserId: string | null;
  /** @example "consultor_mp" */
  nickname: string | null;
  /** @example "consultor@mail.com" */
  email: string | null;
  /**
   * @format date-time
   * @example "2026-06-17T15:00:00.000Z"
   */
  connectedAt: string | null;
}

export interface MercadoPagoCreateCheckoutDto {
  /** @example 3 */
  consultantId: number;
  /** @example "2026-05-10T15:00:00.000Z" */
  startTime: string;
  /** @example 60 */
  durationMinutes?: number;
  /** @example "Sesión de consultoría" */
  title: string;
  /** @example "Detalle de la reunión" */
  description?: string;
}

export interface CheckoutMeetingDetailsDto {
  startTime: string;
  durationMinutes: number;
  title: string;
  description?: string;
}

export interface MercadoPagoCheckoutDto {
  id: number;
  meetingId: number | null;
  pymeId: number;
  consultantId: number;
  preferenceId: string | null;
  initPoint: string | null;
  sandboxInitPoint: string | null;
  externalReference: string;
  status:
    | "created"
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
    | "expired";
  amount: string;
  marketplaceFee: string;
  currency: string;
  meetingDetails?: CheckoutMeetingDetailsDto | null;
}

export interface MercadoPagoPaymentWebhookDto {
  /** @example "payment" */
  type?: string;
  /** @example "payment" */
  topic?: string;
  /** @example {"id":"123456789"} */
  data?: object;
  /** @example "123456789" */
  id?: string;
}

export interface PublicConsultantListItemDto {
  id: number;
  userId: number;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  specialties: string[];
  sectors: string[];
  photoUrl: string | null;
  videoUrl: string | null;
  pricePerHour: string;
  rating: string;
  totalReviews: number;
  active: "true" | "false";
  /** @format date-time */
  createdAt: string;
}

export interface PublicConsultantListDto {
  data: PublicConsultantListItemDto[];
  meta: PaginationMetaDto;
}

export type AppGetHelloData = any;

export type AuthLoginData = LoginResponseDto;

export type AuthLoginError = HttpErrorDto;

export type AuthRegisterData = LoginResponseDto;

export type AuthRegisterError = HttpErrorDto;

export interface AuthGoogleUrlParams {
  /** @default "login" */
  flow?: "login" | "register";
  /** @default "pyme" */
  role?: "pyme" | "consultor";
}

export type AuthGoogleUrlData = GoogleAuthUrlResponseDto;

export type AuthGoogleUrlError = HttpErrorDto;

export interface AuthGoogleCallbackParams {
  code?: string;
  state?: string;
  error?: string;
}

export type AuthGoogleCallbackData = any;

export type AuthGetProfileData = any;

export type AuthGetProfileError = HttpErrorDto;

export interface UserFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by name or email */
  search?: string;
  role?: "admin" | "pyme" | "consultor";
  isActive?: "true" | "false";
}

export type UserFindAllData = UserListDto;

export type UserFindAllError = HttpErrorDto;

export interface UserFindOneParams {
  id: number;
}

export type UserFindOneData = UserResultDto;

export type UserFindOneError = HttpErrorDto;

export type UserCreateData = UserResultDto;

export type UserCreateError = HttpErrorDto;

export interface UserUpdateParams {
  id: number;
}

export type UserUpdateData = UserResultDto;

export type UserUpdateError = HttpErrorDto;

export interface UserRemoveParams {
  id: number;
}

export type UserRemoveData = UserResultDto;

export type UserRemoveError = HttpErrorDto;

export interface PymeFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by business name or RUC */
  search?: string;
  /** Filter by sector */
  sector?: string;
}

export type PymeFindAllData = PymeListDto;

export type PymeFindAllError = HttpErrorDto;

export interface PymeFindOneParams {
  id: number;
}

export type PymeFindOneData = PymeResultDto;

export type PymeFindOneError = HttpErrorDto;

export interface PymeFindByUserParams {
  userId: number;
}

export type PymeFindByUserData = PymeResultDto;

export type PymeFindByUserError = HttpErrorDto;

export type PymeCreateData = PymeResultDto;

export type PymeCreateError = HttpErrorDto;

export interface PymeUpdateParams {
  id: number;
}

export type PymeUpdateData = PymeResultDto;

export type PymeUpdateError = HttpErrorDto;

export interface PymeRemoveParams {
  id: number;
}

export type PymeRemoveData = PymeResultDto;

export type PymeRemoveError = HttpErrorDto;

export interface ConsultantFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by name, bio or specialty */
  search?: string;
  active?: "true" | "false";
  validated?: "true" | "false";
  /** Filter by sector */
  sector?: string;
}

export type ConsultantFindAllData = ConsultantListDto;

export type ConsultantFindAllError = HttpErrorDto;

export interface ConsultantMeetingPymesParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by business name or RUC */
  search?: string;
  /** Filter by sector */
  sector?: string;
}

export type ConsultantMeetingPymesData = PymeListDto;

export type ConsultantMeetingPymesError = HttpErrorDto;

export interface ConsultantFindOneParams {
  id: number;
}

export type ConsultantFindOneData = ConsultantResultDto;

export type ConsultantFindOneError = HttpErrorDto;

export interface ConsultantFindByUserParams {
  userId: number;
}

export type ConsultantFindByUserData = ConsultantResultDto;

export type ConsultantFindByUserError = HttpErrorDto;

export type ConsultantCreateData = ConsultantResultDto;

export type ConsultantCreateError = HttpErrorDto;

export interface ConsultantUpdateParams {
  id: number;
}

export type ConsultantUpdateData = ConsultantResultDto;

export type ConsultantUpdateError = HttpErrorDto;

export interface ConsultantRemoveParams {
  id: number;
}

export type ConsultantRemoveData = ConsultantResultDto;

export type ConsultantRemoveError = HttpErrorDto;

export interface MeetingFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by title */
  search?: string;
  /** @example 2 */
  pymeId?: number;
  /** @example 3 */
  consultantId?: number;
  status?:
    | "solicitada"
    | "pago_pendiente"
    | "confirmada"
    | "finalizada"
    | "cancelada";
}

export type MeetingFindAllData = MeetingListDto;

export type MeetingFindAllError = HttpErrorDto;

export interface MeetingFindOneParams {
  id: number;
}

export type MeetingFindOneData = MeetingResultDto;

export type MeetingFindOneError = HttpErrorDto;

export type MeetingCreateData = MeetingResultDto;

export type MeetingCreateError = HttpErrorDto;

export interface MeetingConfirmParams {
  id: number;
}

export type MeetingConfirmData = MeetingResultDto;

export type MeetingConfirmError = HttpErrorDto;

export interface MeetingCreateTeamsJoinTokenParams {
  id: number;
}

export type MeetingCreateTeamsJoinTokenData = MeetingTeamsJoinResponseDto;

export type MeetingCreateTeamsJoinTokenError = HttpErrorDto;

export interface MeetingGetRecordingsParams {
  id: number;
}

export type MeetingGetRecordingsData = MeetingRecordingDto[];

export type MeetingGetRecordingsError = HttpErrorDto;

export interface MeetingGetCopilotSummaryParams {
  id: number;
}

export type MeetingGetCopilotSummaryData = MeetingCopilotSummaryDto;

export type MeetingGetCopilotSummaryError = HttpErrorDto;

export interface MeetingUpdateParams {
  id: number;
}

export type MeetingUpdateData = MeetingResultDto;

export type MeetingUpdateError = HttpErrorDto;

export interface MeetingFinalizeParams {
  id: number;
}

export type MeetingFinalizeData = MeetingFinalizeResultDto;

export type MeetingFinalizeError = HttpErrorDto;

export interface MeetingRemoveParams {
  id: number;
}

export type MeetingRemoveData = MeetingResultDto;

export type MeetingRemoveError = HttpErrorDto;

export type PowerautomateRunHubsmeAiData = HubsmeAiResultDto;

export type PowerautomateRunHubsmeAiError = HttpErrorDto;

export interface ConsultantAvailabilityFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** @example 3 */
  consultantId?: number;
  /**
   * @format date-time
   * @example "2026-06-01T00:00:00.000Z"
   */
  startFrom?: string;
  /**
   * @format date-time
   * @example "2026-06-30T23:59:59.999Z"
   */
  startTo?: string;
}

export type ConsultantAvailabilityFindAllData = ConsultantAvailabilityListDto;

export type ConsultantAvailabilityFindAllError = HttpErrorDto;

export interface ConsultantAvailabilityFindMonthParams {
  /** @example 3 */
  consultantId: number;
  /** @example 2026 */
  year: number;
  /** @example 6 */
  month: number;
}

export type ConsultantAvailabilityFindMonthData =
  ConsultantAvailabilityMonthDto;

export type ConsultantAvailabilityFindMonthError = HttpErrorDto;

export interface ConsultantAvailabilityVisibleMonthParams {
  /** @example 3 */
  consultantId: number;
  /** @example 2026 */
  year: number;
  /** @example 6 */
  month: number;
}

export type ConsultantAvailabilityVisibleMonthData =
  ConsultantAvailabilityMonthDto;

export type ConsultantAvailabilityVisibleMonthError = HttpErrorDto;

export interface ConsultantAvailabilityFindOneParams {
  id: number;
}

export type ConsultantAvailabilityFindOneData = ConsultantAvailabilityResultDto;

export type ConsultantAvailabilityFindOneError = HttpErrorDto;

export type ConsultantAvailabilityCreateData = ConsultantAvailabilityResultDto;

export type ConsultantAvailabilityCreateError = HttpErrorDto;

export type ConsultantAvailabilityReplaceMonthData =
  ConsultantAvailabilityMonthDto;

export type ConsultantAvailabilityReplaceMonthError = HttpErrorDto;

export interface ConsultantAvailabilityUpdateParams {
  id: number;
}

export type ConsultantAvailabilityUpdateData = ConsultantAvailabilityResultDto;

export type ConsultantAvailabilityUpdateError = HttpErrorDto;

export interface ConsultantAvailabilityRemoveParams {
  id: number;
}

export type ConsultantAvailabilityRemoveData = ConsultantAvailabilityResultDto;

export type ConsultantAvailabilityRemoveError = HttpErrorDto;

export interface ConsultantgooglecalendarAuthUrlParams {
  /** @example 3 */
  consultantId: number;
}

export type ConsultantgooglecalendarAuthUrlData =
  ConsultantGoogleCalendarAuthUrlResponseDto;

export type ConsultantgooglecalendarAuthUrlError = HttpErrorDto;

export interface ConsultantgooglecalendarCallbackParams {
  code?: string;
  state?: string;
  error?: string;
}

export type ConsultantgooglecalendarCallbackData = any;

export interface ConsultantgooglecalendarStatusParams {
  /** @example 3 */
  consultantId: number;
}

export type ConsultantgooglecalendarStatusData =
  ConsultantGoogleCalendarStatusDto;

export type ConsultantgooglecalendarStatusError = HttpErrorDto;

export interface ConsultantgooglecalendarBusyMonthParams {
  /** @example 3 */
  consultantId: number;
  /** @example 2026 */
  year: number;
  /** @example 6 */
  month: number;
}

export type ConsultantgooglecalendarBusyMonthData =
  ConsultantGoogleCalendarBusyMonthResponseDto;

export type ConsultantgooglecalendarBusyMonthError = HttpErrorDto;

export interface ConsultantgooglecalendarDisconnectParams {
  /** @example 3 */
  consultantId: number;
}

export type ConsultantgooglecalendarDisconnectData =
  ConsultantGoogleCalendarStatusDto;

export type ConsultantgooglecalendarDisconnectError = HttpErrorDto;

export interface TaskFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by title */
  search?: string;
  /** @example 2 */
  pymeId?: number;
  /** @example 3 */
  consultantId?: number;
  assignedTo?: "pyme" | "consultor";
  priority?: "alta" | "media" | "baja";
  status?: "pendiente" | "en_progreso" | "completada" | "bloqueada";
}

export type TaskFindAllData = TaskListDto;

export type TaskFindAllError = HttpErrorDto;

export interface TaskFindOneParams {
  id: number;
}

export type TaskFindOneData = TaskResultDto;

export type TaskFindOneError = HttpErrorDto;

export type TaskCreateData = TaskResultDto;

export type TaskCreateError = HttpErrorDto;

export interface TaskUpdateParams {
  id: number;
}

export type TaskUpdateData = TaskResultDto;

export type TaskUpdateError = HttpErrorDto;

export interface TaskUpdateStatusParams {
  id: number;
}

export type TaskUpdateStatusData = TaskResultDto;

export type TaskUpdateStatusError = HttpErrorDto;

export interface TaskRemoveParams {
  id: number;
}

export type TaskRemoveData = TaskResultDto;

export type TaskRemoveError = HttpErrorDto;

export interface DiagnosticFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** @example 2 */
  pymeId?: number;
}

export type DiagnosticFindAllData = DiagnosticListDto;

export type DiagnosticFindAllError = HttpErrorDto;

export interface DiagnosticFindOneParams {
  id: number;
}

export type DiagnosticFindOneData = DiagnosticResultDto;

export type DiagnosticFindOneError = HttpErrorDto;

export type DiagnosticGenerateData = DiagnosticResultDto;

export type DiagnosticGenerateError = HttpErrorDto;

export interface DiagnosticRemoveParams {
  id: number;
}

export type DiagnosticRemoveData = DiagnosticResultDto;

export type DiagnosticRemoveError = HttpErrorDto;

export interface DiagnosticdocumentFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by title */
  search?: string;
  /** @example 1 */
  diagnosticId?: number;
  /** @example 2 */
  pymeId?: number;
  type?: "informe" | "plan_accion" | "respuestas";
}

export type DiagnosticdocumentFindAllData = DiagnosticDocumentListDto;

export type DiagnosticdocumentFindAllError = HttpErrorDto;

export interface DiagnosticdocumentFindOneParams {
  id: number;
}

export type DiagnosticdocumentFindOneData = DiagnosticDocumentResultDto;

export type DiagnosticdocumentFindOneError = HttpErrorDto;

export interface DiagnosticdocumentRemoveParams {
  id: number;
}

export type DiagnosticdocumentRemoveData = DiagnosticDocumentResultDto;

export type DiagnosticdocumentRemoveError = HttpErrorDto;

export type SubscriptionPlansData = PlanResultDto[];

export interface SubscriptionFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** @example 3 */
  userId?: number;
  plan?: "free" | "basic" | "pro" | "expert";
  status?: "active" | "paused" | "cancelled" | "expired";
}

export type SubscriptionFindAllData = SubscriptionListDto;

export type SubscriptionFindAllError = HttpErrorDto;

export interface SubscriptionFindOneParams {
  id: number;
}

export type SubscriptionFindOneData = SubscriptionResultDto;

export type SubscriptionFindOneError = HttpErrorDto;

export interface SubscriptionFindByUserParams {
  userId: number;
}

export type SubscriptionFindByUserData = SubscriptionResultDto;

export type SubscriptionFindByUserError = HttpErrorDto;

export type SubscriptionUpsertData = SubscriptionResultDto;

export type SubscriptionUpsertError = HttpErrorDto;

export interface DashboardSummaryParams {
  /** @example 3 */
  userId?: number;
  role?: "admin" | "pyme" | "consultor";
}

export type DashboardSummaryData = DashboardResponseDto;

export type DashboardSummaryError = HttpErrorDto;

export interface StorageUploadPayload {
  /** @format binary */
  file?: File;
}

export interface StorageUploadParams {
  folder: string;
}

export type StorageUploadData = StorageResultDto;

export interface StorageDeleteParams {
  publicId: string;
}

export type StorageDeleteData = any;

export interface StorageDownloadParams {
  path: string;
}

export type StorageDownloadData = any;

export interface MercadopagoAuthUrlParams {
  /** @example 3 */
  consultantId: number;
}

export type MercadopagoAuthUrlData = MercadoPagoAuthUrlResponseDto;

export type MercadopagoAuthUrlError = HttpErrorDto;

export interface MercadopagoCallbackParams {
  code?: string;
  state?: string;
  error?: string;
}

export type MercadopagoCallbackData = any;

export interface MercadopagoStatusParams {
  /** @example 3 */
  consultantId: number;
}

export type MercadopagoStatusData = MercadoPagoStatusDto;

export type MercadopagoStatusError = HttpErrorDto;

export interface MercadopagoDisconnectParams {
  /** @example 3 */
  consultantId: number;
}

export type MercadopagoDisconnectData = MercadoPagoStatusDto;

export type MercadopagoDisconnectError = HttpErrorDto;

export type MercadopagoCreateCheckoutData = MercadoPagoCheckoutDto;

export type MercadopagoCreateCheckoutError = HttpErrorDto;

export interface MercadopagoFindCheckoutParams {
  id: number;
}

export type MercadopagoFindCheckoutData = MercadoPagoCheckoutDto;

export type MercadopagoFindCheckoutError = HttpErrorDto;

export type MercadopagoWebhookData = any;

export interface PublicconsultantFindAllParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 10
   */
  limit?: number;
  /** Search by name, bio or specialty */
  search?: string;
  active?: "true" | "false";
  validated?: "true" | "false";
  /** Filter by sector */
  sector?: string;
}

export type PublicconsultantFindAllData = PublicConsultantListDto;

export namespace App {
  /**
   * No description
   * @tags App
   * @name AppGetHello
   * @request GET:/
   * @response `200` `AppGetHelloData`
   */
  export namespace AppGetHello {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AppGetHelloData;
  }
}

export namespace Auth {
  /**
   * No description
   * @tags auth
   * @name AuthLogin
   * @summary User login
   * @request POST:/auth/login
   * @response `200` `AuthLoginData`
   * @response `400` `HttpErrorDto`
   */
  export namespace AuthLogin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthLoginData;
  }

  /**
   * No description
   * @tags auth
   * @name AuthRegister
   * @summary Register a new PYME or consultant user
   * @request POST:/auth/register
   * @response `200` `AuthRegisterData`
   * @response `400` `HttpErrorDto`
   */
  export namespace AuthRegister {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthRegisterData;
  }

  /**
   * No description
   * @tags auth
   * @name AuthGoogleUrl
   * @summary Get Google OAuth URL generated by backend
   * @request GET:/auth/google/url
   * @response `200` `AuthGoogleUrlData`
   * @response `400` `HttpErrorDto`
   */
  export namespace AuthGoogleUrl {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @default "login" */
      flow?: "login" | "register";
      /** @default "pyme" */
      role?: "pyme" | "consultor";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AuthGoogleUrlData;
  }

  /**
   * No description
   * @tags auth
   * @name AuthGoogleCallback
   * @summary Google OAuth callback for popup login
   * @request GET:/auth/google/callback
   * @response `200` `AuthGoogleCallbackData` HTML response that posts the session to the opener window
   */
  export namespace AuthGoogleCallback {
    export type RequestParams = {};
    export type RequestQuery = {
      code?: string;
      state?: string;
      error?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AuthGoogleCallbackData;
  }

  /**
   * No description
   * @tags auth
   * @name AuthGetProfile
   * @summary Get current user profile
   * @request GET:/auth/profile
   * @secure
   * @response `200` `AuthGetProfileData` Returns current user information
   * @response `400` `HttpErrorDto`
   */
  export namespace AuthGetProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AuthGetProfileData;
  }
}

export namespace User {
  /**
   * No description
   * @tags user
   * @name UserFindAll
   * @summary Get all users paginated
   * @request GET:/admin/user/find-all
   * @secure
   * @response `200` `UserFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace UserFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by name or email */
      search?: string;
      role?: "admin" | "pyme" | "consultor";
      isActive?: "true" | "false";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserFindAllData;
  }

  /**
   * No description
   * @tags user
   * @name UserFindOne
   * @summary Get a user by ID
   * @request GET:/admin/user/find-one/{id}
   * @secure
   * @response `200` `UserFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace UserFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserFindOneData;
  }

  /**
   * No description
   * @tags user
   * @name UserCreate
   * @summary Create a new user
   * @request POST:/admin/user/create
   * @secure
   * @response `200` `UserCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace UserCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = UserCreateData;
  }

  /**
   * No description
   * @tags user
   * @name UserUpdate
   * @summary Update a user
   * @request PATCH:/admin/user/update/{id}
   * @secure
   * @response `200` `UserUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace UserUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UserUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = UserUpdateData;
  }

  /**
   * No description
   * @tags user
   * @name UserRemove
   * @summary Soft-delete a user
   * @request DELETE:/admin/user/delete/{id}
   * @secure
   * @response `200` `UserRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace UserRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserRemoveData;
  }
}

export namespace Pyme {
  /**
   * No description
   * @tags pyme
   * @name PymeFindAll
   * @summary Get all PYMEs paginated
   * @request GET:/admin/pyme/find-all
   * @secure
   * @response `200` `PymeFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by business name or RUC */
      search?: string;
      /** Filter by sector */
      sector?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeFindAllData;
  }

  /**
   * No description
   * @tags pyme
   * @name PymeFindOne
   * @summary Get a PYME profile by ID
   * @request GET:/admin/pyme/find-one/{id}
   * @secure
   * @response `200` `PymeFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeFindOneData;
  }

  /**
   * No description
   * @tags pyme
   * @name PymeFindByUser
   * @summary Get a PYME profile by user ID
   * @request GET:/admin/pyme/find-by-user/{userId}
   * @secure
   * @response `200` `PymeFindByUserData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeFindByUser {
    export type RequestParams = {
      userId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeFindByUserData;
  }

  /**
   * No description
   * @tags pyme
   * @name PymeCreate
   * @summary Create a new PYME profile
   * @request POST:/admin/pyme/create
   * @secure
   * @response `200` `PymeCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PymeCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PymeCreateData;
  }

  /**
   * No description
   * @tags pyme
   * @name PymeUpdate
   * @summary Update a PYME profile
   * @request PATCH:/admin/pyme/update/{id}
   * @secure
   * @response `200` `PymeUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PymeUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PymeUpdateData;
  }

  /**
   * No description
   * @tags pyme
   * @name PymeRemove
   * @summary Soft-delete a PYME profile
   * @request DELETE:/admin/pyme/delete/{id}
   * @secure
   * @response `200` `PymeRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeRemoveData;
  }
}

export namespace Consultant {
  /**
   * No description
   * @tags consultant
   * @name ConsultantFindAll
   * @summary Get all consultants paginated
   * @request GET:/admin/consultant/find-all
   * @secure
   * @response `200` `ConsultantFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by name, bio or specialty */
      search?: string;
      active?: "true" | "false";
      validated?: "true" | "false";
      /** Filter by sector */
      sector?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantFindAllData;
  }

  /**
   * No description
   * @tags consultant
   * @name ConsultantMeetingPymes
   * @summary Get PYMEs with at least one meeting with current consultant
   * @request GET:/admin/consultant/meeting-pymes
   * @secure
   * @response `200` `ConsultantMeetingPymesData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantMeetingPymes {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by business name or RUC */
      search?: string;
      /** Filter by sector */
      sector?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantMeetingPymesData;
  }

  /**
   * No description
   * @tags consultant
   * @name ConsultantFindOne
   * @summary Get a consultant profile by ID
   * @request GET:/admin/consultant/find-one/{id}
   * @secure
   * @response `200` `ConsultantFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantFindOneData;
  }

  /**
   * No description
   * @tags consultant
   * @name ConsultantFindByUser
   * @summary Get a consultant profile by user ID
   * @request GET:/admin/consultant/find-by-user/{userId}
   * @secure
   * @response `200` `ConsultantFindByUserData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantFindByUser {
    export type RequestParams = {
      userId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantFindByUserData;
  }

  /**
   * No description
   * @tags consultant
   * @name ConsultantCreate
   * @summary Create a new consultant profile
   * @request POST:/admin/consultant/create
   * @secure
   * @response `200` `ConsultantCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConsultantCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantCreateData;
  }

  /**
   * No description
   * @tags consultant
   * @name ConsultantUpdate
   * @summary Update a consultant profile
   * @request PATCH:/admin/consultant/update/{id}
   * @secure
   * @response `200` `ConsultantUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsultantUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantUpdateData;
  }

  /**
   * No description
   * @tags consultant
   * @name ConsultantRemove
   * @summary Soft-delete a consultant profile
   * @request DELETE:/admin/consultant/delete/{id}
   * @secure
   * @response `200` `ConsultantRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantRemoveData;
  }
}

export namespace Meeting {
  /**
   * No description
   * @tags meeting
   * @name MeetingFindAll
   * @summary Get all meetings paginated
   * @request GET:/admin/meeting/find-all
   * @secure
   * @response `200` `MeetingFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by title */
      search?: string;
      /** @example 2 */
      pymeId?: number;
      /** @example 3 */
      consultantId?: number;
      status?:
        | "solicitada"
        | "pago_pendiente"
        | "confirmada"
        | "finalizada"
        | "cancelada";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingFindAllData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingFindOne
   * @summary Get a meeting by ID
   * @request GET:/admin/meeting/find-one/{id}
   * @secure
   * @response `200` `MeetingFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingFindOneData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingCreate
   * @summary Create a new meeting
   * @request POST:/admin/meeting/create
   * @secure
   * @response `200` `MeetingCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MeetingCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingCreateData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingConfirm
   * @summary Confirm a requested meeting and create its Teams meeting URL internally
   * @request POST:/admin/meeting/confirm/{id}
   * @secure
   * @response `200` `MeetingConfirmData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingConfirm {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingConfirmData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingCreateTeamsJoinToken
   * @summary Create an anonymous ACS token to join a Teams meeting inside the app
   * @request POST:/admin/meeting/teams-join/{id}
   * @secure
   * @response `200` `MeetingCreateTeamsJoinTokenData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingCreateTeamsJoinToken {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MeetingTeamsJoinDto;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingCreateTeamsJoinTokenData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingGetRecordings
   * @summary List Microsoft Graph recordings for a meeting
   * @request GET:/admin/meeting/recordings/{id}
   * @secure
   * @response `200` `MeetingGetRecordingsData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingGetRecordings {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingGetRecordingsData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingGetCopilotSummary
   * @summary Get Hubsme AI insights (summary & action tasks) for a meeting
   * @request GET:/admin/meeting/hubsme-ai/{id}
   * @secure
   * @response `200` `MeetingGetCopilotSummaryData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingGetCopilotSummary {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingGetCopilotSummaryData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingUpdate
   * @summary Update a meeting
   * @request PATCH:/admin/meeting/update/{id}
   * @secure
   * @response `200` `MeetingUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MeetingUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingUpdateData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingFinalize
   * @summary Finalize meeting, save markdown minutes and create follow-up tasks
   * @request POST:/admin/meeting/finalize/{id}
   * @secure
   * @response `200` `MeetingFinalizeData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingFinalize {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MeetingFinalizeDto;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingFinalizeData;
  }

  /**
   * No description
   * @tags meeting
   * @name MeetingRemove
   * @summary Soft-delete a meeting
   * @request DELETE:/admin/meeting/delete/{id}
   * @secure
   * @response `200` `MeetingRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingRemoveData;
  }
}

export namespace Powerautomate {
  /**
   * No description
   * @tags powerautomate
   * @name PowerautomateRunHubsmeAi
   * @summary Ejecutar flujo de Power Automate para obtener resumen y tareas sugeridas
   * @request POST:/admin/powerautomate/hubsme-ai
   * @secure
   * @response `201` `PowerautomateRunHubsmeAiData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PowerautomateRunHubsmeAi {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = HubsmeAiRunDto;
    export type RequestHeaders = {};
    export type ResponseBody = PowerautomateRunHubsmeAiData;
  }
}

export namespace ConsultantAvailability {
  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityFindAll
   * @summary Get consultant availability months paginated
   * @request GET:/admin/consultant-availability/find-all
   * @secure
   * @response `200` `ConsultantAvailabilityFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** @example 3 */
      consultantId?: number;
      /**
       * @format date-time
       * @example "2026-06-01T00:00:00.000Z"
       */
      startFrom?: string;
      /**
       * @format date-time
       * @example "2026-06-30T23:59:59.999Z"
       */
      startTo?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityFindAllData;
  }

  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityFindMonth
   * @summary Get consultant availability for a month
   * @request GET:/admin/consultant-availability/find-month
   * @secure
   * @response `200` `ConsultantAvailabilityFindMonthData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityFindMonth {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
      /** @example 2026 */
      year: number;
      /** @example 6 */
      month: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityFindMonthData;
  }

  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityVisibleMonth
   * @summary Get consultant availability visible for PYMES in a month
   * @request GET:/admin/consultant-availability/visible-month
   * @secure
   * @response `200` `ConsultantAvailabilityVisibleMonthData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityVisibleMonth {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
      /** @example 2026 */
      year: number;
      /** @example 6 */
      month: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityVisibleMonthData;
  }

  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityFindOne
   * @summary Get a consultant availability month by ID
   * @request GET:/admin/consultant-availability/find-one/{id}
   * @secure
   * @response `200` `ConsultantAvailabilityFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityFindOneData;
  }

  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityCreate
   * @summary Create a consultant availability month
   * @request POST:/admin/consultant-availability/create
   * @secure
   * @response `200` `ConsultantAvailabilityCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConsultantAvailabilityCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityCreateData;
  }

  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityReplaceMonth
   * @summary Replace consultant availability for a month
   * @request POST:/admin/consultant-availability/replace-month
   * @secure
   * @response `200` `ConsultantAvailabilityReplaceMonthData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityReplaceMonth {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConsultantAvailabilityReplaceMonthDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityReplaceMonthData;
  }

  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityUpdate
   * @summary Update a consultant availability month
   * @request PATCH:/admin/consultant-availability/update/{id}
   * @secure
   * @response `200` `ConsultantAvailabilityUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsultantAvailabilityUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityUpdateData;
  }

  /**
   * No description
   * @tags consultant-availability
   * @name ConsultantAvailabilityRemove
   * @summary Soft-delete a consultant availability month
   * @request DELETE:/admin/consultant-availability/delete/{id}
   * @secure
   * @response `200` `ConsultantAvailabilityRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantAvailabilityRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantAvailabilityRemoveData;
  }
}

export namespace ConsultantGoogleCalendar {
  /**
   * No description
   * @tags consultantGoogleCalendar
   * @name ConsultantgooglecalendarAuthUrl
   * @summary Get Google Calendar OAuth URL for a consultant
   * @request GET:/admin/consultant-google-calendar/auth-url
   * @secure
   * @response `200` `ConsultantgooglecalendarAuthUrlData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantgooglecalendarAuthUrl {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantgooglecalendarAuthUrlData;
  }

  /**
   * No description
   * @tags consultantGoogleCalendar
   * @name ConsultantgooglecalendarCallback
   * @summary Google Calendar OAuth callback for consultant connection
   * @request GET:/admin/consultant-google-calendar/callback
   * @response `200` `ConsultantgooglecalendarCallbackData` HTML response that posts the connection result to the opener window
   */
  export namespace ConsultantgooglecalendarCallback {
    export type RequestParams = {};
    export type RequestQuery = {
      code?: string;
      state?: string;
      error?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantgooglecalendarCallbackData;
  }

  /**
   * No description
   * @tags consultantGoogleCalendar
   * @name ConsultantgooglecalendarStatus
   * @summary Get consultant Google Calendar connection status
   * @request GET:/admin/consultant-google-calendar/status
   * @secure
   * @response `200` `ConsultantgooglecalendarStatusData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantgooglecalendarStatus {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantgooglecalendarStatusData;
  }

  /**
   * No description
   * @tags consultantGoogleCalendar
   * @name ConsultantgooglecalendarBusyMonth
   * @summary Get busy events from consultant Google Calendar for a month
   * @request GET:/admin/consultant-google-calendar/busy-month
   * @secure
   * @response `200` `ConsultantgooglecalendarBusyMonthData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantgooglecalendarBusyMonth {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
      /** @example 2026 */
      year: number;
      /** @example 6 */
      month: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantgooglecalendarBusyMonthData;
  }

  /**
   * No description
   * @tags consultantGoogleCalendar
   * @name ConsultantgooglecalendarDisconnect
   * @summary Disconnect consultant Google Calendar account
   * @request DELETE:/admin/consultant-google-calendar/disconnect
   * @secure
   * @response `200` `ConsultantgooglecalendarDisconnectData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantgooglecalendarDisconnect {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantgooglecalendarDisconnectData;
  }
}

export namespace Task {
  /**
   * No description
   * @tags task
   * @name TaskFindAll
   * @summary Get all tasks paginated
   * @request GET:/admin/task/find-all
   * @secure
   * @response `200` `TaskFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace TaskFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by title */
      search?: string;
      /** @example 2 */
      pymeId?: number;
      /** @example 3 */
      consultantId?: number;
      assignedTo?: "pyme" | "consultor";
      priority?: "alta" | "media" | "baja";
      status?: "pendiente" | "en_progreso" | "completada" | "bloqueada";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TaskFindAllData;
  }

  /**
   * No description
   * @tags task
   * @name TaskFindOne
   * @summary Get a task by ID
   * @request GET:/admin/task/find-one/{id}
   * @secure
   * @response `200` `TaskFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace TaskFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TaskFindOneData;
  }

  /**
   * No description
   * @tags task
   * @name TaskCreate
   * @summary Create a new task
   * @request POST:/admin/task/create
   * @secure
   * @response `200` `TaskCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace TaskCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TaskCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = TaskCreateData;
  }

  /**
   * No description
   * @tags task
   * @name TaskUpdate
   * @summary Update a task
   * @request PATCH:/admin/task/update/{id}
   * @secure
   * @response `200` `TaskUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace TaskUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = TaskUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = TaskUpdateData;
  }

  /**
   * No description
   * @tags task
   * @name TaskUpdateStatus
   * @summary Update only the task status
   * @request PATCH:/admin/task/update-status/{id}
   * @secure
   * @response `200` `TaskUpdateStatusData`
   * @response `400` `HttpErrorDto`
   */
  export namespace TaskUpdateStatus {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = TaskStatusDto;
    export type RequestHeaders = {};
    export type ResponseBody = TaskUpdateStatusData;
  }

  /**
   * No description
   * @tags task
   * @name TaskRemove
   * @summary Soft-delete a task
   * @request DELETE:/admin/task/delete/{id}
   * @secure
   * @response `200` `TaskRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace TaskRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TaskRemoveData;
  }
}

export namespace Diagnostic {
  /**
   * No description
   * @tags diagnostic
   * @name DiagnosticFindAll
   * @summary Get all diagnostics paginated
   * @request GET:/admin/diagnostic/find-all
   * @secure
   * @response `200` `DiagnosticFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DiagnosticFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** @example 2 */
      pymeId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DiagnosticFindAllData;
  }

  /**
   * No description
   * @tags diagnostic
   * @name DiagnosticFindOne
   * @summary Get a diagnostic by ID
   * @request GET:/admin/diagnostic/find-one/{id}
   * @secure
   * @response `200` `DiagnosticFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DiagnosticFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DiagnosticFindOneData;
  }

  /**
   * No description
   * @tags diagnostic
   * @name DiagnosticGenerate
   * @summary Generate and persist a PYME diagnostic
   * @request POST:/admin/diagnostic/generate
   * @secure
   * @response `200` `DiagnosticGenerateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DiagnosticGenerate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DiagnosticGenerateDto;
    export type RequestHeaders = {};
    export type ResponseBody = DiagnosticGenerateData;
  }

  /**
   * No description
   * @tags diagnostic
   * @name DiagnosticRemove
   * @summary Soft-delete a diagnostic
   * @request DELETE:/admin/diagnostic/delete/{id}
   * @secure
   * @response `200` `DiagnosticRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DiagnosticRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DiagnosticRemoveData;
  }
}

export namespace DiagnosticDocument {
  /**
   * No description
   * @tags diagnosticDocument
   * @name DiagnosticdocumentFindAll
   * @summary Get all diagnostic documents paginated
   * @request GET:/admin/diagnostic-document/find-all
   * @secure
   * @response `200` `DiagnosticdocumentFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DiagnosticdocumentFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by title */
      search?: string;
      /** @example 1 */
      diagnosticId?: number;
      /** @example 2 */
      pymeId?: number;
      type?: "informe" | "plan_accion" | "respuestas";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DiagnosticdocumentFindAllData;
  }

  /**
   * No description
   * @tags diagnosticDocument
   * @name DiagnosticdocumentFindOne
   * @summary Get a diagnostic document by ID
   * @request GET:/admin/diagnostic-document/find-one/{id}
   * @secure
   * @response `200` `DiagnosticdocumentFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DiagnosticdocumentFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DiagnosticdocumentFindOneData;
  }

  /**
   * No description
   * @tags diagnosticDocument
   * @name DiagnosticdocumentRemove
   * @summary Soft-delete a diagnostic document
   * @request DELETE:/admin/diagnostic-document/delete/{id}
   * @secure
   * @response `200` `DiagnosticdocumentRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DiagnosticdocumentRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DiagnosticdocumentRemoveData;
  }
}

export namespace Subscription {
  /**
   * No description
   * @tags subscription
   * @name SubscriptionPlans
   * @summary Get subscription plans
   * @request GET:/admin/subscription/plans
   * @secure
   * @response `200` `SubscriptionPlansData`
   */
  export namespace SubscriptionPlans {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriptionPlansData;
  }

  /**
   * No description
   * @tags subscription
   * @name SubscriptionFindAll
   * @summary Get all subscriptions paginated
   * @request GET:/admin/subscription/find-all
   * @secure
   * @response `200` `SubscriptionFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace SubscriptionFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** @example 3 */
      userId?: number;
      plan?: "free" | "basic" | "pro" | "expert";
      status?: "active" | "paused" | "cancelled" | "expired";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriptionFindAllData;
  }

  /**
   * No description
   * @tags subscription
   * @name SubscriptionFindOne
   * @summary Get a subscription by ID
   * @request GET:/admin/subscription/find-one/{id}
   * @secure
   * @response `200` `SubscriptionFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace SubscriptionFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriptionFindOneData;
  }

  /**
   * No description
   * @tags subscription
   * @name SubscriptionFindByUser
   * @summary Get a subscription by user ID
   * @request GET:/admin/subscription/find-by-user/{userId}
   * @secure
   * @response `200` `SubscriptionFindByUserData`
   * @response `400` `HttpErrorDto`
   */
  export namespace SubscriptionFindByUser {
    export type RequestParams = {
      userId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriptionFindByUserData;
  }

  /**
   * No description
   * @tags subscription
   * @name SubscriptionUpsert
   * @summary Create or update a user subscription
   * @request POST:/admin/subscription/upsert
   * @secure
   * @response `200` `SubscriptionUpsertData`
   * @response `400` `HttpErrorDto`
   */
  export namespace SubscriptionUpsert {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubscriptionUpsertDto;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriptionUpsertData;
  }
}

export namespace Dashboard {
  /**
   * No description
   * @tags dashboard
   * @name DashboardSummary
   * @summary Get dashboard summary for admin, PYME or consultant
   * @request GET:/admin/dashboard/summary
   * @secure
   * @response `200` `DashboardSummaryData`
   * @response `400` `HttpErrorDto`
   */
  export namespace DashboardSummary {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      userId?: number;
      role?: "admin" | "pyme" | "consultor";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardSummaryData;
  }
}

export namespace Storage {
  /**
   * No description
   * @tags storage
   * @name StorageUpload
   * @summary Subir un archivo a Azure Storage
   * @request POST:/storage
   * @secure
   * @response `200` `StorageUploadData`
   */
  export namespace StorageUpload {
    export type RequestParams = {};
    export type RequestQuery = {
      folder: string;
    };
    export type RequestBody = StorageUploadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = StorageUploadData;
  }

  /**
   * No description
   * @tags storage
   * @name StorageDelete
   * @summary Eliminar un archivo de Azure Storage
   * @request DELETE:/storage/{publicId}
   * @secure
   * @response `200` `StorageDeleteData`
   */
  export namespace StorageDelete {
    export type RequestParams = {
      publicId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = StorageDeleteData;
  }

  /**
   * No description
   * @tags storage
   * @name StorageDownload
   * @summary Visualizar o descargar archivo de Azure Storage
   * @request GET:/storage/download-file
   * @response `200` `StorageDownloadData`
   */
  export namespace StorageDownload {
    export type RequestParams = {};
    export type RequestQuery = {
      path: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = StorageDownloadData;
  }
}

export namespace MercadoPago {
  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoAuthUrl
   * @summary Get Mercado Pago OAuth URL for a consultant
   * @request GET:/admin/mercado-pago/auth-url
   * @secure
   * @response `200` `MercadopagoAuthUrlData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoAuthUrl {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoAuthUrlData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoCallback
   * @summary Mercado Pago OAuth callback for consultant connection
   * @request GET:/admin/mercado-pago/callback
   * @response `200` `MercadopagoCallbackData` HTML response that posts the connection result to the opener window
   */
  export namespace MercadopagoCallback {
    export type RequestParams = {};
    export type RequestQuery = {
      code?: string;
      state?: string;
      error?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoCallbackData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoStatus
   * @summary Get consultant Mercado Pago connection status
   * @request GET:/admin/mercado-pago/status
   * @secure
   * @response `200` `MercadopagoStatusData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoStatus {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoStatusData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoDisconnect
   * @summary Disconnect consultant Mercado Pago account
   * @request DELETE:/admin/mercado-pago/disconnect
   * @secure
   * @response `200` `MercadopagoDisconnectData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoDisconnect {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 3 */
      consultantId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoDisconnectData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoCreateCheckout
   * @summary Create a Mercado Pago checkout for a pending meeting
   * @request POST:/admin/mercado-pago/checkout
   * @secure
   * @response `200` `MercadopagoCreateCheckoutData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoCreateCheckout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MercadoPagoCreateCheckoutDto;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoCreateCheckoutData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoFindCheckout
   * @summary Get a Mercado Pago checkout by ID
   * @request GET:/admin/mercado-pago/checkout/{id}
   * @secure
   * @response `200` `MercadopagoFindCheckoutData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoFindCheckout {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoFindCheckoutData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoWebhook
   * @summary Mercado Pago payment webhook
   * @request POST:/admin/mercado-pago/webhook
   * @response `200` `MercadopagoWebhookData` Webhook processed
   */
  export namespace MercadopagoWebhook {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MercadoPagoPaymentWebhookDto;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoWebhookData;
  }
}

export namespace PublicConsultant {
  /**
   * No description
   * @tags publicConsultant
   * @name PublicconsultantFindAll
   * @summary Get public active consultants for landing
   * @request GET:/public/consultant/find-all
   * @response `200` `PublicconsultantFindAllData`
   */
  export namespace PublicconsultantFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Search by name, bio or specialty */
      search?: string;
      active?: "true" | "false";
      validated?: "true" | "false";
      /** Filter by sector */
      sector?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PublicconsultantFindAllData;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Hubsme API Documentation
 * @version 1.0
 * @contact
 *
 * API endpoints for the Hubsme consulting platform
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  app = {
    /**
     * No description
     *
     * @tags App
     * @name AppGetHello
     * @request GET:/
     * @response `200` `AppGetHelloData`
     */
    getHello: (params: RequestParams = {}) =>
      this.http.request<AppGetHelloData, any>({
        path: `/`,
        method: "GET",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthLogin
     * @summary User login
     * @request POST:/auth/login
     * @response `200` `AuthLoginData`
     * @response `400` `HttpErrorDto`
     */
    login: (data: LoginDto, params: RequestParams = {}) =>
      this.http.request<AuthLoginData, AuthLoginError>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthRegister
     * @summary Register a new PYME or consultant user
     * @request POST:/auth/register
     * @response `200` `AuthRegisterData`
     * @response `400` `HttpErrorDto`
     */
    register: (data: RegisterDto, params: RequestParams = {}) =>
      this.http.request<AuthRegisterData, AuthRegisterError>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthGoogleUrl
     * @summary Get Google OAuth URL generated by backend
     * @request GET:/auth/google/url
     * @response `200` `AuthGoogleUrlData`
     * @response `400` `HttpErrorDto`
     */
    googleUrl: (
      query: AuthGoogleUrlParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<AuthGoogleUrlData, AuthGoogleUrlError>({
        path: `/auth/google/url`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthGoogleCallback
     * @summary Google OAuth callback for popup login
     * @request GET:/auth/google/callback
     * @response `200` `AuthGoogleCallbackData` HTML response that posts the session to the opener window
     */
    googleCallback: (
      query: AuthGoogleCallbackParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<AuthGoogleCallbackData, any>({
        path: `/auth/google/callback`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthGetProfile
     * @summary Get current user profile
     * @request GET:/auth/profile
     * @secure
     * @response `200` `AuthGetProfileData` Returns current user information
     * @response `400` `HttpErrorDto`
     */
    getProfile: (params: RequestParams = {}) =>
      this.http.request<AuthGetProfileData, AuthGetProfileError>({
        path: `/auth/profile`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserFindAll
     * @summary Get all users paginated
     * @request GET:/admin/user/find-all
     * @secure
     * @response `200` `UserFindAllData`
     * @response `400` `HttpErrorDto`
     */
    findAll: (query: UserFindAllParams = {}, params: RequestParams = {}) =>
      this.http.request<UserFindAllData, UserFindAllError>({
        path: `/admin/user/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserFindOne
     * @summary Get a user by ID
     * @request GET:/admin/user/find-one/{id}
     * @secure
     * @response `200` `UserFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: ({ id }: UserFindOneParams, params: RequestParams = {}) =>
      this.http.request<UserFindOneData, UserFindOneError>({
        path: `/admin/user/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreate
     * @summary Create a new user
     * @request POST:/admin/user/create
     * @secure
     * @response `200` `UserCreateData`
     * @response `400` `HttpErrorDto`
     */
    create: (data: UserCreateDto, params: RequestParams = {}) =>
      this.http.request<UserCreateData, UserCreateError>({
        path: `/admin/user/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUpdate
     * @summary Update a user
     * @request PATCH:/admin/user/update/{id}
     * @secure
     * @response `200` `UserUpdateData`
     * @response `400` `HttpErrorDto`
     */
    update: (
      { id }: UserUpdateParams,
      data: UserUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<UserUpdateData, UserUpdateError>({
        path: `/admin/user/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRemove
     * @summary Soft-delete a user
     * @request DELETE:/admin/user/delete/{id}
     * @secure
     * @response `200` `UserRemoveData`
     * @response `400` `HttpErrorDto`
     */
    remove: ({ id }: UserRemoveParams, params: RequestParams = {}) =>
      this.http.request<UserRemoveData, UserRemoveError>({
        path: `/admin/user/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  pyme = {
    /**
     * No description
     *
     * @tags pyme
     * @name PymeFindAll
     * @summary Get all PYMEs paginated
     * @request GET:/admin/pyme/find-all
     * @secure
     * @response `200` `PymeFindAllData`
     * @response `400` `HttpErrorDto`
     */
    findAll: (query: PymeFindAllParams = {}, params: RequestParams = {}) =>
      this.http.request<PymeFindAllData, PymeFindAllError>({
        path: `/admin/pyme/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pyme
     * @name PymeFindOne
     * @summary Get a PYME profile by ID
     * @request GET:/admin/pyme/find-one/{id}
     * @secure
     * @response `200` `PymeFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: ({ id }: PymeFindOneParams, params: RequestParams = {}) =>
      this.http.request<PymeFindOneData, PymeFindOneError>({
        path: `/admin/pyme/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pyme
     * @name PymeFindByUser
     * @summary Get a PYME profile by user ID
     * @request GET:/admin/pyme/find-by-user/{userId}
     * @secure
     * @response `200` `PymeFindByUserData`
     * @response `400` `HttpErrorDto`
     */
    findByUser: (
      { userId }: PymeFindByUserParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PymeFindByUserData, PymeFindByUserError>({
        path: `/admin/pyme/find-by-user/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pyme
     * @name PymeCreate
     * @summary Create a new PYME profile
     * @request POST:/admin/pyme/create
     * @secure
     * @response `200` `PymeCreateData`
     * @response `400` `HttpErrorDto`
     */
    create: (data: PymeCreateDto, params: RequestParams = {}) =>
      this.http.request<PymeCreateData, PymeCreateError>({
        path: `/admin/pyme/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pyme
     * @name PymeUpdate
     * @summary Update a PYME profile
     * @request PATCH:/admin/pyme/update/{id}
     * @secure
     * @response `200` `PymeUpdateData`
     * @response `400` `HttpErrorDto`
     */
    update: (
      { id }: PymeUpdateParams,
      data: PymeUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<PymeUpdateData, PymeUpdateError>({
        path: `/admin/pyme/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pyme
     * @name PymeRemove
     * @summary Soft-delete a PYME profile
     * @request DELETE:/admin/pyme/delete/{id}
     * @secure
     * @response `200` `PymeRemoveData`
     * @response `400` `HttpErrorDto`
     */
    remove: ({ id }: PymeRemoveParams, params: RequestParams = {}) =>
      this.http.request<PymeRemoveData, PymeRemoveError>({
        path: `/admin/pyme/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  consultant = {
    /**
     * No description
     *
     * @tags consultant
     * @name ConsultantFindAll
     * @summary Get all consultants paginated
     * @request GET:/admin/consultant/find-all
     * @secure
     * @response `200` `ConsultantFindAllData`
     * @response `400` `HttpErrorDto`
     */
    findAll: (
      query: ConsultantFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantFindAllData, ConsultantFindAllError>({
        path: `/admin/consultant/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant
     * @name ConsultantMeetingPymes
     * @summary Get PYMEs with at least one meeting with current consultant
     * @request GET:/admin/consultant/meeting-pymes
     * @secure
     * @response `200` `ConsultantMeetingPymesData`
     * @response `400` `HttpErrorDto`
     */
    meetingPymes: (
      query: ConsultantMeetingPymesParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantMeetingPymesData,
        ConsultantMeetingPymesError
      >({
        path: `/admin/consultant/meeting-pymes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant
     * @name ConsultantFindOne
     * @summary Get a consultant profile by ID
     * @request GET:/admin/consultant/find-one/{id}
     * @secure
     * @response `200` `ConsultantFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: (
      { id }: ConsultantFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantFindOneData, ConsultantFindOneError>({
        path: `/admin/consultant/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant
     * @name ConsultantFindByUser
     * @summary Get a consultant profile by user ID
     * @request GET:/admin/consultant/find-by-user/{userId}
     * @secure
     * @response `200` `ConsultantFindByUserData`
     * @response `400` `HttpErrorDto`
     */
    findByUser: (
      { userId }: ConsultantFindByUserParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantFindByUserData, ConsultantFindByUserError>({
        path: `/admin/consultant/find-by-user/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant
     * @name ConsultantCreate
     * @summary Create a new consultant profile
     * @request POST:/admin/consultant/create
     * @secure
     * @response `200` `ConsultantCreateData`
     * @response `400` `HttpErrorDto`
     */
    create: (data: ConsultantCreateDto, params: RequestParams = {}) =>
      this.http.request<ConsultantCreateData, ConsultantCreateError>({
        path: `/admin/consultant/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant
     * @name ConsultantUpdate
     * @summary Update a consultant profile
     * @request PATCH:/admin/consultant/update/{id}
     * @secure
     * @response `200` `ConsultantUpdateData`
     * @response `400` `HttpErrorDto`
     */
    update: (
      { id }: ConsultantUpdateParams,
      data: ConsultantUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantUpdateData, ConsultantUpdateError>({
        path: `/admin/consultant/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant
     * @name ConsultantRemove
     * @summary Soft-delete a consultant profile
     * @request DELETE:/admin/consultant/delete/{id}
     * @secure
     * @response `200` `ConsultantRemoveData`
     * @response `400` `HttpErrorDto`
     */
    remove: (
      { id }: ConsultantRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantRemoveData, ConsultantRemoveError>({
        path: `/admin/consultant/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  meeting = {
    /**
     * No description
     *
     * @tags meeting
     * @name MeetingFindAll
     * @summary Get all meetings paginated
     * @request GET:/admin/meeting/find-all
     * @secure
     * @response `200` `MeetingFindAllData`
     * @response `400` `HttpErrorDto`
     */
    findAll: (
      query: MeetingFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingFindAllData, MeetingFindAllError>({
        path: `/admin/meeting/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingFindOne
     * @summary Get a meeting by ID
     * @request GET:/admin/meeting/find-one/{id}
     * @secure
     * @response `200` `MeetingFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: (
      { id }: MeetingFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingFindOneData, MeetingFindOneError>({
        path: `/admin/meeting/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingCreate
     * @summary Create a new meeting
     * @request POST:/admin/meeting/create
     * @secure
     * @response `200` `MeetingCreateData`
     * @response `400` `HttpErrorDto`
     */
    create: (data: MeetingCreateDto, params: RequestParams = {}) =>
      this.http.request<MeetingCreateData, MeetingCreateError>({
        path: `/admin/meeting/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingConfirm
     * @summary Confirm a requested meeting and create its Teams meeting URL internally
     * @request POST:/admin/meeting/confirm/{id}
     * @secure
     * @response `200` `MeetingConfirmData`
     * @response `400` `HttpErrorDto`
     */
    confirm: (
      { id }: MeetingConfirmParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingConfirmData, MeetingConfirmError>({
        path: `/admin/meeting/confirm/${id}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingCreateTeamsJoinToken
     * @summary Create an anonymous ACS token to join a Teams meeting inside the app
     * @request POST:/admin/meeting/teams-join/{id}
     * @secure
     * @response `200` `MeetingCreateTeamsJoinTokenData`
     * @response `400` `HttpErrorDto`
     */
    createTeamsJoinToken: (
      { id }: MeetingCreateTeamsJoinTokenParams,
      data: MeetingTeamsJoinDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MeetingCreateTeamsJoinTokenData,
        MeetingCreateTeamsJoinTokenError
      >({
        path: `/admin/meeting/teams-join/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingGetRecordings
     * @summary List Microsoft Graph recordings for a meeting
     * @request GET:/admin/meeting/recordings/{id}
     * @secure
     * @response `200` `MeetingGetRecordingsData`
     * @response `400` `HttpErrorDto`
     */
    getRecordings: (
      { id }: MeetingGetRecordingsParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingGetRecordingsData, MeetingGetRecordingsError>({
        path: `/admin/meeting/recordings/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingGetCopilotSummary
     * @summary Get Hubsme AI insights (summary & action tasks) for a meeting
     * @request GET:/admin/meeting/hubsme-ai/{id}
     * @secure
     * @response `200` `MeetingGetCopilotSummaryData`
     * @response `400` `HttpErrorDto`
     */
    getCopilotSummary: (
      { id }: MeetingGetCopilotSummaryParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MeetingGetCopilotSummaryData,
        MeetingGetCopilotSummaryError
      >({
        path: `/admin/meeting/hubsme-ai/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingUpdate
     * @summary Update a meeting
     * @request PATCH:/admin/meeting/update/{id}
     * @secure
     * @response `200` `MeetingUpdateData`
     * @response `400` `HttpErrorDto`
     */
    update: (
      { id }: MeetingUpdateParams,
      data: MeetingUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingUpdateData, MeetingUpdateError>({
        path: `/admin/meeting/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingFinalize
     * @summary Finalize meeting, save markdown minutes and create follow-up tasks
     * @request POST:/admin/meeting/finalize/{id}
     * @secure
     * @response `200` `MeetingFinalizeData`
     * @response `400` `HttpErrorDto`
     */
    finalize: (
      { id }: MeetingFinalizeParams,
      data: MeetingFinalizeDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingFinalizeData, MeetingFinalizeError>({
        path: `/admin/meeting/finalize/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meeting
     * @name MeetingRemove
     * @summary Soft-delete a meeting
     * @request DELETE:/admin/meeting/delete/{id}
     * @secure
     * @response `200` `MeetingRemoveData`
     * @response `400` `HttpErrorDto`
     */
    remove: ({ id }: MeetingRemoveParams, params: RequestParams = {}) =>
      this.http.request<MeetingRemoveData, MeetingRemoveError>({
        path: `/admin/meeting/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  powerautomate = {
    /**
     * No description
     *
     * @tags powerautomate
     * @name PowerautomateRunHubsmeAi
     * @summary Ejecutar flujo de Power Automate para obtener resumen y tareas sugeridas
     * @request POST:/admin/powerautomate/hubsme-ai
     * @secure
     * @response `201` `PowerautomateRunHubsmeAiData`
     * @response `400` `HttpErrorDto`
     */
    runHubsmeAi: (
      data: HubsmeAiRunDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PowerautomateRunHubsmeAiData,
        PowerautomateRunHubsmeAiError
      >({
        path: `/admin/powerautomate/hubsme-ai`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  consultantAvailability = {
    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityFindAll
     * @summary Get consultant availability months paginated
     * @request GET:/admin/consultant-availability/find-all
     * @secure
     * @response `200` `ConsultantAvailabilityFindAllData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityFindAll": (
      query: ConsultantAvailabilityFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityFindAllData,
        ConsultantAvailabilityFindAllError
      >({
        path: `/admin/consultant-availability/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityFindMonth
     * @summary Get consultant availability for a month
     * @request GET:/admin/consultant-availability/find-month
     * @secure
     * @response `200` `ConsultantAvailabilityFindMonthData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityFindMonth": (
      query: ConsultantAvailabilityFindMonthParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityFindMonthData,
        ConsultantAvailabilityFindMonthError
      >({
        path: `/admin/consultant-availability/find-month`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityVisibleMonth
     * @summary Get consultant availability visible for PYMES in a month
     * @request GET:/admin/consultant-availability/visible-month
     * @secure
     * @response `200` `ConsultantAvailabilityVisibleMonthData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityVisibleMonth": (
      query: ConsultantAvailabilityVisibleMonthParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityVisibleMonthData,
        ConsultantAvailabilityVisibleMonthError
      >({
        path: `/admin/consultant-availability/visible-month`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityFindOne
     * @summary Get a consultant availability month by ID
     * @request GET:/admin/consultant-availability/find-one/{id}
     * @secure
     * @response `200` `ConsultantAvailabilityFindOneData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityFindOne": (
      { id }: ConsultantAvailabilityFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityFindOneData,
        ConsultantAvailabilityFindOneError
      >({
        path: `/admin/consultant-availability/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityCreate
     * @summary Create a consultant availability month
     * @request POST:/admin/consultant-availability/create
     * @secure
     * @response `200` `ConsultantAvailabilityCreateData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityCreate": (
      data: ConsultantAvailabilityCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityCreateData,
        ConsultantAvailabilityCreateError
      >({
        path: `/admin/consultant-availability/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityReplaceMonth
     * @summary Replace consultant availability for a month
     * @request POST:/admin/consultant-availability/replace-month
     * @secure
     * @response `200` `ConsultantAvailabilityReplaceMonthData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityReplaceMonth": (
      data: ConsultantAvailabilityReplaceMonthDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityReplaceMonthData,
        ConsultantAvailabilityReplaceMonthError
      >({
        path: `/admin/consultant-availability/replace-month`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityUpdate
     * @summary Update a consultant availability month
     * @request PATCH:/admin/consultant-availability/update/{id}
     * @secure
     * @response `200` `ConsultantAvailabilityUpdateData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityUpdate": (
      { id }: ConsultantAvailabilityUpdateParams,
      data: ConsultantAvailabilityUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityUpdateData,
        ConsultantAvailabilityUpdateError
      >({
        path: `/admin/consultant-availability/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultant-availability
     * @name ConsultantAvailabilityRemove
     * @summary Soft-delete a consultant availability month
     * @request DELETE:/admin/consultant-availability/delete/{id}
     * @secure
     * @response `200` `ConsultantAvailabilityRemoveData`
     * @response `400` `HttpErrorDto`
     */
    "consultant-availabilityRemove": (
      { id }: ConsultantAvailabilityRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantAvailabilityRemoveData,
        ConsultantAvailabilityRemoveError
      >({
        path: `/admin/consultant-availability/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  consultantGoogleCalendar = {
    /**
     * No description
     *
     * @tags consultantGoogleCalendar
     * @name ConsultantgooglecalendarAuthUrl
     * @summary Get Google Calendar OAuth URL for a consultant
     * @request GET:/admin/consultant-google-calendar/auth-url
     * @secure
     * @response `200` `ConsultantgooglecalendarAuthUrlData`
     * @response `400` `HttpErrorDto`
     */
    consultantgooglecalendarAuthUrl: (
      query: ConsultantgooglecalendarAuthUrlParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantgooglecalendarAuthUrlData,
        ConsultantgooglecalendarAuthUrlError
      >({
        path: `/admin/consultant-google-calendar/auth-url`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantGoogleCalendar
     * @name ConsultantgooglecalendarCallback
     * @summary Google Calendar OAuth callback for consultant connection
     * @request GET:/admin/consultant-google-calendar/callback
     * @response `200` `ConsultantgooglecalendarCallbackData` HTML response that posts the connection result to the opener window
     */
    consultantgooglecalendarCallback: (
      query: ConsultantgooglecalendarCallbackParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantgooglecalendarCallbackData, any>({
        path: `/admin/consultant-google-calendar/callback`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantGoogleCalendar
     * @name ConsultantgooglecalendarStatus
     * @summary Get consultant Google Calendar connection status
     * @request GET:/admin/consultant-google-calendar/status
     * @secure
     * @response `200` `ConsultantgooglecalendarStatusData`
     * @response `400` `HttpErrorDto`
     */
    consultantgooglecalendarStatus: (
      query: ConsultantgooglecalendarStatusParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantgooglecalendarStatusData,
        ConsultantgooglecalendarStatusError
      >({
        path: `/admin/consultant-google-calendar/status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantGoogleCalendar
     * @name ConsultantgooglecalendarBusyMonth
     * @summary Get busy events from consultant Google Calendar for a month
     * @request GET:/admin/consultant-google-calendar/busy-month
     * @secure
     * @response `200` `ConsultantgooglecalendarBusyMonthData`
     * @response `400` `HttpErrorDto`
     */
    consultantgooglecalendarBusyMonth: (
      query: ConsultantgooglecalendarBusyMonthParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantgooglecalendarBusyMonthData,
        ConsultantgooglecalendarBusyMonthError
      >({
        path: `/admin/consultant-google-calendar/busy-month`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantGoogleCalendar
     * @name ConsultantgooglecalendarDisconnect
     * @summary Disconnect consultant Google Calendar account
     * @request DELETE:/admin/consultant-google-calendar/disconnect
     * @secure
     * @response `200` `ConsultantgooglecalendarDisconnectData`
     * @response `400` `HttpErrorDto`
     */
    consultantgooglecalendarDisconnect: (
      query: ConsultantgooglecalendarDisconnectParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantgooglecalendarDisconnectData,
        ConsultantgooglecalendarDisconnectError
      >({
        path: `/admin/consultant-google-calendar/disconnect`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  task = {
    /**
     * No description
     *
     * @tags task
     * @name TaskFindAll
     * @summary Get all tasks paginated
     * @request GET:/admin/task/find-all
     * @secure
     * @response `200` `TaskFindAllData`
     * @response `400` `HttpErrorDto`
     */
    findAll: (query: TaskFindAllParams = {}, params: RequestParams = {}) =>
      this.http.request<TaskFindAllData, TaskFindAllError>({
        path: `/admin/task/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskFindOne
     * @summary Get a task by ID
     * @request GET:/admin/task/find-one/{id}
     * @secure
     * @response `200` `TaskFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: ({ id }: TaskFindOneParams, params: RequestParams = {}) =>
      this.http.request<TaskFindOneData, TaskFindOneError>({
        path: `/admin/task/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskCreate
     * @summary Create a new task
     * @request POST:/admin/task/create
     * @secure
     * @response `200` `TaskCreateData`
     * @response `400` `HttpErrorDto`
     */
    create: (data: TaskCreateDto, params: RequestParams = {}) =>
      this.http.request<TaskCreateData, TaskCreateError>({
        path: `/admin/task/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskUpdate
     * @summary Update a task
     * @request PATCH:/admin/task/update/{id}
     * @secure
     * @response `200` `TaskUpdateData`
     * @response `400` `HttpErrorDto`
     */
    update: (
      { id }: TaskUpdateParams,
      data: TaskUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<TaskUpdateData, TaskUpdateError>({
        path: `/admin/task/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskUpdateStatus
     * @summary Update only the task status
     * @request PATCH:/admin/task/update-status/{id}
     * @secure
     * @response `200` `TaskUpdateStatusData`
     * @response `400` `HttpErrorDto`
     */
    updateStatus: (
      { id }: TaskUpdateStatusParams,
      data: TaskStatusDto,
      params: RequestParams = {},
    ) =>
      this.http.request<TaskUpdateStatusData, TaskUpdateStatusError>({
        path: `/admin/task/update-status/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskRemove
     * @summary Soft-delete a task
     * @request DELETE:/admin/task/delete/{id}
     * @secure
     * @response `200` `TaskRemoveData`
     * @response `400` `HttpErrorDto`
     */
    remove: ({ id }: TaskRemoveParams, params: RequestParams = {}) =>
      this.http.request<TaskRemoveData, TaskRemoveError>({
        path: `/admin/task/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  diagnostic = {
    /**
     * No description
     *
     * @tags diagnostic
     * @name DiagnosticFindAll
     * @summary Get all diagnostics paginated
     * @request GET:/admin/diagnostic/find-all
     * @secure
     * @response `200` `DiagnosticFindAllData`
     * @response `400` `HttpErrorDto`
     */
    findAll: (
      query: DiagnosticFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<DiagnosticFindAllData, DiagnosticFindAllError>({
        path: `/admin/diagnostic/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnostic
     * @name DiagnosticFindOne
     * @summary Get a diagnostic by ID
     * @request GET:/admin/diagnostic/find-one/{id}
     * @secure
     * @response `200` `DiagnosticFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: (
      { id }: DiagnosticFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DiagnosticFindOneData, DiagnosticFindOneError>({
        path: `/admin/diagnostic/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnostic
     * @name DiagnosticGenerate
     * @summary Generate and persist a PYME diagnostic
     * @request POST:/admin/diagnostic/generate
     * @secure
     * @response `200` `DiagnosticGenerateData`
     * @response `400` `HttpErrorDto`
     */
    generate: (
      data: DiagnosticGenerateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<DiagnosticGenerateData, DiagnosticGenerateError>({
        path: `/admin/diagnostic/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnostic
     * @name DiagnosticRemove
     * @summary Soft-delete a diagnostic
     * @request DELETE:/admin/diagnostic/delete/{id}
     * @secure
     * @response `200` `DiagnosticRemoveData`
     * @response `400` `HttpErrorDto`
     */
    remove: (
      { id }: DiagnosticRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DiagnosticRemoveData, DiagnosticRemoveError>({
        path: `/admin/diagnostic/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  diagnosticDocument = {
    /**
     * No description
     *
     * @tags diagnosticDocument
     * @name DiagnosticdocumentFindAll
     * @summary Get all diagnostic documents paginated
     * @request GET:/admin/diagnostic-document/find-all
     * @secure
     * @response `200` `DiagnosticdocumentFindAllData`
     * @response `400` `HttpErrorDto`
     */
    diagnosticdocumentFindAll: (
      query: DiagnosticdocumentFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        DiagnosticdocumentFindAllData,
        DiagnosticdocumentFindAllError
      >({
        path: `/admin/diagnostic-document/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnosticDocument
     * @name DiagnosticdocumentFindOne
     * @summary Get a diagnostic document by ID
     * @request GET:/admin/diagnostic-document/find-one/{id}
     * @secure
     * @response `200` `DiagnosticdocumentFindOneData`
     * @response `400` `HttpErrorDto`
     */
    diagnosticdocumentFindOne: (
      { id }: DiagnosticdocumentFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DiagnosticdocumentFindOneData,
        DiagnosticdocumentFindOneError
      >({
        path: `/admin/diagnostic-document/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnosticDocument
     * @name DiagnosticdocumentRemove
     * @summary Soft-delete a diagnostic document
     * @request DELETE:/admin/diagnostic-document/delete/{id}
     * @secure
     * @response `200` `DiagnosticdocumentRemoveData`
     * @response `400` `HttpErrorDto`
     */
    diagnosticdocumentRemove: (
      { id }: DiagnosticdocumentRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DiagnosticdocumentRemoveData,
        DiagnosticdocumentRemoveError
      >({
        path: `/admin/diagnostic-document/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  subscription = {
    /**
     * No description
     *
     * @tags subscription
     * @name SubscriptionPlans
     * @summary Get subscription plans
     * @request GET:/admin/subscription/plans
     * @secure
     * @response `200` `SubscriptionPlansData`
     */
    plans: (params: RequestParams = {}) =>
      this.http.request<SubscriptionPlansData, any>({
        path: `/admin/subscription/plans`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription
     * @name SubscriptionFindAll
     * @summary Get all subscriptions paginated
     * @request GET:/admin/subscription/find-all
     * @secure
     * @response `200` `SubscriptionFindAllData`
     * @response `400` `HttpErrorDto`
     */
    findAll: (
      query: SubscriptionFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<SubscriptionFindAllData, SubscriptionFindAllError>({
        path: `/admin/subscription/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription
     * @name SubscriptionFindOne
     * @summary Get a subscription by ID
     * @request GET:/admin/subscription/find-one/{id}
     * @secure
     * @response `200` `SubscriptionFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: (
      { id }: SubscriptionFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SubscriptionFindOneData, SubscriptionFindOneError>({
        path: `/admin/subscription/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription
     * @name SubscriptionFindByUser
     * @summary Get a subscription by user ID
     * @request GET:/admin/subscription/find-by-user/{userId}
     * @secure
     * @response `200` `SubscriptionFindByUserData`
     * @response `400` `HttpErrorDto`
     */
    findByUser: (
      { userId }: SubscriptionFindByUserParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        SubscriptionFindByUserData,
        SubscriptionFindByUserError
      >({
        path: `/admin/subscription/find-by-user/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription
     * @name SubscriptionUpsert
     * @summary Create or update a user subscription
     * @request POST:/admin/subscription/upsert
     * @secure
     * @response `200` `SubscriptionUpsertData`
     * @response `400` `HttpErrorDto`
     */
    upsert: (
      data: SubscriptionUpsertDto,
      params: RequestParams = {},
    ) =>
      this.http.request<SubscriptionUpsertData, SubscriptionUpsertError>({
        path: `/admin/subscription/upsert`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  dashboard = {
    /**
     * No description
     *
     * @tags dashboard
     * @name DashboardSummary
     * @summary Get dashboard summary for admin, PYME or consultant
     * @request GET:/admin/dashboard/summary
     * @secure
     * @response `200` `DashboardSummaryData`
     * @response `400` `HttpErrorDto`
     */
    summary: (
      query: DashboardSummaryParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<DashboardSummaryData, DashboardSummaryError>({
        path: `/admin/dashboard/summary`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  storage = {
    /**
     * No description
     *
     * @tags storage
     * @name StorageUpload
     * @summary Subir un archivo a Azure Storage
     * @request POST:/storage
     * @secure
     * @response `200` `StorageUploadData`
     */
    upload: (
      query: StorageUploadParams,
      data: StorageUploadPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<StorageUploadData, any>({
        path: `/storage`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags storage
     * @name StorageDelete
     * @summary Eliminar un archivo de Azure Storage
     * @request DELETE:/storage/{publicId}
     * @secure
     * @response `200` `StorageDeleteData`
     */
    delete: (
      { publicId }: StorageDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<StorageDeleteData, any>({
        path: `/storage/${publicId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags storage
     * @name StorageDownload
     * @summary Visualizar o descargar archivo de Azure Storage
     * @request GET:/storage/download-file
     * @response `200` `StorageDownloadData`
     */
    download: (
      query: StorageDownloadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<StorageDownloadData, any>({
        path: `/storage/download-file`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  mercadoPago = {
    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoAuthUrl
     * @summary Get Mercado Pago OAuth URL for a consultant
     * @request GET:/admin/mercado-pago/auth-url
     * @secure
     * @response `200` `MercadopagoAuthUrlData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoAuthUrl: (
      query: MercadopagoAuthUrlParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MercadopagoAuthUrlData, MercadopagoAuthUrlError>({
        path: `/admin/mercado-pago/auth-url`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoCallback
     * @summary Mercado Pago OAuth callback for consultant connection
     * @request GET:/admin/mercado-pago/callback
     * @response `200` `MercadopagoCallbackData` HTML response that posts the connection result to the opener window
     */
    mercadopagoCallback: (
      query: MercadopagoCallbackParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<MercadopagoCallbackData, any>({
        path: `/admin/mercado-pago/callback`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoStatus
     * @summary Get consultant Mercado Pago connection status
     * @request GET:/admin/mercado-pago/status
     * @secure
     * @response `200` `MercadopagoStatusData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoStatus: (
      query: MercadopagoStatusParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MercadopagoStatusData, MercadopagoStatusError>({
        path: `/admin/mercado-pago/status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoDisconnect
     * @summary Disconnect consultant Mercado Pago account
     * @request DELETE:/admin/mercado-pago/disconnect
     * @secure
     * @response `200` `MercadopagoDisconnectData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoDisconnect: (
      query: MercadopagoDisconnectParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MercadopagoDisconnectData, MercadopagoDisconnectError>({
        path: `/admin/mercado-pago/disconnect`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoCreateCheckout
     * @summary Create a Mercado Pago checkout for a pending meeting
     * @request POST:/admin/mercado-pago/checkout
     * @secure
     * @response `200` `MercadopagoCreateCheckoutData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoCreateCheckout: (
      data: MercadoPagoCreateCheckoutDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MercadopagoCreateCheckoutData,
        MercadopagoCreateCheckoutError
      >({
        path: `/admin/mercado-pago/checkout`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoFindCheckout
     * @summary Get a Mercado Pago checkout by ID
     * @request GET:/admin/mercado-pago/checkout/{id}
     * @secure
     * @response `200` `MercadopagoFindCheckoutData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoFindCheckout: (
      { id }: MercadopagoFindCheckoutParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MercadopagoFindCheckoutData,
        MercadopagoFindCheckoutError
      >({
        path: `/admin/mercado-pago/checkout/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoWebhook
     * @summary Mercado Pago payment webhook
     * @request POST:/admin/mercado-pago/webhook
     * @response `200` `MercadopagoWebhookData` Webhook processed
     */
    mercadopagoWebhook: (
      data: MercadoPagoPaymentWebhookDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MercadopagoWebhookData, any>({
        path: `/admin/mercado-pago/webhook`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  publicConsultant = {
    /**
     * No description
     *
     * @tags publicConsultant
     * @name PublicconsultantFindAll
     * @summary Get public active consultants for landing
     * @request GET:/public/consultant/find-all
     * @response `200` `PublicconsultantFindAllData`
     */
    publicconsultantFindAll: (
      query: PublicconsultantFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<PublicconsultantFindAllData, any>({
        path: `/public/consultant/find-all`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}

/**
 * ==============================================================================
 *  UTILITARIOS DE TIPOS PARA FRONTEND
 * ==============================================================================
 */

/**
 * Extrae el tipo de respuesta (data) de un método de la API
 * @example ApiResponse<"clientes", "findAll"> → PaginatedClienteResultDto
 */
export type ApiResponse<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Api<unknown>[Module][Method] extends (...args: any) => Promise<{ data: infer Data }>
  ? Data
  : never;

/**
 * Extrae todos los argumentos de un método de la API
 */
type ApiArgs<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Parameters<
  Api<unknown>[Module][Method] extends (...args: any) => any ? Api<unknown>[Module][Method] : never
>;

/**
 * Extrae el tipo del body (data) de un método de la API
 * Busca el parámetro que se llama "data" en la firma del método
 * @example ApiBody<"clientes", "create"> → ClienteCreateDto
 * @example ApiBody<"clientes", "update"> → ClienteUpdateDto
 */
export type ApiBody<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Required<ApiArgs<Module, Method>> extends [any, any, any, ...any[]]
  ? ApiArgs<Module, Method>[1]
  : Required<ApiArgs<Module, Method>> extends [any, any, ...any[]]
    ? ApiArgs<Module, Method>[0]
    : never;

/**
 * Extrae el tipo de los query params de un método de la API
 * Busca el parámetro que se llama "query" en la firma del método
 * @example ApiQuery<"clientes", "findAll"> → { page?: number, limit?: number, search?: string, ... }
 */
export type ApiQuery<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Required<ApiArgs<Module, Method>> extends [infer Query, ...any[]]
  ? Query
  : never;

/**
 * Extrae el tipo de un parámetro específico (path param) de un método de la API
 * @example ApiParam<"clientes", "update", "id"> → number
 * @example ApiParam<"vehiculos", "findOne", "id"> → number
 */
export type ApiParam<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module],
  ParamName extends Required<ApiArgs<Module, Method>> extends [infer Arg1, ...any[]]
    ? keyof Arg1
    : never
> = Required<ApiArgs<Module, Method>> extends [infer Arg1, ...any[]]
  ? ParamName extends keyof Arg1
    ? Arg1[ParamName]
    : never
  : never;

/**
 * Extrae el tipo de un campo específico de la respuesta de un método de la API
 * @example ApiField<"usuarios", "findOne", "roles"> → UsuarioResultDtoRolesEnum[]
 * @example ApiField<"vehiculos", "findOne", "estado"> → VehiculoResultDtoEstadoEnum
 */
export type ApiField<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module],
  FieldName extends keyof ApiResponse<Module, Method>
> = ApiResponse<Module, Method>[FieldName];
