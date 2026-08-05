import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ApiResponse, PaginationMetaDto } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type PaymentHistoryResponse = ApiResponse<'mercadoPago', 'mercadopagoFindPayments'>;
type PaymentHistoryItem = PaymentHistoryResponse['data'][number];
type PaymentDetail = ApiResponse<'mercadoPago', 'mercadopagoFindPayment'>;

@Component({
  selector: 'app-payment-history',
  imports: [CommonModule, DatePipe, ModalForm, PaginationComponent],
  templateUrl: './payment-history.html',
})
export class PaymentHistory {
  private readonly mercadoPagoService = inject(MercadoPagoService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private requestSequence = 0;
  private detailRequestSequence = 0;

  readonly currentYear = new Date().getFullYear();
  readonly pageSize = 10;
  readonly months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  readonly payments = signal<PaymentHistoryItem[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly year = signal(this.currentYear);
  readonly month = signal(new Date().getMonth() + 1);
  readonly monthInputValue = computed(
    () => `${this.year()}-${String(this.month()).padStart(2, '0')}`,
  );
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly selectedPayment = signal<PaymentDetail | null>(null);
  readonly showDetail = signal(false);
  readonly periodLabel = computed(() => {
    const selectedMonth = this.months.find((item) => item.value === this.month());
    return `${selectedMonth?.label ?? ''} ${this.year()}`;
  });

  constructor() {
    void this.loadPayments();
  }

  async loadPayments() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);

    try {
      const result = await this.mercadoPagoService.findPayments({
        page: this.page(),
        limit: this.pageSize,
        year: this.year(),
        month: this.month(),
      });
      if (requestId !== this.requestSequence) return;
      this.payments.set(result.data);
      this.meta.set(result.meta);
    } catch (error) {
      if (requestId === this.requestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  changeMonth(event: Event) {
    const input = event.target as HTMLInputElement;
    const [selectedYear, selectedMonth] = input.value.split('-').map(Number);
    if (
      !Number.isInteger(selectedYear) ||
      !Number.isInteger(selectedMonth) ||
      selectedYear < 2000 ||
      selectedMonth < 1 ||
      selectedMonth > 12
    ) {
      return;
    }
    this.year.set(selectedYear);
    this.month.set(selectedMonth);
    this.resetAndLoad();
  }

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadPayments();
  }

  async openPayment(payment: PaymentHistoryItem) {
    const requestId = ++this.detailRequestSequence;
    this.selectedPayment.set(payment);
    this.showDetail.set(true);
    this.detailLoading.set(true);

    try {
      const detail = await this.mercadoPagoService.findPayment(payment.id);
      if (requestId === this.detailRequestSequence) this.selectedPayment.set(detail);
    } catch (error) {
      if (requestId === this.detailRequestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.detailRequestSequence) this.detailLoading.set(false);
    }
  }

  closeDetail() {
    this.showDetail.set(false);
    this.selectedPayment.set(null);
    this.detailRequestSequence += 1;
  }

  paymentStatusLabel(status: PaymentHistoryItem['status']) {
    const labels: Record<PaymentHistoryItem['status'], string> = {
      created: 'Creado',
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      cancelled: 'Cancelado',
      expired: 'Expirado',
    };
    return labels[status];
  }

  paymentStatusClass(status: PaymentHistoryItem['status']) {
    const classes: Record<PaymentHistoryItem['status'], string> = {
      created: 'bg-secondary/10 text-secondary',
      pending: 'bg-warning/15 text-warning',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-danger/10 text-danger',
      cancelled: 'bg-text/10 text-muted',
      expired: 'bg-text/10 text-muted',
    };
    return classes[status];
  }

  paymentMethodLabel(payment: PaymentHistoryItem) {
    if (payment.paymentMethod === 'promotion_code') return 'Cupón';

    const methodId = payment.paymentMethodId?.toLowerCase();
    const typeId = payment.paymentTypeId?.toLowerCase();

    if (methodId === 'yape') return 'Yape';
    if (methodId === 'account_money' || typeId === 'account_money') {
      return 'Saldo de Mercado Pago';
    }

    const labels: Record<string, string> = {
      credit_card: 'Tarjeta de crédito',
      debit_card: 'Tarjeta de débito',
      prepaid_card: 'Tarjeta prepago',
      bank_transfer: 'Transferencia bancaria',
      ticket: 'Pago en efectivo',
      atm: 'Pago por cajero',
      digital_currency: 'Billetera digital',
    };

    return (typeId && labels[typeId]) || 'Pago en línea';
  }

  paymentMethodIcon(payment: PaymentHistoryItem) {
    if (payment.paymentMethod === 'promotion_code') return 'fa-ticket';

    const methodId = payment.paymentMethodId?.toLowerCase();
    const typeId = payment.paymentTypeId?.toLowerCase();

    if (methodId === 'yape') return 'fa-mobile-screen-button';
    if (methodId === 'account_money' || typeId === 'account_money') return 'fa-wallet';
    if (typeId === 'bank_transfer') return 'fa-building-columns';
    if (typeId === 'ticket' || typeId === 'atm') return 'fa-money-bill-wave';
    return 'fa-credit-card';
  }

  counterparty(payment: PaymentHistoryItem) {
    return payment.consultantName ?? `Consultor #${payment.consultantId}`;
  }

  private resetAndLoad() {
    this.page.set(1);
    void this.loadPayments();
  }
}
