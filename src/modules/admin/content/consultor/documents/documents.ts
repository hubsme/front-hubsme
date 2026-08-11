import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse, PaginationMetaDto } from 'api/backend.api';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { ConsultantService } from '@service/admin/consultant.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './documents.html',
})
export class Documents implements OnDestroy, OnInit {
  private hubsme = inject(HubsmeService);
  private consultantService = inject(ConsultantService);
  private toastService = inject(ToastService);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  meetingDocuments = signal<ApiResponse<'consultant', 'meetingDocuments'>['data']>([]);
  diagnostics = signal<ApiResponse<'consultant', 'diagnosticDocuments'>['data']>([]);
  search = signal('');
  loading = signal(false);
  activeTab = signal<'meetings' | 'diagnostics'>('meetings');
  meetingPage = signal(1);
  diagnosticPage = signal(1);
  readonly pageSize = 10;

  filteredMeetingDocuments = computed(() => this.meetingDocuments());
  filteredDiagnosticDocuments = computed(() => this.diagnostics());
  paginatedMeetingDocuments = computed(() => this.meetingDocuments());
  paginatedDiagnosticDocuments = computed(() => this.diagnostics());
  meetingMeta = signal<PaginationMetaDto>(this.emptyMeta());
  diagnosticMeta = signal<PaginationMetaDto>(this.emptyMeta());
  private readonly failedPymeImages = signal<ReadonlySet<string>>(new Set<string>());
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }

  load() {
    this.loading.set(true);
    Promise.all([this.loadMeetings(), this.loadDiagnostics()])
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private loadMeetings() {
    return this.consultantService
      .meetingDocuments({ page: this.meetingPage(), limit: this.pageSize, search: this.search().trim() || undefined })
      .then((response) => {
        this.meetingDocuments.set(response.data);
        this.meetingMeta.set(response.meta);
      });
  }

  private loadDiagnostics() {
    return this.consultantService
      .diagnosticDocuments({ page: this.diagnosticPage(), limit: this.pageSize, search: this.search().trim() || undefined })
      .then((response) => {
        this.diagnostics.set(response.data);
        this.diagnosticMeta.set(response.meta);
      });
  }

  updateSearch(value: string) {
    this.search.set(value);
    this.meetingPage.set(1);
    this.diagnosticPage.set(1);

    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.load();
      this.searchTimeout = null;
    }, 300);
  }

  selectTab(tab: 'meetings' | 'diagnostics') {
    this.activeTab.set(tab);
  }

  changeMeetingPage(page: number) {
    this.meetingPage.set(page);
    this.loading.set(true);
    this.loadMeetings()
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  changeDiagnosticPage(page: number) {
    this.diagnosticPage.set(page);
    this.loading.set(true);
    this.loadDiagnostics()
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
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

  documentTitle(document: ApiResponse<'consultant', 'meetingDocuments'>['data'][number]) {
    return document.title || 'Acta de Reunion';
  }

  showPymeLogo(key: string, logoUrl: string | null | undefined): boolean {
    return Boolean(logoUrl) && !this.failedPymeImages().has(key);
  }

  markPymeLogoAsFailed(key: string): void {
    this.failedPymeImages.update((failedImages) => {
      const updatedImages = new Set<string>(failedImages);
      updatedImages.add(key);
      return updatedImages;
    });
  }

  pymeInitial(name: string): string {
    return name.trim().charAt(0).toLocaleUpperCase('es-PE') || 'P';
  }

  consultantName() {
    return this.hubsme.currentUser().name;
  }
}
