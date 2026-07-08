import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ConsultantInputSearch } from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import { PymeInputSearch } from '@module/admin/components/input-search/pyme-input-search/pyme-input-search';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import {
  ApiResponse,
  ConsultantListItemDto,
  MeetingResultDto,
  PaginationMetaDto,
  PymeListItemDto,
} from 'api/backend.api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

type MeetingStatus = NonNullable<ApiResponse<'meetingAdmin', 'meetingadminFindAll'>['data'][number]['status']>;

@Component({
  selector: 'app-reuniones',
  imports: [
    DatePipe,
    FormsModule,
    ConsultantInputSearch,
    ModalForm,
    PaginationComponent,
    PymeInputSearch,
  ],
  templateUrl: './reuniones.html',
})
export class Reuniones {
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);

  readonly meetings = signal<MeetingResultDto[]>([]);
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly showDetailModal = signal(false);
  readonly selectedMeeting = signal<MeetingResultDto | null>(null);
  readonly search = signal('');
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly selectedPyme = signal<PymeListItemDto | null>(null);
  readonly selectedConsultant = signal<ConsultantListItemDto | null>(null);
  readonly status = signal<MeetingStatus | ''>('');
  readonly pymeOptions = signal<PymeListItemDto[]>([]);
  readonly consultantOptions = signal<ConsultantListItemDto[]>([]);
  readonly totalMeetings = computed(() => this.meta()?.total ?? 0);
  readonly confirmedOnPage = computed(
    () => this.meetings().filter((meeting) => meeting.status === 'confirmada').length,
  );
  readonly finalizedOnPage = computed(
    () => this.meetings().filter((meeting) => meeting.status === 'finalizada').length,
  );
  private readonly searchTerms = new Subject<string>();
  private requestSequence = 0;

  constructor() {
    this.searchTerms
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.page.set(1);
        void this.loadMeetings();
      });
    void this.loadFilterOptions();
    void this.loadMeetings();
  }

  async loadMeetings() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const response = await this.adminApi.api.meetingAdmin.meetingadminFindAll({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
        pymeId: this.selectedPyme()?.id,
        consultantId: this.selectedConsultant()?.id,
        status: this.status() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.meetings.set(response.data.data);
      this.meta.set(response.data.meta);
    } catch {
      if (requestId === this.requestSequence) {
        this.toastService.error('No se pudieron cargar las reuniones.');
      }
    } finally {
      if (requestId === this.requestSequence) {
        this.loading.set(false);
      }
    }
  }

  onSearchChange(value: string) {
    this.search.set(value);
    this.searchTerms.next(value.trim());
  }

  onPymeSelected(pyme: PymeListItemDto | null) {
    this.selectedPyme.set(pyme);
    this.page.set(1);
    void this.loadMeetings();
  }

  onConsultantSelected(consultant: ConsultantListItemDto | null) {
    this.selectedConsultant.set(consultant);
    this.page.set(1);
    void this.loadMeetings();
  }

  onStatusChange(value: MeetingStatus | '') {
    this.status.set(value);
    this.page.set(1);
    void this.loadMeetings();
  }

  onStatusSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.onStatusChange(select.value as MeetingStatus | '');
  }

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadMeetings();
  }

  clearFilters() {
    this.search.set('');
    this.selectedPyme.set(null);
    this.selectedConsultant.set(null);
    this.status.set('');
    this.page.set(1);
    void this.loadMeetings();
  }

  pymeName(id: number) {
    return this.pymeOptions().find((pyme) => pyme.id === id)?.name ?? `PYME #${id}`;
  }

  consultantName(id: number) {
    return (
      this.consultantOptions().find((consultant) => consultant.id === id)?.fullName ??
      `Consultor #${id}`
    );
  }

  async openDetail(meeting: MeetingResultDto) {
    this.showDetailModal.set(true);
    this.selectedMeeting.set(null);
    this.detailLoading.set(true);
    try {
      const response = await this.adminApi.api.meetingAdmin.meetingadminFindOne({
        id: meeting.id,
      });
      this.selectedMeeting.set(response.data);
    } catch {
      this.showDetailModal.set(false);
      this.toastService.error('No se pudo cargar el detalle de la reunión.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedMeeting.set(null);
  }

  statusLabel(status: MeetingStatus) {
    const labels: Record<MeetingStatus, string> = {
      solicitada: 'Solicitada',
      pago_pendiente: 'Pago pendiente',
      confirmada: 'Confirmada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: MeetingStatus) {
    const classes: Record<MeetingStatus, string> = {
      solicitada: 'bg-info/10 text-info',
      pago_pendiente: 'bg-warning/10 text-warning',
      confirmada: 'bg-success/10 text-success',
      finalizada: 'bg-secondary/10 text-secondary',
      cancelada: 'bg-danger/10 text-danger',
    };
    return classes[status];
  }

  private async loadFilterOptions() {
    try {
      const [pymes, consultants] = await Promise.all([
        this.adminApi.api.pymeAdmin.pymeadminFindAll({ page: 1, limit: 100 }),
        this.adminApi.api.consultantAdmin.consultantadminFindAll({ page: 1, limit: 100 }),
      ]);
      this.pymeOptions.set(pymes.data.data);
      this.consultantOptions.set(consultants.data.data);
    } catch {
      this.toastService.error('No se pudieron cargar los filtros de reuniones.');
    }
  }
}
