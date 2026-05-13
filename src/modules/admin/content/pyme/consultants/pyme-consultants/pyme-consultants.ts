import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';

type Consultant = ApiResponse<'consultant', 'findAll'>['data'][number];
type Match = ApiResponse<'pymeConsultantMatch', 'pymeconsultantmatchFindAll'>['data'][number];
type ViewTab = 'disponibles' | 'matches';
type ScheduleForm = {
  title: string;
  startTime: string;
  durationMinutes: number;
  meetingUrl: string;
};

@Component({
  selector: 'app-pyme-consultants',
  imports: [CommonModule, FormsModule, ModalForm],
  templateUrl: './pyme-consultants.html',
})
export class PymeConsultants implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  user = this.hubsme.currentUser();
  consultants = signal<Consultant[]>([]);
  matches = signal<Match[]>([]);
  scheduleMatch = signal<Match | null>(null);
  search = signal('');
  activeTab = signal<ViewTab>('disponibles');
  loading = signal(false);
  matchLoadingId = signal<number | null>(null);
  creatingMeeting = signal(false);

  filteredConsultants = computed(() => {
    const search = this.search().trim().toLowerCase();
    if (!search) return this.consultants();
    return this.consultants().filter((consultant) => {
      const specialties = consultant.specialties.join(' ').toLowerCase();
      return consultant.name.toLowerCase().includes(search) || specialties.includes(search);
    });
  });

  scheduleForm = signal<ScheduleForm>({
    title: 'Sesion de consultoria',
    startTime: this.defaultDateTime(),
    durationMinutes: 60,
    meetingUrl: '',
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    const requests: Promise<unknown>[] = [
      this.hubsme.listMatches(1, 100).then((res) => {
        this.matches.set(res.data.data);
      }),
      this.hubsme.listConsultants('', 1, 100, 'true').then((res) => {
        this.consultants.set(res.data.data);
      }),
    ];

    Promise.all(requests)
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  requestMatch(consultant: Consultant) {
    this.matchLoadingId.set(consultant.userId);
    this.hubsme
      .createMatch(consultant.userId)
      .then(() => {
        this.toastService.success('Solicitud de match enviada');
        this.load();
        this.activeTab.set('matches');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.matchLoadingId.set(null));
  }

  openSchedule(match: Match) {
    if (match.status !== 'aceptado') {
      this.toastService.error('Solo se pueden solicitar reuniones con matches aceptados');
      return;
    }
    this.scheduleMatch.set(match);
    this.scheduleForm.set({
      title: 'Sesion de consultoria',
      startTime: this.defaultDateTime(),
      durationMinutes: 60,
      meetingUrl: '',
    });
  }

  createMeetingRequest() {
    const match = this.scheduleMatch();
    const form = this.scheduleForm();
    if (!match || !form.title.trim() || !form.startTime) {
      this.toastService.error('Completa titulo y fecha');
      return;
    }

    this.creatingMeeting.set(true);
    this.hubsme
      .createMeeting({
        pymeId: match.pymeId,
        consultantId: match.consultantId,
        title: form.title.trim(),
        startTime: new Date(form.startTime).toISOString(),
        durationMinutes: Number(form.durationMinutes) || 60,
        meetingUrl: form.meetingUrl.trim() || undefined,
        status: 'solicitada',
      })
      .then(() => {
        this.toastService.success('Solicitud de reunion enviada para aprobacion');
        this.scheduleMatch.set(null);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creatingMeeting.set(false));
  }

  updateScheduleForm<K extends keyof ScheduleForm>(key: K, value: ScheduleForm[K]) {
    this.scheduleForm.update((current) => ({ ...current, [key]: value }));
  }

  matchForConsultant(consultant: Consultant): Match | null {
    return this.matches().find((match) => match.consultantId === consultant.userId) ?? null;
  }

  partnerName(match: Match): string {
    return match.consultantName ?? 'Consultor';
  }

  initials(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  rating(consultant: Consultant) {
    return Number(consultant.rating || 4.8).toFixed(1);
  }

  statusLabel(status: Match['status']) {
    const labels: Record<Match['status'], string> = {
      pendiente: 'Pendiente',
      aceptado: 'Tu cliente',
      rechazado: 'Rechazado',
      finalizado: 'Finalizado',
    };
    return labels[status];
  }

  statusClass(status: Match['status']) {
    const classes: Record<Match['status'], string> = {
      pendiente: 'bg-warning/10 text-warning',
      aceptado: 'bg-success/10 text-success',
      rechazado: 'bg-danger/10 text-danger',
      finalizado: 'bg-text/5 text-muted',
    };
    return classes[status];
  }

  private defaultDateTime(): string {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setMinutes(0, 0, 0);
    return date.toISOString().slice(0, 16);
  }
}
