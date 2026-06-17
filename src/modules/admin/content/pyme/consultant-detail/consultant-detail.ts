import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ConsultantAvailabilityService } from '@service/admin/consultant-availability.service';
import { ConsultantService } from '@service/admin/consultant.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';

type Consultant = ApiResponse<'consultant', 'findByUser'>;
type AvailabilityMonth = ApiResponse<'consultantAvailability', 'consultant-availabilityVisibleMonth'>['data'][number];
type AvailabilitySlot = {
  startTime: Date;
  endTime: Date;
};
type TimeOption = {
  label: string;
  startTime: Date;
  endTime: Date;
};
type CalendarDay = {
  date: Date;
  day: number;
  inMonth: boolean;
  hasAvailability: boolean;
};

@Component({
  selector: 'app-consultant-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultant-detail.html',
})
export class ConsultantDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consultantService = inject(ConsultantService);
  private availabilityService = inject(ConsultantAvailabilityService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  consultant = signal<Consultant | null>(null);
  slots = signal<AvailabilitySlot[]>([]);
  loading = signal(false);
  scheduling = signal(false);
  viewDate = signal(new Date());
  selectedDate = signal<Date>(new Date());
  selectedStartIso = signal<string | null>(null);
  durationMinutes = signal(60);
  description = signal('');

  durations = [30, 60, 90, 120];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  consultantUserId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? 0));
  selectedOption = computed(() => this.timeOptions().find((option) => option.startTime.toISOString() === this.selectedStartIso()) ?? null);
  monthTitle = computed(() =>
    this.viewDate().toLocaleDateString('es-PE', {
      month: 'long',
      year: 'numeric',
    }),
  );
  calendarDays = computed<CalendarDay[]>(() => this.buildCalendarDays());
  availableDates = computed(() => new Set(this.slots().map((slot) => this.toDateKey(new Date(slot.startTime)))));
  selectedDaySlots = computed(() => {
    const key = this.toDateKey(this.selectedDate());
    return this.slots()
      .filter((slot) => this.toDateKey(new Date(slot.startTime)) === key)
      .sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime());
  });
  timeOptions = computed<TimeOption[]>(() => this.buildTimeOptions());
  meetingTotal = computed(() => {
    const consultant = this.consultant();
    return Number(consultant?.pricePerHour ?? 0) * (this.durationMinutes() / 60);
  });

  ngOnInit(): void {
    this.load();
  }

  load() {
    const consultantId = this.consultantUserId();
    if (!consultantId) {
      this.toastService.error('Consultor invalido');
      this.goBack();
      return;
    }

    this.loading.set(true);
    Promise.all([this.consultantService.findByUser(consultantId), this.loadMonth()])
      .then(([consultant]) => this.consultant.set(consultant))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  previousMonth() {
    this.viewDate.update((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
    this.loadMonth().catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  nextMonth() {
    this.viewDate.update((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
    this.loadMonth().catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  selectDate(day: CalendarDay) {
    if (!day.inMonth || !day.hasAvailability) return;
    this.selectedDate.set(day.date);
    this.selectedStartIso.set(null);
  }

  selectTime(option: TimeOption) {
    this.selectedStartIso.set(option.startTime.toISOString());
  }

  updateDuration(value: string) {
    this.durationMinutes.set(Number(value) || 60);
    this.selectedStartIso.set(null);
  }

  updateDescription(value: string) {
    this.description.set(value);
  }

  schedule() {
    const option = this.selectedOption();
    const consultant = this.consultant();
    if (!option || !consultant) {
      this.toastService.warning('Selecciona un horario disponible');
      return;
    }

    const payload: ApiBody<'meeting', 'create'> = {
      pymeId: this.hubsme.currentUser().id,
      consultantId: consultant.userId,
      title: `Sesion con ${consultant.fullName}`,
      startTime: option.startTime.toISOString(),
      durationMinutes: this.durationMinutes(),
      description: this.description().trim() || undefined,
      requestedBy: 'pyme',
    };

    this.scheduling.set(true);
    this.hubsme
      .createMeeting(payload)
      .then(() => {
        this.toastService.success('Reunion creada. Continua con el pago desde Mis Reuniones.');
        this.router.navigate([buildPath(PATH.pyme.meetings)]);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.scheduling.set(false));
  }

  goBack() {
    this.router.navigate([buildPath(PATH.pyme.consultants)]);
  }

  consultantPhoto(consultant: Consultant) {
    return consultant.photoUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName)}`;
  }

  formatDate(date: Date) {
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  }

  currency(value: number) {
    return value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private loadMonth(): Promise<void> {
    const currentDate = this.viewDate();
    return this.availabilityService
      .visibleMonth({
        consultantId: this.consultantUserId(),
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      })
      .then((response) => {
        const slots = this.expandAvailabilityMonths(response.data);
        this.slots.set(slots);
        this.selectFirstAvailableDay(slots);
      });
  }

  private selectFirstAvailableDay(slots: AvailabilitySlot[]) {
    if (slots.some((slot) => this.toDateKey(new Date(slot.startTime)) === this.toDateKey(this.selectedDate()))) {
      return;
    }

    const firstSlot = slots[0];
    if (firstSlot) {
      this.selectedDate.set(new Date(firstSlot.startTime));
    } else {
      this.selectedDate.set(new Date(this.viewDate().getFullYear(), this.viewDate().getMonth(), 1));
    }
    this.selectedStartIso.set(null);
  }

  private buildCalendarDays(): CalendarDay[] {
    const current = this.viewDate();
    const first = new Date(current.getFullYear(), current.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const availableDates = this.availableDates();

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        date,
        day: date.getDate(),
        inMonth: date.getMonth() === current.getMonth(),
        hasAvailability: availableDates.has(this.toDateKey(date)),
      };
    });
  }

  private buildTimeOptions(): TimeOption[] {
    const durationMs = this.durationMinutes() * 60 * 1000;
    const options: TimeOption[] = [];

    for (const slot of this.selectedDaySlots()) {
      const slotStart = slot.startTime;
      const slotEnd = slot.endTime;

      for (let start = new Date(slotStart); start.getTime() + durationMs <= slotEnd.getTime(); start = new Date(start.getTime() + 30 * 60 * 1000)) {
        const end = new Date(start.getTime() + durationMs);
        options.push({
          label: start.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          startTime: start,
          endTime: end,
        });
      }
    }

    return options;
  }

  private toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private expandAvailabilityMonths(months: AvailabilityMonth[]): AvailabilitySlot[] {
    return months.flatMap((availability) => this.expandAvailabilityMonth(availability));
  }

  private expandAvailabilityMonth(availability: AvailabilityMonth): AvailabilitySlot[] {
    const currentDate = this.viewDate();
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const slots: AvailabilitySlot[] = [];

    for (const [day, times] of Object.entries(availability.availableSchedule ?? {})) {
      const sortedTimes = [...times].sort();
      let segmentStart: Date | null = null;
      let segmentEnd: Date | null = null;

      for (const time of sortedTimes) {
        const start = this.fromMonthDayTime(year, monthIndex, Number(day), time);
        const end = this.addMinutes(start, 30);

        if (!segmentStart || !segmentEnd || start.getTime() !== segmentEnd.getTime()) {
          if (segmentStart && segmentEnd) {
            slots.push({ startTime: segmentStart, endTime: segmentEnd });
          }
          segmentStart = start;
          segmentEnd = end;
          continue;
        }

        segmentEnd = end;
      }

      if (segmentStart && segmentEnd) {
        slots.push({ startTime: segmentStart, endTime: segmentEnd });
      }
    }

    return slots.sort((left, right) => left.startTime.getTime() - right.startTime.getTime());
  }

  private fromMonthDayTime(year: number, monthIndex: number, day: number, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(year, monthIndex, day, hours, minutes);
  }

  private addMinutes(date: Date, minutes: number) {
    const next = new Date(date);
    next.setMinutes(next.getMinutes() + minutes);
    return next;
  }
}
