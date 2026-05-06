import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type MeetingForm = {
  pymeId: number;
  consultantId: number;
  title: string;
  startTime: string;
  durationMinutes: number;
  meetingUrl: string;
};

@Component({
  selector: 'app-admin-meetings',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-meetings.html',
})
export class AdminMeetings implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  meetings = signal<ApiResponse<'meeting', 'findAll'>['data']>([]);
  loading = signal(false);
  creating = signal(false);
  finalizingId = signal<number | null>(null);
  finalDescription = signal('');

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
    this.load();
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
        status: 'confirmada',
      })
      .then(() => {
        this.toastService.success('Reunion creada');
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

  private defaultDateTime(): string {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setMinutes(0, 0, 0);
    return date.toISOString().slice(0, 16);
  }
}
