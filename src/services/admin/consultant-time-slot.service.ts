import { Injectable, inject } from '@angular/core';
import { ConsultantAvailabilityService } from '@service/admin/consultant-availability.service';
import { ApiResponse } from 'api/backend.api';
import { formatInPeru, monthKeyInPeru, peruDateTimeToUtc, peruMonthRange } from '@function/date.function';

type AvailabilityMonth = ApiResponse<
  'consultantAvailability',
  'consultant-availabilityVisibleMonth'
>['data'][number];

export type ConsultantTimeSlot = {
  value: string;
  label: string;
  dateLabel: string;
  timeLabel: string;
};

@Injectable({ providedIn: 'root' })
export class ConsultantTimeSlotService {
  private readonly consultantAvailabilityService = inject(ConsultantAvailabilityService);

  async loadAvailableSlots(
    consultantId: number,
    windowStart: Date,
    windowEnd: Date,
  ): Promise<ConsultantTimeSlot[]> {
    if (windowStart >= windowEnd) return [];

    const requests = this.monthsWithinWindow(windowStart, windowEnd).map((month) =>
      this.consultantAvailabilityService.visibleMonth({
        consultantId,
        year: month.getUTCFullYear(),
        month: month.getUTCMonth() + 1,
      }),
    );
    const results = await Promise.allSettled(requests);
    const months = results.flatMap((result) =>
      result.status === 'fulfilled' ? result.value.data : [],
    );
    return this.buildSlots(months, windowStart, windowEnd);
  }

  async loadAvailableMonth(consultantId: number, monthKey: string): Promise<ConsultantTimeSlot[]> {
    const [year, month] = monthKey.split('-').map(Number);
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return [];
    }

    const response = await this.consultantAvailabilityService.visibleMonth({
      consultantId,
      year,
      month,
    });
    const { start: windowStart, end } = peruMonthRange(monthKey);
    const windowEnd = new Date(end.getTime() - 1);
    return this.buildSlots(response.data, windowStart, windowEnd);
  }

  private buildSlots(
    months: AvailabilityMonth[],
    windowStart: Date,
    windowEnd: Date,
  ): ConsultantTimeSlot[] {
    const slots = new Map<string, ConsultantTimeSlot>();

    for (const availability of months) {
      const [year, month] = availability.month.split('-').map(Number);
      for (const [day, times] of Object.entries(availability.availableSchedule ?? {})) {
        const availableTimes = new Set(times);
        for (const time of times) {
          const startTime = this.fromLimaCalendarParts(year, month - 1, Number(day), time);
          const nextHalfHourValue = this.addMinutesToTimeValue(time, 30);
          const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
          if (
            startTime < windowStart ||
            endTime > windowEnd ||
            !availableTimes.has(nextHalfHourValue)
          ) {
            continue;
          }

          const value = startTime.toISOString();
          const dateLabel = formatInPeru(startTime, {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
          });
          const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          const timeLabel = `${formatInPeru(startTime, timeOptions)} – ${formatInPeru(endTime, timeOptions)}`;
          slots.set(value, {
            value,
            label: `${dateLabel} · ${timeLabel}`,
            dateLabel,
            timeLabel,
          });
        }
      }
    }

    return [...slots.values()].sort((left, right) => left.value.localeCompare(right.value));
  }

  private monthsWithinWindow(start: Date, end: Date): Date[] {
    const months: Date[] = [];
    const [startYear, startMonth] = monthKeyInPeru(start).split('-').map(Number);
    const [endYear, endMonth] = monthKeyInPeru(end).split('-').map(Number);
    const cursor = new Date(Date.UTC(startYear, startMonth - 1, 1));
    const lastMonth = new Date(Date.UTC(endYear, endMonth - 1, 1));
    while (cursor <= lastMonth) {
      months.push(new Date(cursor));
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return months;
  }

  private fromLimaCalendarParts(year: number, monthIndex: number, day: number, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    return peruDateTimeToUtc(year, monthIndex + 1, day, hours, minutes);
  }

  private addMinutesToTimeValue(value: string, minutesToAdd: number): string {
    const [hours, minutes] = value.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    if (totalMinutes >= 24 * 60) return '';
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
  }
}
