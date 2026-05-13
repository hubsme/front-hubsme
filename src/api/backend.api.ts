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
   * @example "erick@gmail.com"
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
  role: "admin" | "pyme" | "consultor";
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
   * @example "Maria Torres"
   */
  name: string;
  /** @default "pyme" */
  role: "pyme" | "consultor";
}

export interface UserListItemDto {
  id: number;
  email: string;
  name: string;
  role: "admin" | "pyme" | "consultor";
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
  role?: "admin" | "pyme" | "consultor";
  isActive?: "true" | "false";
}

export interface PymeListItemDto {
  id: number;
  userId: number;
  name: string;
  ruc: string | null;
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
  name: string;
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
  name: string;
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
  /** @example "Carlos Mendoza" */
  name: string;
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
  /** @example "Carlos Mendoza" */
  name?: string;
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

export interface MeetingMinutesDto {
  titulo: string;
  resumen: string;
  puntosTratados: string[];
  acuerdos: object[];
  tareasGeneradas: object[];
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
  status: "solicitada" | "confirmada" | "finalizada" | "cancelada";
  description: string | null;
  minutes: MeetingMinutesDto | null;
  /** @format date-time */
  completedAt: string | null;
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
  /** @example "https://meet.google.com/demo" */
  meetingUrl?: string;
  /** @default "confirmada" */
  status?: "solicitada" | "confirmada" | "finalizada" | "cancelada";
}

export interface MeetingUpdateDto {
  /** @example 2 */
  pymeId?: number;
  /** @example 3 */
  consultantId?: number;
  /** @example "Sesion de diagnostico empresarial" */
  title?: string;
  /**
   * @format date-time
   * @example "2026-05-10T15:00:00.000Z"
   */
  startTime?: string;
  /** @example 60 */
  durationMinutes?: number;
  /** @example "https://meet.google.com/demo" */
  meetingUrl?: string;
  /** @default "confirmada" */
  status?: "solicitada" | "confirmada" | "finalizada" | "cancelada";
}

export interface MeetingFinalizeDto {
  /** @example "Revisamos el embudo comercial, acordamos implementar CRM y preparar reporte financiero para la siguiente sesion." */
  description: string;
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

export interface MeetingFinalizeResultDto {
  meeting: MeetingResultDto;
  tasks: TaskResultDto[];
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
  /** @example {"revenue":"500000","techLevel":6,"challenges":"Falta de liquidez"} */
  responses: object;
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

export interface DashboardResponseDto {
  stats: DashboardStatsDto;
  taskStatus: DashboardTaskStatusDto;
  upcomingMeetings: DashboardMeetingDto[];
}

export interface PymeConsultantMatchResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  pymeId: number;
  pymeName: string | null;
  consultantId: number;
  consultantName: string | null;
  status: "pendiente" | "aceptado" | "rechazado" | "finalizado";
  source: string;
  notes: string | null;
}

export interface PymeConsultantMatchListDto {
  data: PymeConsultantMatchResultDto[];
  meta: PaginationMetaDto;
}

export interface PymeConsultantMatchCreateDto {
  /** @example 2 */
  pymeId: number;
  /** @example 3 */
  consultantId: number;
  /** @default "pendiente" */
  status?: "pendiente" | "aceptado" | "rechazado" | "finalizado";
  /** @example "diagnostico" */
  source?: string;
  /** @example "Match generado por afinidad de sector y especialidad." */
  notes?: string;
}

export interface PymeConsultantMatchUpdateDto {
  /** @example 2 */
  pymeId?: number;
  /** @example 3 */
  consultantId?: number;
  /** @default "pendiente" */
  status?: "pendiente" | "aceptado" | "rechazado" | "finalizado";
  /** @example "diagnostico" */
  source?: string;
  /** @example "Match generado por afinidad de sector y especialidad." */
  notes?: string;
}

export interface PymeConsultantMessageResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  matchId: number;
  senderId: number;
  senderName: string | null;
  senderRole: "admin" | "pyme" | "consultor" | null;
  message: string;
  /** @format date-time */
  readAt: string | null;
}

export interface PymeConsultantMessageListDto {
  data: PymeConsultantMessageResultDto[];
}

export interface PymeConsultantMessageCreateDto {
  /** @example 1 */
  matchId: number;
  /** @example 2 */
  senderId: number;
  /** @example "Hola, revisemos una primera sesion esta semana." */
  message: string;
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

export type AppGetHelloData = any;

export type AuthLoginData = LoginResponseDto;

export type AuthLoginError = HttpErrorDto;

export type AuthRegisterData = LoginResponseDto;

export type AuthRegisterError = HttpErrorDto;

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

export type PublicconsultantFindAllData = ConsultantListDto;

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
  status?: "solicitada" | "confirmada" | "finalizada" | "cancelada";
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

export interface PymeconsultantmatchFindAllParams {
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
  /** Search by PYME or consultant name */
  search?: string;
  /** @example 2 */
  pymeId?: number;
  /** @example 3 */
  consultantId?: number;
  status?: "pendiente" | "aceptado" | "rechazado" | "finalizado";
}

export type PymeconsultantmatchFindAllData = PymeConsultantMatchListDto;

export type PymeconsultantmatchFindAllError = HttpErrorDto;

export interface PymeconsultantmatchFindOneParams {
  id: number;
}

export type PymeconsultantmatchFindOneData = PymeConsultantMatchResultDto;

export type PymeconsultantmatchFindOneError = HttpErrorDto;

export type PymeconsultantmatchCreateData = PymeConsultantMatchResultDto;

export type PymeconsultantmatchCreateError = HttpErrorDto;

export interface PymeconsultantmatchUpdateParams {
  id: number;
}

export type PymeconsultantmatchUpdateData = PymeConsultantMatchResultDto;

export type PymeconsultantmatchUpdateError = HttpErrorDto;

export interface PymeconsultantmatchRemoveParams {
  id: number;
}

export type PymeconsultantmatchRemoveData = PymeConsultantMatchResultDto;

export type PymeconsultantmatchRemoveError = HttpErrorDto;

export interface PymeconsultantmessageFindAllParams {
  /** @example 1 */
  matchId: number;
}

export type PymeconsultantmessageFindAllData = PymeConsultantMessageListDto;

export type PymeconsultantmessageFindAllError = HttpErrorDto;

export type PymeconsultantmessageCreateData = PymeConsultantMessageResultDto;

export type PymeconsultantmessageCreateError = HttpErrorDto;

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
      status?: "solicitada" | "confirmada" | "finalizada" | "cancelada";
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
   * @summary Finalize meeting, generate minutes and create follow-up tasks
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

export namespace PymeConsultantMatch {
  /**
   * No description
   * @tags pymeConsultantMatch
   * @name PymeconsultantmatchFindAll
   * @summary Get all PYME and consultant matches paginated
   * @request GET:/admin/pyme-consultant-match/find-all
   * @secure
   * @response `200` `PymeconsultantmatchFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeconsultantmatchFindAll {
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
      /** Search by PYME or consultant name */
      search?: string;
      /** @example 2 */
      pymeId?: number;
      /** @example 3 */
      consultantId?: number;
      status?: "pendiente" | "aceptado" | "rechazado" | "finalizado";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeconsultantmatchFindAllData;
  }

  /**
   * No description
   * @tags pymeConsultantMatch
   * @name PymeconsultantmatchFindOne
   * @summary Get a PYME and consultant match by ID
   * @request GET:/admin/pyme-consultant-match/find-one/{id}
   * @secure
   * @response `200` `PymeconsultantmatchFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeconsultantmatchFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeconsultantmatchFindOneData;
  }

  /**
   * No description
   * @tags pymeConsultantMatch
   * @name PymeconsultantmatchCreate
   * @summary Create a PYME and consultant match
   * @request POST:/admin/pyme-consultant-match/create
   * @secure
   * @response `200` `PymeconsultantmatchCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeconsultantmatchCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PymeConsultantMatchCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PymeconsultantmatchCreateData;
  }

  /**
   * No description
   * @tags pymeConsultantMatch
   * @name PymeconsultantmatchUpdate
   * @summary Update a PYME and consultant match
   * @request PATCH:/admin/pyme-consultant-match/update/{id}
   * @secure
   * @response `200` `PymeconsultantmatchUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeconsultantmatchUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PymeConsultantMatchUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PymeconsultantmatchUpdateData;
  }

  /**
   * No description
   * @tags pymeConsultantMatch
   * @name PymeconsultantmatchRemove
   * @summary Soft-delete a PYME and consultant match
   * @request DELETE:/admin/pyme-consultant-match/delete/{id}
   * @secure
   * @response `200` `PymeconsultantmatchRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeconsultantmatchRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeconsultantmatchRemoveData;
  }
}

export namespace PymeConsultantMessage {
  /**
   * No description
   * @tags pymeConsultantMessage
   * @name PymeconsultantmessageFindAll
   * @summary Get messages by accepted PYME and consultant match
   * @request GET:/admin/pyme-consultant-message/find-all
   * @secure
   * @response `200` `PymeconsultantmessageFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeconsultantmessageFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example 1 */
      matchId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeconsultantmessageFindAllData;
  }

  /**
   * No description
   * @tags pymeConsultantMessage
   * @name PymeconsultantmessageCreate
   * @summary Create a message in an accepted PYME and consultant match
   * @request POST:/admin/pyme-consultant-message/create
   * @secure
   * @response `200` `PymeconsultantmessageCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeconsultantmessageCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PymeConsultantMessageCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PymeconsultantmessageCreateData;
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
    findAll: (query: UserFindAllParams, params: RequestParams = {}) =>
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
    findOne: (
      { id, ...query }: UserFindOneParams,
      params: RequestParams = {},
    ) =>
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
      { id, ...query }: UserUpdateParams,
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
    remove: (
      { id, ...query }: UserRemoveParams,
      params: RequestParams = {},
    ) =>
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
    findAll: (query: PymeFindAllParams, params: RequestParams = {}) =>
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
    findOne: (
      { id, ...query }: PymeFindOneParams,
      params: RequestParams = {},
    ) =>
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
      { userId, ...query }: PymeFindByUserParams,
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
      { id, ...query }: PymeUpdateParams,
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
    remove: (
      { id, ...query }: PymeRemoveParams,
      params: RequestParams = {},
    ) =>
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
      query: ConsultantFindAllParams,
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
     * @name ConsultantFindOne
     * @summary Get a consultant profile by ID
     * @request GET:/admin/consultant/find-one/{id}
     * @secure
     * @response `200` `ConsultantFindOneData`
     * @response `400` `HttpErrorDto`
     */
    findOne: (
      { id, ...query }: ConsultantFindOneParams,
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
      { userId, ...query }: ConsultantFindByUserParams,
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
      { id, ...query }: ConsultantUpdateParams,
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
      { id, ...query }: ConsultantRemoveParams,
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
      query: PublicconsultantFindAllParams,
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
    findAll: (query: MeetingFindAllParams, params: RequestParams = {}) =>
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
      { id, ...query }: MeetingFindOneParams,
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
     * @name MeetingUpdate
     * @summary Update a meeting
     * @request PATCH:/admin/meeting/update/{id}
     * @secure
     * @response `200` `MeetingUpdateData`
     * @response `400` `HttpErrorDto`
     */
    update: (
      { id, ...query }: MeetingUpdateParams,
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
     * @summary Finalize meeting, generate minutes and create follow-up tasks
     * @request POST:/admin/meeting/finalize/{id}
     * @secure
     * @response `200` `MeetingFinalizeData`
     * @response `400` `HttpErrorDto`
     */
    finalize: (
      { id, ...query }: MeetingFinalizeParams,
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
    remove: (
      { id, ...query }: MeetingRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingRemoveData, MeetingRemoveError>({
        path: `/admin/meeting/delete/${id}`,
        method: "DELETE",
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
    findAll: (query: TaskFindAllParams, params: RequestParams = {}) =>
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
    findOne: (
      { id, ...query }: TaskFindOneParams,
      params: RequestParams = {},
    ) =>
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
      { id, ...query }: TaskUpdateParams,
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
      { id, ...query }: TaskUpdateStatusParams,
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
    remove: (
      { id, ...query }: TaskRemoveParams,
      params: RequestParams = {},
    ) =>
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
      query: DiagnosticFindAllParams,
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
      { id, ...query }: DiagnosticFindOneParams,
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
      { id, ...query }: DiagnosticRemoveParams,
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
      query: SubscriptionFindAllParams,
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
      { id, ...query }: SubscriptionFindOneParams,
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
      { userId, ...query }: SubscriptionFindByUserParams,
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
      query: DashboardSummaryParams,
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
  pymeConsultantMatch = {
    /**
     * No description
     *
     * @tags pymeConsultantMatch
     * @name PymeconsultantmatchFindAll
     * @summary Get all PYME and consultant matches paginated
     * @request GET:/admin/pyme-consultant-match/find-all
     * @secure
     * @response `200` `PymeconsultantmatchFindAllData`
     * @response `400` `HttpErrorDto`
     */
    pymeconsultantmatchFindAll: (
      query: PymeconsultantmatchFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeconsultantmatchFindAllData,
        PymeconsultantmatchFindAllError
      >({
        path: `/admin/pyme-consultant-match/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pymeConsultantMatch
     * @name PymeconsultantmatchFindOne
     * @summary Get a PYME and consultant match by ID
     * @request GET:/admin/pyme-consultant-match/find-one/{id}
     * @secure
     * @response `200` `PymeconsultantmatchFindOneData`
     * @response `400` `HttpErrorDto`
     */
    pymeconsultantmatchFindOne: (
      { id, ...query }: PymeconsultantmatchFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeconsultantmatchFindOneData,
        PymeconsultantmatchFindOneError
      >({
        path: `/admin/pyme-consultant-match/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pymeConsultantMatch
     * @name PymeconsultantmatchCreate
     * @summary Create a PYME and consultant match
     * @request POST:/admin/pyme-consultant-match/create
     * @secure
     * @response `200` `PymeconsultantmatchCreateData`
     * @response `400` `HttpErrorDto`
     */
    pymeconsultantmatchCreate: (
      data: PymeConsultantMatchCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeconsultantmatchCreateData,
        PymeconsultantmatchCreateError
      >({
        path: `/admin/pyme-consultant-match/create`,
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
     * @tags pymeConsultantMatch
     * @name PymeconsultantmatchUpdate
     * @summary Update a PYME and consultant match
     * @request PATCH:/admin/pyme-consultant-match/update/{id}
     * @secure
     * @response `200` `PymeconsultantmatchUpdateData`
     * @response `400` `HttpErrorDto`
     */
    pymeconsultantmatchUpdate: (
      { id, ...query }: PymeconsultantmatchUpdateParams,
      data: PymeConsultantMatchUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeconsultantmatchUpdateData,
        PymeconsultantmatchUpdateError
      >({
        path: `/admin/pyme-consultant-match/update/${id}`,
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
     * @tags pymeConsultantMatch
     * @name PymeconsultantmatchRemove
     * @summary Soft-delete a PYME and consultant match
     * @request DELETE:/admin/pyme-consultant-match/delete/{id}
     * @secure
     * @response `200` `PymeconsultantmatchRemoveData`
     * @response `400` `HttpErrorDto`
     */
    pymeconsultantmatchRemove: (
      { id, ...query }: PymeconsultantmatchRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeconsultantmatchRemoveData,
        PymeconsultantmatchRemoveError
      >({
        path: `/admin/pyme-consultant-match/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  pymeConsultantMessage = {
    /**
     * No description
     *
     * @tags pymeConsultantMessage
     * @name PymeconsultantmessageFindAll
     * @summary Get messages by accepted PYME and consultant match
     * @request GET:/admin/pyme-consultant-message/find-all
     * @secure
     * @response `200` `PymeconsultantmessageFindAllData`
     * @response `400` `HttpErrorDto`
     */
    pymeconsultantmessageFindAll: (
      query: PymeconsultantmessageFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeconsultantmessageFindAllData,
        PymeconsultantmessageFindAllError
      >({
        path: `/admin/pyme-consultant-message/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pymeConsultantMessage
     * @name PymeconsultantmessageCreate
     * @summary Create a message in an accepted PYME and consultant match
     * @request POST:/admin/pyme-consultant-message/create
     * @secure
     * @response `200` `PymeconsultantmessageCreateData`
     * @response `400` `HttpErrorDto`
     */
    pymeconsultantmessageCreate: (
      data: PymeConsultantMessageCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeconsultantmessageCreateData,
        PymeconsultantmessageCreateError
      >({
        path: `/admin/pyme-consultant-message/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
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
      { publicId, ...query }: StorageDeleteParams,
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
> = ApiArgs<Module, Method> extends [infer Query, ...any[]]
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
  ParamName extends ApiArgs<Module, Method> extends [infer Arg1, ...any[]]
    ? keyof Arg1
    : never
> = ApiArgs<Module, Method> extends [infer Arg1, ...any[]]
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
