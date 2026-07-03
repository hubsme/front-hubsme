import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ConsultantService } from '@service/admin/consultant.service';
import { MeetingService } from '@service/admin/meeting.service';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { PromotionCodeService } from '@service/admin/promotion-code.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';

type CheckoutData = ApiResponse<'mercadoPago', 'mercadopagoFindCheckout'>;
type MeetingData = ApiResponse<'meeting', 'findOne'>;
type CheckoutMeetingData = Pick<MeetingData, 'startTime' | 'durationMinutes'>;
type ConsultantData = ApiResponse<'consultant', 'findByUser'>;

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, ModalForm],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mercadoPagoService = inject(MercadoPagoService);
  private promotionCodeService = inject(PromotionCodeService);
  private meetingService = inject(MeetingService);
  private consultantService = inject(ConsultantService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  private paymentPolling: ReturnType<typeof setInterval> | null = null;
  private redirectingAfterPayment = false;
  private readonly paymentPollingIntervalMs = 1500;
  private readonly maxPollingDurationMs = 600000; // 10 minutos
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
  paymentUrl = computed(() => this.checkout()?.initPoint ?? this.checkout()?.sandboxInitPoint ?? null);
  paymentFrameUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.paymentUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
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
    return this.mercadoPagoService
      .findCheckout(checkoutId)
      .then((checkout) => this.applyCheckout(checkout));
  }

  private applyCheckout(checkout: CheckoutData) {
    this.checkout.set(checkout);

    if (checkout.meetingId) {
      return this.meetingService.findOne(checkout.meetingId).then((meeting) => {
        this.meeting.set(meeting);
        return this.consultantService.findByUser(meeting.consultantId);
      }).then((consultant) => this.consultant.set(consultant));
    }

    if (checkout.meetingDetails) {
      this.meeting.set({
        startTime: checkout.meetingDetails.startTime,
        durationMinutes: checkout.meetingDetails.durationMinutes,
      });

      return this.consultantService
        .findByUser(checkout.consultantId)
        .then((consultant) => this.consultant.set(consultant));
    }

    return Promise.reject(new Error('Informacion de reunion no encontrada en el checkout'));
  }

  private refreshPaymentStatus() {
    if (!this.paymentModalOpen() || this.redirectingAfterPayment) return;

    if (Date.now() - this.pollingStartTime > this.maxPollingDurationMs) {
      this.stopPaymentPolling();
      this.toastService.warning(
        'Tiempo de espera excedido. Si ya realizaste el pago, cierra el modal y ábrelo nuevamente para verificar.'
      );
      return;
    }

    this.mercadoPagoService
      .findCheckout(this.checkoutId())
      .then((checkout) => {
        this.checkout.set(checkout);
        if (checkout.meetingId) {
          this.completePaidFlow(checkout.meetingId);
        }
      })
      .catch(() => undefined);
  }

  private startPaymentPolling() {
    this.stopPaymentPolling();
    this.pollingStartTime = Date.now();
    this.refreshPaymentStatus();
    this.paymentPolling = setInterval(() => this.refreshPaymentStatus(), this.paymentPollingIntervalMs);
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
    this.toastService.success('Pago confirmado. Abriendo detalle de la reunion');
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

    const url = this.paymentUrl();
    if (!url) {
      this.toastService.error('La pasarela de pago no devolvió un enlace válido');
      return;
    }

    this.opening.set(true);
    this.paymentModalOpen.set(true);
    this.startPaymentPolling();
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
    if (this.isPaid() || this.redeemingPromotion()) return;

    this.redeemingPromotion.set(true);
    this.promotionCodeService
      .redeem({ checkoutId: this.checkoutId(), code })
      .then((result) => {
        this.toastService.success(result.message);
        this.completePaidFlow(result.meetingId);
      })
      .catch((error) =>
        this.toastService.error(this.hubsme.getErrorMessage(error)),
      )
      .finally(() => this.redeemingPromotion.set(false));
  }

  goBack() {
    this.router.navigate([buildPath(PATH.admin.pyme.meetings)]);
  }

  formatDate(date?: Date | string) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  currency(value: number) {
    return value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  consultantPhoto(consultant: ConsultantData) {
    return consultant.photoUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName)}`;
  }
}
