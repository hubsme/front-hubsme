import { DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import { DiagnosticReport } from '@component/diagnostic-report/diagnostic-report';
import { RecommendedConsultant } from '@module/admin/functions/recommend-consultants';
import { DiagnosticResultDto, PaginationMetaDto } from 'api/backend.api';

@Component({
  selector: 'app-pyme-diagnostics',
  imports: [DatePipe, PaginationComponent, DiagnosticReport],
  templateUrl: './pyme-diagnostics.html',
  host: { class: 'block' },
})
export class PymeDiagnostics {
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private requestSequence = 0;
  private consultantsLoaded = false;

  readonly pymeId = input.required<number>();
  readonly diagnostics = signal<DiagnosticResultDto[]>([]);
  readonly selectedDiagnostic = signal<DiagnosticResultDto | null>(null);
  readonly consultants = signal<RecommendedConsultant[]>([]);
  readonly consultantsLoading = signal(false);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly page = signal(1);
  readonly pageSize = 5;
  readonly meta = signal<PaginationMetaDto | null>(null);

  constructor() {
    effect((onCleanup) => {
      void this.loadDiagnostics(this.pymeId(), this.page());
      onCleanup(() => ++this.requestSequence);
    });
  }

  async loadDiagnostics(pymeId: number, page: number) {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    this.error.set(false);
    try {
      const response = await this.adminApi.api.pymeAdmin.pymeadminDiagnostics({
        id: pymeId,
        page,
        limit: this.pageSize,
      });
      if (requestId !== this.requestSequence) return;
      this.diagnostics.set(response.data.data);
      this.meta.set(response.data.meta);
    } catch {
      if (requestId === this.requestSequence) this.error.set(true);
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  changePage(page: number) {
    this.page.set(page);
    this.scrollToStart();
  }

  selectDiagnostic(diagnostic: DiagnosticResultDto | null) {
    this.selectedDiagnostic.set(diagnostic);
    if (diagnostic) void this.loadSuggestedConsultants();
    this.scrollToStart();
  }

  private async loadSuggestedConsultants() {
    if (this.consultantsLoaded || this.consultantsLoading()) return;
    this.consultantsLoading.set(true);
    try {
      const response = await this.adminApi.api.consultantAdmin.consultantadminFindAll({
        page: 1,
        limit: 100,
        active: 'true',
        validated: 'true',
      });
      if (this.destroyRef.destroyed) return;
      this.consultants.set(response.data.data);
      this.consultantsLoaded = true;
    } catch {
      if (!this.destroyRef.destroyed) {
        this.toastService.error('No se pudieron cargar los consultores recomendados.');
      }
    } finally {
      if (!this.destroyRef.destroyed) this.consultantsLoading.set(false);
    }
  }

  private scrollToStart() {
    afterNextRender(() => this.element.nativeElement.scrollIntoView({ block: 'start' }), {
      injector: this.injector,
    });
  }

  scoreClass(score: number) {
    if (score < 60) return 'bg-danger/10 text-danger';
    if (score < 75) return 'bg-warning/10 text-warning';
    return 'bg-success/10 text-success';
  }
}
