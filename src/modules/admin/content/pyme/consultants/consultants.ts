import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type Consultant = ApiResponse<'consultant', 'findAll'>['data'][number];

@Component({
  selector: 'app-consultants',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultants.html',
})
export class Consultants implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private searchTerms = new Subject<string>();
  private consultantRequestId = 0;

  consultants = signal<Consultant[]>([]);
  videoConsultant = signal<Consultant | null>(null);
  profileConsultant = signal<Consultant | null>(null);
  search = signal('');
  loading = signal(false);
  searching = signal(false);

  constructor() {
    this.searchTerms
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.loadConsultants(term, true));
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.loadConsultants(this.search(), false)
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  updateSearch(value: string) {
    this.search.set(value);
    this.searchTerms.next(value.trim());
  }

  schedule(consultant: Consultant) {
    this.router.navigate([buildPath(PATH.admin.pyme.consultant), consultant.userId]);
  }

  consultantPhoto(consultant: Consultant): string {
    return (
      consultant.photoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName)}`
    );
  }

  initials(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  rating(consultant: Consultant) {
    return Number(consultant.rating || 0).toFixed(1);
  }

  private loadConsultants(search: string, showSearching: boolean): Promise<void> {
    const requestId = ++this.consultantRequestId;
    if (showSearching) this.searching.set(true);

    return this.hubsme
      .listConsultants(search.trim(), 1, 100, 'true')
      .then((res) => {
        if (requestId !== this.consultantRequestId) return;
        this.consultants.set(res.data.data);
      })
      .catch((error) => {
        if (requestId !== this.consultantRequestId) return;
        this.consultants.set([]);
        this.toastService.error(this.hubsme.getErrorMessage(error));
      })
      .finally(() => {
        if (showSearching && requestId === this.consultantRequestId) this.searching.set(false);
      });
  }
}
