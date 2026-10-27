import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DiagnosticReport } from '@component/diagnostic-report/diagnostic-report';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { DiagnosticResultDto } from 'api/backend.api';
import { RecommendedConsultant } from '@module/admin/functions/recommend-consultants';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-diagnostic-detail',
  imports: [DiagnosticReport, RouterLink],
  templateUrl: './diagnostic-detail.html',
})
export class DiagnosticDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly diagnostic = signal<DiagnosticResultDto | null>(null);
  readonly loading = signal(false);
  readonly consultants = signal<RecommendedConsultant[]>([]);
  readonly consultantsLoading = signal(false);
  readonly autoDownloadPdf = this.route.snapshot.queryParamMap.get('download') === 'true';
  readonly consultantView = this.route.snapshot.data['consultantView'] === true;
  readonly consultantDocumentsPath = '/' + buildPath(PATH.admin.consultor.documents);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.toastService.error('Diagnóstico no encontrado');
      return;
    }

    this.loading.set(true);
    try {
      const response = await this.hubsme.getDiagnostic(id);
      if (this.destroyRef.destroyed) return;
      this.diagnostic.set(response.data);
      void this.loadSuggestedConsultants();
    } catch (error) {
      if (!this.destroyRef.destroyed) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (!this.destroyRef.destroyed) this.loading.set(false);
    }
  }

  private async loadSuggestedConsultants() {
    this.consultantsLoading.set(true);
    try {
      const response = await this.hubsme.listConsultants('', 1, 100, 'true');
      if (!this.destroyRef.destroyed) this.consultants.set(response.data.data);
    } catch {
      if (!this.destroyRef.destroyed) {
        this.toastService.error('No se pudieron cargar los consultores recomendados.');
      }
    } finally {
      if (!this.destroyRef.destroyed) this.consultantsLoading.set(false);
    }
  }

  closeDownloadWindow() {
    if (isPlatformBrowser(this.platformId)) {
      const timer = setTimeout(() => window.close(), 1000);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    }
  }
}
