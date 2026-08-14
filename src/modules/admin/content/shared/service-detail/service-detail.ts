import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import {
  TimeSlotPicker,
  TimeSlotPickerMonth,
  TimeSlotPickerOption,
} from '@module/admin/components/time-slot-picker/time-slot-picker';
import { buildPath, PATH } from '@route/path.route';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { ConsultantTimeSlotService } from '@service/admin/consultant-time-slot.service';
import { PromotionCodeService } from '@service/admin/promotion-code.service';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { AlertService } from '@service/alert.service';
import { ToastService } from '@service/toast.service';
import { MercadoPagoCheckoutDto, ServiceRequestResultDto } from 'api/backend.api';
import { ConsultantQuoteForm } from './components/consultant-quote-form/consultant-quote-form';
import { ServicePaymentPlanSummary } from './layout/payment-plan-summary/payment-plan-summary';

type ServiceStatus = ServiceRequestResultDto['status'];
type ServiceMeeting = ServiceRequestResultDto['meetings'][number];
type ServiceEvidence = ServiceRequestResultDto['evidenceAttachments'][number];
type ServicePaymentScheduleItem = ServiceRequestResultDto['paymentSchedule'][number];

type CalendarDay = {
  key: string;
  day: number;
  inCurrentMonth: boolean;
  isWithinServiceRange: boolean;
  isPaymentDate: boolean;
  isDeadline: boolean;
  isToday: boolean;
  milestoneLabels: string[];
  meetings: ServiceMeeting[];
};

type CalendarRange = {
  startKey: string;
  endKey: string;
  startMonth: Date;
  endMonth: Date;
};

type MilestoneInsertionPosition = {
  insertAtIndex: number;
  previousTitle: string;
  nextTitle: string;
  minimumDate: string;
  maximumDate: string;
  available: boolean;
};

@Component({
  selector: 'app-service-detail',
  imports: [
    CommonModule,
    ConsultantQuoteForm,
    DatePipe,
    FormsModule,
    ModalForm,
    RouterLink,
    ServicePaymentPlanSummary,
    TimeSlotPicker,
  ],
  templateUrl: './service-detail.html',
})
export class ServiceDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly consultantTimeSlotService = inject(ConsultantTimeSlotService);
  private readonly mercadoPagoService = inject(MercadoPagoService);
  private readonly promotionCodeService = inject(PromotionCodeService);
  private readonly hubsme = inject(HubsmeService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly evidenceFileInput = viewChild<ElementRef<HTMLInputElement>>('evidenceFileInput');
  private paymentPolling: ReturnType<typeof setInterval> | null = null;
  private pollingStartedAt = 0;
  private paymentPollingInFlight = false;
  private availabilityRequestSequence = 0;
  private readonly availabilityLoadRequests = new Map<string, Promise<void>>();

  readonly service = signal<ServiceRequestResultDto | null>(null);
  readonly loading = signal(false);
  readonly declineMessage = signal('');
  readonly declining = signal(false);
  readonly preparingPayment = signal(false);
  readonly serviceCouponCode = signal('');
  readonly redeemingServiceCoupon = signal(false);
  readonly paymentModalOpen = signal(false);
  readonly paymentCheckout = signal<MercadoPagoCheckoutDto | null>(null);
  readonly milestoneMeetingTimes = signal<Record<number, string[]>>({});
  readonly schedulingMilestone = signal<number | null>(null);
  readonly serviceMeetingAvailabilityByMonth = signal<Record<string, TimeSlotPickerOption[]>>({});
  readonly availabilityLoadingMonths = signal<string[]>([]);
  readonly milestoneAvailabilityMonth = signal<Record<number, string>>({});
  readonly extraMilestoneAvailabilityMonth = signal('');
  readonly calendarCursor = signal(this.firstDayOfMonth(new Date()));
  readonly calendarWeekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly showExtraMilestoneForm = signal(false);
  readonly extraMilestoneTitle = signal('');
  readonly extraMilestoneDueDate = signal('');
  readonly extraMilestoneTimes = signal(['', '', '']);
  readonly extraMilestoneInsertAtIndex = signal<number | null>(null);
  readonly addingExtraMilestone = signal(false);
  readonly evidenceFiles = signal<File[]>([]);
  readonly evidenceNote = signal('');
  readonly evidenceMilestoneIndex = signal<number | null>(null);
  readonly showEvidenceUploader = signal(false);
  readonly uploadingEvidence = signal(false);
  readonly showMilestoneEditor = signal(false);
  readonly editingMilestoneIndex = signal<number | null>(null);
  readonly editingMilestoneTitle = signal('');
  readonly editingMilestoneDueDate = signal('');
  readonly savingMilestone = signal(false);
  readonly deletingMilestone = signal(false);
  readonly deletingEvidenceId = signal<string | null>(null);
  readonly completingService = signal(false);
  readonly minimumMilestoneDate = this.dateKeyInTimeZone(new Date());
  readonly isConsultant = computed(() => this.hubsme.currentUser().role === 'consultor');
  readonly showDeclineForm = signal(false);

  readonly milestoneInsertionPositions = computed<MilestoneInsertionPosition[]>(() => {
    const milestones = this.service()?.milestones ?? [];
    return milestones.slice(1).map((nextMilestone, offset) => {
      const previousMilestone = milestones[offset];
      const minimumDate =
        previousMilestone.dueDate > this.minimumMilestoneDate
          ? previousMilestone.dueDate
          : this.minimumMilestoneDate;
      return {
        insertAtIndex: offset + 1,
        previousTitle: previousMilestone.title,
        nextTitle: nextMilestone.title,
        minimumDate,
        maximumDate: nextMilestone.dueDate,
        available: minimumDate <= nextMilestone.dueDate,
      };
    });
  });
  readonly selectedMilestoneInsertion = computed(() =>
    this.milestoneInsertionPositions().find(
      (position) => position.insertAtIndex === this.extraMilestoneInsertAtIndex(),
    ),
  );
  readonly canSubmitExtraMilestone = computed(() => {
    const selectedTimes = this.extraMilestoneTimes().filter(Boolean);
    const selectedDays = new Set(
      selectedTimes.map((value) => this.dateKeyInTimeZone(new Date(value))),
    );
    return (
      Boolean(this.selectedMilestoneInsertion()) &&
      this.extraMilestoneTitle().trim().length >= 3 &&
      Boolean(this.extraMilestoneDueDate()) &&
      selectedTimes.length === 3 &&
      new Set(selectedTimes).size === 3 &&
      selectedDays.size === 3
    );
  });
  readonly canSubmitMilestoneEdit = computed(() => {
    const current = this.service();
    const index = this.editingMilestoneIndex();
    const milestone = index === null ? undefined : current?.milestones[index];
    if (!current || index === null || !milestone || !this.canEditMilestone(current, index)) {
      return false;
    }

    const dueDate = this.editingMilestoneDueDate();
    const previousMilestone = current.milestones[index - 1];
    const nextMilestone = current.milestones[index + 1];
    return (
      this.editingMilestoneTitle().trim().length >= 3 &&
      this.isDateOnly(dueDate) &&
      dueDate >= this.minimumMilestoneDate &&
      (!previousMilestone || dueDate >= previousMilestone.dueDate) &&
      (!nextMilestone || dueDate <= nextMilestone.dueDate) &&
      (!current.deadline || dueDate <= current.deadline)
    );
  });

  readonly calendarRange = computed<CalendarRange | null>(() => {
    const current = this.service();
    if (!current?.paidAt || !current.deadline) return null;

    const startKey = this.dateKeyInTimeZone(new Date(current.paidAt));
    const endKey = current.deadline;
    if (startKey > endKey) return null;

    return {
      startKey,
      endKey,
      startMonth: this.monthFromDateKey(startKey),
      endMonth: this.monthFromDateKey(endKey),
    };
  });
  readonly canGoToPreviousCalendarMonth = computed(() => {
    const range = this.calendarRange();
    return Boolean(range && this.calendarCursor().getTime() > range.startMonth.getTime());
  });
  readonly canGoToNextCalendarMonth = computed(() => {
    const range = this.calendarRange();
    return Boolean(range && this.calendarCursor().getTime() < range.endMonth.getTime());
  });
  readonly calendarRangeLabel = computed(() => {
    const range = this.calendarRange();
    if (!range) return 'Periodo disponible al confirmar el pago';
    return `${this.formatDateKey(range.startKey)} – ${this.formatDateKey(range.endKey)}`;
  });

  readonly calendarMonthLabel = computed(() =>
    new Intl.DateTimeFormat('es-PE', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(this.calendarCursor()),
  );
  readonly calendarDays = computed<CalendarDay[]>(() => {
    const current = this.calendarCursor();
    const range = this.calendarRange();
    const firstWeekday = (current.getUTCDay() + 6) % 7;
    const gridStart = new Date(current);
    gridStart.setUTCDate(gridStart.getUTCDate() - firstWeekday);
    const meetingMap = new Map<string, ServiceMeeting[]>();
    const milestoneMap = new Map<string, string[]>();

    const currentService = this.service();
    for (const meeting of currentService?.meetings ?? []) {
      if (!meeting.startTime) continue;
      const key = this.dateKeyInTimeZone(new Date(meeting.startTime));
      meetingMap.set(key, [...(meetingMap.get(key) ?? []), meeting]);
    }
    for (const [index, milestone] of (currentService?.milestones ?? []).entries()) {
      milestoneMap.set(milestone.dueDate, [
        ...(milestoneMap.get(milestone.dueDate) ?? []),
        `Hito ${index + 1}`,
      ]);
    }

    const todayKey = this.dateKeyInTimeZone(new Date());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setUTCDate(gridStart.getUTCDate() + index);
      const key = this.utcDateKey(date);
      const isWithinServiceRange = Boolean(range && key >= range.startKey && key <= range.endKey);
      return {
        key,
        day: date.getUTCDate(),
        inCurrentMonth: date.getUTCMonth() === current.getUTCMonth(),
        isWithinServiceRange,
        isPaymentDate: range?.startKey === key,
        isDeadline: range?.endKey === key,
        isToday: isWithinServiceRange && key === todayKey,
        milestoneLabels: milestoneMap.get(key) ?? [],
        meetings: isWithinServiceRange ? (meetingMap.get(key) ?? []) : [],
      };
    });
  });
  readonly paymentFrameUrl = computed<SafeResourceUrl | null>(() => {
    const checkout = this.paymentCheckout();
    const url = checkout?.initPoint ?? checkout?.sandboxInitPoint ?? null;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) {
      this.toastService.error('Servicio no encontrado');
      return;
    }

    void this.loadService(id);
  }

  ngOnDestroy(): void {
    this.stopPaymentPolling();
    this.availabilityRequestSequence += 1;
    this.availabilityLoadRequests.clear();
  }

  previousCalendarMonth(): void {
    if (!this.canGoToPreviousCalendarMonth()) return;
    const current = this.calendarCursor();
    this.calendarCursor.set(
      this.clampCalendarMonth(
        new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - 1, 1)),
      ),
    );
  }

  nextCalendarMonth(): void {
    if (!this.canGoToNextCalendarMonth()) return;
    const current = this.calendarCursor();
    this.calendarCursor.set(
      this.clampCalendarMonth(
        new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 1)),
      ),
    );
  }

  showCurrentCalendarMonth(): void {
    if (!this.calendarRange()) return;
    this.calendarCursor.set(this.clampCalendarMonth(this.firstDayOfMonth(new Date())));
  }

  meetingDetailPath(meetingId: number): string {
    const meetingsPath = this.isConsultant()
      ? PATH.admin.consultor.meetings
      : PATH.admin.pyme.meetings;
    return `/${buildPath(meetingsPath)}/${meetingId}`;
  }

  requestServiceCompletion(): void {
    const current = this.service();
    if (
      this.isConsultant() ||
      !current ||
      !this.canCompleteService(current) ||
      this.completingService()
    ) {
      return;
    }

    this.alertService.confirm(
      'Dar servicio como completado',
      '¿Confirmas que el servicio terminó? El seguimiento quedará en modo de consulta y ya no podrás agregar hitos, proponer reuniones ni adjuntar archivos.',
      () => void this.completeService(),
    );
  }

  canEditMilestone(current: ServiceRequestResultDto, index: number): boolean {
    return (
      !this.isConsultant() &&
      current.status === 'paid' &&
      index > 0 &&
      index < current.milestones.length - 1 &&
      Boolean(current.milestones[index]) &&
      !this.meetingForMilestone(current, index)
    );
  }

  canDeleteMilestone(current: ServiceRequestResultDto, index: number): boolean {
    return (
      this.canEditMilestone(current, index) &&
      index > 0 &&
      index < current.milestones.length - 1 &&
      !current.paymentPlan.installments.some((installment) => installment.milestoneIndex === index)
    );
  }

  canDeleteEvidence(current: ServiceRequestResultDto, attachment: ServiceEvidence): boolean {
    return (
      this.isConsultant() &&
      current.status === 'paid' &&
      (attachment.milestoneIndex === null ||
        attachment.milestoneIndex === undefined ||
        !this.meetingForMilestone(current, attachment.milestoneIndex))
    );
  }

  openMilestoneEditor(index: number): void {
    const current = this.service();
    const milestone = current?.milestones[index];
    if (!current || !milestone || !this.canEditMilestone(current, index)) return;
    this.editingMilestoneIndex.set(index);
    this.editingMilestoneTitle.set(milestone.title);
    this.editingMilestoneDueDate.set(milestone.dueDate);
    this.showMilestoneEditor.set(true);
  }

  closeMilestoneEditor(): void {
    this.editingMilestoneIndex.set(null);
    this.editingMilestoneTitle.set('');
    this.editingMilestoneDueDate.set('');
    this.showMilestoneEditor.set(false);
  }

  async saveMilestone(): Promise<void> {
    const current = this.service();
    const index = this.editingMilestoneIndex();
    if (!current || index === null || !this.canSubmitMilestoneEdit()) return;

    this.savingMilestone.set(true);
    try {
      const updated = await this.serviceRequestService.updateMilestone(current.id, index, {
        title: this.editingMilestoneTitle().trim(),
        dueDate: this.editingMilestoneDueDate(),
      });
      this.service.set(updated);
      this.initializeServiceAvailability(updated);
      this.closeMilestoneEditor();
      this.toastService.success('Hito actualizado correctamente');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.savingMilestone.set(false);
    }
  }

  requestDeleteMilestone(): void {
    const current = this.service();
    const index = this.editingMilestoneIndex();
    if (!current || index === null || !this.canDeleteMilestone(current, index)) return;

    this.alertService.delete(
      'Eliminar hito',
      'El hito y su posición en el plan se eliminarán. Esta acción no se puede deshacer.',
      () => void this.deleteMilestone(),
    );
  }

  private async deleteMilestone(): Promise<void> {
    const current = this.service();
    const index = this.editingMilestoneIndex();
    if (!current || index === null || !this.canDeleteMilestone(current, index)) return;

    this.deletingMilestone.set(true);
    try {
      const updated = await this.serviceRequestService.removeMilestone(current.id, index);
      this.service.set(updated);
      this.initializeServiceAvailability(updated);
      this.closeMilestoneEditor();
      this.toastService.success('Hito eliminado correctamente');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.deletingMilestone.set(false);
    }
  }

  requestDeleteEvidence(attachment: ServiceEvidence): void {
    const current = this.service();
    if (!current || !this.canDeleteEvidence(current, attachment)) return;

    this.alertService.delete(
      'Eliminar evidencia',
      `¿Deseas eliminar “${attachment.originalName}”? El archivo dejará de estar disponible en el seguimiento.`,
      () => void this.deleteEvidence(attachment.id),
    );
  }

  private async deleteEvidence(attachmentId: string): Promise<void> {
    const current = this.service();
    if (!current || this.deletingEvidenceId()) return;

    this.deletingEvidenceId.set(attachmentId);
    try {
      this.service.set(await this.serviceRequestService.deleteEvidence(current.id, attachmentId));
      this.toastService.success('Evidencia eliminada correctamente');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.deletingEvidenceId.set(null);
    }
  }

  calendarMeetingTime(value: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Lima',
    }).format(new Date(value));
  }

  meetingStatusClass(status: ServiceMeeting['status']): string {
    const classes: Record<ServiceMeeting['status'], string> = {
      solicitada: 'bg-info/10 text-info',
      pago_pendiente: 'bg-warning/10 text-warning',
      por_confirmar: 'bg-warning/10 text-warning',
      confirmada: 'bg-success/10 text-success',
      finalizada: 'bg-secondary/10 text-secondary',
      cancelada: 'bg-danger/10 text-danger',
    };
    return classes[status];
  }

  openExtraMilestoneModal(): void {
    const positions = this.milestoneInsertionPositions().filter((position) => position.available);
    if (!positions.length) {
      this.toastService.warning(
        'No hay un espacio vigente entre el hito inicial y el final para agregar otra etapa',
      );
      return;
    }
    this.extraMilestoneInsertAtIndex.set(positions[positions.length - 1].insertAtIndex);
    this.showExtraMilestoneForm.set(true);
  }

  closeExtraMilestoneModal(): void {
    this.resetExtraMilestoneForm();
  }

  selectMilestoneInsertion(position: MilestoneInsertionPosition): void {
    if (!position.available) return;
    this.extraMilestoneInsertAtIndex.set(position.insertAtIndex);
    const currentDate = this.extraMilestoneDueDate();
    if (currentDate < position.minimumDate || currentDate > position.maximumDate) {
      this.extraMilestoneDueDate.set('');
      this.extraMilestoneTimes.set(['', '', '']);
    }
  }

  updateExtraMilestoneDueDate(value: string): void {
    this.extraMilestoneDueDate.set(value);
    const months = this.availabilityMonthsForDueDate(value);
    const targetMonth = this.monthKeyForDate(value);
    const activeMonth = months.some((month) => month.value === targetMonth)
      ? targetMonth
      : (months[months.length - 1]?.value ?? '');
    this.extraMilestoneAvailabilityMonth.set(activeMonth);
    if (activeMonth) void this.loadServiceAvailabilityMonth(activeMonth);

    this.extraMilestoneTimes.update((current) =>
      current.map((selectedValue) =>
        selectedValue && !this.isSlotWithinDueDate(selectedValue, value) ? '' : selectedValue,
      ),
    );
  }

  updateExtraMilestoneTime(index: number, value: string): void {
    this.extraMilestoneTimes.update((current) => {
      const values = [...current];
      values[index] = value;
      return values;
    });
  }

  availabilityMonthsForDueDate(dueDate: string | null | undefined): TimeSlotPickerMonth[] {
    if (!dueDate) return [];
    const startKey = this.availabilityStartDateKey();
    if (startKey > dueDate) return [];

    const months: TimeSlotPickerMonth[] = [];
    const cursor = this.monthFromDateKey(startKey);
    const lastMonth = this.monthFromDateKey(dueDate);
    while (cursor <= lastMonth) {
      const value = this.monthKeyFromDate(cursor);
      months.push({ value, label: this.formatMonthKey(value) });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return months;
  }

  availabilityMonthForMilestone(index: number, dueDate: string): string {
    const months = this.availabilityMonthsForDueDate(dueDate);
    const selectedMonth = this.milestoneAvailabilityMonth()[index];
    if (selectedMonth && months.some((month) => month.value === selectedMonth)) {
      return selectedMonth;
    }

    const targetMonth = this.monthKeyForDate(dueDate);
    if (months.some((month) => month.value === targetMonth)) return targetMonth;
    return months[months.length - 1]?.value ?? '';
  }

  availabilityOptionsForMonth(
    monthKey: string,
    dueDate: string | null | undefined,
  ): TimeSlotPickerOption[] {
    if (!monthKey || !dueDate) return [];
    const options = this.serviceMeetingAvailabilityByMonth()[monthKey] ?? [];
    return options.filter((option) => this.isSlotWithinDueDate(option.value, dueDate));
  }

  isAvailabilityMonthLoading(monthKey: string): boolean {
    return Boolean(monthKey && this.availabilityLoadingMonths().includes(monthKey));
  }

  changeMilestoneAvailabilityMonth(index: number, monthKey: string, dueDate: string): void {
    if (!this.availabilityMonthsForDueDate(dueDate).some((month) => month.value === monthKey)) {
      return;
    }
    this.milestoneAvailabilityMonth.update((current) => ({ ...current, [index]: monthKey }));
    this.clearMilestoneSelectionsOutsideMonth(index, monthKey);
    void this.loadServiceAvailabilityMonth(monthKey);
  }

  changeExtraMilestoneAvailabilityMonth(monthKey: string): void {
    if (
      !this.availabilityMonthsForDueDate(this.extraMilestoneDueDate()).some(
        (month) => month.value === monthKey,
      )
    ) {
      return;
    }
    this.extraMilestoneAvailabilityMonth.set(monthKey);
    this.extraMilestoneTimes.update((current) =>
      current.map((value) => (value && this.monthKeyForDate(value) !== monthKey ? '' : value)),
    );
    void this.loadServiceAvailabilityMonth(monthKey);
  }

  disabledSlotValues(
    selectedValues: string[],
    optionIndex: number,
    availableOptions: TimeSlotPickerOption[],
  ): string[] {
    const selectedDays = new Set(
      selectedValues
        .filter((selectedValue, selectedIndex) => selectedIndex !== optionIndex && selectedValue)
        .map((selectedValue) => this.dateKeyInTimeZone(new Date(selectedValue))),
    );
    return availableOptions
      .filter((option) => selectedDays.has(this.dateKeyInTimeZone(new Date(option.value))))
      .map((option) => option.value);
  }

  slotWindowLabel(dueDate: string | null | undefined): string {
    if (!dueDate) return 'Selecciona primero la fecha objetivo';
    return `Disponibilidad hasta ${new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${dueDate}T00:00:00Z`))}`;
  }

  async addExtraMilestone(): Promise<void> {
    const current = this.service();
    const title = this.extraMilestoneTitle().trim();
    const dueDate = this.extraMilestoneDueDate();
    const values = this.extraMilestoneTimes().filter(Boolean);
    const insertAtIndex = this.extraMilestoneInsertAtIndex();
    if (!current || current.status !== 'paid') return;
    if (insertAtIndex === null) {
      this.toastService.warning('Selecciona dónde irá el nuevo hito');
      return;
    }
    if (title.length < 3) {
      this.toastService.warning('Escribe un nombre para el nuevo hito');
      return;
    }
    if (!dueDate) {
      this.toastService.warning('Selecciona la fecha objetivo del hito');
      return;
    }
    if (values.length !== 3 || new Set(values).size !== 3) {
      this.toastService.warning('Selecciona tres horarios diferentes para la reunión');
      return;
    }
    if (new Set(values.map((value) => this.dateKeyInTimeZone(new Date(value)))).size !== 3) {
      this.toastService.warning('Los horarios deben pertenecer a tres días diferentes');
      return;
    }

    this.addingExtraMilestone.set(true);
    try {
      const updated = await this.serviceRequestService.addExtraMilestoneMeeting(current.id, {
        insertAtIndex,
        title,
        dueDate,
        proposedStartTimes: values.map((value) => new Date(value).toISOString()),
      });
      this.service.set(updated);
      this.initializeServiceAvailability(updated, false);
      this.resetExtraMilestoneForm();
      this.toastService.success('Hito agregado y reunión propuesta al consultor');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.addingExtraMilestone.set(false);
    }
  }

  selectEvidenceFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length > 5) {
      this.toastService.warning('Puedes adjuntar hasta cinco archivos por envío');
    }
    this.evidenceFiles.set(files.slice(0, 5));
  }

  openEvidenceUploader(milestoneIndex: number | null): void {
    const current = this.service();
    if (!this.isConsultant() || current?.status !== 'paid') return;

    this.evidenceMilestoneIndex.set(milestoneIndex);
    this.showEvidenceUploader.set(true);
  }

  closeEvidenceUploader(): void {
    this.resetEvidenceForm();
  }

  updateEvidenceMilestone(value: string): void {
    this.evidenceMilestoneIndex.set(value === '' ? null : Number(value));
  }

  removeEvidenceFile(index: number): void {
    this.evidenceFiles.update((files) => files.filter((_, fileIndex) => fileIndex !== index));
  }

  async uploadEvidence(): Promise<void> {
    const current = this.service();
    const files = this.evidenceFiles();
    if (!current || current.status !== 'paid' || !this.isConsultant()) return;
    if (!files.length) {
      this.toastService.warning('Selecciona al menos un archivo');
      return;
    }

    const data = new FormData();
    for (const file of files) data.append('files', file);
    const note = this.evidenceNote().trim();
    if (note) data.append('note', note);
    const milestoneIndex = this.evidenceMilestoneIndex();
    if (milestoneIndex !== null) data.append('milestoneIndex', String(milestoneIndex));

    this.uploadingEvidence.set(true);
    try {
      const updated = await this.serviceRequestService.uploadEvidence(current.id, data);
      this.service.set(updated);
      this.resetEvidenceForm();
      this.toastService.success('Evidencia adjuntada al seguimiento');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.uploadingEvidence.set(false);
    }
  }

  evidenceMilestoneLabel(
    current: ServiceRequestResultDto,
    index: number | null | undefined,
  ): string {
    if (index === null || index === undefined) return 'General del servicio';
    return current.milestones[index]?.title ?? `Hito ${index + 1}`;
  }

  evidenceForMilestone(current: ServiceRequestResultDto, index: number): ServiceEvidence[] {
    return current.evidenceAttachments.filter((attachment) => attachment.milestoneIndex === index);
  }

  generalEvidence(current: ServiceRequestResultDto): ServiceEvidence[] {
    return current.evidenceAttachments.filter(
      (attachment) => attachment.milestoneIndex === null || attachment.milestoneIndex === undefined,
    );
  }

  evidenceUploaderLabel(role: 'pyme' | 'consultor'): string {
    return role === 'pyme' ? 'Tu empresa' : 'Consultor';
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async declineProposal(): Promise<void> {
    const current = this.service();
    if (!current || current.status !== 'proposal_sent') return;

    this.declining.set(true);
    try {
      const updated = await this.serviceRequestService.decline(current.id, {
        message: this.declineMessage().trim() || undefined,
      });
      this.service.set(updated);
      this.toastService.success('Cotización marcada como no aceptada');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.declining.set(false);
    }
  }

  handleProposalSent(updated: ServiceRequestResultDto): void {
    this.service.set(updated);
  }

  async declineRequest(): Promise<void> {
    const current = this.service();
    if (!this.isConsultant() || !current || current.status !== 'requested') return;

    this.declining.set(true);
    try {
      const updated = await this.serviceRequestService.decline(current.id, {
        message: this.declineMessage().trim() || undefined,
      });
      this.service.set(updated);
      this.showDeclineForm.set(false);
      this.toastService.success('Solicitud marcada como no aceptada');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.declining.set(false);
    }
  }

  openDeclineForm(): void {
    if (this.isConsultant()) this.showDeclineForm.set(true);
  }

  cancelDecline(): void {
    if (this.declining()) return;
    this.declineMessage.set('');
    this.showDeclineForm.set(false);
  }

  async payService(selectedInstallment?: ServicePaymentScheduleItem): Promise<void> {
    const current = this.service();
    const installment = selectedInstallment ?? (current ? this.nextPendingPayment(current) : null);
    if (!current || !installment?.available) return;

    this.preparingPayment.set(true);
    try {
      const checkout = await this.mercadoPagoService.prepareServicePayment(current.id, installment.installmentIndex);
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

  async redeemServiceCoupon(): Promise<void> {
    const current = this.service();
    const installment = current ? this.nextPendingPayment(current) : null;
    const code = this.serviceCouponCode().trim();
    if (!current || !installment?.available || !code || this.redeemingServiceCoupon()) return;

    this.redeemingServiceCoupon.set(true);
    try {
      const result = await this.promotionCodeService.redeemService({
        serviceRequestId: current.id,
        code,
      });
      const updated = await this.serviceRequestService.findOne(current.id);
      this.service.set(updated);
      this.initializeServiceAvailability(updated);
      this.serviceCouponCode.set('');
      const hasPendingInstallments = updated.paymentSchedule.some(
        (payment) => payment.status !== 'approved',
      );
      this.toastService.success(
        hasPendingInstallments
          ? `Cupón ${result.code} aplicado a la cuota`
          : `Cupón ${result.code} aplicado. El servicio quedó completamente pagado`,
      );
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.redeemingServiceCoupon.set(false);
    }
  }

  milestoneMeetingTimesFor(index: number): string[] {
    return this.milestoneMeetingTimes()[index] ?? ['', '', ''];
  }

  updateMilestoneMeetingTime(index: number, optionIndex: number, value: string): void {
    this.milestoneMeetingTimes.update((current) => {
      const values = [...(current[index] ?? ['', '', ''])];
      values[optionIndex] = value;
      return { ...current, [index]: values };
    });
  }

  async scheduleMilestoneMeeting(index: number): Promise<void> {
    const current = this.service();
    const values = this.milestoneMeetingTimesFor(index).filter(Boolean);
    if (!current || current.status !== 'paid') return;
    if (values.length !== 3 || new Set(values).size !== 3) {
      this.toastService.warning('Selecciona tres horarios diferentes para el hito');
      return;
    }
    if (new Set(values.map((value) => this.dateKeyInTimeZone(new Date(value)))).size !== 3) {
      this.toastService.warning('Los horarios deben pertenecer a tres días diferentes');
      return;
    }

    this.schedulingMilestone.set(index);
    try {
      const updated = await this.serviceRequestService.scheduleMilestoneMeeting(current.id, {
        milestoneIndex: index,
        proposedStartTimes: values.map((value) => new Date(value).toISOString()),
      });
      this.service.set(updated);
      this.toastService.success('Reunión del hito propuesta al consultor');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.schedulingMilestone.set(null);
    }
  }

  meetingStatusLabel(status: ServiceMeeting['status']): string {
    const labels: Record<ServiceMeeting['status'], string> = {
      solicitada: 'Solicitada',
      pago_pendiente: 'Pendiente de pago',
      por_confirmar: 'Esperando horario',
      confirmada: 'Confirmada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  meetingForMilestone(current: ServiceRequestResultDto, index: number): ServiceMeeting | null {
    return current.meetings.find((meeting) => meeting.serviceMilestoneIndex === index) ?? null;
  }

  closePaymentModal(): void {
    this.stopPaymentPolling();
    this.paymentModalOpen.set(false);
    this.paymentCheckout.set(null);
    void this.refreshService();
  }

  statusLabel(status: ServiceStatus): string {
    const labels: Record<ServiceStatus, string> = this.isConsultant()
      ? {
          requested: 'Por responder',
          proposal_sent: 'Cotización enviada',
          consultant_declined: 'No aceptada por mí',
          payment_pending: 'Esperando pago',
          paid: 'Servicio activo',
          completed: 'Completada',
          pyme_declined: 'No aceptada por PYME',
          cancelled: 'Cancelada',
        }
      : {
          requested: 'Esperando respuesta',
          proposal_sent: 'Precio recibido',
          consultant_declined: 'No aceptada por consultor',
          payment_pending: 'Pago pendiente',
          paid: 'Servicio activo',
          completed: 'Completado',
          pyme_declined: 'No aceptada',
          cancelled: 'Cancelada',
        };
    return labels[status];
  }

  statusClass(status: ServiceStatus): string {
    const classes: Record<ServiceStatus, string> = {
      requested: 'bg-info/10 text-info',
      proposal_sent: 'bg-secondary/10 text-secondary',
      consultant_declined: 'bg-danger/10 text-danger',
      payment_pending: 'bg-warning/15 text-warning',
      paid: 'bg-success/10 text-success',
      completed: 'bg-secondary/10 text-secondary',
      pyme_declined: 'bg-danger/10 text-danger',
      cancelled: 'bg-text/10 text-muted',
    };
    return classes[status];
  }

  formatMoney(value: string | null | undefined, currency = 'PEN'): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(
      Number(value ?? 0),
    );
  }

  canCompleteService(current: ServiceRequestResultDto): boolean {
    return (
      current.status === 'paid' &&
      current.paymentSchedule.length > 0 &&
      current.paymentSchedule.every((installment) => installment.status === 'approved')
    );
  }

  nextPendingPayment(current: ServiceRequestResultDto): ServicePaymentScheduleItem | null {
    return current.paymentSchedule.find((installment) => installment.status !== 'approved') ?? null;
  }

  serviceBudgetLabel(current: ServiceRequestResultDto): string {
    if (!current.budgetType || !current.budgetMin) return 'No registrado';
    if (current.budgetType === 'fixed')
      return this.formatMoney(current.budgetMin, current.currency);
    if (!current.budgetMax) return `Desde ${this.formatMoney(current.budgetMin, current.currency)}`;
    return `${this.formatMoney(current.budgetMin, current.currency)} – ${this.formatMoney(current.budgetMax, current.currency)}`;
  }

  workModalityLabel(value: ServiceRequestResultDto['workModality']): string {
    return value === 'remote' ? 'Remoto' : value;
  }

  readInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private resetExtraMilestoneForm(): void {
    this.extraMilestoneTitle.set('');
    this.extraMilestoneDueDate.set('');
    this.extraMilestoneTimes.set(['', '', '']);
    this.extraMilestoneInsertAtIndex.set(null);
    this.showExtraMilestoneForm.set(false);
  }

  private async completeService(): Promise<void> {
    const current = this.service();
    if (!current || current.status !== 'paid' || this.completingService()) return;

    this.completingService.set(true);
    try {
      this.service.set(await this.serviceRequestService.completeService(current.id));
      this.toastService.success('El servicio fue marcado como completado');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.completingService.set(false);
    }
  }

  private resetEvidenceForm(): void {
    this.evidenceFiles.set([]);
    this.evidenceNote.set('');
    this.evidenceMilestoneIndex.set(null);
    this.showEvidenceUploader.set(false);
    const input = this.evidenceFileInput()?.nativeElement;
    if (input) input.value = '';
  }

  private async loadService(id: number): Promise<void> {
    this.loading.set(true);
    try {
      const current = await this.serviceRequestService.findOne(id);
      this.service.set(current);
      this.focusCalendarOnNearestMeeting(current);
      this.initializeServiceAvailability(current);
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private async refreshService(): Promise<void> {
    const current = this.service();
    if (!current) return;
    try {
      const updated = await this.serviceRequestService.findOne(current.id);
      this.service.set(updated);
      this.initializeServiceAvailability(updated);
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    }
  }

  private focusCalendarOnNearestMeeting(current: ServiceRequestResultDto): void {
    const meetings = current.meetings.filter(
      (meeting): meeting is ServiceMeeting & { startTime: string } => Boolean(meeting.startTime),
    );
    if (!meetings.length) {
      this.showCurrentCalendarMonth();
      return;
    }
    const now = Date.now();
    const nearest = [...meetings].sort(
      (left, right) =>
        Math.abs(new Date(left.startTime).getTime() - now) -
        Math.abs(new Date(right.startTime).getTime() - now),
    )[0];
    if (!nearest) return;
    const [year, month] = this.dateKeyInTimeZone(new Date(nearest.startTime))
      .split('-')
      .map(Number);
    this.calendarCursor.set(this.clampCalendarMonth(new Date(Date.UTC(year, month - 1, 1))));
  }

  private initializeServiceAvailability(current: ServiceRequestResultDto, resetCache = true): void {
    if (resetCache) this.resetServiceAvailability();
    if (current.status !== 'paid' || this.isConsultant()) return;

    const initialMonths = new Set<string>();
    const activeMonths: Record<number, string> = {};
    for (const [index, milestone] of current.milestones.entries()) {
      if (this.meetingForMilestone(current, index)) continue;
      const months = this.availabilityMonthsForDueDate(milestone.dueDate);
      const targetMonth = this.monthKeyForDate(milestone.dueDate);
      const activeMonth = months.some((month) => month.value === targetMonth)
        ? targetMonth
        : (months[months.length - 1]?.value ?? '');
      if (!activeMonth) continue;
      activeMonths[index] = activeMonth;
      initialMonths.add(activeMonth);
    }
    this.milestoneAvailabilityMonth.set(activeMonths);
    for (const monthKey of initialMonths) {
      void this.loadServiceAvailabilityMonth(monthKey);
    }
  }

  private resetServiceAvailability(): void {
    this.availabilityRequestSequence += 1;
    this.availabilityLoadRequests.clear();
    this.serviceMeetingAvailabilityByMonth.set({});
    this.availabilityLoadingMonths.set([]);
    this.milestoneAvailabilityMonth.set({});
    this.extraMilestoneAvailabilityMonth.set('');
  }

  private loadServiceAvailabilityMonth(monthKey: string): Promise<void> {
    const current = this.service();
    if (!current || current.status !== 'paid' || !monthKey) return Promise.resolve();
    if (this.serviceMeetingAvailabilityByMonth()[monthKey]) return Promise.resolve();

    const pending = this.availabilityLoadRequests.get(monthKey);
    if (pending) return pending;

    const requestSequence = this.availabilityRequestSequence;
    const request = this.fetchServiceAvailabilityMonth(current, monthKey, requestSequence);
    this.availabilityLoadRequests.set(monthKey, request);
    request.then(
      () => this.clearAvailabilityRequest(monthKey, request),
      () => this.clearAvailabilityRequest(monthKey, request),
    );
    return request;
  }

  private async fetchServiceAvailabilityMonth(
    current: ServiceRequestResultDto,
    monthKey: string,
    requestSequence: number,
  ): Promise<void> {
    this.availabilityLoadingMonths.update((months) =>
      months.includes(monthKey) ? months : [...months, monthKey],
    );
    try {
      const slots = await this.consultantTimeSlotService.loadAvailableMonth(
        current.consultantId,
        monthKey,
      );
      if (requestSequence !== this.availabilityRequestSequence) return;
      this.serviceMeetingAvailabilityByMonth.update((months) => ({
        ...months,
        [monthKey]: slots,
      }));
    } catch (error) {
      if (requestSequence === this.availabilityRequestSequence) {
        this.toastService.error(
          `No se pudo cargar la disponibilidad de ${this.formatMonthKey(monthKey)}. ${this.hubsme.getErrorMessage(error)}`,
        );
      }
    } finally {
      if (requestSequence === this.availabilityRequestSequence) {
        this.availabilityLoadingMonths.update((months) =>
          months.filter((currentMonth) => currentMonth !== monthKey),
        );
      }
    }
  }

  private clearAvailabilityRequest(monthKey: string, request: Promise<void>): void {
    if (this.availabilityLoadRequests.get(monthKey) === request) {
      this.availabilityLoadRequests.delete(monthKey);
    }
  }

  private startPaymentPolling(): void {
    this.stopPaymentPolling();
    this.pollingStartedAt = Date.now();
    void this.pollPaymentStatus();
    this.paymentPolling = setInterval(() => void this.pollPaymentStatus(), 3000);
  }

  private stopPaymentPolling(): void {
    if (!this.paymentPolling) return;
    clearInterval(this.paymentPolling);
    this.paymentPolling = null;
  }

  private async pollPaymentStatus(): Promise<void> {
    const current = this.service();
    if (!current || !this.paymentModalOpen() || this.paymentPollingInFlight) return;
    if (Date.now() - this.pollingStartedAt > 600000) {
      this.stopPaymentPolling();
      this.toastService.warning(
        'El pago sigue pendiente. Puedes cerrar esta ventana y reintentarlo luego.',
      );
      return;
    }

    this.paymentPollingInFlight = true;
    try {
      await this.mercadoPagoService.syncServicePayment(current.id, this.paymentCheckout()?.serviceInstallmentIndex);
      if (!this.paymentModalOpen() || this.service()?.id !== current.id) return;
      const updated = await this.serviceRequestService.findOne(current.id);
      if (!this.paymentModalOpen() || this.service()?.id !== current.id) return;
      this.service.set(updated);
      this.initializeServiceAvailability(updated);
      const paidInstallmentIndex = this.paymentCheckout()?.serviceInstallmentIndex;
      const paidInstallment = updated.paymentSchedule.find(
        (installment) => installment.installmentIndex === paidInstallmentIndex,
      );
      if (paidInstallment?.status !== 'approved') return;
      this.stopPaymentPolling();
      this.paymentModalOpen.set(false);
      this.paymentCheckout.set(null);
      const hasPendingInstallments = updated.paymentSchedule.some(
        (installment) => installment.status !== 'approved',
      );
      this.toastService.success(
        hasPendingInstallments
          ? 'Cuota confirmada correctamente'
          : 'Pago confirmado. El servicio quedó completamente pagado',
      );
    } catch {
      // El siguiente ciclo vuelve a consultar para tolerar fallas temporales.
    } finally {
      this.paymentPollingInFlight = false;
    }
  }

  private firstDayOfMonth(date: Date): Date {
    const [year, month] = this.dateKeyInTimeZone(date).split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, 1));
  }

  private monthFromDateKey(value: string): Date {
    const [year, month] = value.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, 1));
  }

  private monthKeyFromDate(value: Date): string {
    return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  private monthKeyForDate(value: string): string {
    return value.slice(0, 7);
  }

  private isDateOnly(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  private formatMonthKey(value: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${value}-01T00:00:00Z`));
  }

  private availabilityStartDateKey(): string {
    const todayKey = this.dateKeyInTimeZone(new Date());
    const paidAt = this.service()?.paidAt;
    if (!paidAt) return todayKey;
    const paidAtKey = this.dateKeyInTimeZone(new Date(paidAt));
    return paidAtKey > todayKey ? paidAtKey : todayKey;
  }

  private isSlotWithinDueDate(value: string, dueDate: string | null | undefined): boolean {
    if (!dueDate) return false;
    const slotDate = new Date(value);
    const deadline = new Date(`${dueDate}T23:59:59-05:00`).getTime();
    return (
      this.dateKeyInTimeZone(slotDate) >= this.availabilityStartDateKey() &&
      slotDate.getTime() <= deadline
    );
  }

  private clearMilestoneSelectionsOutsideMonth(index: number, monthKey: string): void {
    this.milestoneMeetingTimes.update((current) => {
      const values = (current[index] ?? ['', '', '']).map((value) =>
        value && this.monthKeyForDate(value) !== monthKey ? '' : value,
      );
      return { ...current, [index]: values };
    });
  }

  private clampCalendarMonth(value: Date): Date {
    const range = this.calendarRange();
    if (!range) return value;
    if (value < range.startMonth) return new Date(range.startMonth);
    if (value > range.endMonth) return new Date(range.endMonth);
    return value;
  }

  private formatDateKey(value: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
  }

  private dateKeyInTimeZone(date: Date): string {
    const values: Record<string, string> = {};
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    for (const part of parts) {
      if (part.type !== 'literal') values[part.type] = part.value;
    }
    return `${values['year']}-${values['month']}-${values['day']}`;
  }

  private utcDateKey(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  }
}
