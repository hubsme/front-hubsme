import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { formatInPeru } from '@function/date.function';
import { ConsultantInputSearch } from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import {
  ConsultantListItemDto,
  MeetingMonthlyPayoutDto,
  MeetingMonthlyPayoutItemDto,
  MeetingRecordingDto,
  MeetingRescheduleTraceabilityDto,
  PaginationMetaDto,
} from 'api/backend.api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PayoutFeeBreakdown } from './components/payout-fee-breakdown/payout-fee-breakdown';
import { PayoutDialog } from './components/payout-dialog/payout-dialog';
import { MeetingReceipt } from '@module/admin/content/shared/meeting-receipt/meeting-receipt';

type PayoutStatus = MeetingMonthlyPayoutDto['status'];

@Component({
  selector: 'app-consultant-payouts',
  imports: [
    ConsultantInputSearch,
    DatePipe,
    FormsModule,
    ModalForm,
    PaginationComponent,
    PayoutFeeBreakdown,
    PayoutDialog,
    MeetingReceipt,
  ],
  templateUrl: './consultant-payouts.html',
})
export class ConsultantPayouts {
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);
  private readonly searchTerms = new Subject<string>();
  private requestSequence = 0;

  readonly payouts = signal<MeetingMonthlyPayoutDto[]>([]);
  readonly loading = signal(false);
  readonly loadError = signal(false);
  readonly search = signal('');
  readonly status = signal<PayoutStatus | ''>('');
  readonly selectedConsultant = signal<ConsultantListItemDto | null>(null);
  readonly consultantOptions = signal<ConsultantListItemDto[]>([]);
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly totalPayouts = computed(() => this.meta()?.total ?? 0);
  readonly pendingAmountOnPage = computed(() => {
    const cents = this.payouts()
      .filter((payout) => payout.status !== 'paid' && payout.status !== 'processing' && payout.currency === 'PEN')
      .reduce((total, payout) => total + (this.amountBeforePayoutInCents(payout) ?? 0n), 0n);
    return this.decimalFromCents(cents);
  });

  readonly month = signal(this.currentMonth());
  readonly selectedSettlement = signal<MeetingMonthlyPayoutDto | null>(null);
  readonly settlementToPay = signal<MeetingMonthlyPayoutDto | null>(null);
  readonly expandedSettlementMeetingIds = signal<Set<number>>(new Set());
  readonly showPayoutDiscount = signal(false);
  readonly settlementPhotoUrl = signal<string | null>(null);
  readonly settlementInitials = computed(() =>
    (this.selectedSettlement()?.consultantName ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase(),
  );
  readonly collectedPayinTotals = computed(() => {
    const meetings = this.selectedSettlement()?.meetings ?? [];
    const sum = (field: 'payinCommissionAmount' | 'payinTaxAmount'): string | null => {
      let cents = 0n;
      for (const meeting of meetings) {
        const amount = meeting[field];
        if (amount === null) return null;
        cents += BigInt(amount.replace('.', ''));
      }
      return this.decimalFromCents(cents);
    };
    return { payin: sum('payinCommissionAmount'), igv: sum('payinTaxAmount') };
  });
  readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('es-PE', {
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Lima',
    }).format(new Date(`${this.month()}-15T12:00:00-05:00`)),
  );
  readonly settlementBreakdown = computed(() => {
    const payout = this.selectedSettlement();
    if (!payout) return [];
    return [
      {
        label: 'Bruto liquidable',
        detail: 'Consultorías y servicios completados con RxH',
        amount: payout.grossAmount,
        isDeduction: false,
      },
      {
        label: 'Comisión total Payin',
        detail: 'Comisión e IGV de los cobros incluidos',
        amount: payout.payinTotalAmount,
        isDeduction: true,
      },
      {
        label: 'Comisión Hubsme',
        detail: `${payout.platformCommissionPercent}% del saldo después de Payin`,
        amount: payout.platformCommissionAmount,
        isDeduction: true,
      },
    ];
  });
  readonly payoutBreakdown = computed(() => {
    const payout = this.selectedSettlement();
    if (!payout) return [];
    return [
      {
        label: 'Comisión Payout',
        detail: `${payout.payoutCommissionPercent}% del saldo después de Payin · mínimo ${this.money(payout.payoutMinimumAmount, payout.currency)}${payout.payoutMinimumApplied ? ' aplicado' : ''}`,
        amount: payout.payoutCommissionAmount,
      },
      {
        label: 'IGV Payout',
        detail: `${payout.igvRate * 100}% de la comisión Payout`,
        amount: payout.payoutTaxAmount,
      },
    ];
  });

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

  onMonthChange(value: string) {
    if (!/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(value)) return;
    this.month.set(value);
    this.page.set(1);
    this.selectedSettlement.set(null);
    void this.loadPayouts();
  }

  async openSettlement(payout: MeetingMonthlyPayoutDto) {
    this.selectedSettlement.set(payout);
    this.expandedSettlementMeetingIds.set(new Set());
    this.showPayoutDiscount.set(false);
    const consultant = this.consultantOptions().find((item) => item.id === payout.consultantId);
    this.settlementPhotoUrl.set(consultant?.photoUrl ?? null);
    if (consultant) return;

    try {
      const response = await this.adminApi.api.consultantAdmin.consultantadminFindOne({
        id: payout.consultantId,
      });
      if (this.selectedSettlement()?.consultantId === payout.consultantId) {
        this.settlementPhotoUrl.set(response.data.photoUrl);
      }
    } catch {
      // Las iniciales mantienen el encabezado disponible si no se puede cargar la foto.
    }
  }
  closeSettlement() {
    this.selectedSettlement.set(null);
    this.expandedSettlementMeetingIds.set(new Set());
    this.showPayoutDiscount.set(false);
  }

  openPayout(payout: MeetingMonthlyPayoutDto): void {
    this.closeSettlement();
    this.settlementToPay.set(payout);
  }

  payoutActionLabel(payout: MeetingMonthlyPayoutDto): string {
    if (payout.transfer?.status === 'paid') return 'Ver pago';
    if (payout.transfer?.status === 'processing') return 'Ver estado';
    return 'Payout';
  }
  togglePayoutDiscount() {
    this.showPayoutDiscount.update((show) => !show);
  }
  toggleSettlementMeetingDetails(payoutId: number) {
    this.expandedSettlementMeetingIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(payoutId)) next.delete(payoutId);
      else next.add(payoutId);
      return next;
    });
  }
  async copyOperationNumber(operationNumber: string) {
    try {
      await navigator.clipboard.writeText(operationNumber);
      this.toastService.success('Número de operación copiado.');
    } catch {
      this.toastService.error('No se pudo copiar el número de operación.');
    }
  }
  retryLoading() {
    void this.loadPayouts();
  }

  amountBeforePayout(payout: MeetingMonthlyPayoutDto): string | null {
    const cents = this.amountBeforePayoutInCents(payout);
    return cents === null ? null : this.decimalFromCents(cents);
  }

  private amountBeforePayoutInCents(payout: MeetingMonthlyPayoutDto): bigint | null {
    const { netAfterPayinAmount, platformCommissionAmount } = payout;
    if (netAfterPayinAmount === null || platformCommissionAmount === null) return null;

    const cents =
      BigInt(netAfterPayinAmount.replace('.', '')) -
      BigInt(platformCommissionAmount.replace('.', ''));
    return cents >= 0n ? cents : null;
  }

  private decimalFromCents(cents: bigint): string {
    return `${cents / 100n}.${String(cents % 100n).padStart(2, '0')}`;
  }

  money(amount: string | null, currency = 'PEN'): string {
    if (amount === null) return 'Por conciliar';
    return `${currency === 'PEN' ? 'S/' : currency} ${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(amount))}`;
  }

  deduction(amount: string | null, currency: string): string {
    const formattedAmount = this.money(amount, currency);
    return amount !== null && Number(amount) > 0 ? `-${formattedAmount}` : formattedAmount;
  }

  statusLabel(status: PayoutStatus, isTest = false): string {
    return {
      open: 'En curso',
      pending: 'Pendiente',
      needs_review: 'Por conciliar',
      processing: 'Procesando pago',
      paid: isTest ? 'Prueba completada' : 'Pagado',
      empty: 'Sin saldo liquidable',
    }[status];
  }

  statusClass(status: PayoutStatus): string {
    return status === 'paid'
      ? 'bg-success/10 text-success'
      : status === 'needs_review'
        ? 'bg-warning/10 text-warning'
        : status === 'open' || status === 'processing'
          ? 'bg-secondary/10 text-secondary'
          : 'bg-muted/10 text-muted';
  }

  paymentMethodLabel(method: MeetingMonthlyPayoutItemDto['paymentMethod']): string {
    return {
      qr: 'QR · Monnet',
      'bank-transfer': 'Código bancario · Monnet',
      'yape-one-shot': 'Yape One Shot · Monnet',
      unidentified: 'Sin identificar',
    }[method];
  }

  inclusionLabel(meeting: MeetingMonthlyPayoutItemDto): string {
    if (meeting.exclusionReason === 'missing_receipt') return 'Pendiente de RxH';
    if (meeting.operationType === 'servicio' && meeting.exclusionReason === 'not_completed') return 'Servicio en curso';
    return meeting.exclusionReason === 'already_paid'
      ? 'Ya pagada'
      : meeting.exclusionReason === 'not_completed'
        ? 'No liquidable'
        : meeting.exclusionReason === 'payin_unknown'
          ? 'Por conciliar'
          : 'Incluida';
  }

  private currentMonth(): string {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
    }).formatToParts(new Date());
    return `${parts.find((part) => part.type === 'year')?.value}-${parts.find((part) => part.type === 'month')?.value}`;
  }

  meetingDate(value: string | null): string {
    if (!value) return 'Sin fecha';
    return formatInPeru(value, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
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
      const response = await this.adminApi.api.meetingAdmin.meetingadminGetRecordings({
        id: meetingId,
      });
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

  async openTraceabilityModal(payoutId: number) {
    this.showTraceabilityModal.set(true);
    this.traceabilityLoading.set(true);
    this.traceabilityData.set(null);
    this.expandedStepIds.set(new Set());
    this.showRootMeetingDetails.set(false);
    this.showLatestMeetingDetails.set(false);
    this.recordings.set([]);
    try {
      const response = await this.adminApi.api.meetingAdmin.meetingadminGetPayoutTraceability({
        id: payoutId,
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

  private async loadPayouts() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    this.loadError.set(false);
    this.payouts.set([]);
    this.meta.set(null);
    try {
      const response = await this.adminApi.api.meetingAdmin.meetingadminFindMonthlyPayouts({
        month: this.month(),
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
        this.loadError.set(true);
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
