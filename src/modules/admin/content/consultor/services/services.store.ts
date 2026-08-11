import { Injectable, computed, inject, signal } from '@angular/core';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PaginationMetaDto, ServiceRequestResultDto } from 'api/backend.api';

type ServiceStatus = ServiceRequestResultDto['status'];
type ServiceStage = 'requests' | 'proposals';

@Injectable()
export class ConsultantServicesStore {
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private requestSequence = 0;

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
          { value: 'completed', label: 'Completadas' },
          { value: 'pyme_declined', label: 'No aceptadas por PYME' },
        ],
  );

  readonly services = signal<ServiceRequestResultDto[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly statusFilter = signal<ServiceStatus | ''>('');
  readonly search = signal('');
  readonly loading = signal(false);

  constructor() {
    void this.loadServices();
  }

  async loadServices(): Promise<void> {
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

  changeTab(tab: ServiceStage): void {
    if (tab === this.activeTab()) return;
    this.activeTab.set(tab);
    this.statusFilter.set('');
    this.page.set(1);
    void this.loadServices();
  }

  applyFilters(): void {
    this.page.set(1);
    void this.loadServices();
  }

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.applyFilters();
  }

  changeStatus(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as ServiceStatus | '');
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadServices();
  }
}
