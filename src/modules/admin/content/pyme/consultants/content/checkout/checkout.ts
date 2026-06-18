import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { ConsultantService } from '@service/admin/consultant.service';
import { MeetingService } from '@service/admin/meeting.service';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';

type CheckoutData = ApiResponse<'mercadoPago', 'mercadopagoFindCheckout'>;
type MeetingData = ApiResponse<'meeting', 'findOne'>;
type ConsultantData = ApiResponse<'consultant', 'findByUser'>;

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mercadoPagoService = inject(MercadoPagoService);
  private meetingService = inject(MeetingService);
  private consultantService = inject(ConsultantService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  checkout = signal<CheckoutData | null>(null);
  meeting = signal<MeetingData | null>(null);
  consultant = signal<ConsultantData | null>(null);
  loading = signal(false);
  opening = signal(false);

  checkoutId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? 0));
  paymentUrl = computed(() => this.checkout()?.initPoint ?? this.checkout()?.sandboxInitPoint ?? null);
  total = computed(() => Number(this.checkout()?.amount ?? 0));
  marketplaceFee = computed(() => Number(this.checkout()?.marketplaceFee ?? 0));

  ngOnInit(): void {
    this.load();
  }

  load() {
    const checkoutId = this.checkoutId();
    if (!checkoutId) {
      this.toastService.error('Checkout invalido');
      this.goBack();
      return;
    }

    this.loading.set(true);
    this.mercadoPagoService
      .findCheckout(checkoutId)
      .then((checkout) => {
        this.checkout.set(checkout);
        if (checkout.meetingId) {
          return this.meetingService.findOne(checkout.meetingId).then((meeting) => {
            this.meeting.set(meeting);
            return this.consultantService.findByUser(meeting.consultantId);
          });
        } else if (checkout.meetingDetails) {
          this.meeting.set({
            startTime: checkout.meetingDetails.startTime,
            durationMinutes: checkout.meetingDetails.durationMinutes,
          } as any);
          return this.consultantService.findByUser(checkout.consultantId);
        } else {
          throw new Error('Informacion de reunion no encontrada en el checkout');
        }
      })
      .then((consultant) => this.consultant.set(consultant))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  pay() {
    const url = this.paymentUrl();
    if (!url) {
      this.toastService.error('Mercado Pago no devolvio un enlace de pago');
      return;
    }

    this.opening.set(true);
    window.location.href = url;
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
