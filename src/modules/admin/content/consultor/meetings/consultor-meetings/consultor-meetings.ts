import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { QuillModule } from 'ngx-quill';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PymeService } from '@service/admin/pyme.service';
import {
  PymeInputSearch,
  PymeInputSearchFilters,
} from '@module/admin/components/input-search/pyme-input-search/pyme-input-search';

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

type Match = ApiResponse<'consultant', 'pymeContacts'>['data'][number];
type Meeting = ApiResponse<'meeting', 'findAll'>['data'][number];

@Component({
  selector: 'app-consultor-meetings',
  imports: [CommonModule, FormsModule, RouterLink, ModalForm, PymeInputSearch, QuillModule],
  templateUrl: './consultor-meetings.html',
})
export class ConsultorMeetings implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  readonly pymeFilters = {
    source: 'matches',
    status: 'aceptado',
  } satisfies PymeInputSearchFilters;
  meetings = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  acceptedMatches = signal<Match[]>([]);
  private pymeService = inject(PymeService);
  pymeLogos = signal<Record<number, string | null>>({});
  loading = signal(false);
  creating = signal(false);
  showCreate = signal(false);
  finalizingId = signal<number | null>(null);
  finalDescription = signal('');
  finalTasks = signal<FinalizeTask[]>([]);

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
  };

  form = signal<MeetingForm>({
    pymeId: 0,
    consultantId: 0,
    title: 'Sesion de consultoria',
    startTime: this.defaultDateTime(),
    durationMinutes: 60,
    description: '',
  });

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
    this.loadAcceptedMatches().catch((error) =>
      this.toastService.error(this.hubsme.getErrorMessage(error)),
    );
  }

  loadAcceptedMatches() {
    return this.hubsme
      .listMatches(1, 100, 'aceptado')
      .then((matchesRes) => {
        const matches = matchesRes.data.data;
        this.acceptedMatches.set(matches);
        this.form.update((current) => ({
          ...current,
          pymeId: matches.some((match) => match.pymeId === current.pymeId)
            ? current.pymeId
            : (matches[0]?.pymeId ?? 0),
        }));
      });
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listMeetings()
      .then((res) => {
        this.meetings.set(res.data.data);
        this.loadPymeLogos(res.data.data);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private loadPymeLogos(meetings: ApiResponse<'meeting', 'findAll'>['data']) {
    const uniqueIds = [...new Set(meetings.map((m) => m.pymeId))];
    uniqueIds.forEach((id) => {
      this.pymeService
        .findByUser(id)
        .then((pyme) => {
          this.pymeLogos.update((current) => ({ ...current, [id]: pyme.logoUrl }));
        })
        .catch(() => {
          this.pymeLogos.update((current) => ({ ...current, [id]: null }));
        });
    });
  }

  updateForm<K extends keyof MeetingForm>(key: K, value: MeetingForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  create() {
    const data = this.form();
    if (!data.pymeId || !data.consultantId || !data.title || !data.startTime) {
      this.toastService.error('Selecciona una PYME contactada y completa titulo y fecha');
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
        requestedBy: 'consultor',
      })
      .then(() => {
        this.toastService.success('Solicitud de reunion enviada');
        this.showCreate.set(false);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creating.set(false));
  }

  startFinalize(meeting: Meeting) {
    this.finalizingId.set(meeting.id);
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
      .then((res) => {
        this.toastService.success(`Acta creada y ${res.data.tasks.length} compromisos de la PYME generados`);
        this.finalizingId.set(null);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  finalizeDirect(id: number) {
    this.updatingId.set(id);
    this.hubsme
      .finalizeMeeting(id, {
        description: '.',
        tasks: [],
      })
      .then(() => {
        this.toastService.success('Reunión finalizada');
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.updatingId.set(null));
  }

  updatingId = signal<number | null>(null);

  updateMeetingStatus(
    id: number,
    status: ApiResponse<'meeting', 'findAll'>['data'][number]['status'],
  ) {
    this.updatingId.set(id);
    const request = status === 'confirmada'
      ? this.hubsme.confirmMeeting(id)
      : this.hubsme.updateMeeting(id, { status });

    request
      .then(() => {
        this.toastService.success(
          status === 'pago_pendiente' ? 'Solicitud aceptada, esperando pago' : 'Reunion cancelada',
        );
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.updatingId.set(null));
  }

  private defaultDateTime(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  }




  day(meeting: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return new Date(meeting.startTime).toLocaleDateString('es-PE', { day: '2-digit' });
  }

  month(meeting: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return new Date(meeting.startTime)
      .toLocaleDateString('es-PE', { month: 'short' })
      .replace('.', '')
      .toUpperCase();
  }

  hour(meeting: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return new Date(meeting.startTime).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  statusClass(status: ApiResponse<'meeting', 'findAll'>['data'][number]['status']) {
    if (status === 'finalizada') return 'bg-slate-100 text-slate-700';
    if (status === 'cancelada') return 'bg-danger/10 text-danger';
    if (status === 'solicitada') return 'bg-warning/10 text-warning';
    if (status === 'pago_pendiente') return 'bg-secondary/10 text-secondary';
    return 'bg-success/10 text-success';
  }

  statusLabel(status: ApiResponse<'meeting', 'findAll'>['data'][number]['status']) {
    const labels: Record<ApiResponse<'meeting', 'findAll'>['data'][number]['status'], string> = {
      solicitada: 'Solicitada',
      pago_pendiente: 'Pago pendiente',
      confirmada: 'Confirmada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  canApprove(meeting: Meeting) {
    return meeting.status === 'solicitada' && meeting.requestedBy === 'pyme';
  }

  isWaitingApproval(meeting: Meeting) {
    return meeting.status === 'solicitada' && meeting.requestedBy === 'consultor';
  }

  isPendingPayment(meeting: Meeting) {
    return meeting.status === 'pago_pendiente';
  }
}
