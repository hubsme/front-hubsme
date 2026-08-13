import { Injectable, computed, inject, signal } from '@angular/core';
import {
  SERVICE_REQUEST_CATEGORY_OPTIONS,
  ServiceRequestCategory,
} from '@enum/service-request-category.enum';
import { ConsultantServiceOfferService } from '@service/admin/consultant-service-offer.service';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import {
  ConsultantServiceOfferResultDto,
  PaginationMetaDto,
  ServiceRequestResultDto,
} from 'api/backend.api';

type ServiceStatus = ServiceRequestResultDto['status'];
type ServiceTab = 'requests' | 'proposals' | 'offers';

@Injectable()
export class ConsultantServicesStore {
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly offerService = inject(ConsultantServiceOfferService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private requestSequence = 0;

  readonly pageSize = 9;
  readonly categoryOptions = SERVICE_REQUEST_CATEGORY_OPTIONS;
  readonly activeTab = signal<ServiceTab>('requests');
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
  readonly offers = signal<ConsultantServiceOfferResultDto[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly statusFilter = signal<ServiceStatus | ''>('');
  readonly offerVisibility = signal<'' | 'true' | 'false'>('');
  readonly categoryFilter = signal<ServiceRequestCategory | ''>('');
  readonly search = signal('');
  readonly loading = signal(false);
  readonly showOfferForm = signal(false);
  readonly editingOffer = signal<ConsultantServiceOfferResultDto | null>(null);
  readonly updatingOfferId = signal<number | null>(null);

  constructor() {
    void this.loadCurrentTab();
  }

  async loadCurrentTab(): Promise<void> {
    if (this.activeTab() === 'offers') return this.loadOffers();
    return this.loadServices();
  }

  async loadServices(): Promise<void> {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const result = await this.serviceRequestService.findAll({
        page: this.page(),
        limit: this.pageSize,
        stage: this.activeTab() === 'requests' ? 'requests' : 'proposals',
        status: this.statusFilter() || undefined,
        search: this.search().trim() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.services.set(result.data);
      this.meta.set(result.meta);
    } catch (error) {
      if (requestId === this.requestSequence)
        this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  async loadOffers(): Promise<void> {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const result = await this.offerService.findMine({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
        category: this.categoryFilter() || undefined,
        isActive: this.offerVisibility() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.offers.set(result.data);
      this.meta.set(result.meta);
    } catch (error) {
      if (requestId === this.requestSequence)
        this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  changeTab(tab: ServiceTab): void {
    if (tab === this.activeTab()) return;
    this.activeTab.set(tab);
    this.statusFilter.set('');
    this.offerVisibility.set('');
    this.categoryFilter.set('');
    this.search.set('');
    this.page.set(1);
    this.meta.set(null);
    void this.loadCurrentTab();
  }

  applyFilters(): void {
    this.page.set(1);
    void this.loadCurrentTab();
  }

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.offerVisibility.set('');
    this.categoryFilter.set('');
    this.applyFilters();
  }

  changeStatus(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as ServiceStatus | '');
    this.applyFilters();
  }

  changeOfferVisibility(event: Event): void {
    this.offerVisibility.set((event.target as HTMLSelectElement).value as '' | 'true' | 'false');
    this.applyFilters();
  }

  changeCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const category =
      this.categoryOptions.find((option) => option.category === value)?.category ?? '';
    this.categoryFilter.set(category);
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadCurrentTab();
  }

  openOfferForm(offer: ConsultantServiceOfferResultDto | null = null): void {
    this.editingOffer.set(offer);
    this.showOfferForm.set(true);
  }

  closeOfferForm(): void {
    this.showOfferForm.set(false);
    this.editingOffer.set(null);
  }

  async offerSaved(): Promise<void> {
    this.closeOfferForm();
    await this.loadOffers();
  }

  async toggleOffer(offer: ConsultantServiceOfferResultDto): Promise<void> {
    if (this.updatingOfferId() !== null) return;
    this.updatingOfferId.set(offer.id);
    try {
      await this.offerService.setActive(offer.id, { isActive: !offer.isActive });
      this.toastService.success(offer.isActive ? 'Servicio pausado' : 'Servicio publicado');
      await this.loadOffers();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.updatingOfferId.set(null);
    }
  }
}
