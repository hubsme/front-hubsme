import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-consultor-pymes',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultor-pymes.html',
})
export class ConsultorPymes implements OnInit {
  private api = inject(Api);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  pymes = signal<ApiResponse<'pyme', 'findAll'>['data']>([]);
  search = signal('');
  loading = signal(false);
  creating = signal(false);
  filteredPymes = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return this.pymes();
    return this.pymes().filter((pyme) =>
      [pyme.name, pyme.ruc, pyme.sector].some((value) => value?.toLowerCase().includes(query)),
    );
  });

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

  initials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  avatarClass(index: number) {
    return ['bg-lime-600', 'bg-pink-600', 'bg-secondary', 'bg-amber-500', 'bg-slate-900'][index % 5];
  }

  lastActivity(pyme: ApiResponse<'pyme', 'findAll'>['data'][number], index: number) {
    const date = new Date(pyme.createdAt);
    date.setDate(date.getDate() + index + 2);
    return `Reunion de diagnostico completada el ${date.toLocaleDateString('es-PE')}`;
  }
}
