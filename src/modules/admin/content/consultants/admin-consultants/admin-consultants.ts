import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type ConsultantForm = {
  name: string;
  email: string;
  password: string;
  bio: string;
  specialties: string;
  sectors: string;
  pricePerHour: number;
};

@Component({
  selector: 'app-admin-consultants',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-consultants.html',
})
export class AdminConsultants implements OnInit {
  private api = inject(Api);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  consultants = signal<ApiResponse<'consultant', 'findAll'>['data']>([]);
  search = signal('');
  loading = signal(false);
  creating = signal(false);

  form = signal<ConsultantForm>({
    name: '',
    email: '',
    password: '123456',
    bio: '',
    specialties: '',
    sectors: '',
    pricePerHour: 120,
  });

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

  updateForm<K extends keyof ConsultantForm>(key: K, value: ConsultantForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  create() {
    const data = this.form();
    if (!data.name || !data.email) {
      this.toastService.error('Nombre y email son obligatorios');
      return;
    }

    this.creating.set(true);
    this.api.user
      .create({ name: data.name, email: data.email, password: data.password || '123456', role: 'consultor' })
      .then((userRes) =>
        this.api.consultant.create({
          userId: userRes.data.id,
          name: data.name,
          bio: data.bio || undefined,
          specialties: this.csvToArray(data.specialties),
          sectors: this.csvToArray(data.sectors),
          pricePerHour: Number(data.pricePerHour) || 0,
          active: 'true',
          validated: 'true',
        }),
      )
      .then(() => {
        this.toastService.success('Consultor creado correctamente');
        this.form.set({
          name: '',
          email: '',
          password: '123456',
          bio: '',
          specialties: '',
          sectors: '',
          pricePerHour: 120,
        });
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creating.set(false));
  }

  private csvToArray(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
