import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  CalendarDatePipe,
  CalendarEvent,
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
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { MeetingService } from '@service/admin/meeting.service';
import { PATH, buildPath } from '@route/path.route';

type MeetingForm = {
  pymeId: number;
  consultantId: number;
  title: string;
  startTime: string;
  durationMinutes: number;
  description: string;
};

type FinalizeTask = {
  title: string;
  description: string;
  assignedTo: 'pyme' | 'consultor';
  priority: 'alta' | 'media' | 'baja';
  dueDate?: string;
};

type Meeting = ApiResponse<'meeting', 'calendar'>['data'][number];
type MeetingEventMeta = { meetingId: number };
type MonthDaySelection = {
  date: Date;
  events: CalendarEvent<MeetingEventMeta>[];
};

@Component({
  selector: 'app-meetings',
  imports: [
    CommonModule,
    RouterLink,
    ModalForm,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarNextViewDirective,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CalendarDatePipe,
  ],
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  templateUrl: './meetings.html',
})
export class Meetings implements OnInit {
  private hubsme = inject(HubsmeService);
  private meetingService = inject(MeetingService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  readonly CalendarView = CalendarView;
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  currentUserName = computed(() => {
    try {
      const user = this.hubsme.currentUser();
      return user?.name || 'Usuario Hubsme';
    } catch {
      return 'Usuario Hubsme';
    }
  });

  meetings = signal<Meeting[]>([]);
  view = signal<CalendarView>(CalendarView.Month);
  viewDate = signal(new Date());
  loading = signal(false);
  creating = signal(false);
  showCreate = signal(false);
  paymentMeeting = signal<Meeting | null>(null);
  calendarMeeting = signal<Meeting | null>(null);
  expandedMonthDay = signal<MonthDaySelection | null>(null);
  readonly monthEventLimit = 2;
  private calendarLoadSequence = 0;
  private readonly calendarPageLimit = 50;

  form = signal<MeetingForm>({
    pymeId: 0,
    consultantId: 0,
    title: 'Sesion de consultoria',
    startTime: this.defaultDateTime(),
    durationMinutes: 60,
    description: '',
  });

  // Finalization signals
  finalizingId = signal<number | null>(null);
  finalDescription = signal('');
  finalTasks = signal<FinalizeTask[]>([]);
  
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };
  viewingActaId = signal<number | null>(null);
  selectedMeeting = signal<Meeting | null>(null);
  calendarEvents = computed<CalendarEvent<MeetingEventMeta>[]>(() =>
    this.meetings()
      .filter((meeting) => ['confirmada', 'pago_pendiente', 'por_confirmar'].includes(meeting.status))
      .map((meeting) => ({
        id: meeting.id,
        start: this.meetingDisplayStart(meeting),
        end: this.meetingEnd(meeting),
        title: `${this.calendarEventTime(this.meetingDisplayStart(meeting))} · ${this.consultantDisplayName(meeting)}`,
        color: this.meetingColor(meeting),
        meta: { meetingId: meeting.id },
      })),
  );

  ngOnInit() {
    const user = this.hubsme.currentUser();
    this.form.update((current) => ({
      ...current,
      pymeId: user.role === 'pyme' ? user.id : current.pymeId,
      consultantId: user.role === 'consultor' ? user.id : current.consultantId,
    }));
    this.load();
  }

  load() {
    void this.loadCalendarMeetings();
  }

  changeViewDate(date: Date) {
    this.viewDate.set(date);
    this.load();
  }

  updateForm<K extends keyof MeetingForm>(key: K, value: MeetingForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  setView(view: CalendarView) {
    const nextView = view === CalendarView.Day ? CalendarView.Week : view;
    if (this.view() === nextView) return;
    this.view.set(nextView);
    this.load();
  }

  openCalendarMeeting(event: CalendarEvent<MeetingEventMeta>) {
    const meetingId = event.meta?.meetingId;
    if (!meetingId) return;
    const meeting = this.meetings().find((item) => item.id === meetingId);
    if (meeting) this.calendarMeeting.set(meeting);
  }

  closeCalendarMeeting() {
    this.calendarMeeting.set(null);
  }

  openMonthDay(
    date: Date,
    events: CalendarEvent<MeetingEventMeta>[],
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

  openExpandedMonthEvent(event: CalendarEvent<MeetingEventMeta>) {
    this.closeMonthDay();
    this.openCalendarMeeting(event);
  }

  monthDayLabel(date: Date) {
    return date.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
    });
  }

  joinMeeting(meeting: Meeting) {
    if (!this.canJoin(meeting)) return;
    this.router.navigate([`/${buildPath(PATH.meetingAccess)}`, meeting.id]);
  }

  create() {
    const data = this.form();
    if (!data.pymeId || !data.consultantId || !data.title || !data.startTime) {
      this.toastService.error('Selecciona un consultor y completa titulo y fecha');
      return;
    }

    this.creating.set(true);
    this.hubsme
      .createMeeting({
        pymeId: Number(data.pymeId),
        consultantId: Number(data.consultantId),
        title: data.title,
        startTime: new Date(data.startTime).toISOString(),
        durationMinutes: Number(data.durationMinutes) || 60,
        description: data.description || undefined,
        requestedBy: 'pyme',
      })
      .then(() => {
        this.toastService.success('Solicitud de reunion enviada');
        this.showCreate.set(false);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creating.set(false));
  }

  updatingId = signal<number | null>(null);

  updateMeetingStatus(
    id: number,
    status: Meeting['status'],
  ) {
    this.updatingId.set(id);
    const request = status === 'confirmada'
      ? this.hubsme.confirmMeeting(id)
      : this.hubsme.updateMeeting(id, { status });

    request
      .then(() => {
        this.toastService.success(
          status === 'confirmada' ? 'Reunion aprobada' : 'Reunion cancelada',
        );
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.updatingId.set(null));
  }

  openPaymentModal(meeting: Meeting) {
    this.paymentMeeting.set(meeting);
  }

  closePaymentModal() {
    this.paymentMeeting.set(null);
  }

  payMeeting() {
    const meeting = this.paymentMeeting();
    if (!meeting) return;

    this.updatingId.set(meeting.id);
    this.hubsme
      .confirmMeeting(meeting.id)
      .then(() => {
        this.toastService.success('Pago registrado y reunion confirmada');
        this.paymentMeeting.set(null);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.updatingId.set(null));
  }

  startFinalize(id: number) {
    const meeting = this.meetings().find((m) => m.id === id);
    if (!meeting) return;
    this.finalizingId.set(id);
    this.finalDescription.set('');
    this.finalTasks.set([]);
  }

  addTask() {
    this.finalTasks.update((current) => [
      ...current,
      {
        title: '',
        description: '',
        assignedTo: 'pyme',
        priority: 'media',
        dueDate: new Date().toISOString().split('T')[0],
      },
    ]);
  }

  removeTask(index: number) {
    this.finalTasks.update((current) => current.filter((_, i) => i !== index));
  }

  updateTask<K extends keyof FinalizeTask>(index: number, key: K, value: FinalizeTask[K]) {
    this.finalTasks.update((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  }

  finalize() {
    const id = this.finalizingId();
    const description = this.finalDescription();
    const tasks = this.finalTasks();

    if (!id || !description.trim()) {
      this.toastService.error('El acta no puede estar vacia');
      return;
    }

    this.hubsme
      .finalizeMeeting(id, {
        description,
        tasks: tasks
          .filter((task) => task.assignedTo === 'pyme')
          .map((t) => ({
            ...t,
            assignedTo: 'pyme' as const,
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : undefined,
          })),
      })
      .then(() => {
        this.toastService.success('Reunion finalizada y acta generada');
        this.finalizingId.set(null);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  viewActa(meeting: Meeting) {
    this.selectedMeeting.set(meeting);
    this.viewingActaId.set(meeting.id);
  }

  closeActa() {
    this.viewingActaId.set(null);
    this.selectedMeeting.set(null);
  }

  private defaultDateTime(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  }


  month(startTime: string) {
    return new Date(startTime).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  day(startTime: string) {
    return new Date(startTime).toLocaleDateString('en-US', { day: '2-digit' });
  }

  time(startTime: string) {
    return new Date(startTime).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  statusLabel(status: Meeting['status']) {
    const labels: Record<Meeting['status'], string> = {
      solicitada: 'Solicitada',
      pago_pendiente: 'Pago pendiente',
      por_confirmar: 'Por confirmación',
      confirmada: 'Confirmada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: Meeting['status']) {
    if (status === 'solicitada') return 'bg-warning/10 text-warning';
    if (status === 'pago_pendiente') return 'bg-secondary/10 text-secondary';
    if (status === 'por_confirmar') return 'bg-warning/10 text-warning';
    if (status === 'cancelada') return 'bg-danger/10 text-danger';
    if (status === 'finalizada') return 'bg-text/5 text-text';
    return 'bg-success/10 text-success';
  }

  meetingColor(meeting: Meeting) {
    if (meeting.status === 'confirmada') return { primary: '#0e9f6e', secondary: 'rgba(14,159,110,0.16)' };
    if (meeting.status === 'por_confirmar') return { primary: '#f59e0b', secondary: 'rgba(245,158,11,0.16)' };
    return { primary: '#2563eb', secondary: 'rgba(37,99,235,0.16)' };
  }

  canApprove(meeting: Meeting) {
    return meeting.status === 'solicitada' && meeting.requestedBy === 'consultor';
  }

  isWaitingApproval(meeting: Meeting) {
    return meeting.status === 'solicitada' && meeting.requestedBy === 'pyme';
  }

  canPay(meeting: Meeting) {
    return meeting.status === 'pago_pendiente';
  }

  canJoin(meeting: Meeting) {
    return meeting.status === 'confirmada' && meeting.hasMeetingLink && !meeting.description;
  }

  meetingEnd(meeting: Meeting) {
    const end = this.meetingDisplayStart(meeting);
    end.setMinutes(end.getMinutes() + meeting.durationMinutes);
    return end;
  }

  meetingDisplayStart(meeting: Meeting) {
    return new Date(meeting.startTime ?? meeting.proposedStartTimes?.[0] ?? meeting.createdAt);
  }

  proposedTimes(meeting: Meeting) {
    return (meeting.proposedStartTimes?.length ? meeting.proposedStartTimes : [meeting.startTime]).filter(
      (value): value is string => Boolean(value),
    );
  }

  consultantPhoto(meeting: Meeting) {
    return meeting.consultantPhotoUrl;
  }

  consultantDisplayName(meeting: Meeting) {
    return meeting.consultantName || 'Consultor asignado';
  }

  pricePerHour(meeting: Meeting) {
    return Number(meeting.consultantPricePerHour);
  }

  meetingTotal(meeting: Meeting) {
    return this.pricePerHour(meeting) * (meeting.durationMinutes / 60);
  }

  currency(value: number) {
    return value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private calendarEventTime(value: Date) {
    return value.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  private async loadCalendarMeetings() {
    const loadSequence = ++this.calendarLoadSequence;
    const { startDate, endDate } = this.visibleCalendarRange();
    const loadedMeetings: Meeting[] = [];
    let page = 1;

    this.meetings.set([]);
    this.loading.set(true);

    try {
      while (true) {
        const response = await this.meetingService.calendar({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          page,
          limit: this.calendarPageLimit,
        });

        if (loadSequence !== this.calendarLoadSequence) return;

        loadedMeetings.push(...response.data);
        this.meetings.set([...loadedMeetings]);
        this.loading.set(false);

        if (!response.meta.hasNextPage) break;
        page += 1;
      }
    } catch (error) {
      if (loadSequence === this.calendarLoadSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (loadSequence === this.calendarLoadSequence) {
        this.loading.set(false);
      }
    }
  }

  private visibleCalendarRange() {
    const viewDate = this.viewDate();

    if (this.view() === CalendarView.Week) {
      const startDate = this.startOfWeek(viewDate);
      return { startDate, endDate: this.addDays(startDate, 7) };
    }

    const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startDate = this.startOfWeek(monthStart);
    const nextMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    const daysUntilNextWeek = (7 - nextMonth.getDay()) % 7;
    const endDate = this.addDays(nextMonth, daysUntilNextWeek);

    return { startDate, endDate };
  }

  private startOfWeek(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }

  private addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }
}
