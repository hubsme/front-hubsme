import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationMetaDto, ApiResponse } from 'api/backend.api';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { MeetingService } from '@service/admin/meeting.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { formatInPeru, monthKeyInPeru, parseApiDate, peruMonthRange } from '@function/date.function';

type Meeting = ApiResponse<'meeting', 'calendar'>['data'][number];
type MeetingListRole = 'pyme' | 'consultor';
type MeetingListStatus =
  | 'all'
  | 'solicitada'
  | 'pendiente'
  | 'confirmada'
  | 'finalizada'
  | 'cancelada';
type MeetingApiStatus = Exclude<MeetingListStatus, 'all'>;

type StatusFilter = {
  value: MeetingListStatus;
  label: string;
};

@Component({
  selector: 'app-meeting-list',
  imports: [CommonModule, PaginationComponent, RouterLink],
  templateUrl: './meeting-list.html',
})
export class MeetingList implements OnInit {
  private readonly meetingService = inject(MeetingService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private loadSequence = 0;

  readonly role = input.required<MeetingListRole>();
  readonly pageSize = 10;
  readonly statusFilters: StatusFilter[] = [
    { value: 'all', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'finalizada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
    { value: 'solicitada', label: 'Solicitadas' },
  ];

  readonly meetings = signal<Meeting[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly loading = signal(false);
  readonly status = signal<MeetingListStatus>('all');
  readonly month = signal(this.currentMonth());
  readonly page = signal(1);
  readonly counterpartHeading = computed(() => (this.role() === 'pyme' ? 'Consultor' : 'PYME'));
  readonly detailBasePath = computed(() =>
    this.role() === 'pyme'
      ? buildPath(PATH.admin.pyme.meetings)
      : buildPath(PATH.admin.consultor.meetings),
  );

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params.get('view') !== 'list') return;

      const month = this.validMonth(params.get('month')) ?? this.currentMonth();
      const status = this.validStatus(params.get('status'));
      const page = this.validPage(params.get('page'));

      this.month.set(month);
      this.status.set(status);
      this.page.set(page);

      if (!params.get('month')) {
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { view: 'list', month, page },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
        return;
      }

      void this.loadMeetings();
    });
  }

  selectStatus(status: MeetingListStatus): void {
    if (status === this.status()) return;
    void this.updateQuery({ status: status === 'all' ? null : status, page: 1 });
  }

  changeStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectStatus(this.validStatus(value));
  }

  changeMonth(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!this.validMonth(value)) return;
    void this.updateQuery({ month: value, page: 1 });
  }

  changePage(page: number): void {
    if (page === this.page()) return;
    void this.updateQuery({ page });
  }

  counterpartName(meeting: Meeting): string {
    return this.role() === 'pyme' ? meeting.consultantName : meeting.pymeName;
  }

  agendaDate(meeting: Meeting): string {
    return this.formatDate(this.parseApiDate(meeting.createdAt));
  }

  agendaTime(meeting: Meeting): string {
    return this.formatTime(this.parseApiDate(meeting.createdAt));
  }

  meetingDate(meeting: Meeting): string {
    const start = this.meetingStart(meeting);
    return start ? this.formatDate(start) : 'Por definir';
  }

  meetingTime(meeting: Meeting): string {
    const start = this.meetingStart(meeting);
    if (!start) return 'Sin horario';
    const value = this.formatTime(start);
    const proposedCount =
      meeting.status === 'por_confirmar' ? meeting.proposedStartTimes.length : 0;
    return proposedCount > 1 ? `${value} · ${proposedCount} opciones` : value;
  }

  statusLabel(status: Meeting['status']): string {
    const labels: Record<Meeting['status'], string> = {
      solicitada: 'Solicitada',
      por_confirmar: 'Por confirmar',
      confirmada: 'Confirmada',
      finalizada: 'Completada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: Meeting['status']): string {
    const classes: Record<Meeting['status'], string> = {
      solicitada: 'bg-warning/10 text-warning',
      por_confirmar: 'bg-warning/10 text-warning',
      confirmada: 'bg-success/10 text-success',
      finalizada: 'bg-secondary/10 text-secondary',
      cancelada: 'bg-danger/10 text-danger',
    };
    return classes[status];
  }

  descriptionPreview(value: string | null): string {
    const plainText = (value ?? '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/[#*_`~>-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!plainText) return 'Sin descripción registrada.';
    return plainText.length > 110 ? `${plainText.slice(0, 110).trimEnd()}…` : plainText;
  }

  private async loadMeetings(): Promise<void> {
    const sequence = ++this.loadSequence;
    const range = this.monthRange(this.month());
    const status = this.status() === 'all' ? undefined : (this.status() as MeetingApiStatus);
    this.loading.set(true);

    try {
      const response = await this.meetingService.calendar({
        startDate: range.start.toISOString(),
        endDate: range.end.toISOString(),
        status,
        page: this.page(),
        limit: this.pageSize,
      });
      if (sequence !== this.loadSequence) return;
      this.meetings.set(response.data);
      this.meta.set(response.meta);
    } catch (error) {
      if (sequence === this.loadSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (sequence === this.loadSequence) this.loading.set(false);
    }
  }

  private updateQuery(queryParams: Record<string, string | number | null>): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...queryParams, view: 'list' },
      queryParamsHandling: 'merge',
    });
  }

  private meetingStart(meeting: Meeting): Date | null {
    const start = meeting.startTime ?? meeting.proposedStartTimes[0];
    return start ? this.parseApiDate(start) : null;
  }

  private formatDate(value: Date): string {
    return formatInPeru(value, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private formatTime(value: Date): string {
    return formatInPeru(value, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  private parseApiDate(value: string): Date {
    return parseApiDate(value);
  }

  private monthRange(value: string): { start: Date; end: Date } {
    return peruMonthRange(value);
  }

  private validStatus(value: string | null): MeetingListStatus {
    return this.statusFilters.some((filter) => filter.value === value)
      ? (value as MeetingListStatus)
      : 'all';
  }

  private validMonth(value: string | null): string | null {
    if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return null;
    return value;
  }

  private validPage(value: string | null): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private currentMonth(): string {
    return monthKeyInPeru();
  }
}
