import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  SERVICE_REQUEST_CATEGORY_OPTIONS,
  ServiceRequestCategory,
} from '@enum/service-request-category.enum';
import {
  ConsultantInputSearch,
  ConsultantInputSearchFilters,
} from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import {
  TimeSlotPicker,
  TimeSlotPickerOption,
} from '@module/admin/components/time-slot-picker/time-slot-picker';
import { AiService } from '@service/admin/ai.service';
import { ConsultantAvailabilityService } from '@service/admin/consultant-availability.service';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import {
  ApiResponse,
  MercadoPagoCheckoutDto,
  PaginationMetaDto,
  ServiceConsultantMatchDto,
  ServiceRequestChatMessageDto,
  ServiceRequestDraftDto,
  ServiceRequestMilestoneDraftDto,
  ServiceRequestInitialMeetingOptionDto,
  ServiceRequestResultDto,
} from 'api/backend.api';

type ServiceStatus = ServiceRequestResultDto['status'];
type ServiceStage = 'requests' | 'proposals';
type ConsultantOption = ApiResponse<'consultant', 'findAll'>['data'][number];
type AvailabilityMonth = ApiResponse<
  'consultantAvailability',
  'consultant-availabilityVisibleMonth'
>['data'][number];
type WizardStep = 1 | 2 | 3;
type InitialMeetingSlot = TimeSlotPickerOption;

type ConsultantSelection = {
  userId: number;
  fullName: string;
  headline: string | null;
  photoUrl: string | null;
  diagnosticAreas: string[];
  specialties: string[];
  yearsExperience: number;
  rating: string;
  reason: string | null;
};

const INITIAL_ASSISTANT_MESSAGE =
  '¡Hola! Cuéntame qué problema necesita resolver tu empresa y qué resultado esperas. Luego precisaré contigo qué esperas recibir al finalizar, presupuesto, duración, fecha límite y forma de trabajo.';

@Component({
  selector: 'app-pyme-services',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ConsultantInputSearch,
    ModalForm,
    PaginationComponent,
    TimeSlotPicker,
  ],
  templateUrl: './services.html',
})
export class PymeServices implements OnDestroy {
  private readonly serviceChatInput =
    viewChild<ElementRef<HTMLTextAreaElement>>('serviceChatInput');
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly aiService = inject(AiService);
  private readonly consultantAvailabilityService = inject(ConsultantAvailabilityService);
  private readonly mercadoPagoService = inject(MercadoPagoService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly meetingDateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  private requestSequence = 0;
  private detailSequence = 0;
  private aiRequestSequence = 0;
  private availabilityRequestSequence = 0;
  private paymentPolling: ReturnType<typeof setInterval> | null = null;
  private pollingStartedAt = 0;
  private paymentPollingInFlight = false;

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
      this.selectedConsultants().length >= 1 &&
      this.hasValidInitialMeetingOptions(),
  );

  readonly selectedService = signal<ServiceRequestResultDto | null>(null);
  readonly showDetail = signal(false);
  readonly detailLoading = signal(false);
  readonly declineMessage = signal('');
  readonly declining = signal(false);
  readonly preparingPayment = signal(false);
  readonly paymentModalOpen = signal(false);
  readonly paymentCheckout = signal<MercadoPagoCheckoutDto | null>(null);
  readonly milestoneMeetingTimes = signal<Record<number, string[]>>({});
  readonly schedulingMilestone = signal<number | null>(null);
  readonly paymentFrameUrl = computed<SafeResourceUrl | null>(() => {
    const checkout = this.paymentCheckout();
    const url = checkout?.initPoint ?? checkout?.sandboxInitPoint ?? null;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  constructor() {
    void this.loadServices();
  }

  ngOnDestroy(): void {
    this.stopPaymentPolling();
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
    if (this.creating() || this.chatLoading() || this.matchingConsultants()) return;
    this.showCreate.set(false);
    this.resetCreateFlow();
  }

  handleChatKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    void this.sendChatMessage();
  }

  updateChatInput(value: string) {
    this.chatInput.set(value);
    queueMicrotask(() => this.resizeChatInput());
  }

  async sendChatMessage() {
    const content = this.chatInput().trim();
    if (content.length < 2 || this.chatLoading() || this.chatComplete()) return;

    const messages = [...this.chatMessages(), { role: 'user' as const, content }];
    const requestId = ++this.aiRequestSequence;
    this.chatMessages.set(messages);
    this.chatInput.set('');
    queueMicrotask(() => this.resizeChatInput());
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

  private resizeChatInput() {
    const textarea = this.serviceChatInput()?.nativeElement;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
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
    this.milestones.update((items) => [...items, { title: '', dueDate: '' }]);
  }

  updateMilestone(index: number, field: keyof ServiceRequestMilestoneDraftDto, value: string) {
    this.milestones.update((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    );
  }

  removeMilestone(index: number) {
    this.milestones.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  goToConsultants() {
    if (!this.hasValidDraft()) {
      this.toastService.warning(
        'Completa todos los datos obligatorios antes de elegir consultores',
      );
      return;
    }
    this.wizardStep.set(3);
  }

  previousStep() {
    if (this.wizardStep() === 3) this.wizardStep.set(2);
    else if (this.wizardStep() === 2) this.wizardStep.set(1);
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

  initialMeetingDisabledValuesFor(consultantId: number, optionIndex: number) {
    const selectedDays = new Set(
      this.initialMeetingTimesFor(consultantId)
        .filter(
          (selectedValue, selectedIndex) => selectedIndex !== optionIndex && Boolean(selectedValue),
        )
        .map((selectedValue) => this.initialMeetingDateKey(selectedValue)),
    );
    return this.initialMeetingAvailabilityFor(consultantId)
      .filter((option) => selectedDays.has(this.initialMeetingDateKey(option.value)))
      .map((option) => option.value);
  }

  hasEnoughInitialMeetingDays(consultantId: number) {
    return (
      new Set(
        this.initialMeetingAvailabilityFor(consultantId).map((option) =>
          this.initialMeetingDateKey(option.value),
        ),
      ).size >= 3
    );
  }

  readInputValue(event: Event) {
    return (event.target as HTMLInputElement).value;
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
    const months = this.monthsWithinWindow(meetingWindow.start, meetingWindow.end);

    try {
      const requests = uniqueConsultantIds.flatMap((consultantId) =>
        months.map(async (month) => ({
          consultantId,
          response: await this.consultantAvailabilityService.visibleMonth({
            consultantId,
            year: month.getFullYear(),
            month: month.getMonth() + 1,
          }),
        })),
      );
      const results = await Promise.allSettled(requests);
      if (requestId !== this.availabilityRequestSequence) return;

      const monthsByConsultant = new Map<number, AvailabilityMonth[]>();
      results.forEach((result) => {
        if (result.status !== 'fulfilled') return;
        const current = monthsByConsultant.get(result.value.consultantId) ?? [];
        monthsByConsultant.set(result.value.consultantId, [
          ...current,
          ...result.value.response.data,
        ]);
      });

      const selectedConsultantIds = new Set(
        this.selectedConsultants().map((consultant) => consultant.userId),
      );
      const availability = Object.fromEntries(
        uniqueConsultantIds
          .filter((consultantId) => selectedConsultantIds.has(consultantId))
          .map((consultantId) => [
            consultantId,
            this.buildInitialMeetingSlots(
              monthsByConsultant.get(consultantId) ?? [],
              meetingWindow.start,
              meetingWindow.end,
            ),
          ]),
      );
      this.initialMeetingAvailability.update((current) => ({ ...current, ...availability }));
    } finally {
      if (requestId === this.availabilityRequestSequence) {
        this.initialMeetingAvailabilityLoading.set(false);
      }
    }
  }

  private buildInitialMeetingSlots(
    months: AvailabilityMonth[],
    windowStart: Date,
    windowEnd: Date,
  ): InitialMeetingSlot[] {
    const slots = new Map<string, InitialMeetingSlot>();

    months.forEach((availability) => {
      const [year, month] = availability.month.split('-').map(Number);
      Object.entries(availability.availableSchedule ?? {}).forEach(([day, times]) => {
        const availableTimes = new Set(times);
        times.forEach((time) => {
          const startTime = this.fromCalendarParts(year, month - 1, Number(day), time);
          const nextHalfHour = this.addMinutes(startTime, 30);
          const nextHalfHourValue = this.toTimeValue(nextHalfHour);
          const endTime = this.addMinutes(startTime, 60);
          if (
            startTime < windowStart ||
            endTime > windowEnd ||
            !availableTimes.has(nextHalfHourValue) ||
            !times.includes(nextHalfHourValue)
          ) {
            return;
          }

          const value = startTime.toISOString();
          slots.set(value, {
            value,
            label: `${this.formatMeetingDate(startTime)} · ${this.formatMeetingTime(startTime)}–${this.formatMeetingTime(endTime)}`,
            dateLabel: this.formatMeetingDate(startTime),
            timeLabel: `${this.formatMeetingTime(startTime)} – ${this.formatMeetingTime(endTime)}`,
          });
        });
      });
    });

    return [...slots.values()].sort((left, right) => left.value.localeCompare(right.value));
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

  private monthsWithinWindow(start: Date, end: Date) {
    const months: Date[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= lastMonth) {
      months.push(new Date(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return months;
  }

  private fromCalendarParts(year: number, monthIndex: number, day: number, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(year, monthIndex, day, hours, minutes);
  }

  private toTimeValue(date: Date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  private formatMeetingDate(date: Date) {
    return date.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' });
  }

  private formatMeetingTime(date: Date) {
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  private addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60 * 1000);
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
      if (created[0]) await this.openDetail(created[0]);
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.creating.set(false);
    }
  }

  async openDetail(service: ServiceRequestResultDto) {
    const requestId = ++this.detailSequence;
    this.selectedService.set(service);
    this.declineMessage.set('');
    this.showDetail.set(true);
    this.detailLoading.set(true);
    try {
      const detail = await this.serviceRequestService.findOne(service.id);
      if (requestId === this.detailSequence) this.selectedService.set(detail);
    } catch (error) {
      if (requestId === this.detailSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.detailSequence) this.detailLoading.set(false);
    }
  }

  closeDetail() {
    if (this.declining() || this.preparingPayment() || this.schedulingMilestone() !== null) return;
    this.showDetail.set(false);
    this.selectedService.set(null);
    this.detailSequence += 1;
  }

  async declineProposal() {
    const service = this.selectedService();
    if (!service || service.status !== 'proposal_sent') return;

    this.declining.set(true);
    try {
      const updated = await this.serviceRequestService.decline(service.id, {
        message: this.declineMessage().trim() || undefined,
      });
      this.selectedService.set(updated);
      this.toastService.success('Cotización marcada como no aceptada');
      await this.loadServices();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.declining.set(false);
    }
  }

  async payService() {
    const service = this.selectedService();
    if (!service || !['proposal_sent', 'payment_pending'].includes(service.status)) return;

    this.preparingPayment.set(true);
    try {
      const checkout = await this.mercadoPagoService.prepareServicePayment(service.id);
      if (!checkout.initPoint && !checkout.sandboxInitPoint) {
        throw new Error('La pasarela de pago no devolvió un enlace válido');
      }
      this.paymentCheckout.set(checkout);
      this.paymentModalOpen.set(true);
      this.startPaymentPolling();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.preparingPayment.set(false);
    }
  }

  milestoneMeetingTimesFor(index: number) {
    return this.milestoneMeetingTimes()[index] ?? ['', '', ''];
  }

  updateMilestoneMeetingTime(index: number, optionIndex: number, value: string) {
    this.milestoneMeetingTimes.update((current) => {
      const values = [...(current[index] ?? ['', '', ''])];
      values[optionIndex] = value;
      return { ...current, [index]: values };
    });
  }

  async scheduleMilestoneMeeting(index: number) {
    const service = this.selectedService();
    const values = this.milestoneMeetingTimesFor(index).filter(Boolean);
    if (!service || service.status !== 'paid') return;
    if (values.length !== 3 || new Set(values).size !== 3) {
      this.toastService.warning('Selecciona tres horarios diferentes para el hito');
      return;
    }

    this.schedulingMilestone.set(index);
    try {
      const updated = await this.serviceRequestService.scheduleMilestoneMeeting(service.id, {
        milestoneIndex: index,
        proposedStartTimes: values.map((value) => new Date(value).toISOString()),
      });
      this.selectedService.set(updated);
      this.toastService.success('Reunión del hito propuesta al consultor');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.schedulingMilestone.set(null);
    }
  }

  meetingStatusLabel(status: ServiceRequestResultDto['meetings'][number]['status']) {
    const labels: Record<ServiceRequestResultDto['meetings'][number]['status'], string> = {
      solicitada: 'Solicitada',
      pago_pendiente: 'Pendiente de pago',
      por_confirmar: 'Esperando horario del consultor',
      confirmada: 'Confirmada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  meetingForMilestone(service: ServiceRequestResultDto, index: number) {
    return service.meetings.find((meeting) => meeting.serviceMilestoneIndex === index) ?? null;
  }

  closePaymentModal() {
    this.stopPaymentPolling();
    this.paymentModalOpen.set(false);
    this.paymentCheckout.set(null);
    void this.refreshSelectedService();
  }

  statusLabel(status: ServiceStatus) {
    const labels: Record<ServiceStatus, string> = {
      requested: 'Esperando respuesta',
      proposal_sent: 'Precio recibido',
      consultant_declined: 'No aceptada por consultor',
      payment_pending: 'Pago pendiente',
      paid: 'Aprobada y pagada',
      pyme_declined: 'No aceptada',
      cancelled: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: ServiceStatus) {
    const classes: Record<ServiceStatus, string> = {
      requested: 'bg-info/10 text-info',
      proposal_sent: 'bg-secondary/10 text-secondary',
      consultant_declined: 'bg-danger/10 text-danger',
      payment_pending: 'bg-warning/15 text-warning',
      paid: 'bg-success/10 text-success',
      pyme_declined: 'bg-danger/10 text-danger',
      cancelled: 'bg-text/10 text-muted',
    };
    return classes[status];
  }

  formatMoney(value: string | null | undefined, currency = 'PEN') {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(
      Number(value ?? 0),
    );
  }

  formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  serviceBudgetLabel(service: ServiceRequestResultDto) {
    if (!service.budgetType || !service.budgetMin) return 'No registrado';
    if (service.budgetType === 'fixed')
      return this.formatMoney(service.budgetMin, service.currency);
    if (!service.budgetMax) return `Desde ${this.formatMoney(service.budgetMin, service.currency)}`;
    return `${this.formatMoney(service.budgetMin, service.currency)} – ${this.formatMoney(service.budgetMax, service.currency)}`;
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
      milestones: this.milestones()
        .map((item) => ({ title: item.title.trim(), dueDate: item.dueDate }))
        .filter((item) => item.title || item.dueDate),
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
    formData.append(
      'milestones',
      JSON.stringify(
        this.milestones()
          .map((item) => ({ title: item.title.trim(), dueDate: item.dueDate }))
          .filter((item) => item.title && item.dueDate),
      ),
    );
    formData.append('details', this.details().trim());
    this.referenceFiles().forEach((file) => formData.append('files', file, file.name));
    return formData;
  }

  private cleanStringList(values: string[]) {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
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

  private startPaymentPolling() {
    this.stopPaymentPolling();
    this.pollingStartedAt = Date.now();
    void this.pollPaymentStatus();
    this.paymentPolling = setInterval(() => void this.pollPaymentStatus(), 3000);
  }

  private stopPaymentPolling() {
    if (!this.paymentPolling) return;
    clearInterval(this.paymentPolling);
    this.paymentPolling = null;
  }

  private async pollPaymentStatus() {
    const service = this.selectedService();
    if (!service || !this.paymentModalOpen() || this.paymentPollingInFlight) return;
    if (Date.now() - this.pollingStartedAt > 600000) {
      this.stopPaymentPolling();
      this.toastService.warning(
        'El pago sigue pendiente. Puedes cerrar esta ventana y reintentarlo luego.',
      );
      return;
    }

    this.paymentPollingInFlight = true;
    try {
      const checkout = await this.mercadoPagoService.syncServicePayment(service.id);
      if (!this.paymentModalOpen() || this.selectedService()?.id !== service.id) return;
      this.paymentCheckout.set(checkout);
      const updated = await this.serviceRequestService.findOne(service.id);
      if (!this.paymentModalOpen() || this.selectedService()?.id !== service.id) return;
      this.selectedService.set(updated);
      if (updated.status !== 'paid') return;
      this.stopPaymentPolling();
      this.paymentModalOpen.set(false);
      this.paymentCheckout.set(null);
      this.toastService.success('Pago confirmado. El servicio fue aprobado');
      await this.loadServices();
    } catch {
      // El siguiente ciclo vuelve a consultar para tolerar fallas temporales.
    } finally {
      this.paymentPollingInFlight = false;
    }
  }

  private async refreshSelectedService() {
    const service = this.selectedService();
    if (!service) return;
    try {
      const updated = await this.serviceRequestService.findOne(service.id);
      this.selectedService.set(updated);
      await this.loadServices();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    }
  }
}
