import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type Consultant = ApiResponse<'consultant', 'findAll'>['data'][number];
type Match = ApiResponse<'pyme', 'consultantContacts'>['data'][number];
type ViewTab = 'explorar' | 'matches';
type ScheduleForm = {
  title: string;
  startTime: string;
  durationMinutes: number;
  description: string;
};

@Component({
  selector: 'app-pyme-consultants',
  imports: [CommonModule, FormsModule, ModalForm],
  templateUrl: './pyme-consultants.html',
})
export class PymeConsultants implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private searchTerms = new Subject<string>();
  private consultantRequestId = 0;

  user = this.hubsme.currentUser();
  consultants = signal<Consultant[]>([]);
  matches = signal<Match[]>([]);
  scheduleMatch = signal<Match | null>(null);
  videoConsultant = signal<Consultant | null>(null);
  profileConsultant = signal<Consultant | null>(null);
  search = signal('');
  activeTab = signal<ViewTab>('matches');
  loading = signal(false);
  searching = signal(false);
  matchLoadingId = signal<number | null>(null);
  creatingMeeting = signal(false);

  scheduleForm = signal<ScheduleForm>({
    title: 'Sesion de consultoria',
    startTime: this.defaultDateTime(),
    durationMinutes: 60,
    description: '',
  });

  constructor() {
    this.searchTerms
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.loadConsultants(term, true));
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    const requests: Promise<unknown>[] = [
      this.hubsme.listMatches(1, 100).then((res) => {
        this.matches.set(res.data.data);
      }),
      this.loadConsultants(this.search(), false),
    ];

    Promise.all(requests)
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  updateSearch(value: string) {
    this.search.set(value);
    this.searchTerms.next(value.trim());
  }

  requestMatch(consultant: Consultant) {
    this.matchLoadingId.set(consultant.userId);
    this.hubsme
      .createMatch(consultant.userId)
      .then(() => {
        this.toastService.success('Solicitud de match enviada');
        this.load();
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
      description: '',
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
        description: form.description.trim() || undefined,
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

  matchConsultantPhoto(match: Match): string {
    return (
      match.consultantPhotoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(this.partnerName(match))}`
    );
  }

  matchRating(match: Match) {
    return Number(match.consultantRating || 0).toFixed(1);
  }

  consultantPhoto(consultant: Consultant): string {
    return (
      consultant.photoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.name)}`
    );
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
    return Number(consultant.rating || 0).toFixed(1);
  }

  private loadConsultants(search: string, showSearching: boolean): Promise<void> {
    const requestId = ++this.consultantRequestId;
    if (showSearching) this.searching.set(true);

    return this.hubsme
      .listConsultants(search.trim(), 1, 100, 'true')
      .then((res) => {
        if (requestId !== this.consultantRequestId) return;
        this.consultants.set(res.data.data);
      })
      .catch((error) => {
        if (requestId !== this.consultantRequestId) return;
        this.consultants.set([]);
        this.toastService.error(this.hubsme.getErrorMessage(error));
      })
      .finally(() => {
        if (showSearching && requestId === this.consultantRequestId) this.searching.set(false);
      });
  }

  statusLabel(status: Match['status']) {
    const labels: Record<Match['status'], string> = {
      pendiente: 'Pendiente',
      aceptado: 'Contactado',
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
