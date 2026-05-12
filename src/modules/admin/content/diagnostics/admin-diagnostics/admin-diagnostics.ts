import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PymeInputSearch } from '@module/admin/components/input-search/pyme-input-search/pyme-input-search';

type DiagnosticForm = {
  pymeId: number;
  sector: string;
  employees: number;
  years: number;
  revenue: string;
  challenges: string;
  techLevel: number;
  culture: string;
  market: string;
};

@Component({
  selector: 'app-admin-diagnostics',
  imports: [CommonModule, FormsModule, PymeInputSearch, ModalForm],
  templateUrl: './admin-diagnostics.html',
})
export class AdminDiagnostics implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  diagnostics = signal<ApiResponse<'diagnostic', 'findAll'>['data']>([]);
  pymes = signal<ApiResponse<'pyme', 'findAll'>['data']>([]);
  latest = signal<ApiResponse<'diagnostic', 'generate'> | null>(null);
  loading = signal(false);
  generating = signal(false);
  showCreate = signal(false);

  form = signal<DiagnosticForm>({
    pymeId: 0,
    sector: '',
    employees: 10,
    years: 3,
    revenue: '',
    challenges: '',
    techLevel: 5,
    culture: '',
    market: '',
  });

  ngOnInit() {
    const user = this.hubsme.currentUser();
    this.form.update((current) => ({ ...current, pymeId: user.role === 'pyme' ? user.id : current.pymeId }));
    this.loadPymes();
    this.load();
  }

  loadPymes() {
    this.hubsme
      .listPymes('', 1, 100)
      .then((res) => {
        const pymes = res.data.data;
        this.pymes.set(pymes);
        this.form.update((current) => ({ ...current, pymeId: current.pymeId || pymes[0]?.userId || 0 }));
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listDiagnostics()
      .then((res) => this.diagnostics.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  updateForm<K extends keyof DiagnosticForm>(key: K, value: DiagnosticForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  generate() {
    const data = this.form();
    if (!data.pymeId) {
      this.toastService.error('Indica el ID de usuario PYME');
      return;
    }

    this.generating.set(true);
    this.hubsme
      .generateDiagnostic({
        pymeId: Number(data.pymeId),
        pymeData: {
          name: this.hubsme.currentUser().name,
          sector: data.sector,
          employees: Number(data.employees),
          years: Number(data.years),
        },
        responses: {
          sector: data.sector,
          employees: Number(data.employees),
          years: Number(data.years),
          revenue: data.revenue,
          challenges: data.challenges,
          techLevel: Number(data.techLevel),
          culture: data.culture,
          market: data.market,
        },
      })
      .then((res) => {
        this.latest.set(res.data);
        this.toastService.success('Diagnostico generado');
        this.showCreate.set(false);
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.generating.set(false));
  }
}
