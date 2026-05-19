import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { QuillModule } from 'ngx-quill';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import {
  ConsultantInputSearch,
  ConsultantInputSearchFilters,
} from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';

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

type Match = ApiResponse<'pyme', 'consultantContacts'>['data'][number];

@Component({
  selector: 'app-pyme-meetings',
  imports: [CommonModule, FormsModule, RouterLink, ModalForm, ConsultantInputSearch, QuillModule],
  templateUrl: './pyme-meetings.html',
})
export class PymeMeetings implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  readonly consultantFilters = {
    source: 'matches',
    status: 'aceptado',
  } satisfies ConsultantInputSearchFilters;
  meetings = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  acceptedMatches = signal<Match[]>([]);
  loading = signal(false);
  creating = signal(false);
  showCreate = signal(false);

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
          consultantId: matches.some((match) => match.consultantId === current.consultantId)
            ? current.consultantId
            : (matches[0]?.consultantId ?? 0),
        }));
      });
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listMeetings()
      .then((res) => this.meetings.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  updateForm<K extends keyof MeetingForm>(key: K, value: MeetingForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  create() {
    const data = this.form();
    if (!data.pymeId || !data.consultantId || !data.title || !data.startTime) {
      this.toastService.error('Selecciona un consultor contactado y completa titulo y fecha');
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
        status: 'solicitada',
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

  updateMeetingStatus(
    id: number,
    status: ApiResponse<'meeting', 'findAll'>['data'][number]['status'],
  ) {
    this.hubsme
      .updateMeeting(id, { status })
      .then(() => {
        this.toastService.success(
          status === 'confirmada' ? 'Reunion aprobada' : 'Reunion cancelada',
        );
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
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

  updateTask<K extends keyof FinalizeTask>(index: number, key: K, value: any) {
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
        tasks: tasks.map((t) => ({
          ...t,
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
    date.setDate(date.getDate() + 1);
    date.setMinutes(0, 0, 0);
    return date.toISOString().slice(0, 16);
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

  statusClass(status: string) {
    if (status === 'solicitada') return 'bg-warning/10 text-warning';
    if (status === 'cancelada') return 'bg-danger/10 text-danger';
    if (status === 'finalizada') return 'bg-text/5 text-text';
    return 'bg-success/10 text-success';
  }

  canApprove(meeting: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return meeting.status === 'solicitada' && meeting.requestedBy === 'consultor';
  }

  isWaitingApproval(meeting: ApiResponse<'meeting', 'findAll'>['data'][number]) {
    return meeting.status === 'solicitada' && meeting.requestedBy === 'pyme';
  }
}
