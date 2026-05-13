import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type PymeProfileData = ApiResponse<'pyme', 'findByUser'>;

type PymeForm = {
  name: string;
  ruc: string;
  sector: string;
  numEmployees: number;
  yearsInOperation: number;
  description: string;
  logoUrl: string;
};

@Component({
  selector: 'app-pyme-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './pyme-profile.html',
})
export class PymeProfile implements OnInit {
  private api = inject(Api);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  uploadingLogo = signal(false);
  pyme = signal<PymeProfileData | null>(null);

  form = signal<PymeForm>({
    name: '',
    ruc: '',
    sector: '',
    numEmployees: 0,
    yearsInOperation: 0,
    description: '',
    logoUrl: '',
  });

  ngOnInit(): void {
    this.load();
  }

  updateForm<K extends keyof PymeForm>(key: K, value: PymeForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  load() {
    const user = this.hubsme.currentUser();
    this.loading.set(true);
    this.api.pyme
      .findByUser({ userId: user.id })
      .then((response) => {
        const data = response.data;
        this.pyme.set(data);
        this.form.set({
          name: data.name,
          ruc: data.ruc ?? '',
          sector: data.sector ?? '',
          numEmployees: data.numEmployees ?? 0,
          yearsInOperation: data.yearsInOperation ?? 0,
          description: data.description ?? '',
          logoUrl: data.logoUrl ?? '',
        });
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  save() {
    const user = this.hubsme.currentUser();
    const form = this.form();
    const payload: ApiBody<'pyme', 'create'> = {
      userId: user.id,
      name: form.name,
      ruc: form.ruc || undefined,
      sector: form.sector || undefined,
      numEmployees: Number(form.numEmployees) || 0,
      yearsInOperation: Number(form.yearsInOperation) || 0,
      description: form.description || undefined,
      logoUrl: form.logoUrl || undefined,
    };
    const current = this.pyme();

    this.saving.set(true);
    const request = current ? this.api.pyme.update({ id: current.id }, payload) : this.api.pyme.create(payload);
    request
      .then(() => {
        this.toastService.success('Perfil actualizado');
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.saving.set(false));
  }

  uploadLogo(event: Event) {
    const file = this.getFile(event);
    if (!file) return;

    this.uploadingLogo.set(true);
    this.api.storage
      .upload({ folder: 'pymes/logos' }, { file })
      .then((response) => this.updateForm('logoUrl', response.data.secureUrl))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.uploadingLogo.set(false));
  }

  private getFile(event: Event): File | null {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return null;
    return target.files?.[0] ?? null;
  }
}
