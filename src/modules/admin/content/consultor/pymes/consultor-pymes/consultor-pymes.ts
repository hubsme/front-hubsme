import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type Match = ApiResponse<'pymeConsultantMatch', 'pymeconsultantmatchFindAll'>['data'][number];
type MatchFilter = 'solicitudes' | 'activos';

@Component({
  selector: 'app-consultor-pymes',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultor-pymes.html',
})
export class ConsultorPymes implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  matches = signal<Match[]>([]);
  search = signal('');
  activeFilter = signal<MatchFilter>('solicitudes');
  loading = signal(false);
  updatingId = signal<number | null>(null);

  pendingMatches = computed(() => this.filterMatches('pendiente'));
  acceptedMatches = computed(() => this.filterMatches('aceptado'));

  visibleMatches = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.activeFilter() === 'solicitudes' ? 'pendiente' : 'aceptado';
    const matches = this.filterMatches(status);
    if (!query) return matches;
    return matches.filter((match) => this.clientName(match).toLowerCase().includes(query));
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listMatches(1, 100)
      .then((res) => this.matches.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  updateMatch(match: Match, status: Match['status']) {
    this.updatingId.set(match.id);
    this.hubsme
      .updateMatch(match.id, status)
      .then(() => {
        this.toastService.success(status === 'aceptado' ? 'Match aceptado' : 'Match rechazado');
        this.load();
        if (status === 'aceptado') this.activeFilter.set('activos');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.updatingId.set(null));
  }

  clientName(match: Match) {
    return match.pymeName ?? 'PYME';
  }

  initials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  statusLabel(status: Match['status']) {
    const labels: Record<Match['status'], string> = {
      pendiente: 'Pendiente',
      aceptado: 'Activo',
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

  lastActivity(match: Match) {
    const date = new Date(match.updatedAt || match.createdAt);
    return match.status === 'pendiente'
      ? `Solicitud recibida el ${date.toLocaleDateString('es-PE')}`
      : `Contactaste desde el ${date.toLocaleDateString('es-PE')}`;
  }

  private filterMatches(status: Match['status']) {
    return this.matches().filter((match) => match.status === status);
  }
}
