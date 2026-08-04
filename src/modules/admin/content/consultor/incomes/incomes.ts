import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ApiResponse, PaginationMetaDto } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type IncomeResponse = ApiResponse<'mercadoPago', 'mercadopagoFindPayments'>;
type IncomeItem = IncomeResponse['data'][number];
type IncomeDetail = ApiResponse<'mercadoPago', 'mercadopagoFindPayment'>;

@Component({
  selector: 'app-incomes',
  imports: [CommonModule, DatePipe, ModalForm, PaginationComponent],
  templateUrl: './incomes.html',
})
export class Incomes {
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

  readonly incomes = signal<IncomeItem[]>([]);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly year = signal(this.currentYear);
  readonly month = signal(new Date().getMonth() + 1);
  readonly monthInputValue = computed(
    () => `${this.year()}-${String(this.month()).padStart(2, '0')}`,
  );
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly selectedIncome = signal<IncomeDetail | null>(null);
  readonly showDetail = signal(false);
  readonly periodLabel = computed(() => {
    const selectedMonth = this.months.find((item) => item.value === this.month());
    return `${selectedMonth?.label ?? ''} ${this.year()}`;
  });

  constructor() {
    void this.loadIncomes();
  }

  async loadIncomes() {
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
      this.incomes.set(result.data);
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
    void this.loadIncomes();
  }

  async openIncome(income: IncomeItem) {
    const requestId = ++this.detailRequestSequence;
    this.selectedIncome.set(income);
    this.showDetail.set(true);
    this.detailLoading.set(true);

    try {
      const detail = await this.mercadoPagoService.findPayment(income.id);
      if (requestId === this.detailRequestSequence) this.selectedIncome.set(detail);
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
    this.selectedIncome.set(null);
    this.detailRequestSequence += 1;
  }

  paymentStatusLabel(status: IncomeItem['status']) {
    const labels: Record<IncomeItem['status'], string> = {
      created: 'Creado',
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      cancelled: 'Cancelado',
      expired: 'Expirado',
    };
    return labels[status];
  }

  paymentStatusClass(status: IncomeItem['status']) {
    const classes: Record<IncomeItem['status'], string> = {
      created: 'bg-secondary/10 text-secondary',
      pending: 'bg-warning/15 text-warning',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-danger/10 text-danger',
      cancelled: 'bg-text/10 text-muted',
      expired: 'bg-text/10 text-muted',
    };
    return classes[status];
  }

  counterparty(income: IncomeItem) {
    return income.pymeName ?? `PYME #${income.pymeId}`;
  }

  private resetAndLoad() {
    this.page.set(1);
    void this.loadIncomes();
  }
}
