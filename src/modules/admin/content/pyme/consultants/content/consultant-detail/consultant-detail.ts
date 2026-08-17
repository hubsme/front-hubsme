import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ConsultantAvailabilityService } from '@service/admin/consultant-availability.service';
import { ConsultantService } from '@service/admin/consultant.service';
import { MeetingService } from '@service/admin/meeting.service';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { dateKeyInPeru, formatInPeru, peruDateTimeToUtc } from '@function/date.function';

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
type SelectedProposal = {
  iso: string;
  dateLabel: string;
  timeLabel: string;
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
  private meetingService = inject(MeetingService);
  private mercadoPagoService = inject(MercadoPagoService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  consultant = signal<Consultant | null>(null);
  slots = signal<AvailabilitySlot[]>([]);
  loading = signal(false);
  scheduling = signal(false);
  viewDate = signal(new Date());
  selectedDate = signal<Date>(new Date());
  selectedStartIsos = signal<string[]>([]);
  durationMinutes = signal(60);
  description = signal('');

  durations = [60, 90, 120];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  consultantUserId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? 0));
  selectedProposals = computed<SelectedProposal[]>(() =>
    this.selectedStartIsos().map((iso) => {
      const date = new Date(iso);
      return {
        iso,
        dateLabel: this.formatShortDate(date),
        timeLabel: this.formatTime(date),
      };
    }),
  );
  selectedDateKeys = computed(() => new Set(this.selectedStartIsos().map((iso) => this.toDateKey(new Date(iso)))));
  selectedDaysCount = computed(() => this.selectedDateKeys().size);
  selectionProgressText = computed(() => {
    const count = this.selectedStartIsos().length;
    if (count === 0) return 'Elige el primer dia y horario disponible';
    if (count === 1) return 'Elige 2 horarios mas en dias diferentes';
    if (count === 2) return 'Elige 1 horario mas en otro dia disponible';
    return 'Listo: tienes 3 opciones en dias diferentes';
  });
  monthTitle = computed(() =>
    formatInPeru(this.viewDate(), {
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
  }

  selectTime(option: TimeOption) {
    const iso = option.startTime.toISOString();
    this.selectedStartIsos.update((current) => {
      if (current.includes(iso)) return current.filter((value) => value !== iso);
      const selectedDay = this.toDateKey(option.startTime);
      if (current.some((value) => this.toDateKey(new Date(value)) === selectedDay)) {
        this.toastService.warning('Elige solo un horario por dia para darle alternativas reales al consultor');
        return current;
      }
      if (current.length >= 3) {
        this.toastService.warning('Solo puedes seleccionar 3 horarios');
        return current;
      }
      return [...current, iso].sort();
    });
  }

  updateDuration(value: string) {
    this.durationMinutes.set(Number(value) || 60);
    this.selectedStartIsos.set([]);
  }

  updateDescription(value: string) {
    this.description.set(value);
  }

  removeSelectedTime(iso: string) {
    this.selectedStartIsos.update((current) => current.filter((value) => value !== iso));
  }

  schedule() {
    const consultant = this.consultant();
    const selectedStartIsos = this.selectedStartIsos();
    if (!consultant || selectedStartIsos.length !== 3) {
      const missing = 3 - selectedStartIsos.length;
      this.toastService.warning(
        missing === 1
          ? 'Selecciona 1 horario mas en otro dia disponible'
          : `Selecciona ${missing} horarios mas en dias diferentes`,
      );
      return;
    }

    this.scheduling.set(true);
    this.mercadoPagoService
      .createCheckout({
        consultantId: consultant.userId,
        startTime: selectedStartIsos[0],
        proposedStartTimes: selectedStartIsos,
        durationMinutes: this.durationMinutes(),
        title: `Sesión con ${consultant.fullName}`,
        description: this.description().trim() || undefined,
      })
      .then((checkout) => {
        this.toastService.success('Checkout creado. Continúa con el pago.');
        this.router.navigate([buildPath(PATH.admin.pyme.consultants.checkout), checkout.id]);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.scheduling.set(false));
  }

  goBack() {
    this.router.navigate([buildPath(PATH.admin.pyme.consultants)]);
  }

  consultantPhoto(consultant: Consultant) {
    return consultant.photoUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName)}`;
  }

  formatDate(date: Date) {
    return formatInPeru(date, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  }

  formatShortDate(date: Date) {
    return formatInPeru(date, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  }

  formatTime(date: Date) {
    return formatInPeru(date, { hour: '2-digit', minute: '2-digit' });
  }

  dayHasProposal(date: Date) {
    return this.selectedDateKeys().has(this.toDateKey(date));
  }

  currency(value: number) {
    return value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private loadMonth(): Promise<void> {
    const currentDate = this.viewDate();
    const months = [
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    ];

    const requests = months.map((m) =>
      this.availabilityService.visibleMonth({
        consultantId: this.consultantUserId(),
        year: m.getFullYear(),
        month: m.getMonth() + 1,
      })
    );

    return Promise.all(requests)
      .then((responses) => {
        const allMonths = responses.flatMap((response) => response.data);
        const slots = this.expandAvailabilityMonths(allMonths);
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const viewFirst = new Date(this.viewDate().getFullYear(), this.viewDate().getMonth(), 1);
      if (viewFirst.getTime() > today.getTime()) {
        this.selectedDate.set(viewFirst);
      } else {
        this.selectedDate.set(today);
      }
    }
    this.selectedStartIsos.set([]);
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
          label: formatInPeru(start, { hour: '2-digit', minute: '2-digit' }),
          startTime: start,
          endTime: end,
        });
      }
    }

    return options;
  }

  private toDateKey(date: Date) {
    return dateKeyInPeru(date);
  }

  private expandAvailabilityMonths(months: AvailabilityMonth[]): AvailabilitySlot[] {
    return months.flatMap((availability) => this.expandAvailabilityMonth(availability));
  }

  private expandAvailabilityMonth(availability: AvailabilityMonth): AvailabilitySlot[] {
    const parts = availability.month.split('-').map(Number);
    const year = parts[0];
    const monthIndex = parts[1] - 1;
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
    return peruDateTimeToUtc(year, monthIndex + 1, day, hours, minutes);
  }

  private addMinutes(date: Date, minutes: number) {
    const next = new Date(date);
    next.setMinutes(next.getMinutes() + minutes);
    return next;
  }
}
