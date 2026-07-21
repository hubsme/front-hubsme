import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { AlertService } from '@service/alert.service';
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
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);

  readonly consultants = signal<ConsultantListItemDto[]>([]);
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly showDetailModal = signal(false);
  readonly selectedConsultant = signal<ConsultantResultDto | null>(null);
  readonly search = signal('');
  readonly activeFilter = signal<'' | 'true' | 'false'>('');
  readonly validatedFilter = signal<'' | 'true' | 'false'>('');
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly totalConsultants = computed(() => this.meta()?.total ?? 0);
  readonly activeConsultants = computed(
    () => this.consultants().filter((consultant) => consultant.active === 'true').length,
  );
  readonly validatedConsultants = computed(
    () => this.consultants().filter((consultant) => consultant.validated === 'true').length,
  );
  readonly actionLoading = signal(false);
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
        active: this.activeFilter() || undefined,
        validated: this.validatedFilter() || undefined,
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

  onActiveFilterChange(value: '' | 'true' | 'false') {
    this.activeFilter.set(value);
    this.page.set(1);
    void this.loadConsultants();
  }

  onValidatedFilterChange(value: '' | 'true' | 'false') {
    this.validatedFilter.set(value);
    this.page.set(1);
    void this.loadConsultants();
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

  requestApprovalChange(validated: boolean) {
    const consultant = this.selectedConsultant();
    if (!consultant) return;

    const action = validated ? 'aprobar' : 'retirar la aprobación de';
    this.alertService.confirm(
      `${validated ? 'Aprobar' : 'Retirar aprobación'} consultor`,
      `¿Deseas ${action} a ${consultant.fullName}?`,
      () => void this.updateApproval(consultant.id, validated),
    );
  }

  requestDelete() {
    const consultant = this.selectedConsultant();
    if (!consultant) return;

    this.alertService.delete(
      'Eliminar consultor',
      `El consultor ${consultant.fullName} dejará de aparecer en la plataforma.`,
      () => void this.deleteConsultant(consultant.id),
    );
  }

  requestActiveChange(active: boolean) {
    const consultant = this.selectedConsultant();
    if (!consultant) return;

    this.alertService.confirm(
      `${active ? 'Activar' : 'Desactivar'} consultor`,
      `¿Deseas ${active ? 'activar' : 'desactivar'} a ${consultant.fullName}?`,
      () => void this.updateActive(consultant.id, active),
    );
  }

  private async updateApproval(id: number, validated: boolean) {
    this.actionLoading.set(true);
    try {
      const response = await this.adminApi.api.consultantAdmin.consultantadminApprove(
        { id },
        { validated: validated ? 'true' : 'false' },
      );
      this.selectedConsultant.set(response.data);
      this.toastService.success(validated ? 'Consultor aprobado correctamente.' : 'Aprobación retirada.');
      await this.loadConsultants();
    } catch {
      this.toastService.error('No se pudo actualizar la aprobación del consultor.');
    } finally {
      this.actionLoading.set(false);
    }
  }

  private async updateActive(id: number, active: boolean) {
    this.actionLoading.set(true);
    try {
      const response = await this.adminApi.api.consultantAdmin.consultantadminSetActive(
        { id },
        { active: active ? 'true' : 'false' },
      );
      this.selectedConsultant.set(response.data);
      this.toastService.success(active ? 'Consultor activado correctamente.' : 'Consultor desactivado.');
      await this.loadConsultants();
    } catch {
      this.toastService.error('No se pudo actualizar la disponibilidad del consultor.');
    } finally {
      this.actionLoading.set(false);
    }
  }

  private async deleteConsultant(id: number) {
    this.actionLoading.set(true);
    try {
      await this.adminApi.api.consultantAdmin.consultantadminRemove({ id });
      this.toastService.success('Consultor eliminado correctamente.');
      this.closeDetailModal();
      await this.loadConsultants();
    } catch {
      this.toastService.error('No se pudo eliminar el consultor.');
    } finally {
      this.actionLoading.set(false);
    }
  }

  authProviderLabel(provider: ConsultantResultDto['authProvider']) {
    return provider === 'google' ? 'Google' : 'Email y contraseña';
  }
}
