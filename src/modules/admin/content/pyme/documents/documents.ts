import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { ApiResponse, PaginationMetaDto } from 'api/backend.api';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { PymeService } from '@service/admin/pyme.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { downloadPdf } from '../../../functions/download-pdf';
import { downloadWord } from '../../../functions/download-word';

type DocumentTab = 'meetings' | 'diagnostics';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './documents.html',
})
export class Documents implements OnDestroy, OnInit {
  private pymeService = inject(PymeService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  meetingDocuments = signal<ApiResponse<'pyme', 'meetingDocuments'>['data']>([]);
  diagnostics = signal<ApiResponse<'pyme', 'diagnosticDocuments'>['data']>([]);
  meetingMeta = signal<PaginationMetaDto>(this.emptyMeta());
  diagnosticMeta = signal<PaginationMetaDto>(this.emptyMeta());
  meetingPage = signal(1);
  diagnosticPage = signal(1);
  search = signal('');
  loading = signal(false);
  activeTab = signal<DocumentTab>('meetings');
  downloadingPdfId = signal<number | null>(null);
  downloadingWordId = signal<number | null>(null);
  readonly pageSize = 10;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  filteredMeetingDocuments = computed(() => this.meetingDocuments());
  filteredDiagnosticDocuments = computed(() => this.diagnostics());
  paginatedMeetingDocuments = computed(() => this.meetingDocuments());
  paginatedDiagnosticDocuments = computed(() => this.diagnostics());

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.activeTab.set(this.tabFromQuery(params.get('type')));
    });
    this.load();
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }

  load(): void {
    this.loading.set(true);
    Promise.all([this.loadMeetings(), this.loadDiagnostics()])
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private loadMeetings(): Promise<ApiResponse<'pyme', 'meetingDocuments'>> {
    return this.pymeService
      .meetingDocuments({
        page: this.meetingPage(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
      })
      .then((response) => {
        this.meetingDocuments.set(response.data);
        this.meetingMeta.set(response.meta);
        return response;
      });
  }

  private loadDiagnostics(): Promise<ApiResponse<'pyme', 'diagnosticDocuments'>> {
    return this.pymeService
      .diagnosticDocuments({
        page: this.diagnosticPage(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
      })
      .then((response) => {
        this.diagnostics.set(response.data);
        this.diagnosticMeta.set(response.meta);
        return response;
      });
  }

  updateSearch(value: string): void {
    this.search.set(value);
    this.meetingPage.set(1);
    this.diagnosticPage.set(1);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.load();
      this.searchTimeout = null;
    }, 300);
  }

  selectTab(tab: DocumentTab): void {
    this.activeTab.set(tab);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: tab === 'meetings' ? 'actas' : 'diagnosticos' },
      queryParamsHandling: 'merge',
    });
  }

  changeMeetingPage(page: number): void {
    this.meetingPage.set(page);
    this.loading.set(true);
    this.loadMeetings()
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  changeDiagnosticPage(page: number): void {
    this.diagnosticPage.set(page);
    this.loading.set(true);
    this.loadDiagnostics()
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private tabFromQuery(type: string | null): DocumentTab {
    return type === 'diagnosticos' ? 'diagnostics' : 'meetings';
  }

  meetingTitle(document: ApiResponse<'pyme', 'meetingDocuments'>['data'][number]): string {
    return document.title || 'Acta de Reunion';
  }

  isAnyDownloading(): boolean {
    return this.downloadingPdfId() !== null || this.downloadingWordId() !== null;
  }

  downloadPdf(diagnostic: ApiResponse<'pyme', 'diagnosticDocuments'>['data'][number]): void {
    if (this.isAnyDownloading()) return;
    this.downloadingPdfId.set(diagnostic.id);
    try {
      downloadPdf(diagnostic);
    } catch (error) {
      console.error('Error generating PDF', error);
      this.toastService.error('Ocurrió un error al generar el PDF.');
    } finally {
      this.downloadingPdfId.set(null);
    }
  }

  downloadWord(diagnostic: ApiResponse<'pyme', 'diagnosticDocuments'>['data'][number]): void {
    if (this.isAnyDownloading()) return;
    this.downloadingWordId.set(diagnostic.id);
    try {
      downloadWord(diagnostic);
    } catch (error) {
      console.error('Error generating Word', error);
      this.toastService.error('Ocurrió un error al generar el archivo Word.');
    } finally {
      this.downloadingWordId.set(null);
    }
  }

  private emptyMeta(): PaginationMetaDto {
    return {
      total: 0,
      page: 1,
      limit: this.pageSize,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}
