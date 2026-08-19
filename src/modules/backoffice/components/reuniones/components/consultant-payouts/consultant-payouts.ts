import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ConsultantInputSearch } from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import {
  ConsultantListItemDto,
  MeetingConsultantPayoutResultDto,
  MeetingRecordingDto,
  MeetingRescheduleTraceabilityDto,
  PaginationMetaDto,
} from 'api/backend.api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

type PayoutStatus = MeetingConsultantPayoutResultDto['status'];

@Component({
  selector: 'app-consultant-payouts',
  imports: [
    ConsultantInputSearch,
    DatePipe,
    DecimalPipe,
    FormsModule,
    ModalForm,
    PaginationComponent,
  ],
  templateUrl: './consultant-payouts.html',
})
export class ConsultantPayouts {
  private readonly maxEvidenceSizeBytes = 10 * 1024 * 1024;
  private readonly allowedEvidenceTypes = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);
  private readonly searchTerms = new Subject<string>();
  private requestSequence = 0;

  readonly payouts = signal<MeetingConsultantPayoutResultDto[]>([]);
  readonly loading = signal(false);
  readonly search = signal('');
  readonly status = signal<PayoutStatus | ''>('pending');
  readonly selectedConsultant = signal<ConsultantListItemDto | null>(null);
  readonly consultantOptions = signal<ConsultantListItemDto[]>([]);
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly totalPayouts = computed(() => this.meta()?.total ?? 0);
  readonly pendingAmountOnPage = computed(() =>
    this.payouts()
      .filter((payout) => payout.status === 'pending')
      .reduce((total, payout) => total + Number(payout.amount), 0),
  );

  readonly showPaymentModal = signal(false);
  readonly selectedPayout = signal<MeetingConsultantPayoutResultDto | null>(null);
  readonly paymentReference = signal('');
  readonly paymentNotes = signal('');
  readonly evidence = signal<File | null>(null);
  readonly submitting = signal(false);
  readonly canSubmitPayment = computed(
    () => this.paymentReference().trim().length > 0 && this.evidence() !== null,
  );

  readonly showTraceabilityModal = signal(false);
  readonly traceabilityData = signal<MeetingRescheduleTraceabilityDto | null>(null);
  readonly traceabilityLoading = signal(false);
  readonly expandedStepIds = signal<Set<number>>(new Set());
  readonly showRootMeetingDetails = signal(false);
  readonly showLatestMeetingDetails = signal(false);
  readonly recordings = signal<MeetingRecordingDto[]>([]);
  readonly recordingsLoading = signal(false);

  constructor() {
    this.searchTerms
      .pipe(debounceTime(450), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.page.set(1);
        void this.loadPayouts();
      });
    void this.loadConsultants();
    void this.loadPayouts();
  }

  onSearchChange(value: string) {
    this.search.set(value);
    this.searchTerms.next(value.trim());
  }

  onStatusSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value as PayoutStatus | '';
    this.status.set(value);
    this.page.set(1);
    void this.loadPayouts();
  }

  onConsultantSelected(consultant: ConsultantListItemDto | null) {
    this.selectedConsultant.set(consultant);
    this.page.set(1);
    void this.loadPayouts();
  }

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadPayouts();
  }

  openPaymentModal(payout: MeetingConsultantPayoutResultDto) {
    this.selectedPayout.set(payout);
    this.paymentReference.set('');
    this.paymentNotes.set('');
    this.evidence.set(null);
    this.showPaymentModal.set(true);
  }

  closePaymentModal() {
    if (this.submitting()) return;
    this.showPaymentModal.set(false);
    this.selectedPayout.set(null);
    this.evidence.set(null);
  }

  onEvidenceSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) return;

    if (!this.setEvidence(file)) input.value = '';
  }

  @HostListener('document:paste', ['$event'])
  onEvidencePasted(event: ClipboardEvent) {
    if (!this.showPaymentModal() || this.submitting()) return;

    const imageItem = Array.from(event.clipboardData?.items ?? []).find(
      (item) => item.kind === 'file' && item.type.startsWith('image/'),
    );
    const image = imageItem?.getAsFile();
    if (!image) return;

    event.preventDefault();
    if (this.setEvidence(image)) {
      this.toastService.success('Imagen adjuntada desde el portapapeles.');
    }
  }

  async registerPayment() {
    const payout = this.selectedPayout();
    const evidence = this.evidence();
    const paymentReference = this.paymentReference().trim();
    if (!payout || !evidence || !paymentReference || this.submitting()) return;

    this.submitting.set(true);
    try {
      await this.adminApi.api.meetingAdmin.meetingadminMarkPayoutPaid(
        { id: payout.id },
        {
          paymentReference,
          notes: this.paymentNotes().trim() || undefined,
          evidence,
        },
      );
      this.toastService.success('El depósito al consultor quedó registrado.');
      this.showPaymentModal.set(false);
      this.selectedPayout.set(null);
      this.evidence.set(null);
      await this.loadPayouts();
    } catch {
      this.toastService.error(
        'No se pudo registrar el depósito. Revisa los datos e inténtalo otra vez.',
      );
    } finally {
      this.submitting.set(false);
    }
  }

  statusLabel(status: PayoutStatus) {
    return status === 'paid' ? 'Depositado' : 'Pendiente de depósito';
  }

  meetingStatusLabel(status?: string | null) {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'finalizada':
        return 'Finalizada';
      case 'por_confirmar':
        return 'Por confirmar';
      case 'cancelada':
        return 'Cancelada';
      case 'solicitada':
        return 'Solicitada';
      default:
        return status || '-';
    }
  }

  meetingStatusBadgeClass(status?: string | null) {
    switch (status) {
      case 'confirmada':
        return 'bg-success/10 text-success';
      case 'finalizada':
        return 'bg-secondary/10 text-secondary';
      case 'por_confirmar':
        return 'bg-warning/10 text-warning';
      case 'cancelada':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-muted/10 text-muted';
    }
  }

  toggleStepDetails(stepId: number) {
    this.expandedStepIds.update((set) => {
      const next = new Set(set);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }

  isStepExpanded(stepId: number): boolean {
    return this.expandedStepIds().has(stepId);
  }

  toggleRootMeetingDetails() {
    this.showRootMeetingDetails.update((v) => !v);
  }

  toggleLatestMeetingDetails() {
    this.showLatestMeetingDetails.update((v) => !v);
  }

  async loadRecordings(meetingId: number) {
    if (this.recordingsLoading()) return;
    this.recordingsLoading.set(true);
    try {
      const response = await this.adminApi.api.meetingAdmin.meetingadminGetRecordings({ id: meetingId });
      this.recordings.set(response.data);
      if (!response.data.length) {
        this.toastService.info('No se encontraron grabaciones para esta reunión.');
      }
    } catch {
      this.toastService.error('No se pudieron cargar las grabaciones.');
    } finally {
      this.recordingsLoading.set(false);
    }
  }

  async openTraceabilityModal(payout: MeetingConsultantPayoutResultDto) {
    this.showTraceabilityModal.set(true);
    this.traceabilityLoading.set(true);
    this.traceabilityData.set(null);
    this.expandedStepIds.set(new Set());
    this.showRootMeetingDetails.set(false);
    this.showLatestMeetingDetails.set(false);
    this.recordings.set([]);
    try {
      const response = await this.adminApi.api.meetingAdmin.meetingadminGetPayoutTraceability({
        id: payout.id,
      });
      this.traceabilityData.set(response.data);
    } catch {
      this.toastService.error('No se pudo cargar el historial de reagendamientos de la reunión.');
      this.showTraceabilityModal.set(false);
    } finally {
      this.traceabilityLoading.set(false);
    }
  }

  closeTraceabilityModal() {
    this.showTraceabilityModal.set(false);
    this.traceabilityData.set(null);
    this.expandedStepIds.set(new Set());
    this.showRootMeetingDetails.set(false);
    this.showLatestMeetingDetails.set(false);
    this.recordings.set([]);
  }

  openPaymentModalFromTraceability() {
    const data = this.traceabilityData();
    if (!data) return;

    const matchedPayout = this.payouts().find((p) => p.id === data.payout.id);
    this.closeTraceabilityModal();

    if (matchedPayout) {
      this.openPaymentModal(matchedPayout);
    } else {
      this.openPaymentModal({
        id: data.payout.id,
        createdAt: data.payout.paidAt ?? new Date().toISOString(),
        updatedAt: data.payout.paidAt ?? new Date().toISOString(),
        meetingId: data.rootMeeting.id,
        checkoutId: 0,
        pymeId: 0,
        consultantId: 0,
        amount: data.payout.amount,
        currency: data.payout.currency,
        status: data.payout.status,
        paymentReference: data.payout.paymentReference,
        evidenceFileUrl: data.payout.evidenceFileUrl,
        evidenceStoragePath: null,
        evidenceOriginalName: data.payout.evidenceOriginalName,
        evidenceMimeType: data.payout.evidenceMimeType,
        evidenceSizeBytes: null,
        notes: data.payout.notes,
        paidAt: data.payout.paidAt,
        processedByAdmin: data.payout.processedByAdmin,
        meetingTitle: data.rootMeeting.title,
        meetingStartTime: data.rootMeeting.startTime,
        meetingStatus: data.rootMeeting.status as 'cancelada',
        pymeName: data.rootMeeting.pymeName,
        consultantName: data.rootMeeting.consultantName,
        mercadoPagoPaymentId: data.payout.mercadoPagoPaymentId,
        checkoutExternalReference: data.payout.checkoutExternalReference,
        grossAmount: data.payout.grossAmount,
        platformCommissionAmount: data.payout.platformCommissionAmount,
        rescheduleCount: data.rescheduleCount,
        latestMeetingId: data.latestMeeting.id,
        latestMeetingTitle: data.latestMeeting.title,
        latestMeetingStartTime: data.latestMeeting.startTime,
        latestMeetingStatus: data.latestMeeting.status as 'por_confirmar',
      });
    }
  }

  private setEvidence(file: File) {
    if (!this.allowedEvidenceTypes.has(file.type)) {
      this.toastService.error('La constancia debe ser PDF, JPG, PNG o WEBP.');
      return false;
    }

    if (file.size > this.maxEvidenceSizeBytes) {
      this.toastService.error('La constancia no puede superar los 10 MB.');
      return false;
    }

    this.evidence.set(file);
    return true;
  }

  private async loadPayouts() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const response = await this.adminApi.api.meetingAdmin.meetingadminFindAllPayouts({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
        consultantId: this.selectedConsultant()?.id,
        status: this.status() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.payouts.set(response.data.data);
      this.meta.set(response.data.meta);
    } catch {
      if (requestId === this.requestSequence) {
        this.toastService.error('No se pudieron cargar los pagos a consultores.');
      }
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  private async loadConsultants() {
    try {
      const response = await this.adminApi.api.consultantAdmin.consultantadminFindAll({
        page: 1,
        limit: 100,
      });
      this.consultantOptions.set(response.data.data);
    } catch {
      this.toastService.error('No se pudo cargar el filtro de consultores.');
    }
  }
}
