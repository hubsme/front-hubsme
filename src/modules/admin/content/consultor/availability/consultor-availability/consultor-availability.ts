import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CalendarDatePipe,
  CalendarDayViewComponent,
  CalendarEvent,
  CalendarMonthViewComponent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarView,
  CalendarWeekViewComponent,
  DateAdapter,
  provideCalendar,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ConsultantAvailabilityService } from '@service/admin/consultant-availability.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';

type AvailabilitySlot = ApiResponse<'consultantAvailability', 'consultant-availabilityFindMonth'>['data'][number];
type DraftSlotStatus = 'disponible' | 'bloqueado';

type DraftSlot = {
  localId: string;
  id?: number;
  consultantId: number;
  startTime: Date;
  endTime: Date;
  status: DraftSlotStatus;
  notes: string;
};

type SlotForm = {
  date: string;
  startTime: string;
  endTime: string;
  status: DraftSlotStatus;
  notes: string;
};

type SlotEventMeta = {
  localId: string;
};

@Component({
  selector: 'app-consultor-availability',
  imports: [
    CommonModule,
    FormsModule,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarNextViewDirective,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CalendarDayViewComponent,
    CalendarDatePipe,
    ModalForm,
  ],
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  templateUrl: './consultor-availability.html',
})
export class ConsultorAvailability implements OnInit {
  private availabilityService = inject(ConsultantAvailabilityService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  readonly CalendarView = CalendarView;

  view = signal<CalendarView>(CalendarView.Week);
  viewDate = signal(new Date());
  loading = signal(false);
  saving = signal(false);
  isCreateModalOpen = signal(false);
  selectedSlotLocalId = signal<string | null>(null);
  slots = signal<DraftSlot[]>([]);
  form = signal<SlotForm>({
    date: this.toDateInput(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    status: 'disponible',
    notes: '',
  });
  private draftCounter = 0;

  consultantId = computed(() => this.hubsme.currentUser().id);
  monthLabel = computed(() => this.viewDate());
  sortedSlots = computed(() => [...this.slots()].sort((left, right) => left.startTime.getTime() - right.startTime.getTime()));
  selectedSlot = computed(() => {
    const localId = this.selectedSlotLocalId();
    if (!localId) return null;
    return this.slots().find((slot) => slot.localId === localId) ?? null;
  });
  events = computed<CalendarEvent<SlotEventMeta>[]>(() =>
    this.slots().map((slot) => ({
      start: slot.startTime,
      end: slot.endTime,
      title: `${this.formatHour(slot.startTime)} - ${this.formatHour(slot.endTime)}${
        slot.status === 'bloqueado' ? ' Bloqueado' : ' Disponible'
      }`,
      color:
        slot.status === 'bloqueado'
          ? { primary: '#f05252', secondary: 'rgba(240,82,82,0.16)' }
          : { primary: '#0e9f6e', secondary: 'rgba(14,159,110,0.16)' },
      meta: { localId: slot.localId },
    })),
  );

  ngOnInit(): void {
    this.loadMonth();
  }

  setView(view: CalendarView) {
    this.view.set(view);
  }

  previous() {
    this.viewDate.update((current) => this.addMonths(current, -1));
    this.syncFormDate();
    this.loadMonth();
  }

  next() {
    this.viewDate.update((current) => this.addMonths(current, 1));
    this.syncFormDate();
    this.loadMonth();
  }

  today() {
    this.viewDate.set(new Date());
    this.syncFormDate();
    this.loadMonth();
  }

  updateForm<K extends keyof SlotForm>(key: K, value: SlotForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  openCreateModal(date?: Date) {
    if (date) {
      const endTime = new Date(date);
      endTime.setHours(endTime.getHours() + 1);
      this.form.set({
        date: this.toDateInput(date),
        startTime: this.toTimeInput(date),
        endTime: this.toTimeInput(endTime),
        status: 'disponible',
        notes: '',
      });
    }
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  openSlotDetail(event: CalendarEvent<SlotEventMeta>) {
    if (!event.meta?.localId) return;
    this.selectedSlotLocalId.set(event.meta.localId);
  }

  closeSlotDetail() {
    this.selectedSlotLocalId.set(null);
  }

  addSlot() {
    const form = this.form();
    const startTime = this.fromLocalInput(form.date, form.startTime);
    const endTime = this.fromLocalInput(form.date, form.endTime);

    if (!startTime || !endTime) {
      this.toastService.warning('Completa la fecha y horas del bloque');
      return;
    }

    if (endTime <= startTime) {
      this.toastService.warning('La hora final debe ser mayor que la inicial');
      return;
    }

    const draft: DraftSlot = {
      localId: this.createLocalId(),
      consultantId: this.consultantId(),
      startTime,
      endTime,
      status: form.status,
      notes: form.notes.trim(),
    };

    if (!this.isCurrentMonth(startTime) || !this.isCurrentMonth(endTime)) {
      this.toastService.warning('El bloque debe pertenecer al mes visible');
      return;
    }

    if (this.hasOverlap(draft)) {
      this.toastService.warning('El bloque se cruza con otro horario');
      return;
    }

    this.slots.update((current) => [...current, draft]);
    this.form.update((current) => ({ ...current, notes: '' }));
    this.closeCreateModal();
  }

  removeSelectedSlot() {
    const localId = this.selectedSlotLocalId();
    if (!localId) return;
    this.slots.update((current) => current.filter((slot) => slot.localId !== localId));
    this.closeSlotDetail();
  }

  saveMonth() {
    const currentDate = this.viewDate();
    const payload: ApiBody<'consultantAvailability', 'consultant-availabilityReplaceMonth'> = {
      consultantId: this.consultantId(),
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      slots: this.sortedSlots().map((slot) => ({
        consultantId: this.consultantId(),
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        status: slot.status,
        notes: slot.notes || undefined,
      })),
    };

    this.saving.set(true);
    this.availabilityService
      .replaceMonth(payload)
      .then(() => {
        this.toastService.success('Disponibilidad actualizada');
        this.loadMonth();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.saving.set(false));
  }

  loadMonth() {
    const currentDate = this.viewDate();
    this.loading.set(true);
    this.availabilityService
      .findMonth({
        consultantId: this.consultantId(),
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      })
      .then((response) => this.slots.set(response.data.map((slot) => this.toDraftSlot(slot))))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  formatDate(date: Date) {
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  }

  formatHour(date: Date) {
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  trackBySlot(index: number, slot: DraftSlot) {
    return `${slot.localId}-${index}`;
  }

  private toDraftSlot(slot: AvailabilitySlot): DraftSlot {
    return {
      localId: `persisted-${slot.id}`,
      id: slot.id,
      consultantId: slot.consultantId,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
      status: slot.status,
      notes: slot.notes ?? '',
    };
  }

  private syncFormDate() {
    this.form.update((current) => ({ ...current, date: this.toDateInput(this.viewDate()) }));
  }

  private isCurrentMonth(date: Date) {
    const currentDate = this.viewDate();
    return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth();
  }

  private hasOverlap(target: DraftSlot) {
    return this.slots().some((slot) => slot.startTime < target.endTime && slot.endTime > target.startTime);
  }

  private addMonths(date: Date, months: number) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  }

  private toDateInput(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toTimeInput(date: Date) {
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minute = `${date.getMinutes()}`.padStart(2, '0');
    return `${hour}:${minute}`;
  }

  private fromLocalInput(date: string, time: string) {
    if (!date || !time) return null;
    const value = new Date(`${date}T${time}:00`);
    return Number.isNaN(value.getTime()) ? null : value;
  }

  private createLocalId() {
    this.draftCounter += 1;
    return `draft-${Date.now()}-${this.draftCounter}`;
  }
}
