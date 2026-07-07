import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PaginationMetaDto, PymeListItemDto, PymeResultDto } from 'api/backend.api';

@Component({
  selector: 'app-backoffice-pymes',
  imports: [DatePipe, FormsModule, ModalForm, PaginationComponent],
  templateUrl: './pymes.html',
})
export class Pymes {
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);

  readonly pymes = signal<PymeListItemDto[]>([]);
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly showDetailModal = signal(false);
  readonly selectedPyme = signal<PymeResultDto | null>(null);
  readonly search = signal('');
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly totalPymes = computed(() => this.meta()?.total ?? 0);
  private readonly searchTerms = new Subject<string>();
  private requestSequence = 0;

  constructor() {
    this.searchTerms
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.page.set(1);
        void this.loadPymes();
      });
    void this.loadPymes();
  }

  async loadPymes() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const response = await this.adminApi.api.pymeAdmin.pymeadminFindAll({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.pymes.set(response.data.data);
      this.meta.set(response.data.meta);
    } catch {
      if (requestId === this.requestSequence) {
        this.toastService.error('No se pudieron cargar las PYMES.');
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
    void this.loadPymes();
  }

  async openDetail(pyme: PymeListItemDto) {
    this.showDetailModal.set(true);
    this.selectedPyme.set(null);
    this.detailLoading.set(true);
    try {
      const response = await this.adminApi.api.pymeAdmin.pymeadminFindOne({
        id: pyme.id,
      });
      this.selectedPyme.set(response.data);
    } catch {
      this.showDetailModal.set(false);
      this.toastService.error('No se pudo cargar el detalle de la PYME.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedPyme.set(null);
  }
}
