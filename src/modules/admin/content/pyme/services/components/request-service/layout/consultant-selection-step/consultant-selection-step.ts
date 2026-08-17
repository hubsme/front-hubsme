import { Component, inject } from '@angular/core';
import { ConsultantInputSearch } from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import { TimeSlotPicker } from '@module/admin/components/time-slot-picker/time-slot-picker';
import { InitialMeetingSlot } from '../../../../utils/service-request-wizard.types';
import { PymeServicesStore } from '../../../../services.store';
import { dateKeyInPeru } from '@function/date.function';

@Component({
  selector: 'app-consultant-selection-step',
  imports: [ConsultantInputSearch, TimeSlotPicker],
  templateUrl: './consultant-selection-step.html',
})
export class ConsultantSelectionStep {
  readonly store = inject(PymeServicesStore);

  isSelected(consultantId: number): boolean {
    return this.store.isConsultantSelected(consultantId);
  }

  meetingTimes(consultantId: number): string[] {
    return this.store.initialMeetingTimesFor(consultantId);
  }

  availabilityFor(consultantId: number): InitialMeetingSlot[] {
    return this.store.initialMeetingAvailabilityFor(consultantId);
  }

  disabledValues(consultantId: number, optionIndex: number): string[] {
    const selectedDays = new Set(
      this.meetingTimes(consultantId)
        .filter((value, index) => index !== optionIndex && Boolean(value))
        .map((value) => this.dateKey(value)),
    );
    return this.availabilityFor(consultantId)
      .filter((slot) => selectedDays.has(this.dateKey(slot.value)))
      .map((slot) => slot.value);
  }

  hasEnoughDays(consultantId: number): boolean {
    const dates = new Set(
      this.availabilityFor(consultantId).map((slot) => this.dateKey(slot.value)),
    );
    return dates.size >= 3;
  }

  private dateKey(value: string): string {
    return dateKeyInPeru(value) || value.slice(0, 10);
  }
}
