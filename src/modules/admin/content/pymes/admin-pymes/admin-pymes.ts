import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-admin-pymes',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pymes.html',
})
export class AdminPymes implements OnInit {
  private api = inject(Api);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  pymes = signal<ApiResponse<'pyme', 'findAll'>['data']>([]);
  search = signal('');
  loading = signal(false);
  creating = signal(false);
  showCreate = signal(false);

  form = signal({
    name: '',
    email: '',
    password: '123456',
    ruc: '',
    sector: '',
    numEmployees: 0,
    yearsInOperation: 0,
    description: '',
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listPymes(this.search())
      .then((res) => this.pymes.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  updateForm<K extends keyof ReturnType<typeof this.form>>(key: K, value: ReturnType<typeof this.form>[K]) {
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
      .create({ name: data.name, email: data.email, password: data.password || '123456', role: 'pyme' })
      .then((userRes) =>
        this.api.pyme.create({
          userId: userRes.data.id,
          name: data.name,
          ruc: data.ruc || undefined,
          sector: data.sector || undefined,
          numEmployees: Number(data.numEmployees) || undefined,
          yearsInOperation: Number(data.yearsInOperation) || undefined,
          description: data.description || undefined,
        }),
      )
      .then(() => {
        this.toastService.success('PYME creada correctamente');
        this.showCreate.set(false);
        this.form.set({
          name: '',
          email: '',
          password: '123456',
          ruc: '',
          sector: '',
          numEmployees: 0,
          yearsInOperation: 0,
          description: '',
        });
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creating.set(false));
  }
}
