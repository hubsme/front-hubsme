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
  readonly valueChange = output<string>();

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

  toggle() {
    this.isOpen.update((current) => !current);
  }

  select(option: TimeSlotPickerOption) {
    if (this.disabledValueSet().has(option.value)) return;
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
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
