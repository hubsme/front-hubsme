import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '@service/admin/task.service';
import { ApiQuery, ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type TaskOption = ApiResponse<'task', 'findAll'>['data'][number];

@Component({
  selector: 'app-task-input-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-input-search.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: TaskInputSearch, multi: true }],
})
export class TaskInputSearch implements ControlValueAccessor {
  private taskService = inject(TaskService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  initialData = input<TaskOption | null>(null);
  query = input<Partial<ApiQuery<'task', 'findAll'>>>({});
  showClear = input(false);
  onSelected = output<TaskOption | null>();

  isOpen = signal(false);
  loading = signal(false);
  items = signal<TaskOption[]>([]);
  selectedItem = signal<TaskOption | null>(null);
  disabled = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  onChange: (value: TaskOption | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search(term));
  }

  writeValue(value: number | TaskOption | null): void {
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

  registerOnChange(fn: (value: TaskOption | null) => void): void {
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

  selectItem(item: TaskOption) {
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
    return item ? item.title : 'Seleccionar tarea...';
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
    this.taskService
      .findAll({ ...this.query(), search: term.trim() || undefined, limit: 10 })
      .then((response) => this.items.set(response.data))
      .catch(() => this.items.set([]))
      .finally(() => this.loading.set(false));
  }

  private loadInitial(id: number) {
    this.taskService
      .findOne(id)
      .then((item) => this.selectedItem.set(item))
      .catch(() => this.selectedItem.set(null));
  }
}
