import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionService } from '@service/admin/subscription.service';
import { ApiQuery, ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type SubscriptionOption = ApiResponse<'subscription', 'findAll'>['data'][number];

@Component({
  selector: 'app-subscription-input-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-input-search.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: SubscriptionInputSearch, multi: true }],
})
export class SubscriptionInputSearch implements ControlValueAccessor {
  private subscriptionService = inject(SubscriptionService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  initialData = input<SubscriptionOption | null>(null);
  query = input<Partial<ApiQuery<'subscription', 'findAll'>>>({});
  showClear = input(false);
  onSelected = output<SubscriptionOption | null>();

  isOpen = signal(false);
  loading = signal(false);
  items = signal<SubscriptionOption[]>([]);
  selectedItem = signal<SubscriptionOption | null>(null);
  disabled = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  onChange: (value: SubscriptionOption | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search(term));
  }

  writeValue(value: number | SubscriptionOption | null): void {
    if (!value) {
      this.selectedItem.set(null);
      return;
    }
    if (typeof value === 'object') {
      this.selectedItem.set(value);
      return;
    }
    const initial = this.initialData();
    if (initial?.id === value || initial?.userId === value) {
      this.selectedItem.set(initial);
      return;
    }
    this.loadInitial(value);
  }

  registerOnChange(fn: (value: SubscriptionOption | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggleDropdown() {
    if (this.disabled()) return;
    this.isOpen.update((value) => !value);
    if (this.isOpen()) this.search(this.searchControl.value);
    else this.onTouched();
  }

  selectItem(item: SubscriptionOption) {
    this.selectedItem.set(item);
    this.onChange(item);
    this.onSelected.emit(item);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedItem.set(null);
    this.onChange(null);
    this.onSelected.emit(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const item = this.selectedItem();
    return item ? `${item.plan} · ${item.status}` : 'Seleccionar suscripcion...';
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
    this.subscriptionService
      .findAll({ ...this.query(), limit: 10 })
      .then((response) => {
        const data = normalized
          ? response.data.filter((item) =>
              [`${item.id}`, `${item.userId}`, item.plan, item.status].some((value) => value.includes(normalized)),
            )
          : response.data;
        this.items.set(data);
      })
      .catch(() => this.items.set([]))
      .finally(() => this.loading.set(false));
  }

  private loadInitial(id: number) {
    this.subscriptionService
      .findOne(id)
      .then((item) => this.selectedItem.set(item))
      .catch(() =>
        this.subscriptionService
          .findByUser(id)
          .then((item) => this.selectedItem.set(item))
          .catch(() => this.selectedItem.set(null)),
      );
  }
}
