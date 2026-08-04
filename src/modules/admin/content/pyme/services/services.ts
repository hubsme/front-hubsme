import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ConsultantInputSearch,
  ConsultantInputSearchFilters,
} from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AiService } from '@service/admin/ai.service';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { ServiceRequestService } from '@service/admin/service-request.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import {
  ApiResponse,
  MercadoPagoCheckoutDto,
  PaginationMetaDto,
  ServiceConsultantMatchDto,
  ServiceRequestChatMessageDto,
  ServiceRequestResultDto,
} from 'api/backend.api';

type ServiceStatus = ServiceRequestResultDto['status'];
type ServiceStage = 'requests' | 'proposals';
type ConsultantOption = ApiResponse<'consultant', 'findAll'>['data'][number];
type WizardStep = 1 | 2 | 3;

type ConsultantSelection = {
  userId: number;
  fullName: string;
  headline: string | null;
  photoUrl: string | null;
  diagnosticAreas: string[];
  specialties: string[];
  yearsExperience: number;
  rating: string;
  reason: string | null;
};

const INITIAL_ASSISTANT_MESSAGE =
  '¡Hola! Cuéntame qué trabajo o servicio necesita tu empresa. Puede ser algo como llevar la contabilidad, capacitar a tu equipo o implementar un proceso.';

@Component({
  selector: 'app-pyme-services',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ConsultantInputSearch,
    ModalForm,
    PaginationComponent,
  ],
  templateUrl: './services.html',
})
export class PymeServices implements OnDestroy {
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly aiService = inject(AiService);
  private readonly mercadoPagoService = inject(MercadoPagoService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);
  private requestSequence = 0;
  private detailSequence = 0;
  private aiRequestSequence = 0;
  private paymentPolling: ReturnType<typeof setInterval> | null = null;
  private pollingStartedAt = 0;

  readonly pageSize = 9;
  readonly consultantSearchFilters: ConsultantInputSearchFilters = {
    active: 'true',
    validated: 'true',
  };
  readonly activeTab = signal<ServiceStage>('requests');
  readonly services = signal<ServiceRequestResultDto[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly statusFilter = signal<ServiceStatus | ''>('');
  readonly search = signal('');
  readonly loading = signal(false);
  readonly statusOptions = computed<Array<{ value: ServiceStatus | ''; label: string }>>(() =>
    this.activeTab() === 'requests'
      ? [
          { value: '', label: 'Todos los estados' },
          { value: 'requested', label: 'Esperando respuesta' },
          { value: 'consultant_declined', label: 'No aceptadas por consultor' },
          { value: 'cancelled', label: 'Canceladas' },
        ]
      : [
          { value: '', label: 'Todos los estados' },
          { value: 'proposal_sent', label: 'Precio recibido' },
          { value: 'payment_pending', label: 'Pago pendiente' },
          { value: 'paid', label: 'Aprobadas y pagadas' },
          { value: 'pyme_declined', label: 'No aceptadas por mi empresa' },
        ],
  );

  readonly showCreate = signal(false);
  readonly creating = signal(false);
  readonly wizardStep = signal<WizardStep>(1);
  readonly chatMessages = signal<ServiceRequestChatMessageDto[]>([]);
  readonly chatInput = signal('');
  readonly chatLoading = signal(false);
  readonly chatComplete = signal(false);
  readonly missingInformation = signal<string[]>([]);
  readonly title = signal('');
  readonly description = signal('');
  readonly requirements = signal('');
  readonly details = signal('');
  readonly matchingConsultants = signal(false);
  readonly aiMatches = signal<ServiceConsultantMatchDto[]>([]);
  readonly selectedConsultants = signal<ConsultantSelection[]>([]);
  readonly canReviewDraft = computed(() => this.chatComplete() && this.hasValidDraft());
  readonly canSendService = computed(
    () => this.hasValidDraft() && this.selectedConsultants().length >= 1,
  );

  readonly selectedService = signal<ServiceRequestResultDto | null>(null);
  readonly showDetail = signal(false);
  readonly detailLoading = signal(false);
  readonly declineMessage = signal('');
  readonly declining = signal(false);
  readonly preparingPayment = signal(false);
  readonly paymentModalOpen = signal(false);
  readonly paymentCheckout = signal<MercadoPagoCheckoutDto | null>(null);
  readonly paymentFrameUrl = computed<SafeResourceUrl | null>(() => {
    const checkout = this.paymentCheckout();
    const url = checkout?.initPoint ?? checkout?.sandboxInitPoint ?? null;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  constructor() {
    void this.loadServices();
  }

  ngOnDestroy(): void {
    this.stopPaymentPolling();
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

  openCreate() {
    this.resetCreateFlow();
    this.showCreate.set(true);
  }

  closeCreate() {
    if (this.creating() || this.chatLoading() || this.matchingConsultants()) return;
    this.showCreate.set(false);
    this.resetCreateFlow();
  }

  handleChatKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    void this.sendChatMessage();
  }

  async sendChatMessage() {
    const content = this.chatInput().trim();
    if (content.length < 2 || this.chatLoading() || this.chatComplete()) return;

    const messages = [...this.chatMessages(), { role: 'user' as const, content }];
    const requestId = ++this.aiRequestSequence;
    this.chatMessages.set(messages);
    this.chatInput.set('');
    this.chatLoading.set(true);
    try {
      const result = await this.aiService.continueServiceRequestChat({
        messages,
        draft: this.currentDraft(),
      });
      if (requestId !== this.aiRequestSequence) return;
      this.chatMessages.update((current) => [
        ...current,
        { role: 'assistant', content: result.message },
      ]);
      this.chatComplete.set(result.isComplete);
      this.missingInformation.set(result.missingInformation);
      this.applyDraft(result.draft);
    } catch (error) {
      if (requestId === this.aiRequestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.aiRequestSequence) this.chatLoading.set(false);
    }
  }

  goToReview() {
    if (!this.canReviewDraft()) {
      this.toastService.warning('Confirma con el asistente que ya brindaste toda la información');
      return;
    }
    this.wizardStep.set(2);
  }

  goToConsultants() {
    if (!this.hasValidDraft()) {
      this.toastService.warning('Completa el título, la descripción y el alcance del servicio');
      return;
    }
    this.wizardStep.set(3);
  }

  previousStep() {
    if (this.wizardStep() === 3) this.wizardStep.set(2);
    else if (this.wizardStep() === 2) this.wizardStep.set(1);
  }

  selectManualConsultant(consultant: ConsultantOption | null) {
    if (!consultant) return;
    this.addConsultant({
      userId: consultant.userId,
      fullName: consultant.fullName,
      headline: consultant.headline,
      photoUrl: consultant.photoUrl,
      diagnosticAreas: consultant.diagnosticAreas,
      specialties: consultant.specialties,
      yearsExperience: consultant.yearsExperience,
      rating: consultant.rating,
      reason: null,
    });
  }

  async findRecommendedConsultants() {
    if (this.matchingConsultants()) return;
    this.matchingConsultants.set(true);
    try {
      const result = await this.aiService.matchServiceConsultants({ draft: this.currentDraft() });
      this.aiMatches.set(result.matches);
      this.selectedConsultants.set(result.matches.map((match) => this.matchToSelection(match)));
      this.toastService.success('Encontramos 3 consultores compatibles con tu servicio');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.matchingConsultants.set(false);
    }
  }

  toggleAiMatch(match: ServiceConsultantMatchDto) {
    if (this.isConsultantSelected(match.consultantId)) {
      this.removeConsultant(match.consultantId);
      return;
    }
    this.addConsultant(this.matchToSelection(match));
  }

  isConsultantSelected(consultantId: number) {
    return this.selectedConsultants().some((consultant) => consultant.userId === consultantId);
  }

  removeConsultant(consultantId: number) {
    this.selectedConsultants.update((current) =>
      current.filter((consultant) => consultant.userId !== consultantId),
    );
  }

  async createService() {
    if (!this.canSendService() || this.creating()) {
      this.toastService.warning('Selecciona al menos un consultor para enviar la solicitud');
      return;
    }

    this.creating.set(true);
    try {
      const created = await this.serviceRequestService.create({
        consultantIds: this.selectedConsultants().map((consultant) => consultant.userId),
        title: this.title().trim(),
        description: this.description().trim(),
        requirements: this.requirements().trim(),
        details: this.details().trim() || undefined,
      });
      this.toastService.success(
        `Solicitud enviada a ${created.length} ${created.length === 1 ? 'consultor' : 'consultores'}`,
      );
      this.showCreate.set(false);
      this.resetCreateFlow();
      this.activeTab.set('requests');
      this.statusFilter.set('');
      this.page.set(1);
      await this.loadServices();
      if (created[0]) await this.openDetail(created[0]);
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.creating.set(false);
    }
  }

  async openDetail(service: ServiceRequestResultDto) {
    const requestId = ++this.detailSequence;
    this.selectedService.set(service);
    this.declineMessage.set('');
    this.showDetail.set(true);
    this.detailLoading.set(true);
    try {
      const detail = await this.serviceRequestService.findOne(service.id);
      if (requestId === this.detailSequence) this.selectedService.set(detail);
    } catch (error) {
      if (requestId === this.detailSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.detailSequence) this.detailLoading.set(false);
    }
  }

  closeDetail() {
    if (this.declining() || this.preparingPayment()) return;
    this.showDetail.set(false);
    this.selectedService.set(null);
    this.detailSequence += 1;
  }

  async declineProposal() {
    const service = this.selectedService();
    if (!service || service.status !== 'proposal_sent') return;

    this.declining.set(true);
    try {
      const updated = await this.serviceRequestService.decline(service.id, {
        message: this.declineMessage().trim() || undefined,
      });
      this.selectedService.set(updated);
      this.toastService.success('Cotización marcada como no aceptada');
      await this.loadServices();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.declining.set(false);
    }
  }

  async payService() {
    const service = this.selectedService();
    if (!service || !['proposal_sent', 'payment_pending'].includes(service.status)) return;

    this.preparingPayment.set(true);
    try {
      const checkout = await this.mercadoPagoService.prepareServicePayment(service.id);
      if (!checkout.initPoint && !checkout.sandboxInitPoint) {
        throw new Error('La pasarela de pago no devolvió un enlace válido');
      }
      this.paymentCheckout.set(checkout);
      this.paymentModalOpen.set(true);
      this.startPaymentPolling();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.preparingPayment.set(false);
    }
  }

  closePaymentModal() {
    this.stopPaymentPolling();
    this.paymentModalOpen.set(false);
    this.paymentCheckout.set(null);
    void this.refreshSelectedService();
  }

  statusLabel(status: ServiceStatus) {
    const labels: Record<ServiceStatus, string> = {
      requested: 'Esperando respuesta',
      proposal_sent: 'Precio recibido',
      consultant_declined: 'No aceptada por consultor',
      payment_pending: 'Pago pendiente',
      paid: 'Aprobada y pagada',
      pyme_declined: 'No aceptada',
      cancelled: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: ServiceStatus) {
    const classes: Record<ServiceStatus, string> = {
      requested: 'bg-info/10 text-info',
      proposal_sent: 'bg-secondary/10 text-secondary',
      consultant_declined: 'bg-danger/10 text-danger',
      payment_pending: 'bg-warning/15 text-warning',
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

  private addConsultant(consultant: ConsultantSelection) {
    if (this.isConsultantSelected(consultant.userId)) return;
    if (this.selectedConsultants().length >= 3) {
      this.toastService.warning('Puedes enviar la solicitud a un máximo de 3 consultores');
      return;
    }
    this.selectedConsultants.update((current) => [...current, consultant]);
  }

  private matchToSelection(match: ServiceConsultantMatchDto): ConsultantSelection {
    return {
      userId: match.consultantId,
      fullName: match.fullName,
      headline: match.headline,
      photoUrl: match.photoUrl,
      diagnosticAreas: match.diagnosticAreas,
      specialties: match.specialties,
      yearsExperience: match.yearsExperience,
      rating: match.rating,
      reason: match.reason,
    };
  }

  private hasValidDraft() {
    return (
      this.title().trim().length >= 3 &&
      this.description().trim().length >= 10 &&
      this.requirements().trim().length >= 5
    );
  }

  private currentDraft() {
    return {
      title: this.title().trim(),
      description: this.description().trim(),
      requirements: this.requirements().trim(),
      details: this.details().trim(),
    };
  }

  private applyDraft(draft: {
    title: string;
    description: string;
    requirements: string;
    details: string;
  }) {
    this.title.set(draft.title);
    this.description.set(draft.description);
    this.requirements.set(draft.requirements);
    this.details.set(draft.details);
  }

  private resetCreateFlow() {
    this.aiRequestSequence += 1;
    this.wizardStep.set(1);
    this.chatMessages.set([{ role: 'assistant', content: INITIAL_ASSISTANT_MESSAGE }]);
    this.chatInput.set('');
    this.chatLoading.set(false);
    this.chatComplete.set(false);
    this.missingInformation.set([]);
    this.title.set('');
    this.description.set('');
    this.requirements.set('');
    this.details.set('');
    this.matchingConsultants.set(false);
    this.aiMatches.set([]);
    this.selectedConsultants.set([]);
  }

  private startPaymentPolling() {
    this.stopPaymentPolling();
    this.pollingStartedAt = Date.now();
    void this.pollPaymentStatus();
    this.paymentPolling = setInterval(() => void this.pollPaymentStatus(), 1500);
  }

  private stopPaymentPolling() {
    if (!this.paymentPolling) return;
    clearInterval(this.paymentPolling);
    this.paymentPolling = null;
  }

  private async pollPaymentStatus() {
    const service = this.selectedService();
    if (!service || !this.paymentModalOpen()) return;
    if (Date.now() - this.pollingStartedAt > 600000) {
      this.stopPaymentPolling();
      this.toastService.warning(
        'El pago sigue pendiente. Puedes cerrar esta ventana y reintentarlo luego.',
      );
      return;
    }

    try {
      const updated = await this.serviceRequestService.findOne(service.id);
      this.selectedService.set(updated);
      if (updated.status !== 'paid') return;
      this.stopPaymentPolling();
      this.paymentModalOpen.set(false);
      this.paymentCheckout.set(null);
      this.toastService.success('Pago confirmado. El servicio fue aprobado');
      await this.loadServices();
    } catch {
      // El siguiente ciclo vuelve a consultar para tolerar fallas temporales.
    }
  }

  private async refreshSelectedService() {
    const service = this.selectedService();
    if (!service) return;
    try {
      const updated = await this.serviceRequestService.findOne(service.id);
      this.selectedService.set(updated);
      await this.loadServices();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    }
  }
}
