import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  SERVICE_REQUEST_CATEGORY_OPTIONS,
  ServiceRequestCategory,
} from '@enum/service-request-category.enum';
import { ConsultantInputSearchFilters } from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import {
  ConsultantOption,
  ConsultantSelection,
  InitialMeetingSlot,
} from './utils/service-request-wizard.types';
import { AiService } from '@service/admin/ai.service';
import { ConsultantTimeSlotService } from '@service/admin/consultant-time-slot.service';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import {
  PaginationMetaDto,
  ServiceConsultantMatchDto,
  ServicePaymentPlanResultDto,
  ServiceRequestChatMessageDto,
  ServiceRequestDraftDto,
  ServiceRequestMilestoneDraftDto,
  ServiceRequestInitialMeetingOptionDto,
  ServiceRequestResultDto,
} from 'api/backend.api';

type ServiceStatus = ServiceRequestResultDto['status'];
type ServiceStage = 'requests' | 'proposals';
type WizardStep = 1 | 2 | 3 | 4;

const INITIAL_ASSISTANT_MESSAGE =
  '¡Hola! Cuéntame qué problema necesita resolver tu empresa y qué resultado esperas. Luego precisaré contigo qué esperas recibir al finalizar, presupuesto, duración, fecha límite y forma de trabajo. La solicitud siempre tendrá un primer hito de kickoff y presentación, y un último hito de cierre; si mencionas otras etapas, las organizaremos entre ambos.';
const KICKOFF_MILESTONE_TITLE = 'Kickoff y alineamiento inicial';
const COMPLETION_MILESTONE_TITLE = 'Cierre y finalización del servicio';

@Injectable()
export class PymeServicesStore {
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly aiService = inject(AiService);
  private readonly consultantTimeSlotService = inject(ConsultantTimeSlotService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly meetingDateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  private requestSequence = 0;
  private aiRequestSequence = 0;
  private paymentPlanRequestSequence = 0;
  private availabilityRequestSequence = 0;
  private paymentPlanDraftSnapshot = '';

  readonly pageSize = 9;
  readonly consultantSearchFilters: ConsultantInputSearchFilters = {
    active: 'true',
    validated: 'true',
  };
  readonly activeTab = signal<ServiceStage>('requests');
  readonly services = signal<ServiceRequestResultDto[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly statusFilter = signal<ServiceStatus | ''>('');
  readonly search = signal('');
  readonly loading = signal(false);
  readonly statusOptions = computed<Array<{ value: ServiceStatus | ''; label: string }>>(() =>
    this.activeTab() === 'requests'
      ? [
          { value: '', label: 'Todos los estados' },
          { value: 'requested', label: 'Esperando respuesta' },
          { value: 'consultant_declined', label: 'No aceptadas por consultor' },
          { value: 'cancelled', label: 'Canceladas' },
        ]
      : [
          { value: '', label: 'Todos los estados' },
          { value: 'proposal_sent', label: 'Precio recibido' },
          { value: 'payment_pending', label: 'Pago pendiente' },
          { value: 'paid', label: 'Aprobadas y pagadas' },
          { value: 'completed', label: 'Completadas' },
          { value: 'pyme_declined', label: 'No aceptadas por mi empresa' },
        ],
  );

  readonly showCreate = signal(false);
  readonly creating = signal(false);
  readonly wizardStep = signal<WizardStep>(1);
  readonly chatMessages = signal<ServiceRequestChatMessageDto[]>([]);
  readonly chatInput = signal('');
  readonly chatLoading = signal(false);
  readonly chatComplete = signal(false);
  readonly missingInformation = signal<string[]>([]);
  readonly title = signal('');
  readonly category = signal<ServiceRequestCategory | ''>('');
  readonly subcategory = signal('');
  readonly description = signal('');
  readonly expectedOutcome = signal('');
  readonly requirements = signal('');
  readonly deliverables = signal<string[]>(['']);
  readonly exclusions = signal('');
  readonly referenceUrls = signal<string[]>(['']);
  readonly referenceFiles = signal<File[]>([]);
  readonly budgetType = signal<ServiceRequestDraftDto['budgetType']>('');
  readonly budgetMin = signal('');
  readonly budgetMax = signal('');
  readonly deadline = signal('');
  readonly estimatedDuration = signal('');
  readonly workModality = signal<'remote'>('remote');
  readonly workMethod = signal('');
  readonly milestones = signal<ServiceRequestMilestoneDraftDto[]>([]);
  readonly details = signal('');
  readonly paymentPlan = signal<ServicePaymentPlanResultDto | null>(null);
  readonly paymentPlanLoading = signal(false);
  readonly categoryOptions = SERVICE_REQUEST_CATEGORY_OPTIONS;
  readonly subcategoryOptions = computed(
    () =>
      this.categoryOptions.find((option) => option.category === this.category())?.subcategories ??
      [],
  );
  readonly minimumDeadline = this.toLocalDateInput(new Date());
  readonly matchingConsultants = signal(false);
  readonly aiMatches = signal<ServiceConsultantMatchDto[]>([]);
  readonly selectedConsultants = signal<ConsultantSelection[]>([]);
  readonly initialMeetingOptions = signal<Record<number, string[]>>({});
  readonly initialMeetingAvailability = signal<Record<number, InitialMeetingSlot[]>>({});
  readonly initialMeetingAvailabilityLoading = signal(false);
  readonly minimumMeetingDateTime = this.toLocalDateTimeInput(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );
  readonly canReviewDraft = computed(() => this.chatComplete() && this.hasValidDraft());
  readonly canSendService = computed(
    () =>
      this.hasValidDraft() &&
      Boolean(this.paymentPlan()) &&
      this.selectedConsultants().length >= 1 &&
      this.hasValidInitialMeetingOptions(),
  );

  constructor() {
    void this.loadServices();
  }

  async loadServices() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const result = await this.serviceRequestService.findAll({
        page: this.page(),
        limit: this.pageSize,
        stage: this.activeTab(),
        status: this.statusFilter() || undefined,
        search: this.search().trim() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.services.set(result.data);
      this.meta.set(result.meta);
    } catch (error) {
      if (requestId === this.requestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  changeTab(tab: ServiceStage) {
    if (tab === this.activeTab()) return;
    this.activeTab.set(tab);
    this.statusFilter.set('');
    this.page.set(1);
    void this.loadServices();
  }

  applyFilters() {
    this.page.set(1);
    void this.loadServices();
  }

  clearFilters() {
    this.search.set('');
    this.statusFilter.set('');
    this.applyFilters();
  }

  changeStatus(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value as ServiceStatus | '');
    this.applyFilters();
  }

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadServices();
  }

  openCreate() {
    this.resetCreateFlow();
    this.showCreate.set(true);
  }

  closeCreate() {
    if (
      this.creating() ||
      this.chatLoading() ||
      this.paymentPlanLoading() ||
      this.matchingConsultants()
    )
      return;
    this.showCreate.set(false);
    this.resetCreateFlow();
  }

  async sendChatMessage() {
    const content = this.chatInput().trim();
    if (content.length < 2 || this.chatLoading() || this.chatComplete()) return;

    const messages = [...this.chatMessages(), { role: 'user' as const, content }];
    const requestId = ++this.aiRequestSequence;
    this.chatMessages.set(messages);
    this.chatInput.set('');
    this.chatLoading.set(true);
    try {
      const result = await this.aiService.continueServiceRequestChat({
        messages,
        draft: this.currentDraft(),
      });
      if (requestId !== this.aiRequestSequence) return;
      this.chatMessages.update((current) => [
        ...current,
        { role: 'assistant', content: result.message },
      ]);
      this.chatComplete.set(result.isComplete);
      this.missingInformation.set(result.missingInformation);
      this.applyDraft(result.draft);
    } catch (error) {
      if (requestId === this.aiRequestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.aiRequestSequence) this.chatLoading.set(false);
    }
  }

  goToReview() {
    if (!this.canReviewDraft()) {
      this.toastService.warning('Confirma con el asistente que ya brindaste toda la información');
      return;
    }
    this.wizardStep.set(2);
  }

  changeCategory(value: string) {
    const category =
      this.categoryOptions.find((option) => option.category === value)?.category ?? '';
    this.category.set(category);
    if (!this.subcategoryOptions().includes(this.subcategory())) this.subcategory.set('');
  }

  changeBudgetType(value: string) {
    this.budgetType.set(value === 'fixed' || value === 'range' ? value : '');
    if (value !== 'range') this.budgetMax.set('');
  }

  changeBudgetMin(value: string | number | null) {
    this.budgetMin.set(value === null ? '' : String(value));
  }

  changeBudgetMax(value: string | number | null) {
    this.budgetMax.set(value === null ? '' : String(value));
  }

  updateDeliverable(index: number, value: string) {
    this.deliverables.update((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  addDeliverable() {
    if (this.deliverables().length >= 20) return;
    this.deliverables.update((items) => [...items, '']);
  }

  removeDeliverable(index: number) {
    this.deliverables.update((items) => {
      const next = items.filter((_, itemIndex) => itemIndex !== index);
      return next.length ? next : [''];
    });
  }

  updateReferenceUrl(index: number, value: string) {
    this.referenceUrls.update((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  addReferenceUrl() {
    if (this.referenceUrls().length >= 10) return;
    this.referenceUrls.update((items) => [...items, '']);
  }

  removeReferenceUrl(index: number) {
    this.referenceUrls.update((items) => {
      const next = items.filter((_, itemIndex) => itemIndex !== index);
      return next.length ? next : [''];
    });
  }

  selectReferenceFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const incoming = Array.from(input.files ?? []);
    input.value = '';
    if (!incoming.length) return;

    const allowedTypes = new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
    ]);
    const invalid = incoming.find(
      (file) => !allowedTypes.has(file.type) || file.size > 10 * 1024 * 1024,
    );
    if (invalid) {
      this.toastService.warning('Adjunta archivos PDF, imágenes u Office de máximo 10 MB');
      return;
    }

    const existing = this.referenceFiles();
    const unique = incoming.filter(
      (file) => !existing.some((item) => item.name === file.name && item.size === file.size),
    );
    if (existing.length + unique.length > 5) {
      this.toastService.warning('Puedes adjuntar un máximo de 5 archivos');
      return;
    }
    this.referenceFiles.set([...existing, ...unique]);
  }

  removeReferenceFile(index: number) {
    this.referenceFiles.update((files) => files.filter((_, fileIndex) => fileIndex !== index));
  }

  addMilestone() {
    if (this.milestones().length >= 20) return;
    this.milestones.update((items) => {
      if (items.length < 2) return [...items, { title: '', dueDate: '' }];
      const updated = [...items];
      updated.splice(updated.length - 1, 0, { title: '', dueDate: '' });
      return updated;
    });
  }

  updateMilestone(index: number, field: keyof ServiceRequestMilestoneDraftDto, value: string) {
    if (this.isFixedDraftMilestone(index)) return;
    this.milestones.update((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    );
  }

  removeMilestone(index: number) {
    if (this.isFixedDraftMilestone(index)) return;
    this.milestones.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  updateDeadline(value: string) {
    this.deadline.set(value);
    this.milestones.update((items) =>
      items.map((item, index) =>
        index === items.length - 1
          ? { ...item, title: COMPLETION_MILESTONE_TITLE, dueDate: value }
          : item,
      ),
    );
  }

  isFixedDraftMilestone(index: number) {
    return index === 0 || index === this.milestones().length - 1;
  }

  async goToPaymentPlan() {
    if (!this.hasValidDraft()) {
      this.toastService.warning(
        'Completa todos los datos obligatorios antes de definir las cuotas',
      );
      return;
    }
    this.wizardStep.set(3);
    await this.recommendPaymentPlan();
  }

  async recommendPaymentPlan(force = false) {
    if (this.paymentPlanLoading()) return;
    const draft = this.currentDraft();
    const draftSnapshot = JSON.stringify(draft);
    if (!force && this.paymentPlan() && this.paymentPlanDraftSnapshot === draftSnapshot) return;

    const requestId = ++this.paymentPlanRequestSequence;
    this.paymentPlan.set(null);
    this.paymentPlanLoading.set(true);
    try {
      const result = await this.aiService.recommendServicePaymentPlan({ draft });
      if (requestId !== this.paymentPlanRequestSequence) return;
      this.paymentPlan.set(result);
      this.paymentPlanDraftSnapshot = draftSnapshot;
    } catch (error) {
      if (requestId === this.paymentPlanRequestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.paymentPlanRequestSequence) this.paymentPlanLoading.set(false);
    }
  }

  goToConsultants() {
    if (!this.paymentPlan()) {
      this.toastService.warning('Genera el plan de cuotas antes de elegir consultores');
      return;
    }
    this.wizardStep.set(4);
  }

  previousStep() {
    if (this.wizardStep() === 4) this.wizardStep.set(3);
    else if (this.wizardStep() === 3) this.wizardStep.set(2);
    else if (this.wizardStep() === 2) this.wizardStep.set(1);
  }

  maximumPaymentInstallments(): number {
    return Math.min(6, Math.max(1, this.normalizedDraftMilestones().length));
  }

  normalizedDraftMilestonesForView(): ServiceRequestMilestoneDraftDto[] {
    return this.normalizedDraftMilestones();
  }

  updatePaymentInstallmentCount(value: number | string): void {
    const currentPlan = this.paymentPlan();
    const requestedCount = Number(value);
    if (!currentPlan || !Number.isInteger(requestedCount)) return;

    const installmentCount = Math.min(
      this.maximumPaymentInstallments(),
      Math.max(1, requestedCount),
    );
    if (installmentCount === currentPlan.installments.length) return;

    const milestones = this.normalizedDraftMilestones();
    const milestoneIndexes = this.paymentMilestoneIndexes(installmentCount, milestones.length);
    const basePercentage = Math.floor(100 / installmentCount);
    const percentageRemainder = 100 - basePercentage * installmentCount;
    const installments: ServicePaymentPlanResultDto['installments'] = milestoneIndexes.map(
      (milestoneIndex, installmentIndex) => {
        const isFirst = installmentIndex === 0;
        const isLast = installmentIndex === installmentCount - 1;
        const milestoneTitle = milestones[milestoneIndex]?.title ?? `Hito ${milestoneIndex + 1}`;

        return {
          label: isFirst
            ? installmentCount === 1
              ? 'Pago único para iniciar el servicio'
              : 'Pago inicial para iniciar el servicio'
            : isLast
              ? 'Pago final al cerrar el servicio'
              : `Pago al completar ${milestoneTitle}`,
          percentage: basePercentage + (installmentIndex < percentageRemainder ? 1 : 0),
          trigger: isFirst
            ? 'service_approval'
            : isLast
              ? 'service_completion'
              : 'milestone_completion',
          milestoneIndex,
        };
      },
    );
    const strategy: ServicePaymentPlanResultDto['strategy'] =
      installmentCount === 1
        ? 'single'
        : installmentCount === 2
          ? 'initial_final'
          : 'milestone_installments';

    this.paymentPlan.set({
      ...currentPlan,
      strategy,
      summary:
        installmentCount === 1
          ? 'Pago único del 100% al aprobar e iniciar el servicio.'
          : installmentCount === 2
            ? `${installments[0]?.percentage}% al iniciar y ${installments[1]?.percentage}% al finalizar el servicio.`
            : `${installmentCount} cuotas vinculadas al inicio, los avances definidos y el cierre del servicio.`,
      rationale:
        installmentCount === 1
          ? 'El plan fue ajustado manualmente a un pago único antes de iniciar el servicio.'
          : `El plan fue ajustado manualmente a ${installmentCount} cuotas, distribuidas de forma equilibrada entre los hitos disponibles.`,
      installments,
    });
  }

  selectManualConsultant(consultant: ConsultantOption | null) {
    if (!consultant) return;
    this.addConsultant({
      userId: consultant.userId,
      fullName: consultant.fullName,
      headline: consultant.headline,
      photoUrl: consultant.photoUrl,
      diagnosticAreas: consultant.diagnosticAreas,
      specialties: consultant.specialties,
      yearsExperience: consultant.yearsExperience,
      rating: consultant.rating,
      reason: null,
    });
  }

  async findRecommendedConsultants() {
    if (this.matchingConsultants()) return;
    this.matchingConsultants.set(true);
    try {
      const result = await this.aiService.matchServiceConsultants({ draft: this.currentDraft() });
      this.aiMatches.set(result.matches);
      this.selectedConsultants.set(result.matches.map((match) => this.matchToSelection(match)));
      this.initialMeetingOptions.set(
        Object.fromEntries(result.matches.map((match) => [match.consultantId, ['', '', '']])),
      );
      this.initialMeetingAvailability.set({});
      await this.loadInitialMeetingAvailability(result.matches.map((match) => match.consultantId));
      this.toastService.success('Encontramos 3 consultores compatibles con tu servicio');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.matchingConsultants.set(false);
    }
  }

  toggleAiMatch(match: ServiceConsultantMatchDto) {
    if (this.isConsultantSelected(match.consultantId)) {
      this.removeConsultant(match.consultantId);
      return;
    }
    this.addConsultant(this.matchToSelection(match));
  }

  isConsultantSelected(consultantId: number) {
    return this.selectedConsultants().some((consultant) => consultant.userId === consultantId);
  }

  removeConsultant(consultantId: number) {
    this.selectedConsultants.update((current) =>
      current.filter((consultant) => consultant.userId !== consultantId),
    );
    this.initialMeetingOptions.update((current) => {
      const next = { ...current };
      delete next[consultantId];
      return next;
    });
    this.initialMeetingAvailability.update((current) => {
      const next = { ...current };
      delete next[consultantId];
      return next;
    });
  }

  initialMeetingTimesFor(consultantId: number) {
    return this.initialMeetingOptions()[consultantId] ?? ['', '', ''];
  }

  updateInitialMeetingTime(consultantId: number, index: number, value: string) {
    this.initialMeetingOptions.update((current) => {
      const values = [...(current[consultantId] ?? ['', '', ''])];
      values[index] = value;
      return { ...current, [consultantId]: values };
    });
  }

  initialMeetingAvailabilityFor(consultantId: number) {
    return this.initialMeetingAvailability()[consultantId] ?? [];
  }

  private hasValidInitialMeetingOptions() {
    const consultants = this.selectedConsultants();
    return (
      consultants.length > 0 &&
      consultants.every((consultant) => {
        const values = this.initialMeetingTimesFor(consultant.userId).filter(Boolean);
        const selectedDays = new Set(values.map((value) => this.initialMeetingDateKey(value)));
        return values.length === 3 && new Set(values).size === 3 && selectedDays.size === 3;
      })
    );
  }

  private initialMeetingDateKey(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const parts: Record<string, string> = {};
    for (const part of this.meetingDateFormatter.formatToParts(date)) {
      if (part.type !== 'literal') parts[part.type] = part.value;
    }
    return `${parts['year']}-${parts['month']}-${parts['day']}`;
  }

  private async loadInitialMeetingAvailability(consultantIds: number[]) {
    const uniqueConsultantIds = [...new Set(consultantIds)];
    if (!uniqueConsultantIds.length) return;

    const requestId = this.availabilityRequestSequence;
    this.initialMeetingAvailabilityLoading.set(true);
    const meetingWindow = this.initialMeetingWindow();

    try {
      const requests = uniqueConsultantIds.map(async (consultantId) => ({
        consultantId,
        slots: await this.consultantTimeSlotService.loadAvailableSlots(
          consultantId,
          meetingWindow.start,
          meetingWindow.end,
        ),
      }));
      const results = await Promise.allSettled(requests);
      if (requestId !== this.availabilityRequestSequence) return;

      const selectedConsultantIds = new Set(
        this.selectedConsultants().map((consultant) => consultant.userId),
      );
      const availability = Object.fromEntries(
        results.flatMap((result) =>
          result.status === 'fulfilled' && selectedConsultantIds.has(result.value.consultantId)
            ? [[result.value.consultantId, result.value.slots] as const]
            : [],
        ),
      );
      this.initialMeetingAvailability.update((current) => ({ ...current, ...availability }));
    } finally {
      if (requestId === this.availabilityRequestSequence) {
        this.initialMeetingAvailabilityLoading.set(false);
      }
    }
  }

  private initialMeetingWindow() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(start.getDate() + 1);

    const monday = new Date(today);
    const daysSinceMonday = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - daysSinceMonday);

    const end = new Date(monday);
    end.setDate(end.getDate() + 13);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  async createService() {
    if (!this.canSendService() || this.creating()) {
      this.toastService.warning('Selecciona al menos un consultor para enviar la solicitud');
      return;
    }

    this.creating.set(true);
    try {
      const created = await this.serviceRequestService.create(this.buildCreateFormData());
      this.toastService.success(
        `Solicitud enviada a ${created.length} ${created.length === 1 ? 'consultor' : 'consultores'}`,
      );
      this.showCreate.set(false);
      this.resetCreateFlow();
      this.activeTab.set('requests');
      this.statusFilter.set('');
      this.page.set(1);
      await this.loadServices();
      if (created[0]) await this.navigateToDetail(created[0]);
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.creating.set(false);
    }
  }

  async navigateToDetail(service: ServiceRequestResultDto) {
    await this.router.navigate([buildPath(PATH.admin.pyme.services), service.id]);
  }

  formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private addConsultant(consultant: ConsultantSelection) {
    if (this.isConsultantSelected(consultant.userId)) return;
    if (this.selectedConsultants().length >= 3) {
      this.toastService.warning('Puedes enviar la solicitud a un máximo de 3 consultores');
      return;
    }
    this.selectedConsultants.update((current) => [...current, consultant]);
    this.initialMeetingOptions.update((current) => ({
      ...current,
      [consultant.userId]: current[consultant.userId] ?? ['', '', ''],
    }));
    void this.loadInitialMeetingAvailability([consultant.userId]);
  }

  private matchToSelection(match: ServiceConsultantMatchDto): ConsultantSelection {
    return {
      userId: match.consultantId,
      fullName: match.fullName,
      headline: match.headline,
      photoUrl: match.photoUrl,
      diagnosticAreas: match.diagnosticAreas,
      specialties: match.specialties,
      yearsExperience: match.yearsExperience,
      rating: match.rating,
      reason: match.reason,
    };
  }

  private hasValidDraft() {
    const minimumBudget = Number(this.budgetMin());
    const maximumBudget = Number(this.budgetMax());
    const validBudget =
      minimumBudget > 0 &&
      (this.budgetType() === 'fixed' ||
        (this.budgetType() === 'range' && maximumBudget >= minimumBudget));
    const validReferences = this.cleanStringList(this.referenceUrls()).every((url) =>
      this.isValidHttpUrl(url),
    );
    const cleanedDeliverables = this.cleanStringList(this.deliverables());
    const validMilestones = this.milestones().every(
      (milestone) =>
        milestone.title.trim().length >= 3 &&
        milestone.dueDate >= this.minimumDeadline &&
        Boolean(this.deadline()) &&
        milestone.dueDate <= this.deadline(),
    );

    return (
      this.title().trim().length >= 3 &&
      Boolean(this.category()) &&
      Boolean(this.subcategory()) &&
      this.description().trim().length >= 10 &&
      this.expectedOutcome().trim().length >= 10 &&
      this.requirements().trim().length >= 5 &&
      cleanedDeliverables.length > 0 &&
      cleanedDeliverables.every((item) => item.length >= 3) &&
      validBudget &&
      this.deadline() >= this.minimumDeadline &&
      this.estimatedDuration().trim().length >= 2 &&
      this.workMethod().trim().length >= 5 &&
      validReferences &&
      validMilestones
    );
  }

  private currentDraft(): ServiceRequestDraftDto {
    return {
      title: this.title().trim(),
      category: this.category(),
      subcategory: this.subcategory().trim(),
      description: this.description().trim(),
      expectedOutcome: this.expectedOutcome().trim(),
      requirements: this.requirements().trim(),
      deliverables: this.cleanStringList(this.deliverables()),
      exclusions: this.exclusions().trim(),
      referenceUrls: this.cleanStringList(this.referenceUrls()),
      budgetType: this.budgetType(),
      budgetMin: this.budgetMin().trim(),
      budgetMax: this.budgetMax().trim(),
      deadline: this.deadline(),
      estimatedDuration: this.estimatedDuration().trim(),
      workModality: this.workModality(),
      workMethod: this.workMethod().trim(),
      milestones: this.normalizedDraftMilestones(),
      details: this.details().trim(),
    };
  }

  private applyDraft(draft: ServiceRequestDraftDto) {
    this.title.set(draft.title);
    this.category.set(draft.category);
    this.subcategory.set(draft.subcategory);
    this.description.set(draft.description);
    this.expectedOutcome.set(draft.expectedOutcome);
    this.requirements.set(draft.requirements);
    this.deliverables.set(draft.deliverables.length ? draft.deliverables : ['']);
    this.exclusions.set(draft.exclusions);
    this.referenceUrls.set(draft.referenceUrls.length ? draft.referenceUrls : ['']);
    this.budgetType.set(draft.budgetType);
    this.budgetMin.set(draft.budgetMin);
    this.budgetMax.set(draft.budgetMax);
    this.deadline.set(draft.deadline);
    this.estimatedDuration.set(draft.estimatedDuration);
    this.workModality.set('remote');
    this.workMethod.set(draft.workMethod);
    this.milestones.set(draft.milestones);
    this.details.set(draft.details);
  }

  private resetCreateFlow() {
    this.aiRequestSequence += 1;
    this.wizardStep.set(1);
    this.chatMessages.set([{ role: 'assistant', content: INITIAL_ASSISTANT_MESSAGE }]);
    this.chatInput.set('');
    this.chatLoading.set(false);
    this.chatComplete.set(false);
    this.missingInformation.set([]);
    this.title.set('');
    this.category.set('');
    this.subcategory.set('');
    this.description.set('');
    this.expectedOutcome.set('');
    this.requirements.set('');
    this.deliverables.set(['']);
    this.exclusions.set('');
    this.referenceUrls.set(['']);
    this.referenceFiles.set([]);
    this.budgetType.set('');
    this.budgetMin.set('');
    this.budgetMax.set('');
    this.deadline.set('');
    this.estimatedDuration.set('');
    this.workModality.set('remote');
    this.workMethod.set('');
    this.milestones.set([]);
    this.details.set('');
    this.paymentPlanRequestSequence += 1;
    this.paymentPlanDraftSnapshot = '';
    this.paymentPlan.set(null);
    this.paymentPlanLoading.set(false);
    this.matchingConsultants.set(false);
    this.aiMatches.set([]);
    this.selectedConsultants.set([]);
    this.initialMeetingOptions.set({});
    this.initialMeetingAvailability.set({});
    this.availabilityRequestSequence += 1;
    this.initialMeetingAvailabilityLoading.set(false);
  }

  private buildCreateFormData() {
    const formData = new FormData();
    formData.append(
      'consultantIds',
      JSON.stringify(this.selectedConsultants().map((consultant) => consultant.userId)),
    );
    const initialMeetingOptions: ServiceRequestInitialMeetingOptionDto[] =
      this.selectedConsultants().map((consultant) => ({
        consultantId: consultant.userId,
        proposedStartTimes: this.initialMeetingTimesFor(consultant.userId).map((value) =>
          new Date(value).toISOString(),
        ),
      }));
    formData.append('initialMeetingOptions', JSON.stringify(initialMeetingOptions));
    formData.append('title', this.title().trim());
    formData.append('category', this.category());
    formData.append('subcategory', this.subcategory().trim());
    formData.append('description', this.description().trim());
    formData.append('expectedOutcome', this.expectedOutcome().trim());
    formData.append('requirements', this.requirements().trim());
    formData.append('deliverables', JSON.stringify(this.cleanStringList(this.deliverables())));
    formData.append('exclusions', this.exclusions().trim());
    formData.append('referenceUrls', JSON.stringify(this.cleanStringList(this.referenceUrls())));
    formData.append('budgetType', this.budgetType());
    formData.append('budgetMin', this.budgetMin().trim());
    if (this.budgetType() === 'range') formData.append('budgetMax', this.budgetMax().trim());
    formData.append('deadline', this.deadline());
    formData.append('estimatedDuration', this.estimatedDuration().trim());
    formData.append('workModality', this.workModality());
    formData.append('workMethod', this.workMethod().trim());
    formData.append('milestones', JSON.stringify(this.normalizedDraftMilestones()));
    formData.append('paymentPlan', JSON.stringify(this.paymentPlan()));
    formData.append('details', this.details().trim());
    this.referenceFiles().forEach((file) => formData.append('files', file, file.name));
    return formData;
  }

  private cleanStringList(values: string[]) {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  }

  private normalizedDraftMilestones(): ServiceRequestMilestoneDraftDto[] {
    const milestones = this.milestones();
    if (milestones.length < 2) {
      return milestones
        .map((item) => ({ title: item.title.trim(), dueDate: item.dueDate }))
        .filter((item) => item.title || item.dueDate);
    }

    const kickoffDueDate = milestones[0]?.dueDate || this.minimumDeadline;
    const intermediateMilestones = milestones
      .slice(1, -1)
      .map((item) => ({ title: item.title.trim(), dueDate: item.dueDate }))
      .filter((item) => item.title || item.dueDate)
      .sort((left, right) => left.dueDate.localeCompare(right.dueDate));

    return [
      { title: KICKOFF_MILESTONE_TITLE, dueDate: kickoffDueDate },
      ...intermediateMilestones,
      { title: COMPLETION_MILESTONE_TITLE, dueDate: this.deadline() },
    ];
  }

  private paymentMilestoneIndexes(installmentCount: number, milestoneCount: number): number[] {
    if (installmentCount === 1) return [0];

    const finalMilestoneIndex = milestoneCount - 1;
    return Array.from({ length: installmentCount }, (_, installmentIndex) =>
      installmentIndex === installmentCount - 1
        ? finalMilestoneIndex
        : Math.floor((installmentIndex * finalMilestoneIndex) / (installmentCount - 1)),
    );
  }

  private isValidHttpUrl(value: string) {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private toLocalDateInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toLocalDateTimeInput(date: Date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return local.toISOString().slice(0, 16);
  }
}
