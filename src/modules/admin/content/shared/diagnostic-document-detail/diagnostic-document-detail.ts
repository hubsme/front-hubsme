import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type DiagnosticDocument = ApiResponse<'diagnosticDocument', 'diagnosticdocumentFindOne'>;

@Component({
  selector: 'app-diagnostic-document-detail',
  imports: [CommonModule, FormsModule, RouterLink, QuillModule],
  templateUrl: './diagnostic-document-detail.html',
})
export class DiagnosticDocumentDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  diagnostic = signal<DiagnosticDocument | null>(null);
  loading = signal(false);

  quillModulesReadOnly = {
    toolbar: false,
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.toastService.error('Documento no encontrado');
      return;
    }

    this.loading.set(true);
    this.hubsme
      .getDiagnosticDocument(id)
      .then((response) => this.diagnostic.set(response.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  documentsPath() {
    return `/${this.hubsme.currentUser().role === 'pyme' ? 'pyme' : 'consultor'}/documents`;
  }

  meetingDate(value: string | Date | null | undefined) {
    if (!value) return 'Sin fecha';
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  renderMarkdown(text: string | null | undefined): string {
    if (!text) return '';

    return text
      .replace(/^### (.*$)/gim, '<h4 class="mt-4 mb-2 text-lg font-inter-bold">$1</h4>')
      .replace(
        /^## (.*$)/gim,
        '<h3 class="mt-6 mb-3 border-b border-border pb-2 text-xl font-anton lowercase">$1</h3>',
      )
      .replace(/^# (.*$)/gim, '<h2 class="mt-8 mb-4 text-2xl font-anton lowercase">$1</h2>')
      .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/gim, '<br>');
  }
}
