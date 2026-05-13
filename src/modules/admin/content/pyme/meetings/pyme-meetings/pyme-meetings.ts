import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PymeInputSearch } from '@module/admin/components/input-search/pyme-input-search/pyme-input-search';
import { ConsultantInputSearch } from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';

type MeetingForm = {
  pymeId: number;
  consultantId: number;
  title: string;
  startTime: string;
  durationMinutes: number;
  meetingUrl: string;
};

@Component({
  selector: 'app-pyme-meetings',
  imports: [CommonModule, FormsModule, ModalForm, PymeInputSearch, ConsultantInputSearch],
  templateUrl: './pyme-meetings.html',
})
export class PymeMeetings implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  meetings = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  pymes = signal<ApiResponse<'pyme', 'findAll'>['data']>([]);
  consultants = signal<ApiResponse<'consultant', 'findAll'>['data']>([]);
  loading = signal(false);
  creating = signal(false);
  finalizingId = signal<number | null>(null);
  finalDescription = signal('');
  showCreate = signal(false);

  form = signal<MeetingForm>({
    pymeId: 0,
    consultantId: 0,
    title: 'Sesion de consultoria',
    startTime: this.defaultDateTime(),
    durationMinutes: 60,
    meetingUrl: '',
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
    Promise.all([this.hubsme.listPymes('', 1, 100), this.hubsme.listConsultants('', 1, 100, 'true')])
      .then(([pymesRes, consultantsRes]) => {
        const pymes = pymesRes.data.data;
        const consultants = consultantsRes.data.data;
        this.pymes.set(pymes);
        this.consultants.set(consultants);
        this.form.update((current) => ({
          ...current,
          pymeId: current.pymeId || pymes[0]?.userId || 0,
          consultantId: current.consultantId || consultants[0]?.userId || 0,
        }));
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
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
      this.toastService.error('Completa PYME, consultor, titulo y fecha');
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
        meetingUrl: data.meetingUrl || undefined,
        status: 'solicitada',
      })
      .then(() => {
        this.toastService.success('Solicitud de reunion enviada');
        this.showCreate.set(false);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creating.set(false));
  }

  startFinalize(id: number) {
    this.finalizingId.set(id);
    this.finalDescription.set('');
  }

  finalize() {
    const id = this.finalizingId();
    if (!id || !this.finalDescription()) {
      this.toastService.error('Describe lo tratado en la reunion');
      return;
    }

    this.hubsme
      .finalizeMeeting(id, this.finalDescription())
      .then((res) => {
        this.toastService.success(`Acta creada y ${res.data.tasks.length} tareas generadas`);
        this.finalizingId.set(null);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  updateMeetingStatus(id: number, status: ApiResponse<'meeting', 'findAll'>['data'][number]['status']) {
    this.hubsme
      .updateMeeting(id, { status })
      .then(() => {
        this.toastService.success(status === 'confirmada' ? 'Reunion aprobada' : 'Reunion cancelada');
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
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
}
