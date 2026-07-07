import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ConsultantListItemDto, ConsultantResultDto, PaginationMetaDto } from 'api/backend.api';

@Component({
  selector: 'app-consultores',
  imports: [DatePipe, FormsModule, ModalForm, PaginationComponent],
  templateUrl: './consultores.html',
})
export class Consultores {
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);

  readonly consultants = signal<ConsultantListItemDto[]>([]);
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly showDetailModal = signal(false);
  readonly selectedConsultant = signal<ConsultantResultDto | null>(null);
  readonly search = signal('');
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly totalConsultants = computed(() => this.meta()?.total ?? 0);
  readonly activeConsultants = computed(
    () => this.consultants().filter((consultant) => consultant.active === 'true').length,
  );
  private readonly searchTerms = new Subject<string>();
  private requestSequence = 0;

  constructor() {
    this.searchTerms
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.page.set(1);
        void this.loadConsultants();
      });
    void this.loadConsultants();
  }

  async loadConsultants() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const response = await this.adminApi.api.consultantAdmin.consultantadminFindAll({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.consultants.set(response.data.data);
      this.meta.set(response.data.meta);
    } catch {
      if (requestId === this.requestSequence) {
        this.toastService.error('No se pudieron cargar los consultores.');
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

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadConsultants();
  }

  async openDetail(consultant: ConsultantListItemDto) {
    this.showDetailModal.set(true);
    this.selectedConsultant.set(null);
    this.detailLoading.set(true);
    try {
      const response = await this.adminApi.api.consultantAdmin.consultantadminFindOne({
        id: consultant.id,
      });
      this.selectedConsultant.set(response.data);
    } catch {
      this.showDetailModal.set(false);
      this.toastService.error('No se pudo cargar el detalle del consultor.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedConsultant.set(null);
  }
}
