import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { AdminApiService } from '@service/admin-api.service';
import { HubsmeService } from '@service/hubsme.service';
import type {
  MeetingMonthlyPayoutDto,
  MonthlyPayoutDestinationDto,
  MonthlyPayoutOptionsDto,
  MonthlyPayoutTransferDto,
} from 'api/backend.api';

type PayoutMethod = MonthlyPayoutDestinationDto['method'];

@Component({
  selector: 'app-payout-dialog',
  imports: [ModalForm],
  templateUrl: './payout-dialog.html',
})
export class PayoutDialog implements OnInit {
  private readonly api = inject(AdminApiService).api.meetingAdmin;
  private readonly hubsme = inject(HubsmeService);

  readonly settlement = input.required<MeetingMonthlyPayoutDto>();
  readonly closed = output<void>();
  readonly changed = output<void>();

  readonly options = signal<MonthlyPayoutOptionsDto | null>(null);
  readonly selected = signal<PayoutMethod | null>(null);
  readonly busy = signal<'load' | 'send' | 'refresh' | null>(null);
  readonly error = signal<string | null>(null);
  readonly methods: Record<PayoutMethod, { label: string; icon?: string; logo?: string }> = {
    savings: { label: 'Cuenta de ahorros', icon: 'fa-piggy-bank' },
    current: { label: 'Cuenta corriente', icon: 'fa-building-columns' },
    yape: { label: 'Yape', logo: '/images/payment/yape.png' },
    plin: { label: 'Plin', logo: '/images/payment/plin.png' },
  };
  readonly transfer = computed(() => {
    const options = this.options();
    return options ? options.transfer : this.settlement().transfer;
  });
  readonly canSubmit = computed(() => {
    const options = this.options();
    return !!options?.confirmation && !this.busy() && options.destinations.some(
      (option) => option.method === this.selected() && !option.unavailableReason,
    );
  });
  readonly amountLabel = computed(() => {
    const amount = this.options()?.amount ?? this.settlement().consultantAmount;
    return amount === null ? '—' : new Intl.NumberFormat('es-PE', {
      style: 'currency', currency: this.settlement().currency,
    }).format(Number(amount));
  });

  ngOnInit(): void {
    void this.loadOptions();
  }

  select(option: MonthlyPayoutDestinationDto): void {
    if (!option.unavailableReason && !this.busy()) this.selected.set(option.method);
  }

  close(): void {
    if (this.busy() !== 'send' && this.busy() !== 'refresh') this.closed.emit();
  }

  async loadOptions(): Promise<void> {
    this.busy.set('load');
    this.error.set(null);
    try {
      const response = await this.api.meetingadminGetMonthlyPayoutOptions(this.scope());
      this.options.set(response.data);
    } catch (error) {
      this.error.set(this.hubsme.getErrorMessage(error));
    } finally {
      this.busy.set(null);
    }
  }

  async submit(): Promise<void> {
    const method = this.selected();
    const confirmation = this.options()?.confirmation;
    if (!this.canSubmit() || !method || !confirmation) return;

    this.busy.set('send');
    this.error.set(null);
    try {
      const response = await this.api.meetingadminCreateMonthlyPayout({ ...this.scope(), method, confirmation });
      await this.onTransfer(response.data);
    } catch (error) {
      this.options.update((options) => options && { ...options, confirmation: null });
      await this.loadOptions();
      this.error.set(this.hubsme.getErrorMessage(error));
      this.changed.emit();
    } finally {
      this.busy.set(null);
    }
  }

  async refresh(): Promise<void> {
    const transfer = this.transfer();
    if (transfer?.status !== 'processing' || this.busy()) return;

    this.busy.set('refresh');
    this.error.set(null);
    try {
      const response = await this.api.meetingadminRefreshMonthlyPayout({ orderId: transfer.orderId });
      await this.onTransfer(response.data);
    } catch (error) {
      this.error.set(this.hubsme.getErrorMessage(error));
    } finally {
      this.busy.set(null);
    }
  }

  private async onTransfer(transfer: MonthlyPayoutTransferDto): Promise<void> {
    this.selected.set(null);
    this.options.update((options) => options && { ...options, transfer, confirmation: null });
    if (transfer.status === 'rejected') await this.loadOptions();
    this.changed.emit();
  }

  private scope() {
    const { month, consultantId, currency } = this.settlement();
    return { month, consultantId, currency };
  }
}
