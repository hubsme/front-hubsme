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
import { consultantWorkModalityLabel } from '@enum/consultant-work-modality.enum';
import {
  ConsultantListItemDto,
  ConsultantMercadoPagoAdminDto,
  ConsultantResultDto,
  PaginationMetaDto,
} from 'api/backend.api';

type LongTextKey = 'bio' | 'specialties' | 'sectors' | 'services' | 'certifications';
type FinancialReportGenerationStatus = {
  status: 'processing';
  taskId: string | null;
  message: string;
};

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
  readonly consultantWorkModalityLabel = consultantWorkModalityLabel;
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly showDetailModal = signal(false);
  readonly showMercadoPagoProfileModal = signal(false);
  readonly selectedConsultant = signal<ConsultantResultDto | null>(null);
  readonly mercadoPagoDetails = signal<ConsultantMercadoPagoAdminDto | null>(null);
  readonly financialDownloadLoading = signal(false);
  readonly expandedLongText = signal<Set<LongTextKey>>(new Set());
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
  private financialReportPollSequence = 0;
  private readonly financialReportPollAttempts = 24;
  private readonly financialReportPollIntervalMs = 5000;

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
    this.cancelFinancialReportPolling();
    this.showDetailModal.set(true);
    this.selectedConsultant.set(null);
    this.expandedLongText.set(new Set());
    this.mercadoPagoDetails.set(null);
    this.detailLoading.set(true);
    try {
      const [consultantResponse, mercadoPagoResponse] = await Promise.all([
        this.adminApi.api.consultantAdmin.consultantadminFindOne({ id: consultant.id }),
        this.adminApi.api.consultantAdmin.consultantadminMercadoPago({ id: consultant.id }),
      ]);
      this.selectedConsultant.set(consultantResponse.data);
      this.mercadoPagoDetails.set(mercadoPagoResponse.data);
    } catch {
      this.showDetailModal.set(false);
      this.toastService.error('No se pudo cargar el detalle del consultor.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  closeDetailModal() {
    this.cancelFinancialReportPolling();
    this.showDetailModal.set(false);
    this.showMercadoPagoProfileModal.set(false);
    this.selectedConsultant.set(null);
    this.mercadoPagoDetails.set(null);
  }

  openMercadoPagoProfile() {
    if (!this.mercadoPagoDetails()) {
      this.toastService.error('No hay información de perfil disponible para esta cuenta.');
      return;
    }

    this.showMercadoPagoProfileModal.set(true);
  }

  closeMercadoPagoProfile() {
    this.showMercadoPagoProfileModal.set(false);
  }

  async downloadMercadoPagoReport() {
    const consultantId = this.selectedConsultant()?.id;
    if (!consultantId || !this.mercadoPagoDetails()?.connected || this.financialDownloadLoading()) {
      return;
    }

    const pollSequence = ++this.financialReportPollSequence;
    this.financialDownloadLoading.set(true);

    try {
      await this.pollMercadoPagoReport(consultantId, pollSequence);
    } catch {
      this.toastService.error(
        'No se pudo consultar el reporte. Al reintentar continuaremos con la misma solicitud.',
      );
    } finally {
      if (pollSequence === this.financialReportPollSequence) {
        this.financialDownloadLoading.set(false);
      }
    }
  }

  private async pollMercadoPagoReport(consultantId: number, pollSequence: number) {
    let taskId = this.readFinancialReportTaskId(consultantId);

    for (let attempt = 0; attempt < this.financialReportPollAttempts; attempt += 1) {
      if (!this.canContinueFinancialReportPolling(consultantId, pollSequence)) return;

      const response =
        await this.adminApi.api.consultantAdmin.consultantadminMercadoPagoFinancialDownload(
          { id: consultantId, taskId: taskId ?? undefined },
          { format: 'blob' },
        );
      const blob = response.data as unknown as Blob;
      const contentType = response.headers.get('content-type') ?? blob.type;

      if (!contentType.includes('json')) {
        this.clearFinancialReportTaskId(consultantId);
        this.downloadFinancialReportBlob(
          blob,
          response.headers.get('content-disposition'),
          consultantId,
        );
        this.toastService.success('Reporte financiero descargado.');
        return;
      }

      const status = JSON.parse(await blob.text()) as FinancialReportGenerationStatus;
      const wasTrackingTask = Boolean(taskId);
      if (status.taskId) {
        taskId = status.taskId;
        this.storeFinancialReportTaskId(consultantId, status.taskId);
      }

      if (attempt === 0) {
        this.toastService.info(
          wasTrackingTask
            ? 'Continuamos consultando el reporte solicitado anteriormente.'
            : 'Reporte solicitado. Esperaremos a que Mercado Pago termine de generarlo.',
          6000,
        );
      }

      if (attempt === this.financialReportPollAttempts - 1) {
        this.toastService.info(
          'Mercado Pago todavía está procesando el reporte. Puedes reintentar luego y continuaremos la misma solicitud.',
          8000,
        );
        return;
      }

      await this.wait(this.financialReportPollIntervalMs);
    }
  }

  private downloadFinancialReportBlob(
    blob: Blob,
    contentDisposition: string | null,
    consultantId: number,
  ) {
    const fileName =
      this.extractDownloadFileName(contentDisposition) ??
      `reporte-mercado-pago-${consultantId}.csv`;
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  private canContinueFinancialReportPolling(consultantId: number, pollSequence: number) {
    return (
      pollSequence === this.financialReportPollSequence &&
      this.showDetailModal() &&
      this.selectedConsultant()?.id === consultantId
    );
  }

  private cancelFinancialReportPolling() {
    this.financialReportPollSequence += 1;
    this.financialDownloadLoading.set(false);
  }

  private financialReportTaskStorageKey(consultantId: number) {
    return `backoffice_mercado_pago_report_task_${consultantId}`;
  }

  private readFinancialReportTaskId(consultantId: number) {
    try {
      return sessionStorage.getItem(this.financialReportTaskStorageKey(consultantId));
    } catch {
      return null;
    }
  }

  private storeFinancialReportTaskId(consultantId: number, taskId: string) {
    try {
      sessionStorage.setItem(this.financialReportTaskStorageKey(consultantId), taskId);
    } catch {
      // El seguimiento continúa mientras el modal permanezca abierto aunque el navegador bloquee el storage.
    }
  }

  private clearFinancialReportTaskId(consultantId: number) {
    try {
      sessionStorage.removeItem(this.financialReportTaskStorageKey(consultantId));
    } catch {
      // No hay estado local que limpiar cuando el navegador bloquea el storage.
    }
  }

  private wait(milliseconds: number) {
    return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
  }

  private extractDownloadFileName(contentDisposition: string | null) {
    const match = contentDisposition?.match(/filename="?([^";]+)"?/i);
    return match?.[1]?.trim() || null;
  }

  listText(values: string[]) {
    return values.join(', ') || '-';
  }

  shouldShowLongTextToggle(value: string | null | undefined) {
    return Boolean(value?.trim() && value.trim().length > 100);
  }

  isLongTextExpanded(key: LongTextKey) {
    return this.expandedLongText().has(key);
  }

  toggleLongText(key: LongTextKey) {
    const expanded = new Set(this.expandedLongText());
    if (expanded.has(key)) {
      expanded.delete(key);
    } else {
      expanded.add(key);
    }
    this.expandedLongText.set(expanded);
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
      this.toastService.success(
        validated ? 'Consultor aprobado correctamente.' : 'Aprobación retirada.',
      );
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
      this.toastService.success(
        active ? 'Consultor activado correctamente.' : 'Consultor desactivado.',
      );
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
