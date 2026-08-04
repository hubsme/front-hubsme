import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PaginationMetaDto, ServiceRequestResultDto } from 'api/backend.api';

type ServiceStatus = ServiceRequestResultDto['status'];
type ServiceStage = 'requests' | 'proposals';

@Component({
  selector: 'app-consultant-services',
  imports: [CommonModule, DatePipe, FormsModule, ModalForm, PaginationComponent],
  templateUrl: './services.html',
})
export class ConsultantServices {
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private requestSequence = 0;
  private detailSequence = 0;

  readonly pageSize = 9;
  readonly activeTab = signal<ServiceStage>('requests');
  readonly statusOptions = computed<Array<{ value: ServiceStatus | ''; label: string }>>(() =>
    this.activeTab() === 'requests'
      ? [
          { value: '', label: 'Todos los estados' },
          { value: 'requested', label: 'Por responder' },
          { value: 'consultant_declined', label: 'No aceptadas por mí' },
          { value: 'cancelled', label: 'Canceladas' },
        ]
      : [
          { value: '', label: 'Todos los estados' },
          { value: 'proposal_sent', label: 'Enviadas' },
          { value: 'payment_pending', label: 'Esperando pago' },
          { value: 'paid', label: 'Pagadas' },
          { value: 'pyme_declined', label: 'No aceptadas por PYME' },
        ],
  );

  readonly services = signal<ServiceRequestResultDto[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly statusFilter = signal<ServiceStatus | ''>('');
  readonly search = signal('');
  readonly loading = signal(false);
  readonly selectedService = signal<ServiceRequestResultDto | null>(null);
  readonly showDetail = signal(false);
  readonly detailLoading = signal(false);
  readonly price = signal('');
  readonly proposalMessage = signal('');
  readonly declineMessage = signal('');
  readonly showDeclineForm = signal(false);
  readonly responding = signal(false);
  readonly declining = signal(false);

  constructor() {
    void this.loadServices();
  }

  async loadServices() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const result = await this.serviceRequestService.findAll({
        page: this.page(),
        limit: this.pageSize,
        stage: this.activeTab(),
        status: this.statusFilter() || undefined,
        search: this.search().trim() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.services.set(result.data);
      this.meta.set(result.meta);
    } catch (error) {
      if (requestId === this.requestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  changeTab(tab: ServiceStage) {
    if (tab === this.activeTab()) return;
    this.activeTab.set(tab);
    this.statusFilter.set('');
    this.page.set(1);
    void this.loadServices();
  }

  applyFilters() {
    this.page.set(1);
    void this.loadServices();
  }

  clearFilters() {
    this.search.set('');
    this.statusFilter.set('');
    this.applyFilters();
  }

  changeStatus(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value as ServiceStatus | '');
    this.applyFilters();
  }

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadServices();
  }

  async openDetail(service: ServiceRequestResultDto) {
    const requestId = ++this.detailSequence;
    this.selectedService.set(service);
    this.price.set(service.proposedPrice ?? '');
    this.proposalMessage.set(service.proposalMessage ?? '');
    this.declineMessage.set('');
    this.showDeclineForm.set(false);
    this.showDetail.set(true);
    this.detailLoading.set(true);
    try {
      const detail = await this.serviceRequestService.findOne(service.id);
      if (requestId === this.detailSequence) {
        this.selectedService.set(detail);
        this.price.set(detail.proposedPrice ?? '');
        this.proposalMessage.set(detail.proposalMessage ?? '');
      }
    } catch (error) {
      if (requestId === this.detailSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.detailSequence) this.detailLoading.set(false);
    }
  }

  closeDetail() {
    if (this.responding() || this.declining()) return;
    this.showDetail.set(false);
    this.selectedService.set(null);
    this.detailSequence += 1;
  }

  async sendProposal() {
    const service = this.selectedService();
    const amount = Number(this.price());
    if (!service || service.status !== 'requested') return;
    if (!Number.isFinite(amount) || amount < 1) {
      this.toastService.warning('Ingresa un precio válido mayor o igual a S/ 1.00');
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(this.price().trim())) {
      this.toastService.warning('El precio puede tener como máximo dos decimales');
      return;
    }

    this.responding.set(true);
    try {
      const updated = await this.serviceRequestService.sendProposal(service.id, {
        price: amount,
        message: this.proposalMessage().trim() || undefined,
      });
      this.selectedService.set(updated);
      this.toastService.success('Cotización enviada a la PYME');
      this.activeTab.set('proposals');
      this.statusFilter.set('');
      this.page.set(1);
      await this.loadServices();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.responding.set(false);
    }
  }

  async declineRequest() {
    const service = this.selectedService();
    if (!service || service.status !== 'requested') return;

    this.declining.set(true);
    try {
      const updated = await this.serviceRequestService.decline(service.id, {
        message: this.declineMessage().trim() || undefined,
      });
      this.selectedService.set(updated);
      this.showDeclineForm.set(false);
      this.toastService.success('Solicitud marcada como no aceptada');
      await this.loadServices();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.declining.set(false);
    }
  }

  openDeclineForm() {
    this.showDeclineForm.set(true);
  }

  cancelDecline() {
    if (this.declining()) return;
    this.declineMessage.set('');
    this.showDeclineForm.set(false);
  }

  statusLabel(status: ServiceStatus) {
    const labels: Record<ServiceStatus, string> = {
      requested: 'Por responder',
      proposal_sent: 'Cotización enviada',
      consultant_declined: 'No aceptada por mí',
      payment_pending: 'Esperando pago',
      paid: 'Pagada',
      pyme_declined: 'No aceptada por PYME',
      cancelled: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: ServiceStatus) {
    const classes: Record<ServiceStatus, string> = {
      requested: 'bg-warning/15 text-warning',
      proposal_sent: 'bg-secondary/10 text-secondary',
      consultant_declined: 'bg-danger/10 text-danger',
      payment_pending: 'bg-info/10 text-info',
      paid: 'bg-success/10 text-success',
      pyme_declined: 'bg-danger/10 text-danger',
      cancelled: 'bg-text/10 text-muted',
    };
    return classes[status];
  }

  formatMoney(value: string | null | undefined, currency = 'PEN') {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(
      Number(value ?? 0),
    );
  }
}
