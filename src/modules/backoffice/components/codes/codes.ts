import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  PaginationMetaDto,
  PromotionCodeCreateDto,
  PromotionCodeDetailDto,
  PromotionCodeResultDto,
} from 'api/backend.api';

@Component({
  selector: 'app-codes',
  imports: [DatePipe, FormsModule, ModalForm, PaginationComponent],
  templateUrl: './codes.html',
})
export class Codes {
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);

  readonly codes = signal<PromotionCodeResultDto[]>([]);
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly saving = signal(false);
  readonly showCreateModal = signal(false);
  readonly showDetailModal = signal(false);
  readonly selectedCode = signal<PromotionCodeDetailDto | null>(null);
  readonly search = signal('');
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly code = signal('');
  readonly description = signal('');
  readonly maxRedemptions = signal(1);
  readonly startsAt = signal('');
  readonly expiresAt = signal('');
  readonly activeCount = computed(() => this.codes().filter((code) => code.isActive).length);
  readonly totalCodes = computed(() => this.meta()?.total ?? 0);
  readonly totalUses = computed(() =>
    this.codes().reduce((total, code) => total + code.redemptionCount, 0),
  );
  private readonly searchTerms = new Subject<string>();
  private requestSequence = 0;

  constructor() {
    this.searchTerms
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.page.set(1);
        void this.loadCodes();
      });
    void this.loadCodes();
  }

  async loadCodes() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const response = await this.adminApi.api.promotionCodeAdmin.promotioncodeadminFindAll({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.codes.set(response.data.data);
      this.meta.set(response.data.meta);
    } catch {
      if (requestId === this.requestSequence) {
        this.toastService.error('No se pudieron cargar los códigos.');
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
    void this.loadCodes();
  }

  openCreateModal() {
    this.code.set('');
    this.description.set('');
    this.maxRedemptions.set(1);
    this.startsAt.set('');
    this.expiresAt.set('');
    this.showCreateModal.set(true);
  }

  async openDetail(code: PromotionCodeResultDto) {
    this.showDetailModal.set(true);
    this.selectedCode.set(null);
    this.detailLoading.set(true);
    try {
      const response = await this.adminApi.api.promotionCodeAdmin.promotioncodeadminFindOne({
        id: code.id,
      });
      this.selectedCode.set(response.data);
    } catch {
      this.showDetailModal.set(false);
      this.toastService.error('No se pudo cargar el detalle del código.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedCode.set(null);
  }

  async createCode() {
    if (this.maxRedemptions() < 1) {
      this.toastService.warning('El límite debe ser al menos 1.');
      return;
    }

    const payload: PromotionCodeCreateDto = {
      code: this.code().trim() || undefined,
      description: this.description().trim() || undefined,
      maxRedemptions: this.maxRedemptions(),
      startsAt: this.toIsoDate(this.startsAt()),
      expiresAt: this.toIsoDate(this.expiresAt(), true),
    };

    this.saving.set(true);
    try {
      await this.adminApi.api.promotionCodeAdmin.promotioncodeadminCreate(payload);
      this.toastService.success('Código promocional creado.');
      this.showCreateModal.set(false);
      this.page.set(1);
      await this.loadCodes();
    } catch {
      this.toastService.error('No se pudo crear. Revisa el código y las fechas.');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleCode(code: PromotionCodeResultDto) {
    try {
      await this.adminApi.api.promotionCodeAdmin.promotioncodeadminUpdate(
        { id: code.id },
        { isActive: !code.isActive },
      );
      this.codes.update((codes) =>
        codes.map((item) => (item.id === code.id ? { ...item, isActive: !item.isActive } : item)),
      );
      this.toastService.success(code.isActive ? 'Código desactivado.' : 'Código activado.');
    } catch {
      this.toastService.error('No se pudo actualizar el código.');
    }
  }

  async copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    this.toastService.success('Código copiado.');
  }

  usagePercentage(code: PromotionCodeResultDto) {
    return Math.min(100, Math.round((code.redemptionCount / code.maxRedemptions) * 100));
  }

  private toIsoDate(value: string, endOfDay = false) {
    if (!value) return undefined;
    const suffix = endOfDay ? 'T23:59:59.999' : 'T00:00:00.000';
    return new Date(`${value}${suffix}`).toISOString();
  }
}
