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

export interface ConsultantEducationDto {
  /** @example "Contabilidad y Finanzas" */
  degree: string;
  /** @example "Universidad de Lima" */
  institution?: string;
  /** @example "2014" */
  year?: string;
}

export interface ConsultantCaseStudyDto {
  /** @example "Orden financiero para cadena gastronómica" */
  title: string;
  /** @example "No contaban con flujo de caja proyectado." */
  problem?: string;
  /** @example "Implementó tablero financiero y control semanal." */
  action?: string;
  /** @example "Reducción de quiebres de caja en 35%." */
  result?: string;
  /** @example "Gastronomía" */
  sector?: string;
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
   * DNI validado del consultor
   * @example "72750623"
   */
  documentNumber?: string;
  /**
   * Apellido paterno usado en la validación de identidad
   * @example "Pérez"
   */
  paternalLastName?: string;
  /**
   * Apellido materno usado en la validación de identidad
   * @example "Gómez"
   */
  maternalLastName?: string;
  /**
   * Fecha de nacimiento usada en la validación de identidad
   * @example "1990-05-21"
   */
  birthDate?: string;
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
  /** @example "Consultor financiero y tributario para PYMES" */
  headline?: string;
  /** @example "Lima, Perú" */
  location?: string;
  /**
   * @default "remote"
   * @example "remote"
   */
  workModality?: "remote";
  /** @example "https://www.linkedin.com/in/carlos-mendoza" */
  linkedinUrl?: string;
  /** @example "Consultor en finanzas para PYMES." */
  bio?: string;
  /** @example ["Financiera","Tributario / Contable"] */
  diagnosticAreas?: (
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
  )[];
  /** @example ["Finanzas","Tributario"] */
  specialties?: string[];
  /** @example ["Retail","Manufactura"] */
  sectors?: string[];
  /** @example ["Comercio","Gastronomia"] */
  industries?: string[];
  /** @example ["Microempresa","Pequeña empresa"] */
  companyTypes?: string[];
  /** @example ["Diagnóstico","Implementación"] */
  services?: string[];
  /** @example 12 */
  yearsExperience?: number;
  education?: ConsultantEducationDto[];
  /** @example ["NIIF para PYMES"] */
  certifications?: string[];
  /** @example ["Retail","Logistica"] */
  workedSectors?: string[];
  caseStudies?: ConsultantCaseStudyDto[];
  /** @example "Texto extraido del CV del consultor..." */
  cvText?: string;
  /** @example "https://storage.example.com/consultants/cv.pdf" */
  cvUrl?: string;
  /** @default "pyme" */
  role: "pyme" | "consultor";
}

export interface GoogleAuthUrlResponseDto {
  /** @example "https://accounts.google.com/o/oauth2/v2/auth?..." */
  url: string;
}

export interface ForgotPasswordDto {
  /**
   * Correo electrónico del usuario
   * @example "usuario@hubsme.com"
   */
  email: string;
}

export interface MessageResponseDto {
  /**
   * Mensaje de respuesta
   * @example "Operación realizada con éxito"
   */
  message: string;
}

export interface ResetPasswordDto {
  /** Token de restablecimiento enviado por correo electrónico */
  token: string;
  /**
   * Nueva contraseña elegida por el usuario
   * @example "NuevaContrasena123"
   */
  password: string;
}

export interface EmailSendDto {
  /**
   * Correo del destinatario
   * @example "cliente@hubsme.net"
   */
  to: string;
  /**
   * Asunto del correo
   * @example "Bienvenido a Hubsme"
   */
  subject: string;
  /**
   * Mensaje en texto plano
   * @example "Contenido del correo en texto plano"
   */
  text: string;
  /**
   * Mensaje en formato HTML
   * @example "<p>Contenido del correo en HTML</p>"
   */
  html?: string;
}

export interface EmailSendResultDto {
  /** @example "Correo enviado exitosamente" */
  message: string;
  /** @example "<abc123@mail.gmail.com>" */
  messageId: string;
}

export interface DniVerificationDto {
  /**
   * Número de DNI peruano de 8 dígitos
   * @example "72750623"
   */
  documentNumber: string;
  /** @example "Juan" */
  firstName: string;
  /** @example "Pérez" */
  paternalLastName: string;
  /** @example "Gómez" */
  maternalLastName: string;
  /**
   * Fecha en formato ISO: YYYY-MM-DD
   * @example "1990-05-21"
   */
  birthDate: string;
}

export interface DniVerificationMatchesDto {
  /** Coincide el número de DNI consultado con el registro devuelto */
  documentNumber: boolean;
  firstName: boolean;
  paternalLastName: boolean;
  maternalLastName: boolean;
  birthDate: boolean;
}

export interface DniVerificationIdentityDto {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_completo: string;
  genero: string;
  fecha_nacimiento: string;
  codigo_verificacion: string;
}

export interface DniVerificationResultDto {
  /** Indica si todos los datos enviados coinciden */
  verified: boolean;
  /** Indica si PeruDevs encontró un registro para el DNI */
  providerFound: boolean;
  matches: DniVerificationMatchesDto;
  /** Datos devueltos por el proveedor para conservarlos internamente al crear la cuenta */
  identity: DniVerificationIdentityDto | null;
  /** @example "Los datos coinciden con el registro consultado." */
  message: string;
}

export interface RucVerificationDto {
  /**
   * Número de RUC peruano de 11 dígitos
   * @example "20123456789"
   */
  ruc: string;
}

export interface RucVerificationResultDto {
  /** Indica si el RUC existe en el registro consultado */
  verified: boolean;
  /** Indica si PeruDevs encontró información para el RUC */
  providerFound: boolean;
  /**
   * Nombre comercial asociado al RUC; usa la razón social cuando el proveedor no informa un nombre comercial
   * @example "Textiles del Sur SAC"
   */
  nombreComercial: string | null;
  /** @example "El RUC existe en el registro consultado." */
  message: string;
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
  logoUrl: string | null;
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
  userEmail: string;
  authProvider: "local" | "google";
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

export interface ConsultantListItemDto {
  id: number;
  userId: number;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  ownerPhone: string | null;
  headline: string | null;
  location: string | null;
  workModality: "remote";
  linkedinUrl: string | null;
  bio: string | null;
  diagnosticAreas: (
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
  )[];
  specialties: string[];
  sectors: string[];
  industries: string[];
  companyTypes: string[];
  services: string[];
  yearsExperience: number;
  education: ConsultantEducationDto[];
  certifications: string[];
  workedSectors: string[];
  caseStudies: ConsultantCaseStudyDto[];
  cvText: string | null;
  photoUrl: string | null;
  videoUrl: string | null;
  pricePerHour: string;
  rating: string;
  totalReviews: number;
  active: "true" | "false";
  validated: "true" | "false";
  /** @format date-time */
  createdAt: string;
}

export interface ConsultantListDto {
  data: ConsultantListItemDto[];
  meta: PaginationMetaDto;
}

export interface PymeMeetingDocumentDto {
  id: number;
  pymeId: number;
  pymeName: string;
  pymeLogoUrl: string | null;
  consultantId: number;
  consultantName: string;
  consultantPhotoUrl: string | null;
  title: string;
  description: string | null;
  status:
    | "solicitada"
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada";
  /** @format date-time */
  startTime: string | null;
  /** @format date-time */
  completedAt: string | null;
}

export interface PymeMeetingDocumentsDto {
  data: PymeMeetingDocumentDto[];
  meta: PaginationMetaDto;
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

export interface DiagnosticFodaDto {
  fortalezas: string[];
  oportunidades: string[];
  debilidades: string[];
  amenazas: string[];
}

export interface DiagnosticPayloadDto {
  resumenEjecutivo: string;
  puntajeGeneral: number;
  feedbackIa: string;
  areasEvaluadas: DiagnosticAreaDto[];
  problemasCriticos: DiagnosticProblemDto[];
  recomendaciones: DiagnosticRecommendationDto[];
  foda?: DiagnosticFodaDto;
}

export interface PymeDiagnosticDocumentDto {
  id: number;
  pymeId: number;
  pymeName: string;
  pymeLogoUrl: string | null;
  /** @format date-time */
  createdAt: string;
  summary: string;
  result: DiagnosticPayloadDto;
  score: number;
}

export interface PymeDiagnosticDocumentsDto {
  data: PymeDiagnosticDocumentDto[];
  meta: PaginationMetaDto;
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

export interface AdminLoginDto {
  /** @example "admin" */
  username: string;
  /** @example "********" */
  password: string;
}

export interface AdminLoginUserDto {
  /** @example "admin" */
  username: string;
  role: "admin";
}

export interface AdminLoginResponseDto {
  accessToken: string;
  user: AdminLoginUserDto;
}

export interface WhatsappSendDto {
  /**
   * Numero de WhatsApp del destinatario. Puede enviarse con o sin @s.whatsapp.net
   * @example "51929073820"
   */
  phone: string;
  /**
   * Mensaje que se enviara por WhatsApp
   * @example "123456"
   */
  message: string;
}

export interface WhatsappSendResultDto {
  /** @example "Mensaje enviado exitosamente" */
  message: string;
  /** @example "51929073820@s.whatsapp.net" */
  phone: string;
  /** @example 201 */
  providerStatus: number;
  /** @example {"success":true} */
  providerResponse?: object | null;
}

export interface WhatsappNotificacionPymeDto {
  /**
   * Número de WhatsApp del destinatario (sin @s.whatsapp.net)
   * @example "51929073820"
   */
  to: string;
  /**
   * Nombre de la PYME
   * @example "Erick"
   */
  nombre_pyme: string;
  /**
   * Nombre del consultor
   * @example "Miguel Salinas"
   */
  nombre_consultor: string;
  /**
   * Título de la sesión
   * @example "Sesión con Miguel Salinas"
   */
  titulo_sesion: string;
  /**
   * Fecha y hora de la sesión
   * @example "26/06/2026, 12:00 pm"
   */
  fecha_hora: string;
  /**
   * Duración de la sesión
   * @example "60 minutos"
   */
  duracion: string;
}

export interface WhatsappNotificacionConsultorDto {
  /**
   * Número de WhatsApp del destinatario (sin @s.whatsapp.net)
   * @example "51929073820"
   */
  to: string;
  /**
   * Nombre del consultor
   * @example "Miguel Salinas"
   */
  nombre_consultor: string;
  /**
   * Nombre de la PYME
   * @example "CyM Ingenieros SAC"
   */
  nombre_pyme: string;
  /**
   * Título de la sesión
   * @example "Sesión con Miguel Salinas"
   */
  titulo_sesion: string;
  /**
   * Fecha y hora de la sesión
   * @example "26/06/2026, 12:00 pm"
   */
  fecha_hora: string;
  /**
   * Duración de la sesión
   * @example "60 minutos"
   */
  duracion: string;
}

export interface WhatsappNotificacionCancelacionPymeDto {
  /** @example "51929073820" */
  to: string;
  /** @example "CyM Ingenieros SAC" */
  nombre_pyme: string;
  /** @example "Sesión con Miguel Salinas" */
  tema_reunion: string;
  /** @example "Miguel Salinas" */
  nombre_consultor: string;
  /** @example "15 de jul., 6:00 p. m." */
  fecha_hora: string;
  /** @example "60 min." */
  duracion_reunion: string;
  /** @example "El consultor presentó un inconveniente personal." */
  motivo_cancelacion: string;
  /** @example "REUNION-FREE-A1B2C3D4E5F6" */
  codigo_cupon: string;
}

export interface WhatsappAlertaReunionConsultorDto {
  /**
   * Número de WhatsApp del destinatario (sin @s.whatsapp.net)
   * @example "51929073820"
   */
  to: string;
  /**
   * Tiempo restante para el inicio de la reunión
   * @example "15 min"
   */
  tiempo_restante: string;
  /**
   * Nombre del consultor
   * @example "Miguel Salinas"
   */
  nombre_consultor: string;
  /**
   * Nombre de la PYME
   * @example "CyM Ingenieros SAC"
   */
  nombre_pyme: string;
  /**
   * Título de la sesión
   * @example "Sesión con Miguel Salinas"
   */
  titulo_sesion: string;
  /**
   * Fecha y hora de la sesión
   * @example "09/09/2026"
   */
  fecha_hora: string;
  /**
   * Duración de la reunión
   * @example "60 minutos"
   */
  tiempo: string;
  /**
   * Enlace protegido de la reunión en el frontend
   * @example "https://www.hubsme.net/reuniones/42"
   */
  enlace: string;
}

export interface WhatsappAlertaReunionDto {
  /**
   * Número de WhatsApp del destinatario (sin @s.whatsapp.net)
   * @example "51929073820"
   */
  to: string;
  /**
   * Tiempo restante para el inicio de la reunión
   * @example "15 minutos"
   */
  tiempo_restante: string;
  /**
   * Nombre de la PYME
   * @example "Erick"
   */
  nombre_pyme: string;
  /**
   * Nombre del consultor
   * @example "Miguel Salinas"
   */
  nombre_consultor: string;
  /**
   * Título de la sesión
   * @example "Sesión con Miguel Salinas"
   */
  titulo_sesion: string;
  /**
   * Fecha y hora de la sesión
   * @example "09/09/2026"
   */
  fecha_hora: string;
  /**
   * Duración de la reunión
   * @example "60 minutos"
   */
  tiempo: string;
  /**
   * Enlace protegido de la reunión en el frontend
   * @example "https://www.hubsme.net/reuniones/42"
   */
  enlace: string;
}

export interface WhatsappConsultorConfirmarReunionDto {
  /** @example "+51999999999" */
  to: string;
  /**
   * ID interno usado en el payload de los botones
   * @example 42
   */
  reunion_id: number;
  /** @example "Miguel Salinas" */
  nombre_consultor: string;
  /** @example "CyM Ingenieros SAC" */
  nombre_pyme: string;
  /** @example "Sesión de transformación digital" */
  tema_reunion: string;
  /** @example "60 minutos" */
  duracion_reunion: string;
  /** @example "15 de jul., 6:00 p. m." */
  horario_opcion_a: string;
  /** @example "16 de jul., 2:00 p. m." */
  horario_opcion_b: string;
  /** @example "17 de jul., 8:00 p. m." */
  horario_opcion_c: string;
}

export interface WhatsappWebhookPayloadDto {
  /** @example "whatsapp_business_account" */
  object?: string;
  /** @example [{"changes":[{"field":"messages","value":{"messages":[{"from":"51999999999","type":"button","button":{"text":"Horario A","payload":"meeting:42:option:a"}}]}}]}] */
  entry?: object[];
}

export interface WhatsappWebhookAcceptedDto {
  /** @example true */
  received: boolean;
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
  /** @format date-time */
  meetingStartTime?: string | null;
  meetingTitle?: string | null;
  serviceRequestId: number | null;
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
  serviceRequestId: number | null;
  serviceMilestoneIndex: number | null;
  title: string;
  /** @format date-time */
  startTime: string | null;
  proposedStartTimes: string[];
  durationMinutes: number;
  /** Indica si la reunión tiene un acceso virtual configurado */
  hasMeetingLink: boolean;
  status:
    | "solicitada"
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada";
  requestedBy: "pyme" | "consultor";
  meetingType: "consultoria" | "servicio";
  description: string | null;
  cancellationReason: string | null;
  /** @format date-time */
  completedAt: string | null;
  tasks?: TaskResultDto[];
}

export interface MeetingListDto {
  data: MeetingResultDto[];
  meta: PaginationMetaDto;
}

export interface MeetingAdminResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  pymeId: number;
  consultantId: number;
  serviceRequestId: number | null;
  serviceMilestoneIndex: number | null;
  title: string;
  /** @format date-time */
  startTime: string | null;
  proposedStartTimes: string[];
  durationMinutes: number;
  /** Indica si la reunión tiene un acceso virtual configurado */
  hasMeetingLink: boolean;
  status:
    | "solicitada"
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada";
  requestedBy: "pyme" | "consultor";
  meetingType: "consultoria" | "servicio";
  description: string | null;
  cancellationReason: string | null;
  /** @format date-time */
  completedAt: string | null;
  tasks?: TaskResultDto[];
  /** Enlace original de Microsoft Teams, disponible únicamente en el backoffice */
  meetingUrl: string | null;
}

export interface MeetingCalendarItemDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  pymeId: number;
  pymeName: string;
  consultantId: number;
  serviceRequestId: number | null;
  serviceMilestoneIndex: number | null;
  consultantName: string;
  consultantPhotoUrl: string | null;
  /** @example "150.00" */
  consultantPricePerHour: string;
  title: string;
  /** @format date-time */
  startTime: string | null;
  proposedStartTimes: string[];
  durationMinutes: number;
  /** Indica si la reunión tiene un acceso virtual configurado */
  hasMeetingLink: boolean;
  status:
    | "solicitada"
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada";
  requestedBy: "pyme" | "consultor";
  meetingType: "consultoria" | "servicio";
  description: string | null;
  cancellationReason: string | null;
  /** @format date-time */
  completedAt: string | null;
}

export interface MeetingCalendarListDto {
  data: MeetingCalendarItemDto[];
  meta: PaginationMetaDto;
}

export interface MeetingAccessResultDto {
  id: number;
  title: string;
  status: "available" | "upcoming" | "expired" | "unavailable";
  /** @format date-time */
  startTime: string | null;
  /** @format date-time */
  endTime: string | null;
  /** @format date-time */
  accessStartsAt: string | null;
  /** @format date-time */
  accessEndsAt: string | null;
  redirectUrl: string | null;
  hasMinutes: boolean;
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
  startTime?: string;
  /** @example ["2026-05-10T15:00:00.000Z","2026-05-10T16:00:00.000Z","2026-05-11T15:00:00.000Z"] */
  proposedStartTimes?: string[];
  /** @example 60 */
  durationMinutes?: number;
  /** @example "Revisar objetivos, contexto y dudas principales para la sesion." */
  description?: string;
  /** @default "pyme" */
  requestedBy?: "pyme" | "consultor";
  /** @default "consultoria" */
  meetingType?: "consultoria" | "servicio";
  /** @example 42 */
  serviceRequestId?: number;
  /**
   * @min 0
   * @example 0
   */
  serviceMilestoneIndex?: number;
}

export interface MeetingConfirmOptionDto {
  /** @example "2026-05-10T15:00:00.000Z" */
  selectedStartTime: string;
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
  /** Listado de compromisos sugeridos para la PYME y el consultor */
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
  /** @example ["2026-05-10T15:00:00.000Z","2026-05-10T16:00:00.000Z","2026-05-11T15:00:00.000Z"] */
  proposedStartTimes?: string[];
  /** @example 60 */
  durationMinutes?: number;
  /** @example "Revisar objetivos, contexto y dudas principales para la sesion." */
  description?: string;
  status?:
    | "solicitada"
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada";
}

export interface MeetingConsultantCancelDto {
  /**
   * @minLength 10
   * @maxLength 500
   * @example "Se presentó un inconveniente personal y no podré asistir."
   */
  reason: string;
}

export interface MeetingConsultantCancelResultDto {
  meeting: MeetingResultDto;
  /** @example "REUNION-FREE-A1B2C3D4E5F6" */
  promotionCode: string;
}

export interface MeetingFinalizeTaskDto {
  /**
   * ID de la tarea existente al editar un acta
   * @min 1
   */
  id?: number;
  /** @example "Preparar propuesta de optimizacion" */
  title: string;
  /** @example "Detallar alcance, tiempos y siguientes pasos." */
  description: string;
  /** @example "consultor" */
  assignedTo: "pyme" | "consultor";
  /** @example "media" */
  priority: "alta" | "media" | "baja";
  /** @default "pendiente" */
  status?: "pendiente" | "en_progreso" | "completada" | "bloqueada";
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
  /** Listado de compromisos sugeridos para la PYME y el consultor */
  tasks: TaskSuggestionDto[];
}

export interface ConsultantCvRunDto {
  /**
   * Texto extraido del PDF del CV en el frontend
   * @example "Carlos Mendoza Rivas
   * Consultor financiero y tributario para PYMES..."
   */
  text: string;
  /** Prompt opcional para ajustar la extraccion del CV */
  prompt?: string;
}

export interface ConsultantCvProfileResultDto {
  /** @example "Carlos" */
  firstName?: string;
  /** @example "Mendoza Rivas" */
  lastName?: string;
  /** @example "Carlos Mendoza Rivas" */
  fullName?: string;
  /** @example "Consultor financiero y tributario para PYMES" */
  headline?: string;
  /** @example "Lima, Perú" */
  location?: string;
  /** @example "remote" */
  workModality: "remote";
  /** @example "Consultor financiero con foco en orden tributario." */
  bio?: string;
  /** @example "51929073820" */
  ownerPhone?: string;
  /** @example "https://www.linkedin.com/in/carlos-mendoza" */
  linkedinUrl?: string;
  /** @example ["Finanzas","Tributario"] */
  specialties: string[];
  /** @example ["Retail","Manufactura"] */
  sectors: string[];
  /** @example ["Comercio","Gastronomia"] */
  industries: string[];
  /** @example ["Microempresa","Pequeña empresa"] */
  companyTypes: string[];
  /** @example ["Diagnóstico","Implementación"] */
  services: string[];
  /** @example 12 */
  yearsExperience: number;
  education: ConsultantEducationDto[];
  /** @example ["NIIF para PYMES"] */
  certifications: string[];
  /** @example ["Retail","Logistica"] */
  workedSectors: string[];
  caseStudies: ConsultantCaseStudyDto[];
}

export interface ServiceRequestChatMessageDto {
  role: "assistant" | "user";
  /** @maxLength 2000 */
  content: string;
}

export interface ServiceRequestMilestoneDraftDto {
  /** @maxLength 240 */
  title: string;
  /**
   * @maxLength 10
   * @example "2026-09-15"
   */
  dueDate: string;
}

export interface ServiceRequestDraftDto {
  /** @maxLength 160 */
  title: string;
  category:
    | ""
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable";
  /** @maxLength 120 */
  subcategory: string;
  /** @maxLength 5000 */
  description: string;
  /** @maxLength 5000 */
  expectedOutcome: string;
  /** @maxLength 5000 */
  requirements: string;
  /** @maxItems 20 */
  deliverables: string[];
  /** @maxLength 5000 */
  exclusions: string;
  /** @maxItems 10 */
  referenceUrls: string[];
  budgetType: "" | "fixed" | "range";
  /** @maxLength 20 */
  budgetMin: string;
  /** @maxLength 20 */
  budgetMax: string;
  /**
   * @maxLength 10
   * @example "2026-09-30"
   */
  deadline: string;
  /**
   * @maxLength 160
   * @example "4 semanas"
   */
  estimatedDuration: string;
  workModality: "remote";
  /** @maxLength 5000 */
  workMethod: string;
  /** @maxItems 20 */
  milestones: ServiceRequestMilestoneDraftDto[];
  /** @maxLength 5000 */
  details: string;
}

export interface ServiceRequestChatRunDto {
  /**
   * @maxItems 40
   * @minItems 2
   */
  messages: ServiceRequestChatMessageDto[];
  draft?: ServiceRequestDraftDto;
  /**
   * Acta finalizada de consultoría que se usará como contexto inicial de la solicitud
   * @min 1
   */
  sourceMeetingId?: number;
  /**
   * Tarea concreta del acta que se usará como alcance inicial de la solicitud
   * @min 1
   */
  sourceTaskId?: number;
}

export interface ServiceRequestChatResultDto {
  /** @maxLength 1500 */
  message: string;
  phase: "gathering" | "confirming" | "complete";
  /** Indica si la PYME ya puede continuar a la revisión de la solicitud */
  isComplete: boolean;
  draft: ServiceRequestDraftDto;
  /** @maxItems 12 */
  missingInformation: string[];
}

export interface ServicePaymentPlanRunDto {
  draft: ServiceRequestDraftDto;
}

export interface ServiceRequestPaymentInstallmentDto {
  /**
   * @maxLength 180
   * @example "Pago inicial para iniciar el servicio"
   */
  label: string;
  /**
   * @min 10
   * @max 100
   * @example 30
   */
  percentage: number;
  trigger: "service_approval" | "milestone_completion" | "service_completion";
  /**
   * @min 0
   * @example 0
   */
  milestoneIndex: number;
}

export interface ServicePaymentPlanResultDto {
  strategy: "single" | "initial_final" | "milestone_installments";
  /**
   * @maxLength 240
   * @example "30% inicial y 70% al finalizar"
   */
  summary: string;
  /** @maxLength 1200 */
  rationale: string;
  /**
   * @maxItems 6
   * @minItems 1
   */
  installments: ServiceRequestPaymentInstallmentDto[];
}

export interface ServiceConsultantMatchRunDto {
  draft: ServiceRequestDraftDto;
}

export interface ServiceConsultantMatchDto {
  consultantId: number;
  fullName: string;
  headline: string | null;
  photoUrl: string | null;
  diagnosticAreas: (
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
  )[];
  specialties: string[];
  services: string[];
  yearsExperience: number;
  rating: string;
  /** @maxLength 400 */
  reason: string;
}

export interface ServiceConsultantMatchesResultDto {
  /**
   * @maxItems 3
   * @minItems 3
   */
  matches: ServiceConsultantMatchDto[];
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

export interface ConsultantResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string | null;
  userId: number;
  userEmail: string;
  authProvider: "local" | "google";
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  /** @example "72750623" */
  dni: string | null;
  /**
   * @format date
   * @example "1990-05-21"
   */
  birthDate: string | null;
  ownerPhone: string | null;
  headline: string | null;
  location: string | null;
  workModality: "remote";
  linkedinUrl: string | null;
  bio: string | null;
  diagnosticAreas: (
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
  )[];
  specialties: string[];
  sectors: string[];
  industries: string[];
  companyTypes: string[];
  services: string[];
  yearsExperience: number;
  education: ConsultantEducationDto[];
  certifications: string[];
  workedSectors: string[];
  caseStudies: ConsultantCaseStudyDto[];
  cvText: string | null;
  cvUrl: string | null;
  photoUrl: string | null;
  videoUrl: string | null;
  pricePerHour: string;
  /**
   * Horas mínimas de anticipación para reservar.
   * @default 48
   * @example 48
   */
  minimumBookingNoticeHours: number;
  rating: string;
  totalReviews: number;
  active: "true" | "false";
  validated: "true" | "false";
}

export interface MercadoPagoAccountProfileDto {
  /** @example "123456789" */
  id: string | null;
  /** @example "consultor_mp" */
  nickname: string | null;
  /** @example "consultor@mail.com" */
  email: string | null;
  /** @example "Miguel" */
  firstName: string | null;
  /** @example "Salinas" */
  lastName: string | null;
  /** @example "MPE" */
  siteId: string | null;
  /** @example "PE" */
  countryId: string | null;
  /** @example "normal" */
  userType: string | null;
  /** @example "https://www.mercadolibre.com.pe/perfil/consultor_mp" */
  permalink: string | null;
  /**
   * @format date-time
   * @example "2026-06-17T15:00:00.000Z"
   */
  registrationDate: string | null;
  /**
   * @format date-time
   * @example "2026-06-17T15:00:00.000Z"
   */
  dateCreated: string | null;
}

export interface ConsultantMercadoPagoAdminDto {
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
  /**
   * @format date-time
   * @example "2026-06-17T15:00:00.000Z"
   */
  lastUpdatedAt: string | null;
  accountProfile: MercadoPagoAccountProfileDto | null;
  /**
   * @format date-time
   * @example "2026-06-17T15:00:00.000Z"
   */
  tokenExpiresAt: string | null;
  /**
   * @format date-time
   * @example "2026-08-19T15:30:00.000Z"
   */
  profileLastCheckedAt: string | null;
  /** @example null */
  profileError: string | null;
}

export interface MercadoPagoFinancialReportDto {
  /** @example "123456789" */
  id: string | null;
  /**
   * @format date-time
   * @example "2026-08-01T00:00:00.000Z"
   */
  beginDate: string | null;
  /**
   * @format date-time
   * @example "2026-08-19T23:59:59.000Z"
   */
  endDate: string | null;
  /** @example "settlement_report_20260819.csv" */
  fileName: string | null;
  /**
   * @format date-time
   * @example "2026-08-19T15:30:00.000Z"
   */
  createdAt: string | null;
}

export interface ConsultantMercadoPagoFinancialAdminDto {
  /** @example true */
  connected: boolean;
  /** @example "available" */
  status: "available" | "not_available" | "error";
  /** @example "PEN" */
  currency: string | null;
  /** @example false */
  balanceAvailable: boolean;
  /** @example 4 */
  reportCount: number;
  latestReport: MercadoPagoFinancialReportDto | null;
  /**
   * @format date-time
   * @example "2026-08-19T15:30:00.000Z"
   */
  lastUpdatedAt: string | null;
  /** @example "Se encontró el último reporte financiero disponible." */
  message: string;
}

export interface ConsultantApprovalDto {
  /** Estado de aprobación asignado manualmente por backoffice */
  validated: "true" | "false";
}

export interface ConsultantActiveDto {
  /** Estado de disponibilidad del consultor */
  active: "true" | "false";
}

export interface ConsultantMeetingDocumentDto {
  id: number;
  pymeId: number;
  pymeName: string;
  pymeLogoUrl: string | null;
  title: string;
  description: string | null;
  status:
    | "solicitada"
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada";
  /** @format date-time */
  startTime: string | null;
  /** @format date-time */
  completedAt: string | null;
}

export interface ConsultantMeetingDocumentsDto {
  data: ConsultantMeetingDocumentDto[];
  meta: PaginationMetaDto;
}

export interface ConsultantDiagnosticDocumentDto {
  id: number;
  pymeId: number;
  pymeName: string;
  pymeLogoUrl: string | null;
  /** @format date-time */
  createdAt: string;
  summary: string;
  result: DiagnosticPayloadDto;
  score: number;
}

export interface ConsultantDiagnosticDocumentsDto {
  data: ConsultantDiagnosticDocumentDto[];
  meta: PaginationMetaDto;
}

export interface ConsultantCreateDto {
  /** @example 3 */
  userId: number;
  /** @example "Carlos" */
  firstName?: string;
  /** @example "Mendoza" */
  lastName?: string;
  /**
   * DNI validado del consultor
   * @example "72750623"
   */
  dni?: string;
  /**
   * Fecha de nacimiento validada del consultor en formato YYYY-MM-DD
   * @example "1990-05-21"
   */
  birthDate?: string;
  /** @example "Carlos Mendoza" */
  fullName?: string;
  /** @example "51929073820" */
  ownerPhone?: string;
  /** @example "Consultor financiero y tributario para PYMES" */
  headline?: string;
  /** @example "Lima, Perú" */
  location?: string;
  /**
   * @default "remote"
   * @example "remote"
   */
  workModality?: "remote";
  /** @example "https://www.linkedin.com/in/carlos-mendoza" */
  linkedinUrl?: string;
  /** @example "Consultor en transformacion digital para PYMES." */
  bio?: string;
  /** @example ["Estratégica","Operaciones"] */
  diagnosticAreas?: (
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
  )[];
  /** @example ["Tecnologia","Operaciones"] */
  specialties?: string[];
  /** @example ["Retail","Manufactura"] */
  sectors?: string[];
  /** @example ["Comercio","Gastronomia"] */
  industries?: string[];
  /** @example ["Microempresa","Pequeña empresa"] */
  companyTypes?: string[];
  /** @example ["Diagnóstico","Implementación"] */
  services?: string[];
  /** @example 12 */
  yearsExperience?: number;
  education?: ConsultantEducationDto[];
  /** @example ["NIIF para PYMES"] */
  certifications?: string[];
  /** @example ["Retail","Logistica"] */
  workedSectors?: string[];
  caseStudies?: ConsultantCaseStudyDto[];
  /** @example "Texto extraido del CV del consultor..." */
  cvText?: string;
  /** @example "https://storage.example.com/consultants/cv.pdf" */
  cvUrl?: string;
  /** @example "https://storage.example.com/consultants/photo.jpg" */
  photoUrl?: string;
  /** @example "https://storage.example.com/consultants/video.mp4" */
  videoUrl?: string;
  /** @example 150 */
  pricePerHour?: number;
  /**
   * Horas mínimas de anticipación para reservar. El valor predeterminado es 48 horas.
   * @min 1
   * @max 720
   * @default 48
   * @example 48
   */
  minimumBookingNoticeHours?: number;
  /** @default "true" */
  active?: "true" | "false";
}

export interface ConsultantUpdateDto {
  /** @example 3 */
  userId?: number;
  /** @example "Carlos" */
  firstName?: string;
  /** @example "Mendoza" */
  lastName?: string;
  /**
   * DNI validado del consultor
   * @example "72750623"
   */
  dni?: string;
  /**
   * Fecha de nacimiento validada del consultor en formato YYYY-MM-DD
   * @example "1990-05-21"
   */
  birthDate?: string;
  /** @example "Carlos Mendoza" */
  fullName?: string;
  /** @example "51929073820" */
  ownerPhone?: string;
  /** @example "Consultor financiero y tributario para PYMES" */
  headline?: string;
  /** @example "Lima, Perú" */
  location?: string;
  /**
   * @default "remote"
   * @example "remote"
   */
  workModality?: "remote";
  /** @example "https://www.linkedin.com/in/carlos-mendoza" */
  linkedinUrl?: string;
  /** @example "Consultor en transformacion digital para PYMES." */
  bio?: string;
  /** @example ["Estratégica","Operaciones"] */
  diagnosticAreas?: (
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
  )[];
  /** @example ["Tecnologia","Operaciones"] */
  specialties?: string[];
  /** @example ["Retail","Manufactura"] */
  sectors?: string[];
  /** @example ["Comercio","Gastronomia"] */
  industries?: string[];
  /** @example ["Microempresa","Pequeña empresa"] */
  companyTypes?: string[];
  /** @example ["Diagnóstico","Implementación"] */
  services?: string[];
  /** @example 12 */
  yearsExperience?: number;
  education?: ConsultantEducationDto[];
  /** @example ["NIIF para PYMES"] */
  certifications?: string[];
  /** @example ["Retail","Logistica"] */
  workedSectors?: string[];
  caseStudies?: ConsultantCaseStudyDto[];
  /** @example "Texto extraido del CV del consultor..." */
  cvText?: string;
  /** @example "https://storage.example.com/consultants/cv.pdf" */
  cvUrl?: string;
  /** @example "https://storage.example.com/consultants/photo.jpg" */
  photoUrl?: string;
  /** @example "https://storage.example.com/consultants/video.mp4" */
  videoUrl?: string;
  /** @example 150 */
  pricePerHour?: number;
  /**
   * Horas mínimas de anticipación para reservar. El valor predeterminado es 48 horas.
   * @min 1
   * @max 720
   * @default 48
   * @example 48
   */
  minimumBookingNoticeHours?: number;
  /** @default "true" */
  active?: "true" | "false";
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

export interface SubscriptionCheckoutDto {
  /**
   * ID del plan de suscripción
   * @example "basic"
   */
  planId: string;
}

export interface SubscriptionCheckoutResultDto {
  /** URL de pago en producción */
  initPoint: string;
  /** URL de pago en sandbox */
  sandboxInitPoint: string;
}

export interface DashboardStatsDto {
  clients: number;
  meetings: number;
  tasks: number;
  diagnostics: number;
  billableHours: number;
}

export interface DashboardLatestDiagnosticDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  score: number;
}

export interface DashboardMeetingStatsDto {
  total: number;
  confirmed: number;
  requested: number;
  pending: number;
  /** Reuniones finalizadas con acta registrada */
  completed: number;
}

export interface DashboardTaskStatusDto {
  pendiente: number;
  enProgreso: number;
  completada: number;
  bloqueada: number;
}

export interface DashboardTaskDeadlineDto {
  id: number;
  title: string;
  /** @format date-time */
  dueDate: string;
  priority: "alta" | "media" | "baja";
  assignedTo: "pyme" | "consultor";
  status: "pendiente" | "en_progreso" | "bloqueada";
}

export interface DashboardMeetingDto {
  id: number;
  title: string;
  /** @format date-time */
  startTime: string;
  durationMinutes: number;
  status: string;
}

export interface DashboardWorkloadClientDto {
  pymeId: number;
  name: string;
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

export interface DashboardAlertDto {
  id: number;
  client: string;
  message: string;
  tone: "danger" | "warning" | "info";
}

export interface DashboardResponseDto {
  stats: DashboardStatsDto;
  latestDiagnostic: DashboardLatestDiagnosticDto | null;
  meetingStats: DashboardMeetingStatsDto;
  taskStatus: DashboardTaskStatusDto;
  upcomingTasks: DashboardTaskDeadlineDto[];
  overdueTasks: DashboardTaskDeadlineDto[];
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
  /** @example ["2026-05-10T15:00:00.000Z","2026-05-10T16:00:00.000Z","2026-05-11T15:00:00.000Z"] */
  proposedStartTimes: string[];
  /** @example 60 */
  durationMinutes?: number;
  /** @example "Sesión de consultoría" */
  title: string;
  /** @example "Detalle de la reunión" */
  description?: string;
}

export interface CheckoutMeetingDetailsDto {
  startTime: string;
  proposedStartTimes: string[];
  durationMinutes: number;
  title: string;
  description?: string;
}

export interface MercadoPagoCheckoutDto {
  id: number;
  meetingId: number | null;
  serviceRequestId: number | null;
  serviceInstallmentIndex: number | null;
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

export interface MercadoPagoPaymentHistoryItemDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  meetingCreatedAt: string | null;
  /** @format date-time */
  meetingStartTime: string | null;
  meetingId: number | null;
  serviceRequestId: number | null;
  serviceInstallmentIndex: number | null;
  pymeId: number;
  consultantId: number;
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
  meetingStatus:
    | "solicitada"
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada"
    | null;
  meetingCancellationReason: string | null;
  serviceTitle: string | null;
  serviceDescription: string | null;
  mercadoPagoPaymentId: string | null;
  pymeName: string | null;
  consultantName: string | null;
  paymentMethod: "payment" | "promotion_code";
  /** Payment method identifier reported by the payment provider, such as yape, visa or account_money */
  paymentMethodId: string | null;
  /** Payment type reported by the payment provider, such as credit_card, debit_card or account_money */
  paymentTypeId: string | null;
  promotionCode: string | null;
}

export interface MercadoPagoPaymentHistoryResponseDto {
  data: MercadoPagoPaymentHistoryItemDto[];
  meta: PaginationMetaDto;
}

export interface MercadoPagoServicePaymentDto {
  /**
   * Índice de la cuota que se desea pagar. Si se omite, se usa la primera pendiente.
   * @min 0
   * @example 0
   */
  installmentIndex?: number;
}

export interface ServiceRequestReferenceAttachmentResultDto {
  storagePath: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ServiceRequestEvidenceAttachmentResultDto {
  storagePath: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  id: string;
  note?: string | null;
  /** @min 0 */
  milestoneIndex?: number | null;
  uploadedAt: string;
  uploadedBy: number;
  uploadedByRole: "pyme" | "consultor";
}

export interface ServiceRequestMilestoneResultDto {
  title: string;
  /** @example "2026-09-15" */
  dueDate: string;
}

export interface ServiceRequestPaymentPlanDto {
  strategy: "single" | "initial_final" | "milestone_installments";
  /**
   * @maxLength 240
   * @example "30% inicial y 70% al finalizar"
   */
  summary: string;
  /** @maxLength 1200 */
  rationale: string;
  /**
   * @maxItems 6
   * @minItems 1
   */
  installments: ServiceRequestPaymentInstallmentDto[];
}

export interface ServiceRequestPaymentScheduleItemDto {
  /** @min 0 */
  installmentIndex: number;
  label: string;
  /**
   * @min 1
   * @max 100
   */
  percentage: number;
  trigger: "service_approval" | "milestone_completion" | "service_completion";
  /** @min 0 */
  milestoneIndex: number;
  amount?: string | null;
  status:
    | "not_started"
    | "created"
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
    | "expired";
  available: boolean;
  availabilityMessage?: string | null;
  /** @format date-time */
  paidAt?: string | null;
}

export interface ServiceRequestResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  pymeId: number;
  consultantId: number;
  serviceOfferId?: number | null;
  initialMeetingProposedStartTimes: string[];
  /** @format date-time */
  initialMeetingStartTime?: string | null;
  pymeName: string | null;
  consultantName: string | null;
  consultantHeadline?: string | null;
  consultantPhotoUrl?: string | null;
  title: string;
  category?:
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
    | null;
  subcategory?: string | null;
  description: string;
  expectedOutcome?: string | null;
  requirements: string;
  deliverables: string[];
  exclusions?: string | null;
  referenceUrls: string[];
  referenceAttachments: ServiceRequestReferenceAttachmentResultDto[];
  evidenceAttachments: ServiceRequestEvidenceAttachmentResultDto[];
  budgetType?: "fixed" | "range" | null;
  budgetMin?: string | null;
  budgetMax?: string | null;
  /** @example "2026-09-30" */
  deadline?: string | null;
  estimatedDuration?: string | null;
  workModality: "remote";
  workMethod?: string | null;
  milestones: ServiceRequestMilestoneResultDto[];
  paymentPlan: ServiceRequestPaymentPlanDto;
  paymentSchedule: ServiceRequestPaymentScheduleItemDto[];
  meetings: MeetingResultDto[];
  details?: string | null;
  status:
    | "requested"
    | "proposal_sent"
    | "consultant_declined"
    | "payment_pending"
    | "paid"
    | "completed"
    | "pyme_declined"
    | "cancelled";
  proposedPrice?: string | null;
  currency: string;
  proposalMessage?: string | null;
  pymeDecisionMessage?: string | null;
  /** @format date-time */
  respondedAt?: string | null;
  /** @format date-time */
  decidedAt?: string | null;
  /** @format date-time */
  paidAt?: string | null;
  /** @format date-time */
  completedAt?: string | null;
}

export interface ServiceRequestListDto {
  data: ServiceRequestResultDto[];
  meta: PaginationMetaDto;
}

export interface ServiceRequestInitialMeetingOptionDto {
  /** @example 12 */
  consultantId: number;
  /**
   * @maxItems 3
   * @minItems 3
   * @example ["2026-08-12T15:00:00.000Z","2026-08-13T15:00:00.000Z","2026-08-14T15:00:00.000Z"]
   */
  proposedStartTimes: string[];
}

export interface ServiceRequestMilestoneCreateDto {
  /** @maxLength 240 */
  title: string;
  /** @example "2026-09-15" */
  dueDate: string;
}

export interface ServiceRequestCreateMultipartDto {
  /**
   * Tarea del acta que originó la solicitud
   * @min 1
   */
  sourceTaskId?: number;
  /**
   * Oferta del catálogo que originó la solicitud
   * @min 1
   */
  serviceOfferId?: number;
  /**
   * @maxItems 3
   * @minItems 1
   * @example [8,12,19]
   */
  consultantIds: number[];
  /**
   * @maxItems 3
   * @minItems 1
   */
  initialMeetingOptions: ServiceRequestInitialMeetingOptionDto[];
  /**
   * @maxLength 160
   * @example "Capacitación de seguridad para el personal"
   */
  title: string;
  /** @example "Marketing" */
  category:
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable";
  /**
   * @maxLength 120
   * @example "Redes sociales"
   */
  subcategory: string;
  /**
   * @maxLength 5000
   * @example "La marca publica sin una estrategia ni calendario definido."
   */
  description: string;
  /**
   * @maxLength 5000
   * @example "Contar con una estrategia y un calendario aplicable durante tres meses."
   */
  expectedOutcome: string;
  /**
   * @maxLength 5000
   * @example "Diagnóstico, propuesta y acompañamiento durante la implementación."
   */
  requirements: string;
  /** @example ["Estrategia documentada en PDF","Calendario editable de 3 meses"] */
  deliverables: string[];
  /** @maxLength 5000 */
  exclusions?: string;
  /** @maxItems 10 */
  referenceUrls?: string[];
  budgetType: "fixed" | "range";
  /**
   * @min 0.01
   * @example 1500
   */
  budgetMin: number;
  /**
   * @min 0.01
   * @example 2500
   */
  budgetMax?: number;
  /** @example "2026-09-30" */
  deadline: string;
  /**
   * @maxLength 160
   * @example "4 semanas"
   */
  estimatedDuration: string;
  /** @example "remote" */
  workModality: "remote";
  /**
   * @maxLength 5000
   * @example "Una reunión semanal y coordinación asíncrona por correo."
   */
  workMethod: string;
  /** @maxItems 20 */
  milestones?: ServiceRequestMilestoneCreateDto[];
  paymentPlan: ServiceRequestPaymentPlanDto;
  /**
   * @maxLength 5000
   * @example "Disponibilidad durante la segunda semana del mes."
   */
  details?: string;
  /** Hasta 5 archivos de referencia de máximo 10 MB cada uno */
  files?: File[];
}

export interface ServiceRequestProposalDto {
  /**
   * @min 1
   * @example 1850.5
   */
  price: number;
  /** @example "2026-08-12T15:00:00.000Z" */
  selectedInitialMeetingStartTime?: string;
  /**
   * @maxLength 3000
   * @example "Incluye materiales y dos jornadas de capacitación."
   */
  message?: string;
}

export interface ServiceRequestDeclineDto {
  /**
   * @maxLength 3000
   * @example "No podremos continuar con esta solicitud."
   */
  message?: string;
}

export interface ServiceRequestMilestoneMeetingDto {
  /**
   * @min 0
   * @max 19
   * @example 0
   */
  milestoneIndex: number;
  /** @example ["2026-08-19T15:00:00.000Z","2026-08-20T15:00:00.000Z","2026-08-21T15:00:00.000Z"] */
  proposedStartTimes: string[];
}

export interface ServiceRequestMilestoneUpdateDto {
  /**
   * @maxLength 160
   * @example "Validación final con contabilidad"
   */
  title: string;
  /** @example "2026-09-20" */
  dueDate: string;
}

export interface ServiceRequestExtraMilestoneMeetingDto {
  /**
   * @min 1
   * @max 19
   * @example 2
   */
  insertAtIndex: number;
  /** @example "Validación final con contabilidad" */
  title: string;
  /** @example "2026-09-20" */
  dueDate: string;
  /** @example ["2026-09-17T15:00:00.000Z","2026-09-18T15:00:00.000Z","2026-09-19T15:00:00.000Z"] */
  proposedStartTimes: string[];
}

export interface ServiceRequestEvidenceMultipartDto {
  /** @example "Constancia SUNAT correspondiente al primer entregable." */
  note?: string;
  /**
   * @min 0
   * @max 49
   * @example 0
   */
  milestoneIndex?: number;
}

export interface PublicConsultantListItemDto {
  id: number;
  userId: number;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  diagnosticAreas: (
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable"
  )[];
  specialties: string[];
  sectors: string[];
  photoUrl: string | null;
  videoUrl: string | null;
  pricePerHour: string;
  rating: string;
  totalReviews: number;
  active: "true" | "false";
  validated: "true" | "false";
  /** @format date-time */
  createdAt: string;
}

export interface PublicConsultantListDto {
  data: PublicConsultantListItemDto[];
  meta: PaginationMetaDto;
}

export interface PromotionCodeResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  code: string;
  type: "consultation" | "service";
  description?: string | null;
  maxRedemptions: number;
  redemptionCount: number;
  /** @format date-time */
  startsAt?: string | null;
  /** @format date-time */
  expiresAt?: string | null;
  allowedPymeIds?: number[] | null;
  allowedConsultantIds?: number[] | null;
  isActive: boolean;
}

export interface PromotionCodeListDto {
  data: PromotionCodeResultDto[];
  meta: PaginationMetaDto;
}

export interface PromotionCodeRedemptionDetailDto {
  id: number;
  checkoutId: number;
  serviceRequestId: number | null;
  serviceInstallmentIndex: number | null;
  pymeId: number;
  pymeName: string;
  consultantId: number;
  consultantName: string;
  meetingId: number | null;
  /** @format date-time */
  redeemedAt: string;
}

export interface PromotionCodeDetailDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  code: string;
  type: "consultation" | "service";
  description?: string | null;
  maxRedemptions: number;
  redemptionCount: number;
  /** @format date-time */
  startsAt?: string | null;
  /** @format date-time */
  expiresAt?: string | null;
  allowedPymeIds?: number[] | null;
  allowedConsultantIds?: number[] | null;
  isActive: boolean;
  redemptions: PromotionCodeRedemptionDetailDto[];
}

export interface PromotionCodeCreateDto {
  /**
   * If omitted, the backend generates a code
   * @example "GRATIS-JULIO"
   */
  code?: string;
  /**
   * Contexto en el que puede canjearse el cupón
   * @default "consultation"
   */
  type?: "consultation" | "service";
  /** @example "Campaña para primeras consultorias" */
  description?: string;
  /**
   * @min 1
   * @example 10
   */
  maxRedemptions: number;
  /** @format date-time */
  startsAt?: string;
  /** @format date-time */
  expiresAt?: string;
  /** IDs de PYMEs autorizadas. Null permite cualquier PYME. */
  allowedPymeIds?: number[] | null;
  /** IDs de consultores autorizados. Null permite cualquier consultor. */
  allowedConsultantIds?: number[] | null;
}

export interface PromotionCodeUpdateDto {
  /**
   * If omitted, the backend generates a code
   * @example "GRATIS-JULIO"
   */
  code?: string;
  /**
   * Contexto en el que puede canjearse el cupón
   * @default "consultation"
   */
  type?: "consultation" | "service";
  /** @example "Campaña para primeras consultorias" */
  description?: string;
  /**
   * @min 1
   * @example 10
   */
  maxRedemptions?: number;
  /** @format date-time */
  startsAt?: string;
  /** @format date-time */
  expiresAt?: string;
  /** IDs de PYMEs autorizadas. Null permite cualquier PYME. */
  allowedPymeIds?: number[] | null;
  /** IDs de consultores autorizados. Null permite cualquier consultor. */
  allowedConsultantIds?: number[] | null;
  isActive?: boolean;
}

export interface PromotionCodeRedeemDto {
  /** @example 12 */
  checkoutId: number;
  /** @example "GRATIS-JULIO" */
  code: string;
}

export interface PromotionCodeRedeemResultDto {
  meetingId: number;
  checkoutId: number;
  code: string;
  /** @example "Consultoria gratuita confirmada" */
  message: string;
}

export interface PromotionCodeRedeemServiceDto {
  /** @example 12 */
  serviceRequestId: number;
  /** @example "SERVICIO-GRATIS" */
  code: string;
}

export interface PromotionCodeRedeemServiceResultDto {
  serviceRequestId: number;
  installmentIndex: number;
  checkoutId: number;
  code: string;
  /** @example "Cuota de servicio confirmada con cupón" */
  message: string;
}

export interface FeedbackListItemDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  userId: number;
  userRole: "pyme" | "consultor";
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  status: "new" | "in_review" | "accepted" | "resolved" | "closed";
  /** @format date-time */
  statusUpdatedAt?: string | null;
  statusUpdatedBy?: string | null;
  attachmentCount: number;
  replyCount: number;
}

export interface FeedbackListDto {
  data: FeedbackListItemDto[];
  meta: PaginationMetaDto;
}

export interface FeedbackAttachmentResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  storagePath: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface FeedbackReplyResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  authorType: "user" | "admin";
  authorUserId?: number | null;
  authorName: string;
  message: string;
}

export interface FeedbackResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  userId: number;
  userRole: "pyme" | "consultor";
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  status: "new" | "in_review" | "accepted" | "resolved" | "closed";
  /** @format date-time */
  statusUpdatedAt?: string | null;
  statusUpdatedBy?: string | null;
  attachmentCount: number;
  replyCount: number;
  attachments: FeedbackAttachmentResultDto[];
  replies: FeedbackReplyResultDto[];
}

export interface FeedbackCreateMultipartDto {
  /**
   * @maxLength 160
   * @example "No puedo visualizar el acta de mi reunión"
   */
  title: string;
  /**
   * @maxLength 5000
   * @example "Al ingresar al detalle aparece una pantalla vacía."
   */
  description: string;
  /** Hasta 5 imágenes JPG, PNG, WEBP, HEIC o HEIF de máximo 8 MB cada una */
  images?: File[];
}

export interface FeedbackReplyCreateDto {
  /**
   * @maxLength 3000
   * @example "Gracias por el reporte. Ya estamos revisándolo."
   */
  message: string;
}

export interface FeedbackStatusUpdateDto {
  status: "new" | "in_review" | "accepted" | "resolved" | "closed";
}

export interface ConsultantServiceOfferResultDto {
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  consultantId: number;
  consultantName: string;
  consultantHeadline?: string | null;
  consultantPhotoUrl?: string | null;
  consultantRating: string;
  consultantYearsExperience: number;
  title: string;
  category:
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable";
  subcategory: string;
  description: string;
  expectedOutcome: string;
  requirements: string;
  deliverables: string[];
  exclusions?: string | null;
  estimatedDurationDays: number;
  workModality: "remote";
  workMethod: string;
  price: string;
  currency: string;
  pricePeriod: "one_time" | "monthly" | "hourly";
  isActive: boolean;
}

export interface ConsultantServiceOfferListDto {
  data: ConsultantServiceOfferResultDto[];
  meta: PaginationMetaDto;
}

export interface ConsultantServiceOfferCreateDto {
  /**
   * @maxLength 160
   * @example "Contabilidad mensual para PYMEs"
   */
  title: string;
  /** @example "Tributario / Contable" */
  category:
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable";
  /**
   * @maxLength 120
   * @example "Contabilidad"
   */
  subcategory: string;
  /** @maxLength 5000 */
  description: string;
  /** @maxLength 5000 */
  expectedOutcome: string;
  /** @maxLength 5000 */
  requirements: string;
  /**
   * @maxItems 20
   * @minItems 1
   */
  deliverables: string[];
  /** @maxLength 5000 */
  exclusions?: string;
  /**
   * @min 1
   * @max 365
   * @example 30
   */
  estimatedDurationDays: number;
  /** @example "remote" */
  workModality: "remote";
  /** @maxLength 5000 */
  workMethod: string;
  /**
   * @min 0.01
   * @example 1200
   */
  price: number;
  /** @example "monthly" */
  pricePeriod: "one_time" | "monthly" | "hourly";
}

export interface ConsultantServiceOfferUpdateDto {
  /**
   * @maxLength 160
   * @example "Contabilidad mensual para PYMEs"
   */
  title?: string;
  /** @example "Tributario / Contable" */
  category?:
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable";
  /**
   * @maxLength 120
   * @example "Contabilidad"
   */
  subcategory?: string;
  /** @maxLength 5000 */
  description?: string;
  /** @maxLength 5000 */
  expectedOutcome?: string;
  /** @maxLength 5000 */
  requirements?: string;
  /**
   * @maxItems 20
   * @minItems 1
   */
  deliverables?: string[];
  /** @maxLength 5000 */
  exclusions?: string;
  /**
   * @min 1
   * @max 365
   * @example 30
   */
  estimatedDurationDays?: number;
  /** @example "remote" */
  workModality?: "remote";
  /** @maxLength 5000 */
  workMethod?: string;
  /**
   * @min 0.01
   * @example 1200
   */
  price?: number;
  /** @example "monthly" */
  pricePeriod?: "one_time" | "monthly" | "hourly";
}

export interface ConsultantServiceOfferActiveDto {
  isActive: boolean;
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

export type AuthForgotPasswordData = MessageResponseDto;

export type AuthForgotPasswordError = HttpErrorDto;

export type AuthResetPasswordData = MessageResponseDto;

export type AuthResetPasswordError = HttpErrorDto;

export type EmailSendEmailData = EmailSendResultDto;

export type EmailSendEmailError = HttpErrorDto;

export type IdentityverificationVerifyDniData = DniVerificationResultDto;

export type IdentityverificationVerifyDniError = HttpErrorDto;

export type IdentityverificationVerifyRucData = RucVerificationResultDto;

export type IdentityverificationVerifyRucError = HttpErrorDto;

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

export interface PymeadminFindAllParams {
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

export type PymeadminFindAllData = PymeListDto;

export type PymeadminFindAllError = HttpErrorDto;

export interface PymeadminFindOneParams {
  id: number;
}

export type PymeadminFindOneData = PymeResultDto;

export type PymeadminFindOneError = HttpErrorDto;

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

export interface PymeMeetingConsultantsParams {
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

export type PymeMeetingConsultantsData = ConsultantListDto;

export type PymeMeetingConsultantsError = HttpErrorDto;

export interface PymeMeetingDocumentsParams {
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
  /** Search by document title, content or consultant name */
  search?: string;
}

export type PymeMeetingDocumentsData = PymeMeetingDocumentsDto;

export type PymeMeetingDocumentsError = HttpErrorDto;

export interface PymeDiagnosticDocumentsParams {
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
  /** Search by document title, content or consultant name */
  search?: string;
}

export type PymeDiagnosticDocumentsData = PymeDiagnosticDocumentsDto;

export type PymeDiagnosticDocumentsError = HttpErrorDto;

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

export type AdminauthLoginData = AdminLoginResponseDto;

export type AdminauthLoginError = HttpErrorDto;

export type WhatsappSendMessageData = WhatsappSendResultDto;

export type WhatsappSendMessageError = HttpErrorDto;

export type WhatsappSendNotificacionPymeData = WhatsappSendResultDto;

export type WhatsappSendNotificacionPymeError = HttpErrorDto;

export type WhatsappSendNotificacionConsultorData = WhatsappSendResultDto;

export type WhatsappSendNotificacionConsultorError = HttpErrorDto;

export type WhatsappSendNotificacionCancelacionPymeData = WhatsappSendResultDto;

export type WhatsappSendNotificacionCancelacionPymeError = HttpErrorDto;

export type WhatsappSendAlertaReunionConsultorData = WhatsappSendResultDto;

export type WhatsappSendAlertaReunionConsultorError = HttpErrorDto;

export type WhatsappSendAlertaReunionPymeData = WhatsappSendResultDto;

export type WhatsappSendAlertaReunionPymeError = HttpErrorDto;

export type WhatsappSendConsultorConfirmarReunionData = WhatsappSendResultDto;

export type WhatsappSendConsultorConfirmarReunionError = HttpErrorDto;

export interface WhatsappVerifyWebhookParams {
  /** @example "subscribe" */
  "hub.mode": string;
  /** @example "token-configurado-en-el-backend" */
  "hub.verify_token": string;
  /** @example "123456" */
  "hub.challenge": string;
}

export type WhatsappVerifyWebhookData = string;

export type WhatsappReceiveWebhookData = WhatsappWebhookAcceptedDto;

export interface MeetingadminFindAllParams {
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
    | "por_confirmar"
    | "confirmada"
    | "finalizada"
    | "cancelada";
}

export type MeetingadminFindAllData = MeetingListDto;

export type MeetingadminFindAllError = HttpErrorDto;

export interface MeetingadminFindOneParams {
  id: number;
}

export type MeetingadminFindOneData = MeetingAdminResultDto;

export type MeetingadminFindOneError = HttpErrorDto;

export interface MeetingCalendarParams {
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
  /**
   * Inclusive beginning of the visible calendar range
   * @example "2026-07-01T00:00:00.000Z"
   */
  startDate: string;
  /**
   * Exclusive end of the visible calendar range
   * @example "2026-08-01T00:00:00.000Z"
   */
  endDate: string;
  /** Estado visible. Pendiente agrupa pago pendiente y por confirmar. */
  status?:
    | "solicitada"
    | "pendiente"
    | "confirmada"
    | "finalizada"
    | "cancelada";
}

export type MeetingCalendarData = MeetingCalendarListDto;

export type MeetingCalendarError = HttpErrorDto;

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
    | "por_confirmar"
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

export interface MeetingAccessParams {
  id: number;
}

export type MeetingAccessData = MeetingAccessResultDto;

export type MeetingAccessError = HttpErrorDto;

export type MeetingCreateData = MeetingResultDto;

export type MeetingCreateError = HttpErrorDto;

export interface MeetingConfirmParams {
  id: number;
}

export type MeetingConfirmData = MeetingResultDto;

export type MeetingConfirmError = HttpErrorDto;

export interface MeetingConfirmOptionParams {
  id: number;
}

export type MeetingConfirmOptionData = MeetingResultDto;

export type MeetingConfirmOptionError = HttpErrorDto;

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

export interface MeetingCancelByConsultantParams {
  id: number;
}

export type MeetingCancelByConsultantData = MeetingConsultantCancelResultDto;

export type MeetingCancelByConsultantError = HttpErrorDto;

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

export type IaRunHubsmeAiData = HubsmeAiResultDto;

export type IaRunHubsmeAiError = HttpErrorDto;

export type IaRunConsultantCvData = ConsultantCvProfileResultDto;

export type IaRunConsultantCvError = HttpErrorDto;

export type IaRunServiceRequestChatData = ServiceRequestChatResultDto;

export type IaRunServiceRequestChatError = HttpErrorDto;

export type IaRunServicePaymentPlanData = ServicePaymentPlanResultDto;

export type IaRunServicePaymentPlanError = HttpErrorDto;

export type IaRunServiceConsultantMatchesData =
  ServiceConsultantMatchesResultDto;

export type IaRunServiceConsultantMatchesError = HttpErrorDto;

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

export interface ConsultantadminFindAllParams {
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

export type ConsultantadminFindAllData = ConsultantListDto;

export type ConsultantadminFindAllError = HttpErrorDto;

export interface ConsultantadminFindOneParams {
  id: number;
}

export type ConsultantadminFindOneData = ConsultantResultDto;

export type ConsultantadminFindOneError = HttpErrorDto;

export interface ConsultantadminMercadoPagoParams {
  id: number;
}

export type ConsultantadminMercadoPagoData = ConsultantMercadoPagoAdminDto;

export type ConsultantadminMercadoPagoError = HttpErrorDto;

export interface ConsultantadminMercadoPagoFinancialParams {
  id: number;
}

export type ConsultantadminMercadoPagoFinancialData =
  ConsultantMercadoPagoFinancialAdminDto;

export type ConsultantadminMercadoPagoFinancialError = HttpErrorDto;

export interface ConsultantadminMercadoPagoFinancialDownloadParams {
  /**
   * Mercado Pago report generation task to continue tracking instead of creating a new report.
   * @example "99336983670"
   */
  taskId?: string;
  id: number;
}

export type ConsultantadminMercadoPagoFinancialDownloadData = any;

export type ConsultantadminMercadoPagoFinancialDownloadError = HttpErrorDto;

export interface ConsultantadminApproveParams {
  id: number;
}

export type ConsultantadminApproveData = ConsultantResultDto;

export type ConsultantadminApproveError = HttpErrorDto;

export interface ConsultantadminSetActiveParams {
  id: number;
}

export type ConsultantadminSetActiveData = ConsultantResultDto;

export type ConsultantadminSetActiveError = HttpErrorDto;

export interface ConsultantadminRemoveParams {
  id: number;
}

export type ConsultantadminRemoveData = ConsultantResultDto;

export type ConsultantadminRemoveError = HttpErrorDto;

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

export interface ConsultantMeetingDocumentsParams {
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
  /** Search by document title, content or PYME name */
  search?: string;
}

export type ConsultantMeetingDocumentsData = ConsultantMeetingDocumentsDto;

export type ConsultantMeetingDocumentsError = HttpErrorDto;

export interface ConsultantDiagnosticDocumentsParams {
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
  /** Search by document title, content or PYME name */
  search?: string;
}

export type ConsultantDiagnosticDocumentsData =
  ConsultantDiagnosticDocumentsDto;

export type ConsultantDiagnosticDocumentsError = HttpErrorDto;

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

export interface ConsultantSetActiveParams {
  id: number;
}

export type ConsultantSetActiveData = ConsultantResultDto;

export type ConsultantSetActiveError = HttpErrorDto;

export interface ConsultantRemoveParams {
  id: number;
}

export type ConsultantRemoveData = ConsultantResultDto;

export type ConsultantRemoveError = HttpErrorDto;

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

export type SubscriptionCreateCheckoutData = SubscriptionCheckoutResultDto;

export type SubscriptionCreateCheckoutError = HttpErrorDto;

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

export interface MercadopagoFindPaymentsParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Maximum of 10 payments per page
   * @max 10
   * @default 10
   */
  limit?: number;
  /**
   * Year used to filter the payment date
   * @default 2026
   */
  year?: number;
  /**
   * Month used to filter the payment date
   * @default 8
   */
  month?: number;
  /** Type of operation */
  operationType?: "servicio" | "consultoria";
  /** Payment method category */
  paymentType?: "cupon" | "mercado_pago" | "tarjeta" | "yape";
}

export type MercadopagoFindPaymentsData = MercadoPagoPaymentHistoryResponseDto;

export type MercadopagoFindPaymentsError = HttpErrorDto;

export interface MercadopagoFindPaymentParams {
  id: number;
}

export type MercadopagoFindPaymentData = MercadoPagoPaymentHistoryItemDto;

export type MercadopagoFindPaymentError = HttpErrorDto;

export interface MercadopagoFindCheckoutParams {
  id: number;
}

export type MercadopagoFindCheckoutData = MercadoPagoCheckoutDto;

export type MercadopagoFindCheckoutError = HttpErrorDto;

export interface MercadopagoPrepareCheckoutPaymentParams {
  id: number;
}

export type MercadopagoPrepareCheckoutPaymentData = MercadoPagoCheckoutDto;

export type MercadopagoPrepareCheckoutPaymentError = HttpErrorDto;

export interface MercadopagoPrepareServicePaymentParams {
  id: number;
}

export type MercadopagoPrepareServicePaymentData = MercadoPagoCheckoutDto;

export type MercadopagoPrepareServicePaymentError = HttpErrorDto;

export interface MercadopagoSyncServicePaymentParams {
  id: number;
}

export type MercadopagoSyncServicePaymentData = MercadoPagoCheckoutDto;

export type MercadopagoSyncServicePaymentError = HttpErrorDto;

export interface MercadopagoWebhookParams {
  /** @example "payment" */
  type?: string;
  /** @example "payment" */
  topic?: string;
  /** @example "123456789" */
  id?: string;
  /** @example "123456789" */
  payment_id?: string;
  /** @example "123456789" */
  "data.id"?: string;
  /** @example "https://api.mercadopago.com/v1/payments/123456789" */
  resource?: string;
  /** @example "payment.created" */
  action?: string;
  /** @example "pending:1:2:1792500000000" */
  externalReference?: string;
}

export type MercadopagoWebhookData = any;

export interface ServiceFindAllParams {
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
  stage?: "requests" | "proposals";
  status?:
    | "requested"
    | "proposal_sent"
    | "consultant_declined"
    | "payment_pending"
    | "paid"
    | "completed"
    | "pyme_declined"
    | "cancelled";
  /** Buscar por título, descripción o requerimientos */
  search?: string;
}

export type ServiceFindAllData = ServiceRequestListDto;

export interface ServiceFindOneParams {
  id: number;
}

export type ServiceFindOneData = ServiceRequestResultDto;

export type ServiceFindOneError = HttpErrorDto;

export type ServiceCreateData = ServiceRequestResultDto[];

export type ServiceCreateError = HttpErrorDto;

export interface ServiceSendProposalParams {
  id: number;
}

export type ServiceSendProposalData = ServiceRequestResultDto;

export type ServiceSendProposalError = HttpErrorDto;

export interface ServiceDeclineParams {
  id: number;
}

export type ServiceDeclineData = ServiceRequestResultDto;

export type ServiceDeclineError = HttpErrorDto;

export interface ServiceCompleteServiceParams {
  id: number;
}

export type ServiceCompleteServiceData = ServiceRequestResultDto;

export type ServiceCompleteServiceError = HttpErrorDto;

export interface ServiceScheduleMilestoneMeetingParams {
  id: number;
}

export type ServiceScheduleMilestoneMeetingData = ServiceRequestResultDto;

export type ServiceScheduleMilestoneMeetingError = HttpErrorDto;

export interface ServiceUpdateMilestoneParams {
  id: number;
  index: number;
}

export type ServiceUpdateMilestoneData = ServiceRequestResultDto;

export type ServiceUpdateMilestoneError = HttpErrorDto;

export interface ServiceRemoveMilestoneParams {
  id: number;
  index: number;
}

export type ServiceRemoveMilestoneData = ServiceRequestResultDto;

export type ServiceRemoveMilestoneError = HttpErrorDto;

export interface ServiceAddExtraMilestoneMeetingParams {
  id: number;
}

export type ServiceAddExtraMilestoneMeetingData = ServiceRequestResultDto;

export type ServiceAddExtraMilestoneMeetingError = HttpErrorDto;

export interface ServiceUploadEvidenceParams {
  id: number;
}

export type ServiceUploadEvidenceData = ServiceRequestResultDto;

export type ServiceUploadEvidenceError = HttpErrorDto;

export interface ServiceDeleteEvidenceParams {
  id: number;
  attachmentId: string;
}

export type ServiceDeleteEvidenceData = ServiceRequestResultDto;

export type ServiceDeleteEvidenceError = HttpErrorDto;

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

export interface PromotioncodeadminFindAllParams {
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
  search?: string;
}

export type PromotioncodeadminFindAllData = PromotionCodeListDto;

export interface PromotioncodeadminFindOneParams {
  id: number;
}

export type PromotioncodeadminFindOneData = PromotionCodeDetailDto;

export type PromotioncodeadminFindOneError = HttpErrorDto;

export type PromotioncodeadminCreateData = PromotionCodeResultDto;

export type PromotioncodeadminCreateError = HttpErrorDto;

export interface PromotioncodeadminUpdateParams {
  id: number;
}

export type PromotioncodeadminUpdateData = PromotionCodeResultDto;

export type PromotioncodeadminUpdateError = HttpErrorDto;

export type PromotioncodeRedeemData = PromotionCodeRedeemResultDto;

export type PromotioncodeRedeemError = HttpErrorDto;

export type PromotioncodeRedeemServiceData =
  PromotionCodeRedeemServiceResultDto;

export type PromotioncodeRedeemServiceError = HttpErrorDto;

export interface FeedbackFindAllParams {
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
  status?: "new" | "in_review" | "accepted" | "resolved" | "closed";
}

export type FeedbackFindAllData = FeedbackListDto;

export interface FeedbackFindOneParams {
  id: number;
}

export type FeedbackFindOneData = FeedbackResultDto;

export type FeedbackFindOneError = HttpErrorDto;

export type FeedbackCreateData = FeedbackResultDto;

export type FeedbackCreateError = HttpErrorDto;

export interface FeedbackReplyParams {
  id: number;
}

export type FeedbackReplyData = FeedbackResultDto;

export type FeedbackReplyError = HttpErrorDto;

export interface FeedbackadminFindAllParams {
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
  status?: "new" | "in_review" | "accepted" | "resolved" | "closed";
  /** Buscar por título, descripción, usuario o correo */
  search?: string;
  userRole?: "pyme" | "consultor";
}

export type FeedbackadminFindAllData = FeedbackListDto;

export interface FeedbackadminFindOneParams {
  id: number;
}

export type FeedbackadminFindOneData = FeedbackResultDto;

export type FeedbackadminFindOneError = HttpErrorDto;

export interface FeedbackadminUpdateStatusParams {
  id: number;
}

export type FeedbackadminUpdateStatusData = FeedbackResultDto;

export type FeedbackadminUpdateStatusError = HttpErrorDto;

export interface FeedbackadminReplyParams {
  id: number;
}

export type FeedbackadminReplyData = FeedbackResultDto;

export type FeedbackadminReplyError = HttpErrorDto;

export interface ServiceofferFindAllParams {
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
  /** @maxLength 160 */
  search?: string;
  category?:
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable";
  /** @maxLength 120 */
  subcategory?: string;
  isActive?: "true" | "false";
}

export type ServiceofferFindAllData = ConsultantServiceOfferListDto;

export interface ServiceofferFindMineParams {
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
  /** @maxLength 160 */
  search?: string;
  category?:
    | "Estratégica"
    | "Financiera"
    | "Comercial / Ventas"
    | "Marketing"
    | "Servicio al cliente"
    | "Operaciones"
    | "Organizacional / RRHH"
    | "Tecnología"
    | "Legal"
    | "Laboral"
    | "Tributario / Contable";
  /** @maxLength 120 */
  subcategory?: string;
  isActive?: "true" | "false";
}

export type ServiceofferFindMineData = ConsultantServiceOfferListDto;

export interface ServiceofferFindOneParams {
  id: number;
}

export type ServiceofferFindOneData = ConsultantServiceOfferResultDto;

export type ServiceofferFindOneError = HttpErrorDto;

export type ServiceofferCreateData = ConsultantServiceOfferResultDto;

export interface ServiceofferUpdateParams {
  id: number;
}

export type ServiceofferUpdateData = ConsultantServiceOfferResultDto;

export interface ServiceofferSetActiveParams {
  id: number;
}

export type ServiceofferSetActiveData = ConsultantServiceOfferResultDto;

export interface ServiceofferRemoveParams {
  id: number;
}

export type ServiceofferRemoveData = ConsultantServiceOfferResultDto;

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

  /**
   * No description
   * @tags auth
   * @name AuthForgotPassword
   * @summary Request password reset link via email
   * @request POST:/auth/forgot-password
   * @response `200` `AuthForgotPasswordData`
   * @response `400` `HttpErrorDto`
   */
  export namespace AuthForgotPassword {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ForgotPasswordDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthForgotPasswordData;
  }

  /**
   * No description
   * @tags auth
   * @name AuthResetPassword
   * @summary Reset user password using token
   * @request POST:/auth/reset-password
   * @response `200` `AuthResetPasswordData`
   * @response `400` `HttpErrorDto`
   */
  export namespace AuthResetPassword {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ResetPasswordDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthResetPasswordData;
  }
}

export namespace Email {
  /**
   * No description
   * @tags email
   * @name EmailSendEmail
   * @summary Enviar un correo electrónico
   * @request POST:/admin/email/send
   * @secure
   * @response `201` `EmailSendEmailData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace EmailSendEmail {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EmailSendDto;
    export type RequestHeaders = {};
    export type ResponseBody = EmailSendEmailData;
  }
}

export namespace IdentityVerification {
  /**
   * No description
   * @tags identityVerification
   * @name IdentityverificationVerifyDni
   * @summary Validar datos personales contra el registro de DNI de PeruDevs
   * @request POST:/admin/identity-verification/dni
   * @response `200` `IdentityverificationVerifyDniData`
   * @response `400` `HttpErrorDto`
   * @response `502` `HttpErrorDto`
   */
  export namespace IdentityverificationVerifyDni {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DniVerificationDto;
    export type RequestHeaders = {};
    export type ResponseBody = IdentityverificationVerifyDniData;
  }

  /**
   * No description
   * @tags identityVerification
   * @name IdentityverificationVerifyRuc
   * @summary Validar si un RUC existe en el registro de PeruDevs
   * @request POST:/admin/identity-verification/ruc
   * @response `200` `IdentityverificationVerifyRucData`
   * @response `400` `HttpErrorDto`
   * @response `502` `HttpErrorDto`
   */
  export namespace IdentityverificationVerifyRuc {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RucVerificationDto;
    export type RequestHeaders = {};
    export type ResponseBody = IdentityverificationVerifyRucData;
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

export namespace PymeAdmin {
  /**
   * No description
   * @tags pymeAdmin
   * @name PymeadminFindAll
   * @summary List PYMEs for the internal admin panel
   * @request GET:/admin/backoffice/pyme/find-all
   * @secure
   * @response `200` `PymeadminFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeadminFindAll {
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
    export type ResponseBody = PymeadminFindAllData;
  }

  /**
   * No description
   * @tags pymeAdmin
   * @name PymeadminFindOne
   * @summary Get a PYME profile for the internal admin panel
   * @request GET:/admin/backoffice/pyme/find-one/{id}
   * @secure
   * @response `200` `PymeadminFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeadminFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeadminFindOneData;
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
   * @name PymeMeetingConsultants
   * @summary Get consultants with at least one meeting with current PYME
   * @request GET:/admin/pyme/meeting-consultants
   * @secure
   * @response `200` `PymeMeetingConsultantsData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeMeetingConsultants {
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
    export type ResponseBody = PymeMeetingConsultantsData;
  }

  /**
   * No description
   * @tags pyme
   * @name PymeMeetingDocuments
   * @summary Get the current PYME meeting acts with consultant data
   * @request GET:/admin/pyme/documents/meetings
   * @secure
   * @response `200` `PymeMeetingDocumentsData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeMeetingDocuments {
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
      /** Search by document title, content or consultant name */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeMeetingDocumentsData;
  }

  /**
   * No description
   * @tags pyme
   * @name PymeDiagnosticDocuments
   * @summary Get the current PYME diagnostics with PYME data
   * @request GET:/admin/pyme/documents/diagnostics
   * @secure
   * @response `200` `PymeDiagnosticDocumentsData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PymeDiagnosticDocuments {
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
      /** Search by document title, content or consultant name */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PymeDiagnosticDocumentsData;
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

export namespace AdminAuth {
  /**
   * No description
   * @tags adminAuth
   * @name AdminauthLogin
   * @summary Login for the internal Hubsme administrative panel
   * @request POST:/admin/auth/login
   * @response `200` `AdminauthLoginData`
   * @response `401` `HttpErrorDto`
   */
  export namespace AdminauthLogin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AdminLoginDto;
    export type RequestHeaders = {};
    export type ResponseBody = AdminauthLoginData;
  }
}

export namespace Whatsapp {
  /**
   * No description
   * @tags whatsapp
   * @name WhatsappSendMessage
   * @summary Enviar un mensaje por WhatsApp
   * @request POST:/admin/whatsapp/send
   * @secure
   * @response `201` `WhatsappSendMessageData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace WhatsappSendMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappSendDto;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappSendMessageData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappSendNotificacionPyme
   * @summary Enviar plantilla notificacion_pyme
   * @request POST:/admin/whatsapp/notificacion-pyme
   * @secure
   * @response `201` `WhatsappSendNotificacionPymeData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace WhatsappSendNotificacionPyme {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappNotificacionPymeDto;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappSendNotificacionPymeData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappSendNotificacionConsultor
   * @summary Enviar plantilla notificacion_consultor
   * @request POST:/admin/whatsapp/notificacion-consultor
   * @secure
   * @response `201` `WhatsappSendNotificacionConsultorData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace WhatsappSendNotificacionConsultor {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappNotificacionConsultorDto;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappSendNotificacionConsultorData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappSendNotificacionCancelacionPyme
   * @summary Enviar plantilla notificacion_cancelacion_pyme
   * @request POST:/admin/whatsapp/notificacion-cancelacion-pyme
   * @secure
   * @response `201` `WhatsappSendNotificacionCancelacionPymeData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace WhatsappSendNotificacionCancelacionPyme {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappNotificacionCancelacionPymeDto;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappSendNotificacionCancelacionPymeData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappSendAlertaReunionConsultor
   * @summary Enviar plantilla alerta_reunion_consultor
   * @request POST:/admin/whatsapp/alerta-reunion-consultor
   * @secure
   * @response `201` `WhatsappSendAlertaReunionConsultorData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace WhatsappSendAlertaReunionConsultor {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappAlertaReunionConsultorDto;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappSendAlertaReunionConsultorData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappSendAlertaReunionPyme
   * @summary Enviar plantilla alerta_reunion_pyme
   * @request POST:/admin/whatsapp/alerta-reunion-pyme
   * @secure
   * @response `201` `WhatsappSendAlertaReunionPymeData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace WhatsappSendAlertaReunionPyme {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappAlertaReunionDto;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappSendAlertaReunionPymeData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappSendConsultorConfirmarReunion
   * @summary Enviar plantilla consultor_confirmar_reunion
   * @request POST:/admin/whatsapp/consultor-confirmar-reunion
   * @secure
   * @response `201` `WhatsappSendConsultorConfirmarReunionData`
   * @response `400` `HttpErrorDto`
   * @response `500` `HttpErrorDto`
   */
  export namespace WhatsappSendConsultorConfirmarReunion {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappConsultorConfirmarReunionDto;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappSendConsultorConfirmarReunionData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappVerifyWebhook
   * @summary Verificar el webhook de WhatsApp con Meta
   * @request GET:/admin/whatsapp/webhook
   * @response `200` `WhatsappVerifyWebhookData` Devuelve el valor recibido en hub.challenge
   * @response `403` `void` El token de verificación no coincide
   */
  export namespace WhatsappVerifyWebhook {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example "subscribe" */
      "hub.mode": string;
      /** @example "token-configurado-en-el-backend" */
      "hub.verify_token": string;
      /** @example "123456" */
      "hub.challenge": string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WhatsappVerifyWebhookData;
  }

  /**
   * No description
   * @tags whatsapp
   * @name WhatsappReceiveWebhook
   * @summary Recibir mensajes y eventos entrantes de WhatsApp
   * @request POST:/admin/whatsapp/webhook
   * @response `200` `WhatsappReceiveWebhookData`
   * @response `401` `void` La firma enviada por Meta es inválida
   */
  export namespace WhatsappReceiveWebhook {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = WhatsappWebhookPayloadDto;
    export type RequestHeaders = {
      /** Firma HMAC SHA-256 enviada por Meta */
      "x-hub-signature-256": string;
    };
    export type ResponseBody = WhatsappReceiveWebhookData;
  }
}

export namespace MeetingAdmin {
  /**
   * No description
   * @tags meetingAdmin
   * @name MeetingadminFindAll
   * @summary List meetings for the internal admin panel
   * @request GET:/admin/backoffice/meeting/find-all
   * @secure
   * @response `200` `MeetingadminFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingadminFindAll {
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
        | "por_confirmar"
        | "confirmada"
        | "finalizada"
        | "cancelada";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingadminFindAllData;
  }

  /**
   * No description
   * @tags meetingAdmin
   * @name MeetingadminFindOne
   * @summary Get a meeting for the internal admin panel
   * @request GET:/admin/backoffice/meeting/find-one/{id}
   * @secure
   * @response `200` `MeetingadminFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingadminFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingadminFindOneData;
  }
}

export namespace Meeting {
  /**
   * No description
   * @tags meeting
   * @name MeetingCalendar
   * @summary Get lightweight calendar meetings for the authenticated user and date range
   * @request GET:/admin/meeting/calendar
   * @secure
   * @response `200` `MeetingCalendarData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingCalendar {
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
      /**
       * Inclusive beginning of the visible calendar range
       * @example "2026-07-01T00:00:00.000Z"
       */
      startDate: string;
      /**
       * Exclusive end of the visible calendar range
       * @example "2026-08-01T00:00:00.000Z"
       */
      endDate: string;
      /** Estado visible. Pendiente agrupa pago pendiente y por confirmar. */
      status?:
        | "solicitada"
        | "pendiente"
        | "confirmada"
        | "finalizada"
        | "cancelada";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingCalendarData;
  }

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
        | "por_confirmar"
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
   * @name MeetingAccess
   * @summary Resolve protected Teams access for an authenticated meeting participant
   * @request GET:/admin/meeting/access/{id}
   * @secure
   * @response `200` `MeetingAccessData`
   * @response `403` `HttpErrorDto`
   * @response `404` `HttpErrorDto`
   */
  export namespace MeetingAccess {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingAccessData;
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
   * @name MeetingConfirmOption
   * @summary Confirm one of the proposed meeting times and create its Teams meeting URL internally
   * @request POST:/admin/meeting/confirm-option/{id}
   * @secure
   * @response `200` `MeetingConfirmOptionData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MeetingConfirmOption {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MeetingConfirmOptionDto;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingConfirmOptionData;
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
   * @name MeetingCancelByConsultant
   * @summary Cancel a paid meeting as its consultant and issue a restricted replacement code
   * @request POST:/admin/meeting/cancel-by-consultant/{id}
   * @secure
   * @response `200` `MeetingCancelByConsultantData`
   * @response `400` `HttpErrorDto`
   * @response `403` `HttpErrorDto`
   */
  export namespace MeetingCancelByConsultant {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MeetingConsultantCancelDto;
    export type RequestHeaders = {};
    export type ResponseBody = MeetingCancelByConsultantData;
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

export namespace Ia {
  /**
   * No description
   * @tags ia
   * @name IaRunHubsmeAi
   * @summary Ejecutar flujo de IA con Gemini para obtener resumen y tareas sugeridas
   * @request POST:/admin/ia/hubsme-ai
   * @secure
   * @response `201` `IaRunHubsmeAiData`
   * @response `400` `HttpErrorDto`
   */
  export namespace IaRunHubsmeAi {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = HubsmeAiRunDto;
    export type RequestHeaders = {};
    export type ResponseBody = IaRunHubsmeAiData;
  }

  /**
   * No description
   * @tags ia
   * @name IaRunConsultantCv
   * @summary Extraer perfil estructurado de consultor desde texto de CV usando Gemini
   * @request POST:/admin/ia/consultant-cv
   * @secure
   * @response `201` `IaRunConsultantCvData`
   * @response `400` `HttpErrorDto`
   */
  export namespace IaRunConsultantCv {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConsultantCvRunDto;
    export type RequestHeaders = {};
    export type ResponseBody = IaRunConsultantCvData;
  }

  /**
   * No description
   * @tags ia
   * @name IaRunServiceRequestChat
   * @summary Continuar el asistente conversacional para definir un servicio
   * @request POST:/admin/ia/service-request-chat
   * @secure
   * @response `201` `IaRunServiceRequestChatData`
   * @response `400` `HttpErrorDto`
   * @response `403` `HttpErrorDto`
   */
  export namespace IaRunServiceRequestChat {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestChatRunDto;
    export type RequestHeaders = {};
    export type ResponseBody = IaRunServiceRequestChatData;
  }

  /**
   * No description
   * @tags ia
   * @name IaRunServicePaymentPlan
   * @summary Recomendar con IA la estructura de pagos de una solicitud de servicio
   * @request POST:/admin/ia/service-payment-plan
   * @secure
   * @response `201` `IaRunServicePaymentPlanData`
   * @response `400` `HttpErrorDto`
   * @response `403` `HttpErrorDto`
   */
  export namespace IaRunServicePaymentPlan {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ServicePaymentPlanRunDto;
    export type RequestHeaders = {};
    export type ResponseBody = IaRunServicePaymentPlanData;
  }

  /**
   * No description
   * @tags ia
   * @name IaRunServiceConsultantMatches
   * @summary Recomendar exactamente 3 consultores para una solicitud de servicio
   * @request POST:/admin/ia/service-consultant-matches
   * @secure
   * @response `201` `IaRunServiceConsultantMatchesData`
   * @response `400` `HttpErrorDto`
   * @response `403` `HttpErrorDto`
   */
  export namespace IaRunServiceConsultantMatches {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ServiceConsultantMatchRunDto;
    export type RequestHeaders = {};
    export type ResponseBody = IaRunServiceConsultantMatchesData;
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

export namespace ConsultantAdmin {
  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminFindAll
   * @summary List consultants for the internal admin panel
   * @request GET:/admin/backoffice/consultant/find-all
   * @secure
   * @response `200` `ConsultantadminFindAllData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminFindAll {
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
    export type ResponseBody = ConsultantadminFindAllData;
  }

  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminFindOne
   * @summary Get a consultant profile for the internal admin panel
   * @request GET:/admin/backoffice/consultant/find-one/{id}
   * @secure
   * @response `200` `ConsultantadminFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantadminFindOneData;
  }

  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminMercadoPago
   * @summary Get Mercado Pago account details for a consultant in the internal admin panel
   * @request GET:/admin/backoffice/consultant/mercado-pago/{id}
   * @secure
   * @response `200` `ConsultantadminMercadoPagoData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminMercadoPago {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantadminMercadoPagoData;
  }

  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminMercadoPagoFinancial
   * @summary Get a consultant Mercado Pago financial report status in the internal admin panel
   * @request GET:/admin/backoffice/consultant/mercado-pago/{id}/financial
   * @secure
   * @response `200` `ConsultantadminMercadoPagoFinancialData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminMercadoPagoFinancial {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantadminMercadoPagoFinancialData;
  }

  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminMercadoPagoFinancialDownload
   * @summary Download the latest consultant Mercado Pago financial report
   * @request GET:/admin/backoffice/consultant/mercado-pago/{id}/financial/download
   * @secure
   * @response `200` `ConsultantadminMercadoPagoFinancialDownloadData` Downloads the report or returns its generation status.
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminMercadoPagoFinancialDownload {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {
      /**
       * Mercado Pago report generation task to continue tracking instead of creating a new report.
       * @example "99336983670"
       */
      taskId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantadminMercadoPagoFinancialDownloadData;
  }

  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminApprove
   * @summary Approve or withdraw a consultant approval
   * @request PATCH:/admin/backoffice/consultant/approve/{id}
   * @secure
   * @response `200` `ConsultantadminApproveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminApprove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsultantApprovalDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantadminApproveData;
  }

  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminSetActive
   * @summary Activate or deactivate a consultant
   * @request PATCH:/admin/backoffice/consultant/active/{id}
   * @secure
   * @response `200` `ConsultantadminSetActiveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminSetActive {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsultantActiveDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantadminSetActiveData;
  }

  /**
   * No description
   * @tags consultantAdmin
   * @name ConsultantadminRemove
   * @summary Soft-delete a consultant from the internal admin panel
   * @request DELETE:/admin/backoffice/consultant/delete/{id}
   * @secure
   * @response `200` `ConsultantadminRemoveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantadminRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantadminRemoveData;
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
   * @name ConsultantMeetingDocuments
   * @summary Get the current consultant meeting acts with PYME data
   * @request GET:/admin/consultant/documents/meetings
   * @secure
   * @response `200` `ConsultantMeetingDocumentsData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantMeetingDocuments {
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
      /** Search by document title, content or PYME name */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantMeetingDocumentsData;
  }

  /**
   * No description
   * @tags consultant
   * @name ConsultantDiagnosticDocuments
   * @summary Get the current consultant diagnostics with PYME data
   * @request GET:/admin/consultant/documents/diagnostics
   * @secure
   * @response `200` `ConsultantDiagnosticDocumentsData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantDiagnosticDocuments {
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
      /** Search by document title, content or PYME name */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantDiagnosticDocumentsData;
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
   * @name ConsultantSetActive
   * @summary Update consultant availability
   * @request PATCH:/admin/consultant/active/{id}
   * @secure
   * @response `200` `ConsultantSetActiveData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ConsultantSetActive {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsultantActiveDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConsultantSetActiveData;
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

  /**
   * No description
   * @tags subscription
   * @name SubscriptionCreateCheckout
   * @summary Create Mercado Pago preference for subscription plan
   * @request POST:/admin/subscription/checkout
   * @secure
   * @response `200` `SubscriptionCreateCheckoutData`
   * @response `400` `HttpErrorDto`
   */
  export namespace SubscriptionCreateCheckout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubscriptionCheckoutDto;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriptionCreateCheckoutData;
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
   * @name MercadopagoFindPayments
   * @summary List Mercado Pago payments for the authenticated user
   * @request GET:/admin/mercado-pago/payments
   * @secure
   * @response `200` `MercadopagoFindPaymentsData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoFindPayments {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Maximum of 10 payments per page
       * @max 10
       * @default 10
       */
      limit?: number;
      /**
       * Year used to filter the payment date
       * @default 2026
       */
      year?: number;
      /**
       * Month used to filter the payment date
       * @default 8
       */
      month?: number;
      /** Type of operation */
      operationType?: "servicio" | "consultoria";
      /** Payment method category */
      paymentType?: "cupon" | "mercado_pago" | "tarjeta" | "yape";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoFindPaymentsData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoFindPayment
   * @summary Get a Mercado Pago payment detail for the authenticated user
   * @request GET:/admin/mercado-pago/payments/{id}
   * @secure
   * @response `200` `MercadopagoFindPaymentData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoFindPayment {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoFindPaymentData;
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
   * @name MercadopagoPrepareCheckoutPayment
   * @summary Create the Mercado Pago preference when the PYME is ready to pay
   * @request POST:/admin/mercado-pago/checkout/{id}/payment
   * @secure
   * @response `200` `MercadopagoPrepareCheckoutPaymentData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoPrepareCheckoutPayment {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoPrepareCheckoutPaymentData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoPrepareServicePayment
   * @summary Create the Mercado Pago preference for a service installment
   * @request POST:/admin/mercado-pago/service/{id}/payment
   * @secure
   * @response `200` `MercadopagoPrepareServicePaymentData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoPrepareServicePayment {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MercadoPagoServicePaymentDto;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoPrepareServicePaymentData;
  }

  /**
   * No description
   * @tags mercadoPago
   * @name MercadopagoSyncServicePayment
   * @summary Synchronize a service installment payment with Mercado Pago
   * @request POST:/admin/mercado-pago/service/{id}/payment/sync
   * @secure
   * @response `200` `MercadopagoSyncServicePaymentData`
   * @response `400` `HttpErrorDto`
   */
  export namespace MercadopagoSyncServicePayment {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MercadoPagoServicePaymentDto;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoSyncServicePaymentData;
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
    export type RequestQuery = {
      /** @example "payment" */
      type?: string;
      /** @example "payment" */
      topic?: string;
      /** @example "123456789" */
      id?: string;
      /** @example "123456789" */
      payment_id?: string;
      /** @example "123456789" */
      "data.id"?: string;
      /** @example "https://api.mercadopago.com/v1/payments/123456789" */
      resource?: string;
      /** @example "payment.created" */
      action?: string;
      /** @example "pending:1:2:1792500000000" */
      externalReference?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MercadopagoWebhookData;
  }
}

export namespace Service {
  /**
   * No description
   * @tags service
   * @name ServiceFindAll
   * @summary List service requests or proposals for the authenticated participant
   * @request GET:/admin/service/find-all
   * @secure
   * @response `200` `ServiceFindAllData`
   */
  export namespace ServiceFindAll {
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
      stage?: "requests" | "proposals";
      status?:
        | "requested"
        | "proposal_sent"
        | "consultant_declined"
        | "payment_pending"
        | "paid"
        | "completed"
        | "pyme_declined"
        | "cancelled";
      /** Buscar por título, descripción o requerimientos */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceFindAllData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceFindOne
   * @summary Get a service request for the authenticated participant
   * @request GET:/admin/service/find-one/{id}
   * @secure
   * @response `200` `ServiceFindOneData`
   * @response `404` `HttpErrorDto`
   */
  export namespace ServiceFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceFindOneData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceCreate
   * @summary Create and send a service request to one to three consultants as a PYME
   * @request POST:/admin/service/create
   * @secure
   * @response `201` `ServiceCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestCreateMultipartDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceCreateData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceSendProposal
   * @summary Send a priced proposal as the assigned consultant
   * @request POST:/admin/service/proposal/{id}
   * @secure
   * @response `201` `ServiceSendProposalData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceSendProposal {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestProposalDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceSendProposalData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceDecline
   * @summary Decline a service request or its priced proposal
   * @request POST:/admin/service/decline/{id}
   * @secure
   * @response `201` `ServiceDeclineData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceDecline {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestDeclineDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceDeclineData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceCompleteService
   * @summary Mark a paid service as completed by its PYME
   * @request POST:/admin/service/{id}/complete
   * @secure
   * @response `201` `ServiceCompleteServiceData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceCompleteService {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceCompleteServiceData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceScheduleMilestoneMeeting
   * @summary Propose three meeting times for a paid service milestone
   * @request POST:/admin/service/{id}/milestone-meeting
   * @secure
   * @response `201` `ServiceScheduleMilestoneMeetingData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceScheduleMilestoneMeeting {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestMilestoneMeetingDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceScheduleMilestoneMeetingData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceUpdateMilestone
   * @summary Edit a service milestone before it has a meeting
   * @request PATCH:/admin/service/{id}/milestone/{index}
   * @secure
   * @response `200` `ServiceUpdateMilestoneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceUpdateMilestone {
    export type RequestParams = {
      id: number;
      index: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestMilestoneUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceUpdateMilestoneData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceRemoveMilestone
   * @summary Delete a service milestone before it has a meeting
   * @request DELETE:/admin/service/{id}/milestone/{index}
   * @secure
   * @response `200` `ServiceRemoveMilestoneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceRemoveMilestone {
    export type RequestParams = {
      id: number;
      index: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceRemoveMilestoneData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceAddExtraMilestoneMeeting
   * @summary Add an extra milestone and propose three meeting times
   * @request POST:/admin/service/{id}/extra-milestone-meeting
   * @secure
   * @response `201` `ServiceAddExtraMilestoneMeetingData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceAddExtraMilestoneMeeting {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestExtraMilestoneMeetingDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceAddExtraMilestoneMeetingData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceUploadEvidence
   * @summary Attach evidence or a deliverable to a paid service as its consultant
   * @request POST:/admin/service/{id}/evidence
   * @secure
   * @response `201` `ServiceUploadEvidenceData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceUploadEvidence {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ServiceRequestEvidenceMultipartDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceUploadEvidenceData;
  }

  /**
   * No description
   * @tags service
   * @name ServiceDeleteEvidence
   * @summary Delete a service evidence as its consultant before its milestone has a meeting
   * @request DELETE:/admin/service/{id}/evidence/{attachmentId}
   * @secure
   * @response `200` `ServiceDeleteEvidenceData`
   * @response `400` `HttpErrorDto`
   */
  export namespace ServiceDeleteEvidence {
    export type RequestParams = {
      id: number;
      attachmentId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceDeleteEvidenceData;
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

export namespace PromotionCodeAdmin {
  /**
   * No description
   * @tags promotionCodeAdmin
   * @name PromotioncodeadminFindAll
   * @summary List promotional codes for the admin panel
   * @request GET:/admin/promotion-code/find-all
   * @secure
   * @response `200` `PromotioncodeadminFindAllData`
   */
  export namespace PromotioncodeadminFindAll {
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
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PromotioncodeadminFindAllData;
  }

  /**
   * No description
   * @tags promotionCodeAdmin
   * @name PromotioncodeadminFindOne
   * @summary Get promotional code details and redemptions
   * @request GET:/admin/promotion-code/find-one/{id}
   * @secure
   * @response `200` `PromotioncodeadminFindOneData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PromotioncodeadminFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PromotioncodeadminFindOneData;
  }

  /**
   * No description
   * @tags promotionCodeAdmin
   * @name PromotioncodeadminCreate
   * @summary Create a promotional code
   * @request POST:/admin/promotion-code/create
   * @secure
   * @response `201` `PromotioncodeadminCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PromotioncodeadminCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PromotionCodeCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PromotioncodeadminCreateData;
  }

  /**
   * No description
   * @tags promotionCodeAdmin
   * @name PromotioncodeadminUpdate
   * @summary Update or deactivate a promotional code
   * @request PATCH:/admin/promotion-code/update/{id}
   * @secure
   * @response `200` `PromotioncodeadminUpdateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PromotioncodeadminUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PromotionCodeUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PromotioncodeadminUpdateData;
  }
}

export namespace PromotionCode {
  /**
   * No description
   * @tags promotionCode
   * @name PromotioncodeRedeem
   * @summary Redeem a code for a free consulting session
   * @request POST:/admin/promotion-code/redeem
   * @secure
   * @response `201` `PromotioncodeRedeemData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PromotioncodeRedeem {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PromotionCodeRedeemDto;
    export type RequestHeaders = {};
    export type ResponseBody = PromotioncodeRedeemData;
  }

  /**
   * No description
   * @tags promotionCode
   * @name PromotioncodeRedeemService
   * @summary Redeem a service code for the next available installment
   * @request POST:/admin/promotion-code/redeem-service
   * @secure
   * @response `201` `PromotioncodeRedeemServiceData`
   * @response `400` `HttpErrorDto`
   */
  export namespace PromotioncodeRedeemService {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PromotionCodeRedeemServiceDto;
    export type RequestHeaders = {};
    export type ResponseBody = PromotioncodeRedeemServiceData;
  }
}

export namespace Feedback {
  /**
   * No description
   * @tags feedback
   * @name FeedbackFindAll
   * @summary List the authenticated user support comments
   * @request GET:/admin/feedback/find-all
   * @secure
   * @response `200` `FeedbackFindAllData`
   */
  export namespace FeedbackFindAll {
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
      status?: "new" | "in_review" | "accepted" | "resolved" | "closed";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackFindAllData;
  }

  /**
   * No description
   * @tags feedback
   * @name FeedbackFindOne
   * @summary Get an authenticated user support comment
   * @request GET:/admin/feedback/find-one/{id}
   * @secure
   * @response `200` `FeedbackFindOneData`
   * @response `404` `HttpErrorDto`
   */
  export namespace FeedbackFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackFindOneData;
  }

  /**
   * No description
   * @tags feedback
   * @name FeedbackCreate
   * @summary Create a support comment with optional screenshots
   * @request POST:/admin/feedback/create
   * @secure
   * @response `201` `FeedbackCreateData`
   * @response `400` `HttpErrorDto`
   */
  export namespace FeedbackCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FeedbackCreateMultipartDto;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackCreateData;
  }

  /**
   * No description
   * @tags feedback
   * @name FeedbackReply
   * @summary Reply to an authenticated user support comment
   * @request POST:/admin/feedback/reply/{id}
   * @secure
   * @response `201` `FeedbackReplyData`
   * @response `400` `HttpErrorDto`
   */
  export namespace FeedbackReply {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = FeedbackReplyCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackReplyData;
  }
}

export namespace FeedbackAdmin {
  /**
   * No description
   * @tags feedbackAdmin
   * @name FeedbackadminFindAll
   * @summary List support comments in the administrative panel
   * @request GET:/admin/backoffice/feedback/find-all
   * @secure
   * @response `200` `FeedbackadminFindAllData`
   */
  export namespace FeedbackadminFindAll {
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
      status?: "new" | "in_review" | "accepted" | "resolved" | "closed";
      /** Buscar por título, descripción, usuario o correo */
      search?: string;
      userRole?: "pyme" | "consultor";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackadminFindAllData;
  }

  /**
   * No description
   * @tags feedbackAdmin
   * @name FeedbackadminFindOne
   * @summary Get support comment details in the administrative panel
   * @request GET:/admin/backoffice/feedback/find-one/{id}
   * @secure
   * @response `200` `FeedbackadminFindOneData`
   * @response `404` `HttpErrorDto`
   */
  export namespace FeedbackadminFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackadminFindOneData;
  }

  /**
   * No description
   * @tags feedbackAdmin
   * @name FeedbackadminUpdateStatus
   * @summary Update a support comment status
   * @request PATCH:/admin/backoffice/feedback/status/{id}
   * @secure
   * @response `200` `FeedbackadminUpdateStatusData`
   * @response `400` `HttpErrorDto`
   */
  export namespace FeedbackadminUpdateStatus {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = FeedbackStatusUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackadminUpdateStatusData;
  }

  /**
   * No description
   * @tags feedbackAdmin
   * @name FeedbackadminReply
   * @summary Reply to a support comment as an administrator
   * @request POST:/admin/backoffice/feedback/reply/{id}
   * @secure
   * @response `201` `FeedbackadminReplyData`
   * @response `400` `HttpErrorDto`
   */
  export namespace FeedbackadminReply {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = FeedbackReplyCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackadminReplyData;
  }
}

export namespace ServiceOffer {
  /**
   * No description
   * @tags serviceOffer
   * @name ServiceofferFindAll
   * @summary List active consultant services available to PYMEs
   * @request GET:/admin/service-offer/find-all
   * @secure
   * @response `200` `ServiceofferFindAllData`
   */
  export namespace ServiceofferFindAll {
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
      /** @maxLength 160 */
      search?: string;
      category?:
        | "Estratégica"
        | "Financiera"
        | "Comercial / Ventas"
        | "Marketing"
        | "Servicio al cliente"
        | "Operaciones"
        | "Organizacional / RRHH"
        | "Tecnología"
        | "Legal"
        | "Laboral"
        | "Tributario / Contable";
      /** @maxLength 120 */
      subcategory?: string;
      isActive?: "true" | "false";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceofferFindAllData;
  }

  /**
   * No description
   * @tags serviceOffer
   * @name ServiceofferFindMine
   * @summary List services published by the authenticated consultant
   * @request GET:/admin/service-offer/find-mine
   * @secure
   * @response `200` `ServiceofferFindMineData`
   */
  export namespace ServiceofferFindMine {
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
      /** @maxLength 160 */
      search?: string;
      category?:
        | "Estratégica"
        | "Financiera"
        | "Comercial / Ventas"
        | "Marketing"
        | "Servicio al cliente"
        | "Operaciones"
        | "Organizacional / RRHH"
        | "Tecnología"
        | "Legal"
        | "Laboral"
        | "Tributario / Contable";
      /** @maxLength 120 */
      subcategory?: string;
      isActive?: "true" | "false";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceofferFindMineData;
  }

  /**
   * No description
   * @tags serviceOffer
   * @name ServiceofferFindOne
   * @summary Get a consultant service offer
   * @request GET:/admin/service-offer/find-one/{id}
   * @secure
   * @response `200` `ServiceofferFindOneData`
   * @response `404` `HttpErrorDto`
   */
  export namespace ServiceofferFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceofferFindOneData;
  }

  /**
   * No description
   * @tags serviceOffer
   * @name ServiceofferCreate
   * @summary Publish a consultant service
   * @request POST:/admin/service-offer/create
   * @secure
   * @response `201` `ServiceofferCreateData`
   */
  export namespace ServiceofferCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConsultantServiceOfferCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceofferCreateData;
  }

  /**
   * No description
   * @tags serviceOffer
   * @name ServiceofferUpdate
   * @summary Update a consultant service publication
   * @request PATCH:/admin/service-offer/update/{id}
   * @secure
   * @response `200` `ServiceofferUpdateData`
   */
  export namespace ServiceofferUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsultantServiceOfferUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceofferUpdateData;
  }

  /**
   * No description
   * @tags serviceOffer
   * @name ServiceofferSetActive
   * @summary Activate or pause a consultant service publication
   * @request PATCH:/admin/service-offer/active/{id}
   * @secure
   * @response `200` `ServiceofferSetActiveData`
   */
  export namespace ServiceofferSetActive {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConsultantServiceOfferActiveDto;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceofferSetActiveData;
  }

  /**
   * No description
   * @tags serviceOffer
   * @name ServiceofferRemove
   * @summary Delete a consultant service publication
   * @request DELETE:/admin/service-offer/delete/{id}
   * @secure
   * @response `200` `ServiceofferRemoveData`
   */
  export namespace ServiceofferRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ServiceofferRemoveData;
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

    /**
     * No description
     *
     * @tags auth
     * @name AuthForgotPassword
     * @summary Request password reset link via email
     * @request POST:/auth/forgot-password
     * @response `200` `AuthForgotPasswordData`
     * @response `400` `HttpErrorDto`
     */
    forgotPassword: (data: ForgotPasswordDto, params: RequestParams = {}) =>
      this.http.request<AuthForgotPasswordData, AuthForgotPasswordError>({
        path: `/auth/forgot-password`,
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
     * @name AuthResetPassword
     * @summary Reset user password using token
     * @request POST:/auth/reset-password
     * @response `200` `AuthResetPasswordData`
     * @response `400` `HttpErrorDto`
     */
    resetPassword: (data: ResetPasswordDto, params: RequestParams = {}) =>
      this.http.request<AuthResetPasswordData, AuthResetPasswordError>({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  email = {
    /**
     * No description
     *
     * @tags email
     * @name EmailSendEmail
     * @summary Enviar un correo electrónico
     * @request POST:/admin/email/send
     * @secure
     * @response `201` `EmailSendEmailData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendEmail: (data: EmailSendDto, params: RequestParams = {}) =>
      this.http.request<EmailSendEmailData, EmailSendEmailError>({
        path: `/admin/email/send`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  identityVerification = {
    /**
     * No description
     *
     * @tags identityVerification
     * @name IdentityverificationVerifyDni
     * @summary Validar datos personales contra el registro de DNI de PeruDevs
     * @request POST:/admin/identity-verification/dni
     * @response `200` `IdentityverificationVerifyDniData`
     * @response `400` `HttpErrorDto`
     * @response `502` `HttpErrorDto`
     */
    identityverificationVerifyDni: (
      data: DniVerificationDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        IdentityverificationVerifyDniData,
        IdentityverificationVerifyDniError
      >({
        path: `/admin/identity-verification/dni`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags identityVerification
     * @name IdentityverificationVerifyRuc
     * @summary Validar si un RUC existe en el registro de PeruDevs
     * @request POST:/admin/identity-verification/ruc
     * @response `200` `IdentityverificationVerifyRucData`
     * @response `400` `HttpErrorDto`
     * @response `502` `HttpErrorDto`
     */
    identityverificationVerifyRuc: (
      data: RucVerificationDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        IdentityverificationVerifyRucData,
        IdentityverificationVerifyRucError
      >({
        path: `/admin/identity-verification/ruc`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
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
  pymeAdmin = {
    /**
     * No description
     *
     * @tags pymeAdmin
     * @name PymeadminFindAll
     * @summary List PYMEs for the internal admin panel
     * @request GET:/admin/backoffice/pyme/find-all
     * @secure
     * @response `200` `PymeadminFindAllData`
     * @response `400` `HttpErrorDto`
     */
    pymeadminFindAll: (
      query: PymeadminFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<PymeadminFindAllData, PymeadminFindAllError>({
        path: `/admin/backoffice/pyme/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pymeAdmin
     * @name PymeadminFindOne
     * @summary Get a PYME profile for the internal admin panel
     * @request GET:/admin/backoffice/pyme/find-one/{id}
     * @secure
     * @response `200` `PymeadminFindOneData`
     * @response `400` `HttpErrorDto`
     */
    pymeadminFindOne: (
      { id }: PymeadminFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PymeadminFindOneData, PymeadminFindOneError>({
        path: `/admin/backoffice/pyme/find-one/${id}`,
        method: "GET",
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
     * @name PymeMeetingConsultants
     * @summary Get consultants with at least one meeting with current PYME
     * @request GET:/admin/pyme/meeting-consultants
     * @secure
     * @response `200` `PymeMeetingConsultantsData`
     * @response `400` `HttpErrorDto`
     */
    meetingConsultants: (
      query: PymeMeetingConsultantsParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeMeetingConsultantsData,
        PymeMeetingConsultantsError
      >({
        path: `/admin/pyme/meeting-consultants`,
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
     * @name PymeMeetingDocuments
     * @summary Get the current PYME meeting acts with consultant data
     * @request GET:/admin/pyme/documents/meetings
     * @secure
     * @response `200` `PymeMeetingDocumentsData`
     * @response `400` `HttpErrorDto`
     */
    meetingDocuments: (
      query: PymeMeetingDocumentsParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<PymeMeetingDocumentsData, PymeMeetingDocumentsError>({
        path: `/admin/pyme/documents/meetings`,
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
     * @name PymeDiagnosticDocuments
     * @summary Get the current PYME diagnostics with PYME data
     * @request GET:/admin/pyme/documents/diagnostics
     * @secure
     * @response `200` `PymeDiagnosticDocumentsData`
     * @response `400` `HttpErrorDto`
     */
    diagnosticDocuments: (
      query: PymeDiagnosticDocumentsParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        PymeDiagnosticDocumentsData,
        PymeDiagnosticDocumentsError
      >({
        path: `/admin/pyme/documents/diagnostics`,
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
  adminAuth = {
    /**
     * No description
     *
     * @tags adminAuth
     * @name AdminauthLogin
     * @summary Login for the internal Hubsme administrative panel
     * @request POST:/admin/auth/login
     * @response `200` `AdminauthLoginData`
     * @response `401` `HttpErrorDto`
     */
    adminauthLogin: (data: AdminLoginDto, params: RequestParams = {}) =>
      this.http.request<AdminauthLoginData, AdminauthLoginError>({
        path: `/admin/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  whatsapp = {
    /**
     * No description
     *
     * @tags whatsapp
     * @name WhatsappSendMessage
     * @summary Enviar un mensaje por WhatsApp
     * @request POST:/admin/whatsapp/send
     * @secure
     * @response `201` `WhatsappSendMessageData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendMessage: (data: WhatsappSendDto, params: RequestParams = {}) =>
      this.http.request<WhatsappSendMessageData, WhatsappSendMessageError>({
        path: `/admin/whatsapp/send`,
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
     * @tags whatsapp
     * @name WhatsappSendNotificacionPyme
     * @summary Enviar plantilla notificacion_pyme
     * @request POST:/admin/whatsapp/notificacion-pyme
     * @secure
     * @response `201` `WhatsappSendNotificacionPymeData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendNotificacionPyme: (
      data: WhatsappNotificacionPymeDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        WhatsappSendNotificacionPymeData,
        WhatsappSendNotificacionPymeError
      >({
        path: `/admin/whatsapp/notificacion-pyme`,
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
     * @tags whatsapp
     * @name WhatsappSendNotificacionConsultor
     * @summary Enviar plantilla notificacion_consultor
     * @request POST:/admin/whatsapp/notificacion-consultor
     * @secure
     * @response `201` `WhatsappSendNotificacionConsultorData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendNotificacionConsultor: (
      data: WhatsappNotificacionConsultorDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        WhatsappSendNotificacionConsultorData,
        WhatsappSendNotificacionConsultorError
      >({
        path: `/admin/whatsapp/notificacion-consultor`,
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
     * @tags whatsapp
     * @name WhatsappSendNotificacionCancelacionPyme
     * @summary Enviar plantilla notificacion_cancelacion_pyme
     * @request POST:/admin/whatsapp/notificacion-cancelacion-pyme
     * @secure
     * @response `201` `WhatsappSendNotificacionCancelacionPymeData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendNotificacionCancelacionPyme: (
      data: WhatsappNotificacionCancelacionPymeDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        WhatsappSendNotificacionCancelacionPymeData,
        WhatsappSendNotificacionCancelacionPymeError
      >({
        path: `/admin/whatsapp/notificacion-cancelacion-pyme`,
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
     * @tags whatsapp
     * @name WhatsappSendAlertaReunionConsultor
     * @summary Enviar plantilla alerta_reunion_consultor
     * @request POST:/admin/whatsapp/alerta-reunion-consultor
     * @secure
     * @response `201` `WhatsappSendAlertaReunionConsultorData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendAlertaReunionConsultor: (
      data: WhatsappAlertaReunionConsultorDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        WhatsappSendAlertaReunionConsultorData,
        WhatsappSendAlertaReunionConsultorError
      >({
        path: `/admin/whatsapp/alerta-reunion-consultor`,
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
     * @tags whatsapp
     * @name WhatsappSendAlertaReunionPyme
     * @summary Enviar plantilla alerta_reunion_pyme
     * @request POST:/admin/whatsapp/alerta-reunion-pyme
     * @secure
     * @response `201` `WhatsappSendAlertaReunionPymeData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendAlertaReunionPyme: (
      data: WhatsappAlertaReunionDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        WhatsappSendAlertaReunionPymeData,
        WhatsappSendAlertaReunionPymeError
      >({
        path: `/admin/whatsapp/alerta-reunion-pyme`,
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
     * @tags whatsapp
     * @name WhatsappSendConsultorConfirmarReunion
     * @summary Enviar plantilla consultor_confirmar_reunion
     * @request POST:/admin/whatsapp/consultor-confirmar-reunion
     * @secure
     * @response `201` `WhatsappSendConsultorConfirmarReunionData`
     * @response `400` `HttpErrorDto`
     * @response `500` `HttpErrorDto`
     */
    sendConsultorConfirmarReunion: (
      data: WhatsappConsultorConfirmarReunionDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        WhatsappSendConsultorConfirmarReunionData,
        WhatsappSendConsultorConfirmarReunionError
      >({
        path: `/admin/whatsapp/consultor-confirmar-reunion`,
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
     * @tags whatsapp
     * @name WhatsappVerifyWebhook
     * @summary Verificar el webhook de WhatsApp con Meta
     * @request GET:/admin/whatsapp/webhook
     * @response `200` `WhatsappVerifyWebhookData` Devuelve el valor recibido en hub.challenge
     * @response `403` `void` El token de verificación no coincide
     */
    verifyWebhook: (
      query: WhatsappVerifyWebhookParams,
      params: RequestParams = {},
    ) =>
      this.http.request<WhatsappVerifyWebhookData, void>({
        path: `/admin/whatsapp/webhook`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags whatsapp
     * @name WhatsappReceiveWebhook
     * @summary Recibir mensajes y eventos entrantes de WhatsApp
     * @request POST:/admin/whatsapp/webhook
     * @response `200` `WhatsappReceiveWebhookData`
     * @response `401` `void` La firma enviada por Meta es inválida
     */
    receiveWebhook: (
      data: WhatsappWebhookPayloadDto,
      params: RequestParams = {},
    ) =>
      this.http.request<WhatsappReceiveWebhookData, void>({
        path: `/admin/whatsapp/webhook`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  meetingAdmin = {
    /**
     * No description
     *
     * @tags meetingAdmin
     * @name MeetingadminFindAll
     * @summary List meetings for the internal admin panel
     * @request GET:/admin/backoffice/meeting/find-all
     * @secure
     * @response `200` `MeetingadminFindAllData`
     * @response `400` `HttpErrorDto`
     */
    meetingadminFindAll: (
      query: MeetingadminFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingadminFindAllData, MeetingadminFindAllError>({
        path: `/admin/backoffice/meeting/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meetingAdmin
     * @name MeetingadminFindOne
     * @summary Get a meeting for the internal admin panel
     * @request GET:/admin/backoffice/meeting/find-one/{id}
     * @secure
     * @response `200` `MeetingadminFindOneData`
     * @response `400` `HttpErrorDto`
     */
    meetingadminFindOne: (
      { id }: MeetingadminFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingadminFindOneData, MeetingadminFindOneError>({
        path: `/admin/backoffice/meeting/find-one/${id}`,
        method: "GET",
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
     * @name MeetingCalendar
     * @summary Get lightweight calendar meetings for the authenticated user and date range
     * @request GET:/admin/meeting/calendar
     * @secure
     * @response `200` `MeetingCalendarData`
     * @response `400` `HttpErrorDto`
     */
    calendar: (
      query: MeetingCalendarParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingCalendarData, MeetingCalendarError>({
        path: `/admin/meeting/calendar`,
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
     * @name MeetingAccess
     * @summary Resolve protected Teams access for an authenticated meeting participant
     * @request GET:/admin/meeting/access/{id}
     * @secure
     * @response `200` `MeetingAccessData`
     * @response `403` `HttpErrorDto`
     * @response `404` `HttpErrorDto`
     */
    access: ({ id }: MeetingAccessParams, params: RequestParams = {}) =>
      this.http.request<MeetingAccessData, MeetingAccessError>({
        path: `/admin/meeting/access/${id}`,
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
     * @name MeetingConfirmOption
     * @summary Confirm one of the proposed meeting times and create its Teams meeting URL internally
     * @request POST:/admin/meeting/confirm-option/{id}
     * @secure
     * @response `200` `MeetingConfirmOptionData`
     * @response `400` `HttpErrorDto`
     */
    confirmOption: (
      { id }: MeetingConfirmOptionParams,
      data: MeetingConfirmOptionDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MeetingConfirmOptionData, MeetingConfirmOptionError>({
        path: `/admin/meeting/confirm-option/${id}`,
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
     * @name MeetingCancelByConsultant
     * @summary Cancel a paid meeting as its consultant and issue a restricted replacement code
     * @request POST:/admin/meeting/cancel-by-consultant/{id}
     * @secure
     * @response `200` `MeetingCancelByConsultantData`
     * @response `400` `HttpErrorDto`
     * @response `403` `HttpErrorDto`
     */
    cancelByConsultant: (
      { id }: MeetingCancelByConsultantParams,
      data: MeetingConsultantCancelDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MeetingCancelByConsultantData,
        MeetingCancelByConsultantError
      >({
        path: `/admin/meeting/cancel-by-consultant/${id}`,
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
  ia = {
    /**
     * No description
     *
     * @tags ia
     * @name IaRunHubsmeAi
     * @summary Ejecutar flujo de IA con Gemini para obtener resumen y tareas sugeridas
     * @request POST:/admin/ia/hubsme-ai
     * @secure
     * @response `201` `IaRunHubsmeAiData`
     * @response `400` `HttpErrorDto`
     */
    runHubsmeAi: (data: HubsmeAiRunDto, params: RequestParams = {}) =>
      this.http.request<IaRunHubsmeAiData, IaRunHubsmeAiError>({
        path: `/admin/ia/hubsme-ai`,
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
     * @tags ia
     * @name IaRunConsultantCv
     * @summary Extraer perfil estructurado de consultor desde texto de CV usando Gemini
     * @request POST:/admin/ia/consultant-cv
     * @secure
     * @response `201` `IaRunConsultantCvData`
     * @response `400` `HttpErrorDto`
     */
    runConsultantCv: (data: ConsultantCvRunDto, params: RequestParams = {}) =>
      this.http.request<IaRunConsultantCvData, IaRunConsultantCvError>({
        path: `/admin/ia/consultant-cv`,
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
     * @tags ia
     * @name IaRunServiceRequestChat
     * @summary Continuar el asistente conversacional para definir un servicio
     * @request POST:/admin/ia/service-request-chat
     * @secure
     * @response `201` `IaRunServiceRequestChatData`
     * @response `400` `HttpErrorDto`
     * @response `403` `HttpErrorDto`
     */
    runServiceRequestChat: (
      data: ServiceRequestChatRunDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        IaRunServiceRequestChatData,
        IaRunServiceRequestChatError
      >({
        path: `/admin/ia/service-request-chat`,
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
     * @tags ia
     * @name IaRunServicePaymentPlan
     * @summary Recomendar con IA la estructura de pagos de una solicitud de servicio
     * @request POST:/admin/ia/service-payment-plan
     * @secure
     * @response `201` `IaRunServicePaymentPlanData`
     * @response `400` `HttpErrorDto`
     * @response `403` `HttpErrorDto`
     */
    runServicePaymentPlan: (
      data: ServicePaymentPlanRunDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        IaRunServicePaymentPlanData,
        IaRunServicePaymentPlanError
      >({
        path: `/admin/ia/service-payment-plan`,
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
     * @tags ia
     * @name IaRunServiceConsultantMatches
     * @summary Recomendar exactamente 3 consultores para una solicitud de servicio
     * @request POST:/admin/ia/service-consultant-matches
     * @secure
     * @response `201` `IaRunServiceConsultantMatchesData`
     * @response `400` `HttpErrorDto`
     * @response `403` `HttpErrorDto`
     */
    runServiceConsultantMatches: (
      data: ServiceConsultantMatchRunDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        IaRunServiceConsultantMatchesData,
        IaRunServiceConsultantMatchesError
      >({
        path: `/admin/ia/service-consultant-matches`,
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
  consultantAdmin = {
    /**
     * No description
     *
     * @tags consultantAdmin
     * @name ConsultantadminFindAll
     * @summary List consultants for the internal admin panel
     * @request GET:/admin/backoffice/consultant/find-all
     * @secure
     * @response `200` `ConsultantadminFindAllData`
     * @response `400` `HttpErrorDto`
     */
    consultantadminFindAll: (
      query: ConsultantadminFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantadminFindAllData,
        ConsultantadminFindAllError
      >({
        path: `/admin/backoffice/consultant/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantAdmin
     * @name ConsultantadminFindOne
     * @summary Get a consultant profile for the internal admin panel
     * @request GET:/admin/backoffice/consultant/find-one/{id}
     * @secure
     * @response `200` `ConsultantadminFindOneData`
     * @response `400` `HttpErrorDto`
     */
    consultantadminFindOne: (
      { id }: ConsultantadminFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantadminFindOneData,
        ConsultantadminFindOneError
      >({
        path: `/admin/backoffice/consultant/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantAdmin
     * @name ConsultantadminMercadoPago
     * @summary Get Mercado Pago account details for a consultant in the internal admin panel
     * @request GET:/admin/backoffice/consultant/mercado-pago/{id}
     * @secure
     * @response `200` `ConsultantadminMercadoPagoData`
     * @response `400` `HttpErrorDto`
     */
    consultantadminMercadoPago: (
      { id }: ConsultantadminMercadoPagoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantadminMercadoPagoData,
        ConsultantadminMercadoPagoError
      >({
        path: `/admin/backoffice/consultant/mercado-pago/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantAdmin
     * @name ConsultantadminMercadoPagoFinancial
     * @summary Get a consultant Mercado Pago financial report status in the internal admin panel
     * @request GET:/admin/backoffice/consultant/mercado-pago/{id}/financial
     * @secure
     * @response `200` `ConsultantadminMercadoPagoFinancialData`
     * @response `400` `HttpErrorDto`
     */
    consultantadminMercadoPagoFinancial: (
      { id }: ConsultantadminMercadoPagoFinancialParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantadminMercadoPagoFinancialData,
        ConsultantadminMercadoPagoFinancialError
      >({
        path: `/admin/backoffice/consultant/mercado-pago/${id}/financial`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantAdmin
     * @name ConsultantadminMercadoPagoFinancialDownload
     * @summary Download the latest consultant Mercado Pago financial report
     * @request GET:/admin/backoffice/consultant/mercado-pago/{id}/financial/download
     * @secure
     * @response `200` `ConsultantadminMercadoPagoFinancialDownloadData` Downloads the report or returns its generation status.
     * @response `400` `HttpErrorDto`
     */
    consultantadminMercadoPagoFinancialDownload: (
      { id, ...query }: ConsultantadminMercadoPagoFinancialDownloadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantadminMercadoPagoFinancialDownloadData,
        ConsultantadminMercadoPagoFinancialDownloadError
      >({
        path: `/admin/backoffice/consultant/mercado-pago/${id}/financial/download`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags consultantAdmin
     * @name ConsultantadminApprove
     * @summary Approve or withdraw a consultant approval
     * @request PATCH:/admin/backoffice/consultant/approve/{id}
     * @secure
     * @response `200` `ConsultantadminApproveData`
     * @response `400` `HttpErrorDto`
     */
    consultantadminApprove: (
      { id }: ConsultantadminApproveParams,
      data: ConsultantApprovalDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantadminApproveData,
        ConsultantadminApproveError
      >({
        path: `/admin/backoffice/consultant/approve/${id}`,
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
     * @tags consultantAdmin
     * @name ConsultantadminSetActive
     * @summary Activate or deactivate a consultant
     * @request PATCH:/admin/backoffice/consultant/active/{id}
     * @secure
     * @response `200` `ConsultantadminSetActiveData`
     * @response `400` `HttpErrorDto`
     */
    consultantadminSetActive: (
      { id }: ConsultantadminSetActiveParams,
      data: ConsultantActiveDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantadminSetActiveData,
        ConsultantadminSetActiveError
      >({
        path: `/admin/backoffice/consultant/active/${id}`,
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
     * @tags consultantAdmin
     * @name ConsultantadminRemove
     * @summary Soft-delete a consultant from the internal admin panel
     * @request DELETE:/admin/backoffice/consultant/delete/{id}
     * @secure
     * @response `200` `ConsultantadminRemoveData`
     * @response `400` `HttpErrorDto`
     */
    consultantadminRemove: (
      { id }: ConsultantadminRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantadminRemoveData, ConsultantadminRemoveError>({
        path: `/admin/backoffice/consultant/delete/${id}`,
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
     * @name ConsultantMeetingDocuments
     * @summary Get the current consultant meeting acts with PYME data
     * @request GET:/admin/consultant/documents/meetings
     * @secure
     * @response `200` `ConsultantMeetingDocumentsData`
     * @response `400` `HttpErrorDto`
     */
    meetingDocuments: (
      query: ConsultantMeetingDocumentsParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantMeetingDocumentsData,
        ConsultantMeetingDocumentsError
      >({
        path: `/admin/consultant/documents/meetings`,
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
     * @name ConsultantDiagnosticDocuments
     * @summary Get the current consultant diagnostics with PYME data
     * @request GET:/admin/consultant/documents/diagnostics
     * @secure
     * @response `200` `ConsultantDiagnosticDocumentsData`
     * @response `400` `HttpErrorDto`
     */
    diagnosticDocuments: (
      query: ConsultantDiagnosticDocumentsParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        ConsultantDiagnosticDocumentsData,
        ConsultantDiagnosticDocumentsError
      >({
        path: `/admin/consultant/documents/diagnostics`,
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
     * @name ConsultantSetActive
     * @summary Update consultant availability
     * @request PATCH:/admin/consultant/active/{id}
     * @secure
     * @response `200` `ConsultantSetActiveData`
     * @response `400` `HttpErrorDto`
     */
    setActive: (
      { id }: ConsultantSetActiveParams,
      data: ConsultantActiveDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ConsultantSetActiveData, ConsultantSetActiveError>({
        path: `/admin/consultant/active/${id}`,
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

    /**
     * No description
     *
     * @tags subscription
     * @name SubscriptionCreateCheckout
     * @summary Create Mercado Pago preference for subscription plan
     * @request POST:/admin/subscription/checkout
     * @secure
     * @response `200` `SubscriptionCreateCheckoutData`
     * @response `400` `HttpErrorDto`
     */
    createCheckout: (
      data: SubscriptionCheckoutDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        SubscriptionCreateCheckoutData,
        SubscriptionCreateCheckoutError
      >({
        path: `/admin/subscription/checkout`,
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
     * @name MercadopagoFindPayments
     * @summary List Mercado Pago payments for the authenticated user
     * @request GET:/admin/mercado-pago/payments
     * @secure
     * @response `200` `MercadopagoFindPaymentsData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoFindPayments: (
      query: MercadopagoFindPaymentsParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<
        MercadopagoFindPaymentsData,
        MercadopagoFindPaymentsError
      >({
        path: `/admin/mercado-pago/payments`,
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
     * @name MercadopagoFindPayment
     * @summary Get a Mercado Pago payment detail for the authenticated user
     * @request GET:/admin/mercado-pago/payments/{id}
     * @secure
     * @response `200` `MercadopagoFindPaymentData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoFindPayment: (
      { id }: MercadopagoFindPaymentParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MercadopagoFindPaymentData,
        MercadopagoFindPaymentError
      >({
        path: `/admin/mercado-pago/payments/${id}`,
        method: "GET",
        secure: true,
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
     * @name MercadopagoPrepareCheckoutPayment
     * @summary Create the Mercado Pago preference when the PYME is ready to pay
     * @request POST:/admin/mercado-pago/checkout/{id}/payment
     * @secure
     * @response `200` `MercadopagoPrepareCheckoutPaymentData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoPrepareCheckoutPayment: (
      { id }: MercadopagoPrepareCheckoutPaymentParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MercadopagoPrepareCheckoutPaymentData,
        MercadopagoPrepareCheckoutPaymentError
      >({
        path: `/admin/mercado-pago/checkout/${id}/payment`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mercadoPago
     * @name MercadopagoPrepareServicePayment
     * @summary Create the Mercado Pago preference for a service installment
     * @request POST:/admin/mercado-pago/service/{id}/payment
     * @secure
     * @response `200` `MercadopagoPrepareServicePaymentData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoPrepareServicePayment: (
      { id }: MercadopagoPrepareServicePaymentParams,
      data: MercadoPagoServicePaymentDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MercadopagoPrepareServicePaymentData,
        MercadopagoPrepareServicePaymentError
      >({
        path: `/admin/mercado-pago/service/${id}/payment`,
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
     * @name MercadopagoSyncServicePayment
     * @summary Synchronize a service installment payment with Mercado Pago
     * @request POST:/admin/mercado-pago/service/{id}/payment/sync
     * @secure
     * @response `200` `MercadopagoSyncServicePaymentData`
     * @response `400` `HttpErrorDto`
     */
    mercadopagoSyncServicePayment: (
      { id }: MercadopagoSyncServicePaymentParams,
      data: MercadoPagoServicePaymentDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        MercadopagoSyncServicePaymentData,
        MercadopagoSyncServicePaymentError
      >({
        path: `/admin/mercado-pago/service/${id}/payment/sync`,
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
     * @name MercadopagoWebhook
     * @summary Mercado Pago payment webhook
     * @request POST:/admin/mercado-pago/webhook
     * @response `200` `MercadopagoWebhookData` Webhook processed
     */
    mercadopagoWebhook: (
      query: MercadopagoWebhookParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<MercadopagoWebhookData, any>({
        path: `/admin/mercado-pago/webhook`,
        method: "POST",
        query: query,
        ...params,
      }),
  };
  service = {
    /**
     * No description
     *
     * @tags service
     * @name ServiceFindAll
     * @summary List service requests or proposals for the authenticated participant
     * @request GET:/admin/service/find-all
     * @secure
     * @response `200` `ServiceFindAllData`
     */
    findAll: (
      query: ServiceFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceFindAllData, any>({
        path: `/admin/service/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags service
     * @name ServiceFindOne
     * @summary Get a service request for the authenticated participant
     * @request GET:/admin/service/find-one/{id}
     * @secure
     * @response `200` `ServiceFindOneData`
     * @response `404` `HttpErrorDto`
     */
    findOne: (
      { id }: ServiceFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceFindOneData, ServiceFindOneError>({
        path: `/admin/service/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags service
     * @name ServiceCreate
     * @summary Create and send a service request to one to three consultants as a PYME
     * @request POST:/admin/service/create
     * @secure
     * @response `201` `ServiceCreateData`
     * @response `400` `HttpErrorDto`
     */
    create: (
      data: ServiceRequestCreateMultipartDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceCreateData, ServiceCreateError>({
        path: `/admin/service/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags service
     * @name ServiceSendProposal
     * @summary Send a priced proposal as the assigned consultant
     * @request POST:/admin/service/proposal/{id}
     * @secure
     * @response `201` `ServiceSendProposalData`
     * @response `400` `HttpErrorDto`
     */
    sendProposal: (
      { id }: ServiceSendProposalParams,
      data: ServiceRequestProposalDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceSendProposalData, ServiceSendProposalError>({
        path: `/admin/service/proposal/${id}`,
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
     * @tags service
     * @name ServiceDecline
     * @summary Decline a service request or its priced proposal
     * @request POST:/admin/service/decline/{id}
     * @secure
     * @response `201` `ServiceDeclineData`
     * @response `400` `HttpErrorDto`
     */
    decline: (
      { id }: ServiceDeclineParams,
      data: ServiceRequestDeclineDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceDeclineData, ServiceDeclineError>({
        path: `/admin/service/decline/${id}`,
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
     * @tags service
     * @name ServiceCompleteService
     * @summary Mark a paid service as completed by its PYME
     * @request POST:/admin/service/{id}/complete
     * @secure
     * @response `201` `ServiceCompleteServiceData`
     * @response `400` `HttpErrorDto`
     */
    completeService: (
      { id }: ServiceCompleteServiceParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ServiceCompleteServiceData,
        ServiceCompleteServiceError
      >({
        path: `/admin/service/${id}/complete`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags service
     * @name ServiceScheduleMilestoneMeeting
     * @summary Propose three meeting times for a paid service milestone
     * @request POST:/admin/service/{id}/milestone-meeting
     * @secure
     * @response `201` `ServiceScheduleMilestoneMeetingData`
     * @response `400` `HttpErrorDto`
     */
    scheduleMilestoneMeeting: (
      { id }: ServiceScheduleMilestoneMeetingParams,
      data: ServiceRequestMilestoneMeetingDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ServiceScheduleMilestoneMeetingData,
        ServiceScheduleMilestoneMeetingError
      >({
        path: `/admin/service/${id}/milestone-meeting`,
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
     * @tags service
     * @name ServiceUpdateMilestone
     * @summary Edit a service milestone before it has a meeting
     * @request PATCH:/admin/service/{id}/milestone/{index}
     * @secure
     * @response `200` `ServiceUpdateMilestoneData`
     * @response `400` `HttpErrorDto`
     */
    updateMilestone: (
      { id, index }: ServiceUpdateMilestoneParams,
      data: ServiceRequestMilestoneUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ServiceUpdateMilestoneData,
        ServiceUpdateMilestoneError
      >({
        path: `/admin/service/${id}/milestone/${index}`,
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
     * @tags service
     * @name ServiceRemoveMilestone
     * @summary Delete a service milestone before it has a meeting
     * @request DELETE:/admin/service/{id}/milestone/{index}
     * @secure
     * @response `200` `ServiceRemoveMilestoneData`
     * @response `400` `HttpErrorDto`
     */
    removeMilestone: (
      { id, index }: ServiceRemoveMilestoneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ServiceRemoveMilestoneData,
        ServiceRemoveMilestoneError
      >({
        path: `/admin/service/${id}/milestone/${index}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags service
     * @name ServiceAddExtraMilestoneMeeting
     * @summary Add an extra milestone and propose three meeting times
     * @request POST:/admin/service/{id}/extra-milestone-meeting
     * @secure
     * @response `201` `ServiceAddExtraMilestoneMeetingData`
     * @response `400` `HttpErrorDto`
     */
    addExtraMilestoneMeeting: (
      { id }: ServiceAddExtraMilestoneMeetingParams,
      data: ServiceRequestExtraMilestoneMeetingDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ServiceAddExtraMilestoneMeetingData,
        ServiceAddExtraMilestoneMeetingError
      >({
        path: `/admin/service/${id}/extra-milestone-meeting`,
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
     * @tags service
     * @name ServiceUploadEvidence
     * @summary Attach evidence or a deliverable to a paid service as its consultant
     * @request POST:/admin/service/{id}/evidence
     * @secure
     * @response `201` `ServiceUploadEvidenceData`
     * @response `400` `HttpErrorDto`
     */
    uploadEvidence: (
      { id }: ServiceUploadEvidenceParams,
      data: ServiceRequestEvidenceMultipartDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceUploadEvidenceData, ServiceUploadEvidenceError>({
        path: `/admin/service/${id}/evidence`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags service
     * @name ServiceDeleteEvidence
     * @summary Delete a service evidence as its consultant before its milestone has a meeting
     * @request DELETE:/admin/service/{id}/evidence/{attachmentId}
     * @secure
     * @response `200` `ServiceDeleteEvidenceData`
     * @response `400` `HttpErrorDto`
     */
    deleteEvidence: (
      { id, attachmentId }: ServiceDeleteEvidenceParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceDeleteEvidenceData, ServiceDeleteEvidenceError>({
        path: `/admin/service/${id}/evidence/${attachmentId}`,
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
  promotionCodeAdmin = {
    /**
     * No description
     *
     * @tags promotionCodeAdmin
     * @name PromotioncodeadminFindAll
     * @summary List promotional codes for the admin panel
     * @request GET:/admin/promotion-code/find-all
     * @secure
     * @response `200` `PromotioncodeadminFindAllData`
     */
    promotioncodeadminFindAll: (
      query: PromotioncodeadminFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<PromotioncodeadminFindAllData, any>({
        path: `/admin/promotion-code/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags promotionCodeAdmin
     * @name PromotioncodeadminFindOne
     * @summary Get promotional code details and redemptions
     * @request GET:/admin/promotion-code/find-one/{id}
     * @secure
     * @response `200` `PromotioncodeadminFindOneData`
     * @response `400` `HttpErrorDto`
     */
    promotioncodeadminFindOne: (
      { id }: PromotioncodeadminFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PromotioncodeadminFindOneData,
        PromotioncodeadminFindOneError
      >({
        path: `/admin/promotion-code/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags promotionCodeAdmin
     * @name PromotioncodeadminCreate
     * @summary Create a promotional code
     * @request POST:/admin/promotion-code/create
     * @secure
     * @response `201` `PromotioncodeadminCreateData`
     * @response `400` `HttpErrorDto`
     */
    promotioncodeadminCreate: (
      data: PromotionCodeCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PromotioncodeadminCreateData,
        PromotioncodeadminCreateError
      >({
        path: `/admin/promotion-code/create`,
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
     * @tags promotionCodeAdmin
     * @name PromotioncodeadminUpdate
     * @summary Update or deactivate a promotional code
     * @request PATCH:/admin/promotion-code/update/{id}
     * @secure
     * @response `200` `PromotioncodeadminUpdateData`
     * @response `400` `HttpErrorDto`
     */
    promotioncodeadminUpdate: (
      { id }: PromotioncodeadminUpdateParams,
      data: PromotionCodeUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PromotioncodeadminUpdateData,
        PromotioncodeadminUpdateError
      >({
        path: `/admin/promotion-code/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  promotionCode = {
    /**
     * No description
     *
     * @tags promotionCode
     * @name PromotioncodeRedeem
     * @summary Redeem a code for a free consulting session
     * @request POST:/admin/promotion-code/redeem
     * @secure
     * @response `201` `PromotioncodeRedeemData`
     * @response `400` `HttpErrorDto`
     */
    promotioncodeRedeem: (
      data: PromotionCodeRedeemDto,
      params: RequestParams = {},
    ) =>
      this.http.request<PromotioncodeRedeemData, PromotioncodeRedeemError>({
        path: `/admin/promotion-code/redeem`,
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
     * @tags promotionCode
     * @name PromotioncodeRedeemService
     * @summary Redeem a service code for the next available installment
     * @request POST:/admin/promotion-code/redeem-service
     * @secure
     * @response `201` `PromotioncodeRedeemServiceData`
     * @response `400` `HttpErrorDto`
     */
    promotioncodeRedeemService: (
      data: PromotionCodeRedeemServiceDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PromotioncodeRedeemServiceData,
        PromotioncodeRedeemServiceError
      >({
        path: `/admin/promotion-code/redeem-service`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  feedback = {
    /**
     * No description
     *
     * @tags feedback
     * @name FeedbackFindAll
     * @summary List the authenticated user support comments
     * @request GET:/admin/feedback/find-all
     * @secure
     * @response `200` `FeedbackFindAllData`
     */
    findAll: (
      query: FeedbackFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<FeedbackFindAllData, any>({
        path: `/admin/feedback/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags feedback
     * @name FeedbackFindOne
     * @summary Get an authenticated user support comment
     * @request GET:/admin/feedback/find-one/{id}
     * @secure
     * @response `200` `FeedbackFindOneData`
     * @response `404` `HttpErrorDto`
     */
    findOne: (
      { id }: FeedbackFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<FeedbackFindOneData, FeedbackFindOneError>({
        path: `/admin/feedback/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags feedback
     * @name FeedbackCreate
     * @summary Create a support comment with optional screenshots
     * @request POST:/admin/feedback/create
     * @secure
     * @response `201` `FeedbackCreateData`
     * @response `400` `HttpErrorDto`
     */
    create: (
      data: FeedbackCreateMultipartDto,
      params: RequestParams = {},
    ) =>
      this.http.request<FeedbackCreateData, FeedbackCreateError>({
        path: `/admin/feedback/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags feedback
     * @name FeedbackReply
     * @summary Reply to an authenticated user support comment
     * @request POST:/admin/feedback/reply/{id}
     * @secure
     * @response `201` `FeedbackReplyData`
     * @response `400` `HttpErrorDto`
     */
    reply: (
      { id }: FeedbackReplyParams,
      data: FeedbackReplyCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<FeedbackReplyData, FeedbackReplyError>({
        path: `/admin/feedback/reply/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  feedbackAdmin = {
    /**
     * No description
     *
     * @tags feedbackAdmin
     * @name FeedbackadminFindAll
     * @summary List support comments in the administrative panel
     * @request GET:/admin/backoffice/feedback/find-all
     * @secure
     * @response `200` `FeedbackadminFindAllData`
     */
    feedbackadminFindAll: (
      query: FeedbackadminFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<FeedbackadminFindAllData, any>({
        path: `/admin/backoffice/feedback/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags feedbackAdmin
     * @name FeedbackadminFindOne
     * @summary Get support comment details in the administrative panel
     * @request GET:/admin/backoffice/feedback/find-one/{id}
     * @secure
     * @response `200` `FeedbackadminFindOneData`
     * @response `404` `HttpErrorDto`
     */
    feedbackadminFindOne: (
      { id }: FeedbackadminFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<FeedbackadminFindOneData, FeedbackadminFindOneError>({
        path: `/admin/backoffice/feedback/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags feedbackAdmin
     * @name FeedbackadminUpdateStatus
     * @summary Update a support comment status
     * @request PATCH:/admin/backoffice/feedback/status/{id}
     * @secure
     * @response `200` `FeedbackadminUpdateStatusData`
     * @response `400` `HttpErrorDto`
     */
    feedbackadminUpdateStatus: (
      { id }: FeedbackadminUpdateStatusParams,
      data: FeedbackStatusUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<
        FeedbackadminUpdateStatusData,
        FeedbackadminUpdateStatusError
      >({
        path: `/admin/backoffice/feedback/status/${id}`,
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
     * @tags feedbackAdmin
     * @name FeedbackadminReply
     * @summary Reply to a support comment as an administrator
     * @request POST:/admin/backoffice/feedback/reply/{id}
     * @secure
     * @response `201` `FeedbackadminReplyData`
     * @response `400` `HttpErrorDto`
     */
    feedbackadminReply: (
      { id }: FeedbackadminReplyParams,
      data: FeedbackReplyCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<FeedbackadminReplyData, FeedbackadminReplyError>({
        path: `/admin/backoffice/feedback/reply/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  serviceOffer = {
    /**
     * No description
     *
     * @tags serviceOffer
     * @name ServiceofferFindAll
     * @summary List active consultant services available to PYMEs
     * @request GET:/admin/service-offer/find-all
     * @secure
     * @response `200` `ServiceofferFindAllData`
     */
    serviceofferFindAll: (
      query: ServiceofferFindAllParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceofferFindAllData, any>({
        path: `/admin/service-offer/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags serviceOffer
     * @name ServiceofferFindMine
     * @summary List services published by the authenticated consultant
     * @request GET:/admin/service-offer/find-mine
     * @secure
     * @response `200` `ServiceofferFindMineData`
     */
    serviceofferFindMine: (
      query: ServiceofferFindMineParams = {},
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceofferFindMineData, any>({
        path: `/admin/service-offer/find-mine`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags serviceOffer
     * @name ServiceofferFindOne
     * @summary Get a consultant service offer
     * @request GET:/admin/service-offer/find-one/{id}
     * @secure
     * @response `200` `ServiceofferFindOneData`
     * @response `404` `HttpErrorDto`
     */
    serviceofferFindOne: (
      { id }: ServiceofferFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceofferFindOneData, ServiceofferFindOneError>({
        path: `/admin/service-offer/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags serviceOffer
     * @name ServiceofferCreate
     * @summary Publish a consultant service
     * @request POST:/admin/service-offer/create
     * @secure
     * @response `201` `ServiceofferCreateData`
     */
    serviceofferCreate: (
      data: ConsultantServiceOfferCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceofferCreateData, any>({
        path: `/admin/service-offer/create`,
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
     * @tags serviceOffer
     * @name ServiceofferUpdate
     * @summary Update a consultant service publication
     * @request PATCH:/admin/service-offer/update/{id}
     * @secure
     * @response `200` `ServiceofferUpdateData`
     */
    serviceofferUpdate: (
      { id }: ServiceofferUpdateParams,
      data: ConsultantServiceOfferUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceofferUpdateData, any>({
        path: `/admin/service-offer/update/${id}`,
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
     * @tags serviceOffer
     * @name ServiceofferSetActive
     * @summary Activate or pause a consultant service publication
     * @request PATCH:/admin/service-offer/active/{id}
     * @secure
     * @response `200` `ServiceofferSetActiveData`
     */
    serviceofferSetActive: (
      { id }: ServiceofferSetActiveParams,
      data: ConsultantServiceOfferActiveDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceofferSetActiveData, any>({
        path: `/admin/service-offer/active/${id}`,
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
     * @tags serviceOffer
     * @name ServiceofferRemove
     * @summary Delete a consultant service publication
     * @request DELETE:/admin/service-offer/delete/{id}
     * @secure
     * @response `200` `ServiceofferRemoveData`
     */
    serviceofferRemove: (
      { id }: ServiceofferRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ServiceofferRemoveData, any>({
        path: `/admin/service-offer/delete/${id}`,
        method: "DELETE",
        secure: true,
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
