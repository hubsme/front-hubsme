import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ConsultantService } from '@service/admin/consultant.service';
import { HubsmeService } from '@service/hubsme.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type ConsultantOption = ApiResponse<'consultant', 'findAll'>['data'][number];
type MatchOption = ApiResponse<'pyme', 'consultantContacts'>['data'][number];
type MatchStatus = MatchOption['status'];

export type ConsultantInputSearchFilters = {
  source?: 'all' | 'matches';
  status?: MatchStatus;
};

@Component({
  selector: 'app-consultant-input-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultant-input-search.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ConsultantInputSearch, multi: true }],
})
export class ConsultantInputSearch implements ControlValueAccessor {
  private consultantService = inject(ConsultantService);
  private hubsmeService = inject(HubsmeService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  initialData = input<ConsultantOption | null>(null);
  filters = input<ConsultantInputSearchFilters | null>(null);
  showClear = input(false);
  onSelected = output<ConsultantOption | null>();

  isOpen = signal(false);
  loading = signal(false);
  items = signal<ConsultantOption[]>([]);
  selectedItem = signal<ConsultantOption | null>(null);
  disabled = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  onChange: (value: ConsultantOption | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search(term));
  }

  writeValue(value: number | ConsultantOption | null): void {
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

  registerOnChange(fn: (value: ConsultantOption | null) => void): void {
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

  selectItem(item: ConsultantOption) {
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
    return item ? item.name : 'Seleccionar consultor...';
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
    const filters = this.filters();
    const cleanTerm = term.trim();
    const request =
      filters?.source === 'matches'
        ? this.hubsmeService
            .listMatches(1, 10, filters.status, cleanTerm)
            .then((response) => response.data.data.map((match) => this.matchToConsultant(match)))
        : this.consultantService
            .findAll({ search: cleanTerm || undefined, limit: 10, active: 'true' })
            .then((response) => response.data);

    request
      .then((items) => this.items.set(items))
      .catch(() => this.items.set([]))
      .finally(() => this.loading.set(false));
  }

  private loadInitial(id: number) {
    const filters = this.filters();
    if (filters?.source === 'matches') {
      this.hubsmeService
        .listMatches(1, 100, filters.status)
        .then((response) => {
          const match = response.data.data.find((item) => item.consultantId === id);
          this.selectedItem.set(match ? this.matchToConsultant(match) : null);
        })
        .catch(() => this.selectedItem.set(null));
      return;
    }

    this.consultantService
      .findOne(id)
      .then((item) => this.selectedItem.set(item))
      .catch(() =>
        this.consultantService
          .findByUser(id)
          .then((item) => this.selectedItem.set(item))
          .catch(() => this.selectedItem.set(null)),
      );
  }

  private matchToConsultant(match: MatchOption): ConsultantOption {
    return {
      id: match.consultantId,
      userId: match.consultantId,
      name: match.consultantName ?? 'Consultor',
      bio: match.consultantBio,
      specialties: match.consultantSpecialties,
      sectors: [],
      photoUrl: match.consultantPhotoUrl,
      videoUrl: null,
      pricePerHour: match.consultantPricePerHour,
      rating: match.consultantRating,
      totalReviews: 0,
      active: 'true',
      createdAt: match.createdAt,
    };
  }
}
