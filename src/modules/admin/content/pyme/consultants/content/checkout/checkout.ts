import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, DniLookupResultDto, MonnetPrepareCheckoutPaymentDto } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ConsultantService } from '@service/admin/consultant.service';
import { MeetingService } from '@service/admin/meeting.service';
import { MonnetCheckoutService } from '@service/admin/monnet-checkout.service';
import { PromotionCodeService } from '@service/admin/promotion-code.service';
import { HubsmeService } from '@service/hubsme.service';
import { SessionService } from '@service/session.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { formatInPeru } from '@function/date.function';
import { BANK_PAYMENT_CHANNELS } from './bank-payment-channels';

type CheckoutData = ApiResponse<'monnetCheckout', 'monnetcheckoutFindCheckout'>;
type MeetingData = ApiResponse<'meeting', 'findOne'>;
type CheckoutMeetingData = Pick<
  MeetingData,
  'startTime' | 'proposedStartTimes' | 'durationMinutes'
>;
type ConsultantData = ApiResponse<'consultant', 'findByUser'>;
type PromotionPreview = ApiResponse<'promotionCode', 'promotioncodeValidate'>;
type PaymentMethod = NonNullable<MonnetPrepareCheckoutPaymentDto['paymentMethod']>;
type PaymentOption = {
  method: PaymentMethod;
  label: string;
  description: string;
  brands: readonly { name: string; asset: string }[];
  additionalBrands?: readonly string[];
};

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, ModalForm],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private monnetCheckoutService = inject(MonnetCheckoutService);
  private promotionCodeService = inject(PromotionCodeService);
  private meetingService = inject(MeetingService);
  private consultantService = inject(ConsultantService);
  private hubsme = inject(HubsmeService);
  private sessionService = inject(SessionService);
  private toastService = inject(ToastService);
  private dniLookup?: AbortController;
  private paymentSession?: AbortController;
  private paymentClock?: ReturnType<typeof setInterval>;
  private paymentPolling?: ReturnType<typeof setTimeout>;
  private paymentCodeFeedback?: ReturnType<typeof setTimeout>;
  private redirectingAfterPayment = false;
  private destroyed = false;
  private readonly paymentPollingIntervalMs = 5000;
  private readonly maxPollingDurationMs = 2100000; // 35 minutos
  private pollingEndsAt = 0;
  private readonly nextPaymentCheckAt = signal<number | null>(null);

  readonly qrPaymentBrands = [
    { name: 'Yape', asset: 'yape.png' },
    { name: 'Plin', asset: 'plin.png' },
  ] as const;

  readonly paymentOptions: readonly PaymentOption[] = [
    {
      method: 'qr',
      label: 'Código QR',
      description: 'Escanea con Yape, Plin o tu app bancaria.',
      brands: this.qrPaymentBrands,
    },
    {
      method: 'bank-transfer',
      label: 'App de tu banco',
      description: 'Paga servicios con un código de Monnet.',
      brands: BANK_PAYMENT_CHANNELS.slice(0, 3),
      additionalBrands: BANK_PAYMENT_CHANNELS.slice(3).map((channel) => channel.name),
    },
  ];

  checkout = signal<CheckoutData | null>(null);
  meeting = signal<MeetingData | CheckoutMeetingData | null>(null);
  consultant = signal<ConsultantData | null>(null);
  loading = signal(false);
  opening = signal(false);
  paymentModalOpen = signal(false);
  selectedPaymentMethod = signal<PaymentMethod>('qr');
  promotionCode = signal('');
  appliedPromotion = signal<PromotionPreview | null>(null);
  promotionError = signal('');
  validatingPromotion = signal(false);
  redeemingPromotion = signal(false);
  paymentBusy = computed(
    () => this.opening() || this.validatingPromotion() || this.redeemingPromotion(),
  );

  checkoutId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? 0));
  now = signal(Date.now());
  checkingPayment = signal(false);
  nextPaymentCheckIn = computed(() => {
    const next = this.nextPaymentCheckAt();
    return next === null ? null : Math.max(1, Math.ceil((next - this.now()) / 1000));
  });
  isBankPayment = computed(() => this.checkout()?.paymentMethod === 'bank-transfer');
  selectedBankCode = signal<string | null>(null);
  paymentCodeCopied = signal(false);
  bankPaymentChannels = computed(() => {
    const codes = this.checkout()?.paymentBankCodes;
    return codes
      ? BANK_PAYMENT_CHANNELS.filter((channel) => codes.includes(channel.code))
      : BANK_PAYMENT_CHANNELS;
  });
  selectedBank = computed(() => {
    const channels = this.bankPaymentChannels();
    return channels.find((channel) => channel.code === this.selectedBankCode()) ?? channels[0];
  });
  paymentUrl = computed(() => this.checkout()?.paymentUrl ?? null);
  qrCode = computed(() => this.checkout()?.qrCode ?? null);
  isExpired = computed(() => {
    const expiresAt = this.checkout()?.expiresAt;
    return (
      this.checkout()?.status === 'expired' ||
      Boolean(expiresAt && Date.parse(expiresAt) <= this.now())
    );
  });
  remainingTime = computed(() => {
    const expiresAt = Date.parse(this.checkout()?.expiresAt ?? '');
    if (!Number.isFinite(expiresAt)) return '';
    const seconds = Math.max(0, Math.ceil((expiresAt - this.now()) / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const parts = hours ? [hours, minutes, seconds % 60] : [minutes, seconds % 60];
    return parts.map((part) => String(part).padStart(2, '0')).join(':');
  });
  payerDni = signal('');
  payer = signal<DniLookupResultDto | null>(null);
  lookingUpDni = signal(false);
  dniLookupError = signal('');

  subtotal = computed(() => Number(this.checkout()?.amount ?? 0));
  total = computed(() => Number(this.appliedPromotion()?.total ?? this.subtotal()));
  discount = computed(() => this.subtotal() - this.total());
  currencySymbol = computed(() => (this.checkout()?.currency === 'USD' ? 'US$' : 'S/'));
  isPaid = computed(() => {
    const checkout = this.checkout();
    return checkout?.status === 'approved' || Boolean(checkout?.meetingId);
  });

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.dniLookup?.abort();
    this.stopPaymentPolling();
  }

  load() {
    const checkoutId = this.checkoutId();
    if (!checkoutId) {
      this.toastService.error('Checkout invalido');
      this.goBack();
      return;
    }

    this.loading.set(true);
    this.hydrateCheckout(checkoutId)
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private async hydrateCheckout(checkoutId: number) {
    let checkout = await this.monnetCheckoutService.findCheckout(checkoutId);
    if (this.canSyncPayment(checkout)) {
      checkout = await this.monnetCheckoutService
        .syncCheckoutPayment(checkoutId)
        .catch(() => checkout);
    }
    if (!this.destroyed) return this.applyCheckout(checkout);
  }

  private canSyncPayment(checkout: CheckoutData | null): boolean {
    return (
      this.sessionService.session()?.organization?.membershipRole === 'owner' &&
      !!checkout?.paymentMethod &&
      !checkout.meetingId &&
      checkout.status !== 'approved'
    );
  }

  private applyCheckout(checkout: CheckoutData) {
    if (checkout.id !== this.checkout()?.id || !checkout.canCreatePayment) {
      this.appliedPromotion.set(null);
    }
    this.now.set(Date.now());
    this.checkout.set(checkout);

    if (checkout.meetingId) {
      return this.meetingService
        .findOne(checkout.meetingId)
        .then((meeting) => {
          this.meeting.set(meeting);
          return this.consultantService.findByUser(meeting.consultantId);
        })
        .then((consultant) => this.consultant.set(consultant));
    }

    if (checkout.meetingDetails) {
      this.meeting.set({
        startTime: checkout.meetingDetails.startTime,
        proposedStartTimes: checkout.meetingDetails.proposedStartTimes,
        durationMinutes: checkout.meetingDetails.durationMinutes,
      });

      return this.consultantService
        .findByUser(checkout.consultantId)
        .then((consultant) => this.consultant.set(consultant));
    }

    return Promise.reject(new Error('Informacion de reunion no encontrada en el checkout'));
  }

  async refreshPaymentStatus(manual = true) {
    const session = this.paymentSession;
    if (!session || this.redirectingAfterPayment || this.checkingPayment()) return;

    clearTimeout(this.paymentPolling);
    this.nextPaymentCheckAt.set(null);
    this.checkingPayment.set(true);
    try {
      const checkout = await this.monnetCheckoutService.syncCheckoutPayment(
        this.checkoutId(),
        session.signal,
      );
      if (session.signal.aborted) return;
      this.checkout.set(checkout);
      if (checkout.status === 'approved' && checkout.meetingId) {
        this.completePaidFlow(checkout.meetingId);
      } else if (checkout.status === 'expired' && checkout.canCreatePayment) {
        this.stopPaymentPolling();
        this.paymentModalOpen.set(false);
      }
    } catch (error) {
      if (manual && !session.signal.aborted) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (!session.signal.aborted) {
        this.checkingPayment.set(false);
        this.schedulePaymentCheck();
      }
    }
  }

  private startPaymentPolling() {
    this.stopPaymentPolling();
    this.selectedBankCode.set(null);
    this.paymentSession = new AbortController();
    const now = Date.now();
    this.now.set(now);
    this.pollingEndsAt = now + this.maxPollingDurationMs;
    this.paymentClock = setInterval(() => this.now.set(Date.now()), 250);
    if (this.isExpired() && this.canSyncPayment(this.checkout())) void this.refreshPaymentStatus(false);
    else this.schedulePaymentCheck();
  }

  private schedulePaymentCheck() {
    const now = Date.now();
    const next = now + this.paymentPollingIntervalMs;
    this.now.set(now);
    if (!this.canSyncPayment(this.checkout()) || next > this.pollingEndsAt) return;

    this.nextPaymentCheckAt.set(next);
    this.paymentPolling = setTimeout(
      () => void this.refreshPaymentStatus(false),
      this.paymentPollingIntervalMs,
    );
  }

  private stopPaymentPolling() {
    this.paymentSession?.abort();
    this.paymentSession = undefined;
    clearInterval(this.paymentClock);
    clearTimeout(this.paymentPolling);
    clearTimeout(this.paymentCodeFeedback);
    this.paymentCodeCopied.set(false);
    this.nextPaymentCheckAt.set(null);
    this.checkingPayment.set(false);
  }

  private completePaidFlow(meetingId: number) {
    if (this.redirectingAfterPayment) return;
    this.redirectingAfterPayment = true;
    this.stopPaymentPolling();
    this.paymentModalOpen.set(false);
    this.opening.set(false);
    this.toastService.success('Pago confirmado. La reunión queda por confirmación del consultor');
    this.router.navigate([buildPath(PATH.admin.pyme.meetings), meetingId], { replaceUrl: true });
  }

  updatePayerDni(documentNumber: string) {
    this.dniLookup?.abort();
    this.dniLookup = undefined;
    this.payerDni.set(documentNumber);
    this.payer.set(null);
    this.lookingUpDni.set(false);
    this.dniLookupError.set('');
    void this.lookupPayerDni();
  }

  async lookupPayerDni() {
    const documentNumber = this.payerDni();
    if (!/^\d{8}$/.test(documentNumber) || this.lookingUpDni()) return;

    const lookup = new AbortController();
    this.dniLookup = lookup;
    this.lookingUpDni.set(true);
    this.dniLookupError.set('');
    try {
      const payer = await this.monnetCheckoutService.lookupDni(documentNumber, lookup.signal);
      if (!lookup.signal.aborted) this.payer.set(payer);
    } catch (error) {
      if (!lookup.signal.aborted) this.dniLookupError.set(this.hubsme.getErrorMessage(error));
    } finally {
      if (!lookup.signal.aborted) {
        this.dniLookup = undefined;
        this.lookingUpDni.set(false);
      }
    }
  }

  pay() {
    if (this.paymentBusy()) return;
    if (this.isPaid()) {
      const meetingId = this.checkout()?.meetingId;
      if (meetingId) {
        this.completePaidFlow(meetingId);
      } else {
        this.toastService.success('Este checkout ya fue pagado');
      }
      return;
    }

    const current = this.checkout();
    if (!current) return;
    if (!current.canCreatePayment) {
      this.paymentModalOpen.set(true);
      this.startPaymentPolling();
      return;
    }
    const promotion = this.appliedPromotion();
    if (promotion) {
      void this.redeemPromotionCode(promotion.code);
      return;
    }

    const payer = this.payer();
    if (!payer) return;

    this.opening.set(true);
    this.monnetCheckoutService
      .prepareCheckoutPayment(this.checkoutId(), {
        paymentMethod: this.selectedPaymentMethod(),
        payinCustomerDocument: this.payerDni(),
        payinCustomerName: payer.firstName,
        payinCustomerLastName: payer.lastName,
      })
      .then((checkout) => {
        if (this.destroyed) return;
        this.checkout.set(checkout);
        if (checkout.status === 'approved' && checkout.meetingId) {
          this.completePaidFlow(checkout.meetingId);
          return;
        }
        this.paymentModalOpen.set(true);
        this.startPaymentPolling();
      })
      .catch((error) => {
        this.toastService.error(this.hubsme.getErrorMessage(error));
        this.hydrateCheckout(this.checkoutId()).catch(() => undefined);
      })
      .finally(() => this.opening.set(false));
  }

  closePaymentModal() {
    this.stopPaymentPolling();
    this.paymentModalOpen.set(false);
    this.opening.set(false);
    this.load();
  }

  async copyPaymentCode(code: string) {
    const session = this.paymentSession;
    if (!session) return;

    try {
      await navigator.clipboard.writeText(code);
      if (session.signal.aborted) return;
      clearTimeout(this.paymentCodeFeedback);
      this.paymentCodeCopied.set(true);
      this.paymentCodeFeedback = setTimeout(() => this.paymentCodeCopied.set(false), 2500);
    } catch {
      if (!session.signal.aborted) {
        this.toastService.warning('Puedes seleccionar el código y copiarlo manualmente.');
      }
    }
  }

  updatePromotionCode(code: string) {
    this.promotionCode.set(code);
    this.appliedPromotion.set(null);
    this.promotionError.set('');
  }

  async applyPromotionCode() {
    const code = this.promotionCode().trim();
    const checkout = this.checkout();
    if (
      !code ||
      this.paymentBusy() ||
      this.isPaid() ||
      !checkout?.canCreatePayment ||
      checkout.status === 'expired'
    )
      return;

    this.validatingPromotion.set(true);
    this.appliedPromotion.set(null);
    this.promotionError.set('');
    try {
      const preview = await this.promotionCodeService.validate({
        checkoutId: this.checkoutId(),
        code,
      });
      if (this.destroyed) return;
      this.promotionCode.set(preview.code);
      this.appliedPromotion.set(preview);
    } catch (error) {
      if (!this.destroyed) this.promotionError.set(this.hubsme.getErrorMessage(error));
    } finally {
      this.validatingPromotion.set(false);
    }
  }

  private async redeemPromotionCode(code: string) {
    this.redeemingPromotion.set(true);
    try {
      const result = await this.promotionCodeService.redeem({
        checkoutId: this.checkoutId(),
        code,
      });
      if (!this.destroyed) this.completePaidFlow(result.meetingId);
    } catch (error) {
      if (this.destroyed) return;
      this.appliedPromotion.set(null);
      this.promotionError.set(this.hubsme.getErrorMessage(error));
      await this.hydrateCheckout(this.checkoutId()).catch(() => undefined);
    } finally {
      this.redeemingPromotion.set(false);
    }
  }

  goBack() {
    this.router.navigate([buildPath(PATH.admin.pyme.meetings)]);
  }

  formatDate(date?: Date | string) {
    if (!date) return '-';
    return formatInPeru(date, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  }

  formatTime(date: Date | string) {
    return formatInPeru(date, { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  proposedTimes(meeting: MeetingData | CheckoutMeetingData) {
    return (
      meeting.proposedStartTimes?.length ? meeting.proposedStartTimes : [meeting.startTime]
    ).filter((value): value is string => Boolean(value));
  }

  currency(value: number) {
    return value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  consultantPhoto(consultant: ConsultantData) {
    return (
      consultant.photoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName)}`
    );
  }
}
