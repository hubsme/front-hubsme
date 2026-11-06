import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, MonnetPrepareCheckoutPaymentDto } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ConsultantService } from '@service/admin/consultant.service';
import { MeetingService } from '@service/admin/meeting.service';
import { MonnetCheckoutService } from '@service/admin/monnet-checkout.service';
import { PromotionCodeService } from '@service/admin/promotion-code.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { formatInPeru } from '@function/date.function';

type CheckoutData = ApiResponse<'monnetCheckout', 'monnetcheckoutFindCheckout'>;
type MeetingData = ApiResponse<'meeting', 'findOne'>;
type CheckoutMeetingData = Pick<
  MeetingData,
  'startTime' | 'proposedStartTimes' | 'durationMinutes'
>;
type ConsultantData = ApiResponse<'consultant', 'findByUser'>;

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
  private toastService = inject(ToastService);
  private paymentPolling: ReturnType<typeof setInterval> | null = null;
  private redirectingAfterPayment = false;
  private destroyed = false;
  private readonly paymentPollingIntervalMs = 5000;
  private readonly maxPollingDurationMs = 2100000; // 35 minutos
  private pollingStartTime = 0;

  checkout = signal<CheckoutData | null>(null);
  meeting = signal<MeetingData | CheckoutMeetingData | null>(null);
  consultant = signal<ConsultantData | null>(null);
  loading = signal(false);
  opening = signal(false);
  paymentModalOpen = signal(false);
  promotionCode = signal('');
  redeemingPromotion = signal(false);

  checkoutId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? 0));
  now = signal(Date.now());
  checkingPayment = signal(false);
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
    const expiresAt = this.checkout()?.expiresAt;
    if (!expiresAt) return '';
    const seconds = Math.max(0, Math.ceil((Date.parse(expiresAt) - this.now()) / 1000));
    return `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  });
  billing = signal<MonnetPrepareCheckoutPaymentDto>({
    payinCustomerName: this.hubsme.currentUser().firstName ?? '',
    payinCustomerLastName: this.hubsme.currentUser().lastName ?? '',
    payinCustomerEmail: this.hubsme.currentUser().email,
    payinCustomerPhone: '',
    payinCustomerTypeDocument: 'DNI',
    payinCustomerDocument: '',
    payinCustomerAddress: '',
    payinCustomerCity: '',
    payinCustomerRegion: '',
    payinCustomerZipCode: '',
  });
  readonly billingFields: {
    key: keyof Omit<MonnetPrepareCheckoutPaymentDto, 'payinCustomerTypeDocument'>;
    label: string;
    type: string;
    maxLength: number;
    pattern?: string;
  }[] = [
    { key: 'payinCustomerName', label: 'Nombres', type: 'text', maxLength: 30 },
    { key: 'payinCustomerLastName', label: 'Apellidos', type: 'text', maxLength: 30 },
    { key: 'payinCustomerEmail', label: 'Correo electrónico', type: 'email', maxLength: 50 },
    {
      key: 'payinCustomerPhone',
      label: 'Celular (9 dígitos, sin +51)',
      type: 'tel',
      maxLength: 9,
      pattern: '[0-9]{9}',
    },
    {
      key: 'payinCustomerDocument',
      label: 'DNI del pagador',
      type: 'text',
      maxLength: 8,
      pattern: '[0-9]{8}',
    },
    { key: 'payinCustomerAddress', label: 'Dirección', type: 'text', maxLength: 200 },
    { key: 'payinCustomerCity', label: 'Ciudad', type: 'text', maxLength: 80 },
    { key: 'payinCustomerRegion', label: 'Región', type: 'text', maxLength: 80 },
    {
      key: 'payinCustomerZipCode',
      label: 'Código postal',
      type: 'text',
      maxLength: 5,
      pattern: '[0-9]{5}',
    },
  ];

  updateBilling(key: keyof MonnetPrepareCheckoutPaymentDto, value: string) {
    this.billing.update((billing) => ({ ...billing, [key]: value }));
  }

  total = computed(() => Number(this.checkout()?.amount ?? 0));
  marketplaceFee = computed(() => Number(this.checkout()?.marketplaceFee ?? 0));
  isPaid = computed(() => {
    const checkout = this.checkout();
    return checkout?.status === 'approved' || Boolean(checkout?.meetingId);
  });

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
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

  private hydrateCheckout(checkoutId: number) {
    return this.monnetCheckoutService
      .findCheckout(checkoutId)
      .then((checkout) => this.applyCheckout(checkout));
  }

  private applyCheckout(checkout: CheckoutData) {
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

  async refreshPaymentStatus() {
    if (this.redirectingAfterPayment || this.checkingPayment()) return;
    this.now.set(Date.now());
    if (this.paymentPolling && Date.now() - this.pollingStartTime > this.maxPollingDurationMs) {
      this.stopPaymentPolling();
      this.toastService.warning('La espera terminó. Puedes verificar el pago nuevamente.');
      return;
    }
    this.checkingPayment.set(true);
    try {
      const checkout = await this.monnetCheckoutService.syncCheckoutPayment(this.checkoutId());
      if (this.destroyed) return;
      this.checkout.set(checkout);
      if (checkout.status === 'approved' && checkout.meetingId)
        this.completePaidFlow(checkout.meetingId);
    } catch (error) {
      if (!this.paymentPolling) this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.checkingPayment.set(false);
    }
  }

  private startPaymentPolling() {
    this.stopPaymentPolling();
    this.pollingStartTime = Date.now();
    this.refreshPaymentStatus();
    this.paymentPolling = setInterval(
      () => this.refreshPaymentStatus(),
      this.paymentPollingIntervalMs,
    );
  }

  private stopPaymentPolling() {
    if (!this.paymentPolling) return;
    clearInterval(this.paymentPolling);
    this.paymentPolling = null;
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

  pay() {
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
    this.opening.set(true);
    this.monnetCheckoutService
      .prepareCheckoutPayment(this.checkoutId(), this.billing())
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

  redeemPromotionCode() {
    const code = this.promotionCode().trim();
    if (!code) {
      this.toastService.warning('Ingresa un código promocional');
      return;
    }
    if (this.isPaid() || this.redeemingPromotion() || !this.checkout()?.canCreatePayment) return;

    this.redeemingPromotion.set(true);
    this.promotionCodeService
      .redeem({ checkoutId: this.checkoutId(), code })
      .then((result) => {
        this.toastService.success(result.message);
        this.completePaidFlow(result.meetingId);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.redeemingPromotion.set(false));
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
      hour: '2-digit',
      minute: '2-digit',
    });
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
