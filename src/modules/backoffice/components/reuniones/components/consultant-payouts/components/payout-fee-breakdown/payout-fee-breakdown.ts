import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import type { MeetingConsultantPayoutResultDto } from 'api/backend.api';

@Component({
  selector: 'app-payout-fee-breakdown',
  imports: [DecimalPipe],
  templateUrl: './payout-fee-breakdown.html',
})
export class PayoutFeeBreakdown {
  readonly payout =
    input.required<
      Pick<
        MeetingConsultantPayoutResultDto,
        'amount' | 'currency' | 'grossAmount' | 'platformCommissionAmount' | 'feeBreakdown'
      >
    >();
  readonly currency = computed(() =>
    this.payout().currency === 'PEN' ? 'S/' : this.payout().currency,
  );
  readonly rows = computed(() => {
    const payout = this.payout();
    const fees = payout.feeBreakdown;
    if (!fees) {
      return [
        {
          label: 'Comisión Hubsme',
          detail: 'Importe registrado',
          amount: payout.platformCommissionAmount,
        },
      ];
    }
    const rows = [
      {
        label:
          fees.payinMethod === 'bank-transfer'
            ? 'Comisión Payin · Código bancario'
            : 'Comisión Payin',
        detail: this.commissionDetail(
          fees.payinCommissionPercent,
          fees.payinMinimumAmount,
          fees.payinMinimumApplied,
        ),
        amount: fees.payinCommissionAmount,
      },
      {
        label: 'Impuesto Payin',
        detail: `${fees.payinTaxPercent}% de la comisión Payin`,
        amount: fees.payinTaxAmount,
      },
      {
        label: 'Comisión Payout',
        detail: this.commissionDetail(
          fees.payoutCommissionPercent,
          fees.payoutMinimumAmount,
          fees.payoutMinimumApplied,
        ),
        amount: fees.payoutCommissionAmount,
      },
      {
        label: 'Impuesto Payout',
        detail: `${fees.payoutTaxPercent}% de la comisión Payout`,
        amount: fees.payoutTaxAmount,
      },
      {
        label: 'Comisión Hubsme',
        detail: `${fees.platformCommissionPercent}% del total`,
        amount: fees.platformCommissionAmount,
      },
    ];
    return fees.version === 3 ? rows.slice(0, 2) : rows;
  });

  private commissionDetail(
    percent: number,
    minimum: string | undefined,
    applied: boolean | undefined,
  ): string {
    const detail = `${percent}% del total`;
    return minimum && Number(minimum) > 0
      ? `${detail} · mínimo ${this.currency()} ${minimum}${applied ? ' aplicado' : ''}`
      : detail;
  }
}
