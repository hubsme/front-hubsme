import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-pyme-consultants',
  imports: [CommonModule, FormsModule],
  templateUrl: './pyme-consultants.html',
})
export class PymeConsultants implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  consultants = signal<ApiResponse<'consultant', 'findAll'>['data']>([]);
  search = signal('');
  loading = signal(false);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listConsultants(this.search(), 1, 20)
      .then((res) => this.consultants.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  initials(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  rating(consultant: ApiResponse<'consultant', 'findAll'>['data'][number]) {
    return Number(consultant.rating || 4.8).toFixed(1);
  }
}
