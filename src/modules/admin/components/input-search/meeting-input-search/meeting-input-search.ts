import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MeetingService } from '@service/admin/meeting.service';
import { ApiQuery, ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type MeetingOption = ApiResponse<'meeting', 'findAll'>['data'][number];

@Component({
  selector: 'app-meeting-input-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meeting-input-search.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: MeetingInputSearch, multi: true }],
})
export class MeetingInputSearch implements ControlValueAccessor {
  private meetingService = inject(MeetingService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  initialData = input<MeetingOption | null>(null);
  query = input<Partial<ApiQuery<'meeting', 'findAll'>>>({});
  showClear = input(false);
  onSelected = output<MeetingOption | null>();

  isOpen = signal(false);
  loading = signal(false);
  items = signal<MeetingOption[]>([]);
  selectedItem = signal<MeetingOption | null>(null);
  disabled = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  onChange: (value: MeetingOption | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search(term));
  }

  writeValue(value: number | MeetingOption | null): void {
    if (!value) {
      this.selectedItem.set(null);
      return;
    }
    if (typeof value === 'object') {
      this.selectedItem.set(value);
      return;
    }
    const initial = this.initialData();
    if (initial?.id === value) {
      this.selectedItem.set(initial);
      return;
    }
    this.loadInitial(value);
  }

  registerOnChange(fn: (value: MeetingOption | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggleDropdown(event?: MouseEvent) {
    if (this.disabled()) return;
    const target = event?.target;
    if (target instanceof HTMLElement && target.closest('[data-clear-button]')) return;
    this.isOpen.update((value) => !value);
    if (this.isOpen()) this.search(this.searchControl.value);
    else this.onTouched();
  }

  selectItem(item: MeetingOption) {
    this.selectedItem.set(item);
    this.onChange(item);
    this.onSelected.emit(item);
    this.isOpen.set(false);
  }

  clearSelection(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.selectedItem.set(null);
    this.onChange(null);
    this.onSelected.emit(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const item = this.selectedItem();
    return item ? item.title : 'Seleccionar reunion...';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  private search(term: string) {
    this.loading.set(true);
    this.meetingService
      .findAll({ ...this.query(), search: term.trim() || undefined, limit: 10 })
      .then((response) => this.items.set(response.data))
      .catch(() => this.items.set([]))
      .finally(() => this.loading.set(false));
  }

  private loadInitial(id: number) {
    this.meetingService
      .findOne(id)
      .then((item) => this.selectedItem.set(item))
      .catch(() => this.selectedItem.set(null));
  }
}
