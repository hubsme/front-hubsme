import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

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
  selector: 'app-pyme-diagnostics',
  imports: [CommonModule, FormsModule],
  templateUrl: './pyme-diagnostics.html',
})
export class PymeDiagnostics implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  diagnostics = signal<ApiResponse<'diagnostic', 'findAll'>['data']>([]);
  latest = signal<ApiResponse<'diagnostic', 'generate'> | null>(null);
  loading = signal(false);
  generating = signal(false);
  currentStep = signal(1);

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
    this.load();
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

  progress() {
    return `${this.currentStep() * 20}%`;
  }

  nextStep() {
    if (this.currentStep() < 5) {
      this.currentStep.update((step) => step + 1);
      return;
    }

    this.generate();
  }

  previousStep() {
    this.currentStep.update((step) => Math.max(1, step - 1));
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
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.generating.set(false));
  }
}
