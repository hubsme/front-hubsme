import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CalendarTutorial } from './layout/tutorial/tutorial';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CalendarDatePipe,
  CalendarDayViewComponent,
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewComponent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarView,
  CalendarWeekViewComponent,
  DateAdapter,
  provideCalendar,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ConsultantAvailabilityService } from '@service/admin/consultant-availability.service';
import { ConsultantGoogleCalendarService } from '@service/admin/consultant-google-calendar.service';
import { MeetingService } from '@service/admin/meeting.service';
import { PymeService } from '@service/admin/pyme.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PATH, buildPath } from '@route/path.route';

type AvailabilityMonth = ApiResponse<'consultantAvailability', 'consultant-availabilityFindMonth'>['data'][number];
type AvailabilitySchedule = Record<string, string[]>;
type GoogleBusySlot = ApiResponse<'consultantGoogleCalendar', 'consultantgooglecalendarBusyMonth'>['data'][number];
type GoogleCalendarStatus = ApiResponse<'consultantGoogleCalendar', 'consultantgooglecalendarStatus'>;
type Meeting = ApiResponse<'meeting', 'findAll'>['data'][number];
type DraftSlotStatus = 'disponible' | 'bloqueado';

type DraftSlot = {
  localId: string;
  id?: number;
  consultantId: number;
  startTime: Date;
  endTime: Date;
  status: DraftSlotStatus;
  notes: string;
};

type SlotForm = {
  date: string;
  startTime: string;
  endTime: string;
  status: DraftSlotStatus;
  notes: string;
};

type SaveAvailabilityMode = 'week' | 'month';
type SlotEventMeta = { type: 'google-calendar'; id: string } | { type: 'meeting'; meetingId: number };
type GoogleCalendarMessage = { type: 'hubsme:google-calendar'; connected?: boolean; googleEmail?: string; error?: string };
type MonthDaySelection = {
  date: Date;
  events: CalendarEvent<SlotEventMeta>[];
};

@Component({
  selector: 'app-meetings',
  imports: [
    CommonModule,
    FormsModule,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarNextViewDirective,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CalendarDayViewComponent,
    CalendarDatePipe,
    ModalForm,
    RouterLink,
    CalendarTutorial,
  ],
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  templateUrl: './meetings.html',
})
export class Meetings implements OnInit, OnDestroy {
  private availabilityService = inject(ConsultantAvailabilityService);
  private googleCalendarService = inject(ConsultantGoogleCalendarService);
  private meetingService = inject(MeetingService);
  private pymeService = inject(PymeService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  readonly CalendarView = CalendarView;
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  view = signal<CalendarView>(CalendarView.Week);
  viewDate = signal(new Date());
  loading = signal(false);
  saving = signal(false);
  googleLoading = signal(false);
  googleBusyLoading = signal(false);
  isSaveMenuOpen = signal(false);
  isCreateModalOpen = signal(false);
  showTutorial = signal(false);
  selectedSlotLocalId = signal<string | null>(null);
  selectedMeeting = signal<Meeting | null>(null);
  expandedMonthDay = signal<MonthDaySelection | null>(null);
  confirmingMeetingId = signal<number | null>(null);
  selectedProposedStartTime = signal<string | null>(null);
  activeBrush = signal<DraftSlotStatus>('disponible');
  dragSelection = signal<{ start: Date; end: Date } | null>(null);
  slots = signal<DraftSlot[]>([]);
  meetings = signal<Meeting[]>([]);
  pymeNames = signal<Record<number, string>>({});
  googleStatus = signal<GoogleCalendarStatus>({
    connected: false,
    googleEmail: null,
    googleCalendarId: null,
    connectedAt: null,
  });
  googleBusySlots = signal<GoogleBusySlot[]>([]);
  form = signal<SlotForm>({
    date: this.toDateInput(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    status: 'disponible',
    notes: '',
  });
  private draftCounter = 0;
  private googlePopup: Window | null = null;
  private googlePopupTimer: ReturnType<typeof setInterval> | null = null;
  private dragStartDate: Date | null = null;
  private readonly googleMessageHandler = (event: MessageEvent<unknown>) => this.handleGoogleCalendarMessage(event);
  readonly monthEventLimit = 2;

  consultantId = computed(() => this.hubsme.currentUser().id);
  monthLabel = computed(() => this.viewDate());
  sortedSlots = computed(() => [...this.slots()].sort((left, right) => left.startTime.getTime() - right.startTime.getTime()));
  availableDayKeys = computed(() => new Set(this.slots().map((slot) => this.toDateKey(slot.startTime))));
  selectedSlot = computed(() => {
    const localId = this.selectedSlotLocalId();
    if (!localId) return null;
    return this.slots().find((slot) => slot.localId === localId) ?? null;
  });
  events = computed<CalendarEvent<SlotEventMeta>[]>(() => [
    ...this.googleBusySlots().map((slot) => ({
      id: slot.id,
      start: new Date(slot.startTime),
      end: new Date(slot.endTime),
      title: `${this.calendarEventTime(new Date(slot.startTime))} · Ocupado Google`,
      color: { primary: '#f59e0b', secondary: 'rgba(245,158,11,0.18)' },
      cssClass: 'calendar-event-google-busy',
      meta: { type: 'google-calendar' as const, id: slot.id },
    })),
    ...this.meetings()
      .filter((meeting) => meeting.status !== 'cancelada')
      .map((meeting) => ({
        id: meeting.id,
        start: this.meetingDisplayStart(meeting),
        end: this.meetingEnd(meeting),
        title: `${this.calendarEventTime(this.meetingDisplayStart(meeting))} · ${this.pymeDisplayName(meeting)}`,
        color: this.meetingColor(meeting),
        meta: { type: 'meeting' as const, meetingId: meeting.id },
      })),
  ]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('message', this.googleMessageHandler);
    }
    this.loadMonth();
    this.loadMeetings();
    this.loadGoogleCalendarStatus();
    this.checkIfFirstTime();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('message', this.googleMessageHandler);
    }
    this.clearGooglePopupTimer();
  }

  setView(view: CalendarView) {
    if (view === CalendarView.Day) {
      this.view.set(CalendarView.Week);
      return;
    }
    this.view.set(view);
  }

  beforeMonthViewRender(event: CalendarMonthViewBeforeRenderEvent) {
    const availableDayKeys = this.availableDayKeys();

    for (const day of event.body) {
      if (availableDayKeys.has(this.toDateKey(day.date))) {
        day.cssClass = `${day.cssClass ?? ''} calendar-day-available`.trim();
      }
    }
  }

  previous(newDate?: Date) {
    if (newDate) {
      this.viewDate.set(newDate);
    } else {
      const currentView = this.view();
      if (currentView === CalendarView.Month) {
        this.viewDate.update((current) => this.addMonths(current, -1));
      } else if (currentView === CalendarView.Week) {
        this.viewDate.update((current) => this.addDays(current, -7));
      } else {
        this.viewDate.update((current) => this.addDays(current, -1));
      }
    }
    this.syncFormDate();
    this.loadMonth();
    this.loadGoogleBusyMonth();
  }

  next(newDate?: Date) {
    if (newDate) {
      this.viewDate.set(newDate);
    } else {
      const currentView = this.view();
      if (currentView === CalendarView.Month) {
        this.viewDate.update((current) => this.addMonths(current, 1));
      } else if (currentView === CalendarView.Week) {
        this.viewDate.update((current) => this.addDays(current, 7));
      } else {
        this.viewDate.update((current) => this.addDays(current, 1));
      }
    }
    this.syncFormDate();
    this.loadMonth();
    this.loadGoogleBusyMonth();
  }

  today() {
    this.viewDate.set(new Date());
    this.syncFormDate();
    this.loadMonth();
    this.loadGoogleBusyMonth();
  }

  updateForm<K extends keyof SlotForm>(key: K, value: SlotForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  openCreateModal(date?: Date) {
    if (date) {
      const endTime = new Date(date);
      endTime.setHours(endTime.getHours() + 1);
      this.form.set({
        date: this.toDateInput(date),
        startTime: this.toTimeInput(date),
        endTime: this.toTimeInput(endTime),
        status: 'disponible',
        notes: '',
      });
    }
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  openEventDetail(event: CalendarEvent<SlotEventMeta>) {
    const meta = event.meta;
    if (!meta) return;
    if (meta.type === 'google-calendar') {
      this.toastService.info('Este horario viene de Google Calendar y es solo lectura');
      return;
    }

    const meeting = this.meetings().find((item) => item.id === meta.meetingId);
    if (meeting) this.selectedMeeting.set(meeting);
  }

  closeSlotDetail() {
    this.selectedSlotLocalId.set(null);
  }

  openMonthDay(
    date: Date,
    events: CalendarEvent<SlotEventMeta>[],
    sourceEvent: MouseEvent,
  ) {
    sourceEvent.stopPropagation();
    this.expandedMonthDay.set({
      date: new Date(date),
      events: [...events],
    });
  }

  closeMonthDay() {
    this.expandedMonthDay.set(null);
  }

  openExpandedMonthEvent(event: CalendarEvent<SlotEventMeta>) {
    this.closeMonthDay();
    this.openEventDetail(event);
  }

  monthDayLabel(date: Date) {
    return date.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
    });
  }

  setBrush(brush: DraftSlotStatus) {
    this.activeBrush.set(brush);
  }

  startSlotDrag(date: Date, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const slot = this.slotAt(date);
    if (slot) {
      if (this.activeBrush() === 'bloqueado') {
        this.dragStartDate = new Date(date);
        this.dragSelection.set({
          start: new Date(date),
          end: this.addMinutes(date, 30),
        });
        return;
      }

      return;
    }

    this.dragStartDate = new Date(date);
    this.dragSelection.set({
      start: new Date(date),
      end: this.addMinutes(date, 30),
    });
  }

  updateSlotDrag(date: Date) {
    if (!this.dragStartDate) return;
    if (!this.isSameDay(this.dragStartDate, date)) return;
    this.dragSelection.set(this.normalizeDragRange(this.dragStartDate, date));
  }

  finishSlotDrag(date: Date, event?: MouseEvent) {
    if (!this.dragStartDate) return;
    event?.preventDefault();
    event?.stopPropagation();

    const dragStartDate = this.dragStartDate;
    this.dragStartDate = null;
    this.dragSelection.set(null);

    if (!this.isSameDay(dragStartDate, date)) {
      this.toastService.warning('Arrastra dentro del mismo dia para crear un bloque');
      return;
    }

    const range = this.normalizeDragRange(dragStartDate, date);

    if (this.activeBrush() === 'bloqueado') {
      this.eraseSlotsInRange(range.start, range.end);
      return;
    }

    if (this.rangeOverlapsSlot(range.start, range.end)) {
      this.toastService.warning('El bloque se cruza con otro horario');
      return;
    }

    const draft: DraftSlot = {
      localId: this.createLocalId(),
      consultantId: this.consultantId(),
      startTime: range.start,
      endTime: range.end,
      status: this.activeBrush(),
      notes: '',
    };

    this.slots.update((current) => [...current, draft]);
  }

  brushCursor() {
    if (this.activeBrush() === 'bloqueado') {
      return 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27 viewBox=%270 0 32 32%27%3E%3Cpath fill=%27%23ffffff%27 stroke=%27%230f172a%27 stroke-width=%271.4%27 d=%27M11 3.5c1 0 1.8.8 1.8 1.8v9.2h1.1V4.6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v9.9h1.1V6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v9.1h1.1V9.4c0-1 .8-1.8 1.8-1.8S27 8.4 27 9.4v8.4c0 6-3.8 10.7-9.7 10.7h-1.7c-3.4 0-6.1-1.5-7.9-4.2L4.5 19c-.6-1-.3-2.2.7-2.8.9-.5 2-.3 2.6.6l1.4 2.1V5.3c0-1 .8-1.8 1.8-1.8Z%27/%3E%3C/svg%3E") 10 4, pointer';
    }
    return 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27 viewBox=%270 0 32 32%27%3E%3Cpath fill=%27%230e9f6e%27 stroke=%27%230f172a%27 stroke-width=%271.4%27 d=%27M11 3.5c1 0 1.8.8 1.8 1.8v9.2h1.1V4.6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v9.9h1.1V6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v9.1h1.1V9.4c0-1 .8-1.8 1.8-1.8S27 8.4 27 9.4v8.4c0 6-3.8 10.7-9.7 10.7h-1.7c-3.4 0-6.1-1.5-7.9-4.2L4.5 19c-.6-1-.3-2.2.7-2.8.9-.5 2-.3 2.6.6l1.4 2.1V5.3c0-1 .8-1.8 1.8-1.8Z%27/%3E%3C/svg%3E") 10 4, pointer';
  }

  brushPreviewColor() {
    if (this.activeBrush() === 'bloqueado') return 'rgba(255,255,255,0.74)';
    return 'rgba(14,159,110,0.16)';
  }

  brushLabel() {
    if (this.activeBrush() === 'bloqueado') return 'Pintando no disponible';
    return 'Pintando disponible';
  }

  openSegment(date: Date) {
    const slot = this.slotAt(date);
    if (slot) {
      return;
    }

    this.openCreateModal(date);
  }

  segmentBackgroundColor(date: Date, isTimeLabel = false) {
    if (isTimeLabel) return null;
    if (this.activeBrush() === 'bloqueado' && this.isInsideDragSelection(date)) return this.brushPreviewColor();

    const slot = this.slotAt(date);
    if (slot?.status === 'disponible') return 'rgba(14,159,110,0.16)';
    if (this.isInsideDragSelection(date)) return this.brushPreviewColor();
    return null;
  }

  private eraseSlotsInRange(start: Date, end: Date) {
    this.slots.update((current) =>
      current.flatMap((slot) => {
        if (slot.startTime >= end || slot.endTime <= start) return [slot];

        const remaining: DraftSlot[] = [];
        if (slot.startTime < start) {
          remaining.push({
            ...slot,
            localId: this.createLocalId(),
            endTime: new Date(start),
          });
        }

        if (slot.endTime > end) {
          remaining.push({
            ...slot,
            localId: this.createLocalId(),
            startTime: new Date(end),
          });
        }

        return remaining;
      }),
    );
  }

  @HostListener('document:mouseup')
  clearUnfinishedDrag() {
    if (!this.dragStartDate) return;
    this.dragStartDate = null;
    this.dragSelection.set(null);
  }

  @HostListener('document:click')
  closeSaveMenu() {
    this.isSaveMenuOpen.set(false);
  }

  closeMeetingDetail() {
    this.selectedMeeting.set(null);
    this.selectedProposedStartTime.set(null);
  }

  joinMeeting(meeting: Meeting) {
    if (!this.canJoinMeeting(meeting)) return;
    window.open(meeting.meetingUrl ?? '', '_blank', 'noopener,noreferrer');
  }

  finishMeeting(meeting: Meeting) {
    this.closeMeetingDetail();
    this.router.navigate([buildPath(PATH.admin.consultor.documents), meeting.id]);
  }

  selectProposedStartTime(startTime: string) {
    this.selectedProposedStartTime.set(startTime);
  }

  confirmProposedStartTime(meeting: Meeting) {
    const selectedStartTime = this.selectedProposedStartTime();
    if (!selectedStartTime) {
      this.toastService.warning('Selecciona uno de los horarios propuestos');
      return;
    }

    this.confirmingMeetingId.set(meeting.id);
    this.meetingService
      .confirmOption(meeting.id, { selectedStartTime })
      .then((updatedMeeting) => {
        this.toastService.success('Horario confirmado y enlace de Teams generado');
        this.selectedMeeting.set(updatedMeeting);
        this.selectedProposedStartTime.set(null);
        this.loadMeetings();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.confirmingMeetingId.set(null));
  }

  addSlot() {
    const form = this.form();
    const startTime = this.fromLocalInput(form.date, form.startTime);
    const endTime = this.fromLocalInput(form.date, form.endTime);

    if (!startTime || !endTime) {
      this.toastService.warning('Completa la fecha y horas del bloque');
      return;
    }

    if (endTime <= startTime) {
      this.toastService.warning('La hora final debe ser mayor que la inicial');
      return;
    }

    const draft: DraftSlot = {
      localId: this.createLocalId(),
      consultantId: this.consultantId(),
      startTime,
      endTime,
      status: form.status,
      notes: form.notes.trim(),
    };

    const visibleMonths = this.getVisibleMonthsForView();
    const isStartVisible = visibleMonths.some((m) => m.year === startTime.getFullYear() && m.month === startTime.getMonth() + 1);
    const isEndVisible = visibleMonths.some((m) => m.year === endTime.getFullYear() && m.month === endTime.getMonth() + 1);
    if (!isStartVisible || !isEndVisible) {
      this.toastService.warning('El bloque debe pertenecer al mes visible');
      return;
    }

    if (this.hasOverlap(draft)) {
      this.toastService.warning('El bloque se cruza con otro horario');
      return;
    }

    this.slots.update((current) => [...current, draft]);
    this.form.update((current) => ({ ...current, notes: '' }));
    this.closeCreateModal();
  }

  removeSelectedSlot() {
    const localId = this.selectedSlotLocalId();
    if (!localId) return;
    this.slots.update((current) => current.filter((slot) => slot.localId !== localId));
    this.closeSlotDetail();
  }

  toggleSaveMenu(event: MouseEvent) {
    event.stopPropagation();
    if (this.saving() || this.loading()) return;
    this.isSaveMenuOpen.update((isOpen) => !isOpen);
  }

  saveAvailability(mode: SaveAvailabilityMode, event?: MouseEvent) {
    event?.stopPropagation();
    this.isSaveMenuOpen.set(false);

    if (mode === 'month') {
      if (this.visibleWeekSlots().filter(s => s.status === 'disponible').length === 0) {
        this.toastService.warning('Pinta al menos un horario disponible en esta semana');
        return;
      }
    }

    const visibleMonths = this.getVisibleMonthsForView();
    const promises = visibleMonths.map((m) => {
      const availableSchedule =
        mode === 'month'
          ? this.buildEveryDayMonthScheduleFromVisibleWeekForMonth(m.year, m.month)
          : this.buildScheduleForMonth(this.sortedSlots(), m.year, m.month);

      const payload: ApiBody<'consultantAvailability', 'consultant-availabilityReplaceMonth'> = {
        consultantId: this.consultantId(),
        year: m.year,
        month: m.month,
        availableSchedule,
      };

      return this.availabilityService.replaceMonth(payload);
    });

    this.saving.set(true);
    Promise.all(promises)
      .then(() => {
        this.toastService.success(mode === 'month' ? 'Disponibilidad aplicada al mes' : 'Disponibilidad de la semana guardada');
        this.loadMonth();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.saving.set(false));
  }

  loadMonth() {
    const visibleMonths = this.getVisibleMonthsForView();
    this.loading.set(true);

    const requests = visibleMonths.map((m) =>
      this.availabilityService.findMonth({
        consultantId: this.consultantId(),
        year: m.year,
        month: m.month,
      })
    );

    Promise.all(requests)
      .then((responses) => {
        const allMonths = responses.flatMap((response) => response.data);
        this.slots.set(this.expandAvailabilityMonths(allMonths));
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  startGoogleCalendarConnect(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.googleLoading.set(true);
    this.googleCalendarService
      .authUrl({ consultantId: this.consultantId() })
      .then((response) => {
        this.googlePopup = window.open(response.url, 'hubsme_google_calendar', this.getGooglePopupFeatures());

        if (!this.googlePopup) {
          this.toastService.error('Permite popups para conectar Google Calendar');
          this.googleLoading.set(false);
          return;
        }

        this.googlePopup.focus();
        this.googlePopupTimer = setInterval(() => {
          if (this.googlePopup?.closed) {
            this.clearGooglePopupTimer();
            this.googleLoading.set(false);
          }
        }, 500);
      })
      .catch((error) => {
        this.toastService.error(this.hubsme.getErrorMessage(error));
        this.googleLoading.set(false);
      });
  }

  disconnectGoogleCalendar(): void {
    this.googleLoading.set(true);
    this.googleCalendarService
      .disconnect({ consultantId: this.consultantId() })
      .then((status) => {
        this.googleStatus.set(status);
        this.googleBusySlots.set([]);
        this.toastService.success('Google Calendar desconectado');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.googleLoading.set(false));
  }

  confirmDisconnectGoogleCalendar(): void {
    const email = this.googleStatus().googleEmail || '';
    const accountStr = email ? ` la cuenta ${email}` : ' tu cuenta';
    this.alertService.confirm(
      'Desconectar Google Calendar',
      `¿Estás seguro de que deseas desconectar${accountStr} de Google Calendar? Esto detendrá la sincronización automática de tus eventos y horarios ocupados.`,
      () => {
        this.disconnectGoogleCalendar();
      }
    );
  }

  formatDate(value: Date | string) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  }

  formatHour(value: Date | string) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  meetingStatusLabel(status: Meeting['status']) {
    const labels: Record<Meeting['status'], string> = {
      solicitada: 'Solicitada',
      pago_pendiente: 'Pago pendiente',
      por_confirmar: 'Por confirmar',
      confirmada: 'Confirmada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  meetingStatusClass(status: Meeting['status']) {
    if (status === 'confirmada') return 'bg-success/10 text-success';
    if (status === 'pago_pendiente') return 'bg-secondary/10 text-secondary';
    if (status === 'por_confirmar') return 'bg-warning/10 text-warning';
    if (status === 'solicitada') return 'bg-warning/10 text-warning';
    if (status === 'finalizada') return 'bg-text/5 text-text';
    return 'bg-danger/10 text-danger';
  }

  canJoinMeeting(meeting: Meeting) {
    if (meeting.status !== 'confirmada' || !meeting.meetingUrl || meeting.description) return false;

    const now = new Date();
    const start = this.meetingDisplayStart(meeting);
    const end = new Date(start.getTime() + meeting.durationMinutes * 60 * 1000);

    // 10 minutes before
    const allowedStart = new Date(start.getTime() - 10 * 60 * 1000);
    // 30 minutes after the end of the meeting
    const allowedEnd = new Date(end.getTime() + 30 * 60 * 1000);

    return now >= allowedStart && now <= allowedEnd;
  }

  canFinishMeeting(meeting: Meeting) {
    return meeting.status === 'confirmada' && !meeting.description;
  }

  meetingEnd(meeting: Meeting) {
    const end = this.meetingDisplayStart(meeting);
    end.setMinutes(end.getMinutes() + meeting.durationMinutes);
    return end;
  }

  meetingDisplayStart(meeting: Meeting) {
    return new Date(meeting.startTime ?? meeting.proposedStartTimes?.[0] ?? meeting.createdAt);
  }

  private calendarEventTime(value: Date) {
    return value.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  proposedTimes(meeting: Meeting) {
    return (meeting.proposedStartTimes?.length ? meeting.proposedStartTimes : [meeting.startTime]).filter(
      (value): value is string => Boolean(value),
    );
  }

  trackBySlot(index: number, slot: DraftSlot) {
    return `${slot.localId}-${index}`;
  }

  private loadGoogleCalendarStatus() {
    this.googleCalendarService
      .status({ consultantId: this.consultantId() })
      .then((status) => {
        this.googleStatus.set(status);
        if (status.connected) {
          this.loadGoogleBusyMonth();
        }
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  private loadMeetings() {
    this.hubsme
      .listMeetings(1, 200)
      .then((response) => {
        const meetings = response.data.data;
        this.meetings.set(meetings);
        this.loadPymeNames(meetings);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  private loadPymeNames(meetings: Meeting[]) {
    const pymeIds = [...new Set(meetings.map((meeting) => meeting.pymeId))];

    if (pymeIds.length === 0) {
      this.pymeNames.set({});
      return;
    }

    Promise.all(
      pymeIds.map(async (pymeId) => {
        try {
          const pyme = await this.pymeService.findByUser(pymeId);
          return [pymeId, pyme.name.trim() || 'PYME'] as const;
        } catch {
          return [pymeId, 'PYME'] as const;
        }
      }),
    ).then((entries) => this.pymeNames.set(Object.fromEntries(entries)));
  }

  private pymeDisplayName(meeting: Meeting) {
    return this.pymeNames()[meeting.pymeId] ?? 'PYME';
  }

  private meetingColor(meeting: Meeting) {
    if (meeting.status === 'finalizada') {
      return { primary: '#047857', secondary: 'rgba(4,120,87,0.16)' };
    }
    if (meeting.status === 'por_confirmar') {
      return { primary: '#f59e0b', secondary: 'rgba(245,158,11,0.16)' };
    }
    return { primary: '#2563eb', secondary: 'rgba(37,99,235,0.16)' };
  }

  private slotAt(date: Date) {
    return this.slots().find((slot) => this.isInsideRange(date, slot.startTime, slot.endTime)) ?? null;
  }

  private isInsideRange(date: Date, startTime: Date, endTime: Date) {
    const time = date.getTime();
    return time >= startTime.getTime() && time < endTime.getTime();
  }

  private loadGoogleBusyMonth() {
    if (!this.googleStatus().connected) {
      this.googleBusySlots.set([]);
      return;
    }

    const visibleMonths = this.getVisibleMonthsForView();
    this.googleBusyLoading.set(true);

    const requests = visibleMonths.map((m) =>
      this.googleCalendarService.busyMonth({
        consultantId: this.consultantId(),
        year: m.year,
        month: m.month,
      })
    );

    Promise.all(requests)
      .then((responses) => {
        const allBusySlots = responses.flatMap((response) => response.data);
        this.googleBusySlots.set(allBusySlots);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.googleBusyLoading.set(false));
  }

  private handleGoogleCalendarMessage(event: MessageEvent<unknown>): void {
    if (!this.isGoogleCalendarMessage(event.data)) return;

    this.clearGooglePopupTimer();
    this.googlePopup?.close();
    this.googlePopup = null;
    this.googleLoading.set(false);

    if (event.data.error) {
      this.toastService.error(event.data.error);
      return;
    }

    this.toastService.success('Google Calendar conectado');
    this.loadGoogleCalendarStatus();
  }

  private isGoogleCalendarMessage(value: unknown): value is GoogleCalendarMessage {
    if (!value || typeof value !== 'object') return false;
    const message = value as { type?: unknown };
    return message.type === 'hubsme:google-calendar';
  }

  private clearGooglePopupTimer(): void {
    if (!this.googlePopupTimer) return;
    clearInterval(this.googlePopupTimer);
    this.googlePopupTimer = null;
  }

  private getGooglePopupFeatures(): string {
    const width = 520;
    const height = 680;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

    return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
  }

  private syncFormDate() {
    this.form.update((current) => ({ ...current, date: this.toDateInput(this.viewDate()) }));
  }

  private buildScheduleForMonth(slots: DraftSlot[], year: number, month: number): AvailabilitySchedule {
    const schedule = new Map<string, Set<string>>();

    for (const slot of slots) {
      if (slot.status !== 'disponible') continue;

      for (
        let cursor = new Date(slot.startTime);
        cursor.getTime() < slot.endTime.getTime();
        cursor = this.addMinutes(cursor, this.halfHourMinutes())
      ) {
        if (cursor.getFullYear() !== year || (cursor.getMonth() + 1) !== month) continue;
        const day = String(cursor.getDate());
        const daySchedule = schedule.get(day) ?? new Set<string>();
        daySchedule.add(this.toTimeInput(cursor));
        schedule.set(day, daySchedule);
      }
    }

    return Object.fromEntries(
      [...schedule.entries()]
        .sort(([leftDay], [rightDay]) => Number(leftDay) - Number(rightDay))
        .map(([day, times]) => [day, [...times].sort()]),
    );
  }

  private buildEveryDayMonthScheduleFromVisibleWeekForMonth(year: number, month: number): AvailabilitySchedule {
    const weekdaySchedule = new Map<number, Set<string>>();

    for (const slot of this.visibleWeekSlots()) {
      if (slot.status !== 'disponible') continue;
      const weekday = slot.startTime.getDay();
      const times = weekdaySchedule.get(weekday) ?? new Set<string>();

      for (
        let cursor = new Date(slot.startTime);
        cursor.getTime() < slot.endTime.getTime();
        cursor = this.addMinutes(cursor, this.halfHourMinutes())
      ) {
        times.add(this.toTimeInput(cursor));
      }

      weekdaySchedule.set(weekday, times);
    }

    if (weekdaySchedule.size === 0) return {};

    const lastDay = new Date(year, month, 0).getDate();
    const entries: [string, string[]][] = [];

    for (let day = 1; day <= lastDay; day += 1) {
      const date = new Date(year, month - 1, day);
      const times = weekdaySchedule.get(date.getDay());
      if (!times?.size) continue;
      entries.push([String(day), [...times].sort()]);
    }

    return Object.fromEntries(entries);
  }

  private visibleWeekSlots(): DraftSlot[] {
    const { start, end } = this.visibleWeekRange();
    return this.sortedSlots().filter((slot) => slot.startTime >= start && slot.startTime < end);
  }

  private visibleWeekRange() {
    const start = new Date(this.viewDate());
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());

    const end = this.addDays(start, 7);
    return { start, end };
  }

  private expandAvailabilityMonths(months: AvailabilityMonth[]): DraftSlot[] {
    return months.flatMap((availability) => this.expandAvailabilityMonth(availability));
  }

  private expandAvailabilityMonth(availability: AvailabilityMonth): DraftSlot[] {
    const parts = availability.month.split('-').map(Number);
    const year = parts[0];
    const monthIndex = parts[1] - 1;
    const slots: DraftSlot[] = [];

    for (const [day, times] of Object.entries(availability.availableSchedule ?? {})) {
      const sortedTimes = [...times].sort();
      let segmentStart: Date | null = null;
      let segmentEnd: Date | null = null;
      let segmentIndex = 0;

      for (const time of sortedTimes) {
        const start = this.fromMonthDayTime(year, monthIndex, Number(day), time);
        const end = this.addMinutes(start, this.halfHourMinutes());

        if (!segmentStart || !segmentEnd || start.getTime() !== segmentEnd.getTime()) {
          if (segmentStart && segmentEnd) {
            slots.push(this.createPersistedDraftSlot(availability, segmentStart, segmentEnd, day, segmentIndex));
            segmentIndex += 1;
          }
          segmentStart = start;
          segmentEnd = end;
          continue;
        }

        segmentEnd = end;
      }

      if (segmentStart && segmentEnd) {
        slots.push(this.createPersistedDraftSlot(availability, segmentStart, segmentEnd, day, segmentIndex));
      }
    }

    return slots;
  }

  private getVisibleMonths(start: Date, end: Date): { year: number; month: number }[] {
    const months: { year: number; month: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth() + 1;
      if (!months.some((m) => m.year === year && m.month === month)) {
        months.push({ year, month });
      }
      cursor.setMonth(cursor.getMonth() + 1);
      cursor.setDate(1);
    }
    return months;
  }

  private getVisibleMonthsForView(): { year: number; month: number }[] {
    const currentDate = this.viewDate();
    const currentView = this.view();

    if (currentView === CalendarView.Week) {
      const { start, end } = this.visibleWeekRange();
      const lastVisibleDay = new Date(end.getTime() - 1);
      return this.getVisibleMonths(start, lastVisibleDay);
    } else {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const start = this.addDays(monthStart, -6);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const end = this.addDays(monthEnd, 6);
      return this.getVisibleMonths(start, end);
    }
  }

  private createPersistedDraftSlot(
    availability: AvailabilityMonth,
    startTime: Date,
    endTime: Date,
    day: string,
    segmentIndex: number,
  ): DraftSlot {
    return {
      localId: `persisted-${availability.id}-${day}-${segmentIndex}`,
      id: availability.id,
      consultantId: availability.consultantId,
      startTime,
      endTime,
      status: 'disponible',
      notes: '',
    };
  }

  private isCurrentMonth(date: Date) {
    const currentDate = this.viewDate();
    return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth();
  }

  private hasOverlap(target: DraftSlot) {
    return this.slots().some((slot) => slot.startTime < target.endTime && slot.endTime > target.startTime);
  }

  private rangeOverlapsSlot(startTime: Date, endTime: Date) {
    return this.slots().some((slot) => slot.startTime < endTime && slot.endTime > startTime);
  }

  private normalizeDragRange(startTime: Date, segmentDate: Date) {
    if (segmentDate >= startTime) {
      return {
        start: new Date(startTime),
        end: this.addMinutes(segmentDate, 30),
      };
    }

    return {
      start: new Date(segmentDate),
      end: this.addMinutes(startTime, 30),
    };
  }

  private isInsideDragSelection(date: Date) {
    const selection = this.dragSelection();
    if (!selection) return false;
    return this.isInsideRange(date, selection.start, selection.end);
  }

  private isSameDay(left: Date, right: Date) {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }

  private addMonths(date: Date, months: number) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  }

  private addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private addMinutes(date: Date, minutes: number) {
    const next = new Date(date);
    next.setMinutes(next.getMinutes() + minutes);
    return next;
  }

  private halfHourMinutes() {
    return 30;
  }

  private toDateInput(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toDateKey(date: Date) {
    return this.toDateInput(date);
  }

  private toTimeInput(date: Date) {
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minute = `${date.getMinutes()}`.padStart(2, '0');
    return `${hour}:${minute}`;
  }

  private fromLocalInput(date: string, time: string) {
    if (!date || !time) return null;
    const value = new Date(`${date}T${time}:00`);
    return Number.isNaN(value.getTime()) ? null : value;
  }

  private fromMonthDayTime(year: number, monthIndex: number, day: number, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(year, monthIndex, day, hours, minutes);
  }

  private checkIfFirstTime() {
    this.availabilityService.findAll({ consultantId: this.consultantId(), limit: 1 })
      .then((response) => {
        if (response.meta.total === 0) {
          this.showTutorial.set(true);
        }
      })
      .catch((error) => console.error('Error checking availability history:', error));
  }

  private createLocalId() {
    this.draftCounter += 1;
    return `draft-${Date.now()}-${this.draftCounter}`;
  }
}
