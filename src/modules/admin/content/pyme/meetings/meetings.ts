import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { ConsultantService } from '@service/admin/consultant.service';
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

type ConsultantOption = ApiResponse<'consultant', 'findAll'>['data'][number];
type Meeting = ApiResponse<'meeting', 'findAll'>['data'][number];
type ConsultantBilling = {
  photoUrl: string | null;
  pricePerHour: string;
};
type MeetingEventMeta = { meetingId: number };

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
  private toastService = inject(ToastService);
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

  meetings = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  view = signal<CalendarView>(CalendarView.Month);
  viewDate = signal(new Date());
  consultants = signal<ConsultantOption[]>([]);
  private consultantService = inject(ConsultantService);
  consultantBilling = signal<Record<number, ConsultantBilling>>({});
  loading = signal(false);
  creating = signal(false);
  showCreate = signal(false);
  paymentMeeting = signal<Meeting | null>(null);
  calendarMeeting = signal<Meeting | null>(null);

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
  selectedMeeting = signal<ApiResponse<'meeting', 'findAll'>['data'][number] | null>(null);
  calendarEvents = computed<CalendarEvent<MeetingEventMeta>[]>(() =>
    this.meetings()
      .filter((meeting) => meeting.status === 'confirmada' || meeting.status === 'pago_pendiente')
      .map((meeting) => ({
        start: new Date(meeting.startTime),
        end: this.meetingEnd(meeting),
        title: meeting.title,
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
    this.loadLookups();
    this.load();
  }

  loadLookups() {
    this.loadConsultants().catch((error) =>
      this.toastService.error(this.hubsme.getErrorMessage(error)),
    );
  }

  loadConsultants() {
    return this.hubsme
      .listConsultants('', 1, 100, 'true')
      .then((consultantsRes) => {
        const consultants = consultantsRes.data.data;
        this.consultants.set(consultants);
        this.form.update((current) => ({
          ...current,
          consultantId: consultants.some((consultant) => consultant.userId === current.consultantId)
            ? current.consultantId
            : (consultants[0]?.userId ?? 0),
        }));
      });
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listMeetings()
      .then((res) => {
        this.meetings.set(res.data.data);
        this.loadConsultantBilling(res.data.data);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private loadConsultantBilling(meetings: ApiResponse<'meeting', 'findAll'>['data']) {
    const uniqueIds = [...new Set(meetings.map((m) => m.consultantId))];
    uniqueIds.forEach((id) => {
      this.consultantService
        .findByUser(id)
        .then((consultant) => {
          this.consultantBilling.update((current) => ({
            ...current,
            [id]: {
              photoUrl: consultant.photoUrl,
              pricePerHour: consultant.pricePerHour,
            },
          }));
        })
        .catch(() => {
          this.consultantBilling.update((current) => ({
            ...current,
            [id]: { photoUrl: null, pricePerHour: '0.00' },
          }));
        });
    });
  }

  updateForm<K extends keyof MeetingForm>(key: K, value: MeetingForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  setView(view: CalendarView) {
    if (view === CalendarView.Day) {
      this.view.set(CalendarView.Week);
      return;
    }
    this.view.set(view);
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

  joinMeeting(meeting: Meeting) {
    if (!this.canJoin(meeting)) return;
    window.open(meeting.meetingUrl ?? '', '_blank', 'noopener,noreferrer');
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

  viewActa(meeting: ApiResponse<'meeting', 'findAll'>['data'][number]) {
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
      confirmada: 'Confirmada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: Meeting['status']) {
    if (status === 'solicitada') return 'bg-warning/10 text-warning';
    if (status === 'pago_pendiente') return 'bg-secondary/10 text-secondary';
    if (status === 'cancelada') return 'bg-danger/10 text-danger';
    if (status === 'finalizada') return 'bg-text/5 text-text';
    return 'bg-success/10 text-success';
  }

  meetingColor(meeting: Meeting) {
    if (meeting.status === 'confirmada') return { primary: '#0e9f6e', secondary: 'rgba(14,159,110,0.16)' };
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
    return meeting.status === 'confirmada' && Boolean(meeting.meetingUrl) && !meeting.description;
  }

  meetingEnd(meeting: Meeting) {
    const end = new Date(meeting.startTime);
    end.setMinutes(end.getMinutes() + meeting.durationMinutes);
    return end;
  }

  consultantPhoto(meeting: Meeting) {
    return this.consultantBilling()[meeting.consultantId]?.photoUrl ?? null;
  }

  pricePerHour(meeting: Meeting) {
    return Number(this.consultantBilling()[meeting.consultantId]?.pricePerHour ?? 0);
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
}
