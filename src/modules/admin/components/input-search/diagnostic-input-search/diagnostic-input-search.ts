import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DiagnosticService } from '@service/admin/diagnostic.service';
import { ApiQuery, ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type DiagnosticOption = ApiResponse<'diagnostic', 'findAll'>['data'][number];

@Component({
  selector: 'app-diagnostic-input-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diagnostic-input-search.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: DiagnosticInputSearch, multi: true }],
})
export class DiagnosticInputSearch implements ControlValueAccessor {
  private diagnosticService = inject(DiagnosticService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  initialData = input<DiagnosticOption | null>(null);
  query = input<Partial<ApiQuery<'diagnostic', 'findAll'>>>({});
  showClear = input(false);
  onSelected = output<DiagnosticOption | null>();

  isOpen = signal(false);
  loading = signal(false);
  items = signal<DiagnosticOption[]>([]);
  selectedItem = signal<DiagnosticOption | null>(null);
  disabled = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  onChange: (value: DiagnosticOption | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search(term));
  }

  writeValue(value: number | DiagnosticOption | null): void {
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

  registerOnChange(fn: (value: DiagnosticOption | null) => void): void {
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

  selectItem(item: DiagnosticOption) {
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
    return item ? `Diagnostico #${item.id} · ${item.score}/100` : 'Seleccionar diagnostico...';
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
    const normalized = term.trim().toLowerCase();
    this.loading.set(true);
    this.diagnosticService
      .findAll({ ...this.query(), limit: 10 })
      .then((response) => {
        const data = normalized
          ? response.data.filter((item) =>
              [`${item.id}`, `${item.pymeId}`, `${item.score}`, item.summary.toLowerCase()].some((value) =>
                value.includes(normalized),
              ),
            )
          : response.data;
        this.items.set(data);
      })
      .catch(() => this.items.set([]))
      .finally(() => this.loading.set(false));
  }

  private loadInitial(id: number) {
    this.diagnosticService
      .findOne(id)
      .then((item) => this.selectedItem.set(item))
      .catch(() => this.selectedItem.set(null));
  }
}
