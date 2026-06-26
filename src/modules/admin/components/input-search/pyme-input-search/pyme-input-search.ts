import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { PymeService } from '@service/admin/pyme.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type PymeOption = ApiResponse<'pyme', 'findAll'>['data'][number];

export type PymeInputSearchFilters = {
  source?: 'all';
};

@Component({
  selector: 'app-pyme-input-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pyme-input-search.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: PymeInputSearch, multi: true }],
})
export class PymeInputSearch implements ControlValueAccessor {
  private pymeService = inject(PymeService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  initialData = input<PymeOption | null>(null);
  filters = input<PymeInputSearchFilters | null>(null);
  options = input<PymeOption[] | null>(null);
  showClear = input(false);
  onSelected = output<PymeOption | null>();

  isOpen = signal(false);
  loading = signal(false);
  items = signal<PymeOption[]>([]);
  selectedItem = signal<PymeOption | null>(null);
  disabled = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  onChange: (value: PymeOption | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search(term));
  }

  writeValue(value: number | PymeOption | null): void {
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

  registerOnChange(fn: (value: PymeOption | null) => void): void {
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

  selectItem(item: PymeOption) {
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
    return item ? item.name : 'Seleccionar PYME...';
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
    const cleanTerm = term.trim();
    const options = this.options();

    if (options) {
      this.items.set(this.filterOptions(options, cleanTerm).slice(0, 10));
      this.loading.set(false);
      return;
    }

    this.pymeService
      .findAll({ search: cleanTerm || undefined, limit: 10 })
      .then((response) => response.data)
      .then((items) => this.items.set(items))
      .catch(() => this.items.set([]))
      .finally(() => this.loading.set(false));
  }

  private loadInitial(id: number) {
    const options = this.options();
    if (options) {
      const item = options.find((option) => option.id === id || option.userId === id) ?? null;
      this.selectedItem.set(item);
      return;
    }

    this.pymeService
      .findByUser(id)
      .then((item) => this.selectedItem.set(item))
      .catch(() =>
        this.pymeService
          .findOne(id)
          .then((item) => this.selectedItem.set(item))
          .catch(() => this.selectedItem.set(null)),
      );
  }

  private filterOptions(options: PymeOption[], term: string) {
    const normalizedTerm = this.normalize(term);
    if (!normalizedTerm) return options;

    return options.filter((option) =>
      [
        option.name,
        option.ruc,
        option.ownerFirstName,
        option.ownerLastName,
        option.ownerEmail,
        option.sector,
      ]
        .map((value) => this.normalize(value))
        .some((value) => value.includes(normalizedTerm)),
    );
  }

  private normalize(value: string | null | undefined) {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
