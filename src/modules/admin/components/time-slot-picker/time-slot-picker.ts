import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export type TimeSlotPickerOption = {
  value: string;
  label: string;
  dateLabel: string;
  timeLabel: string;
};

export type TimeSlotPickerMonth = {
  value: string;
  label: string;
};

type TimeSlotGroup = {
  key: string;
  label: string;
  options: TimeSlotPickerOption[];
};

@Component({
  selector: 'app-time-slot-picker',
  templateUrl: './time-slot-picker.html',
})
export class TimeSlotPicker {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly options = input.required<TimeSlotPickerOption[]>();
  readonly value = input('');
  readonly disabledValues = input<string[]>([]);
  readonly ariaLabel = input('Seleccionar horario');
  readonly dropdownPosition = input<'up' | 'down'>('down');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly placeholder = input('Seleccionar horario');
  readonly helperText = input('Esta semana o la siguiente');
  readonly panelSubtitle = input('Semana actual y próxima');
  readonly emptyText = input('No hay horarios disponibles en este periodo.');
  readonly availableMonths = input<TimeSlotPickerMonth[]>([]);
  readonly activeMonth = input('');
  readonly valueChange = output<string>();
  readonly monthChange = output<string>();

  readonly isOpen = signal(false);
  readonly selectedOption = computed(
    () => this.options().find((option) => option.value === this.value()) ?? null,
  );
  readonly disabledValueSet = computed(() => new Set(this.disabledValues()));
  readonly groups = computed<TimeSlotGroup[]>(() => {
    const groups = new Map<string, TimeSlotGroup>();
    for (const option of this.options()) {
      const key = option.dateLabel;
      const current = groups.get(key);
      if (current) {
        current.options.push(option);
      } else {
        groups.set(key, { key, label: option.dateLabel, options: [option] });
      }
    }
    return [...groups.values()];
  });
  readonly activeMonthIndex = computed(() =>
    this.availableMonths().findIndex((month) => month.value === this.activeMonth()),
  );
  readonly activeMonthLabel = computed(
    () => this.availableMonths().find((month) => month.value === this.activeMonth())?.label ?? '',
  );

  toggle() {
    if (this.loading() || this.disabled()) return;
    this.isOpen.update((current) => !current);
  }

  select(option: TimeSlotPickerOption) {
    if (this.loading() || this.disabled() || this.disabledValueSet().has(option.value)) return;
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  previousMonth(): void {
    const index = this.activeMonthIndex();
    if (index <= 0 || this.loading()) return;
    this.monthChange.emit(this.availableMonths()[index - 1].value);
  }

  nextMonth(): void {
    const index = this.activeMonthIndex();
    if (index < 0 || index >= this.availableMonths().length - 1 || this.loading()) return;
    this.monthChange.emit(this.availableMonths()[index + 1].value);
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeOnEscape() {
    this.isOpen.set(false);
  }
}
