import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { QuillModule } from 'ngx-quill';

import { FormsModule } from '@angular/forms';

type Meeting = ApiResponse<'meeting', 'findOne'>;

@Component({
  selector: 'app-meeting-minutes-detail',
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './meeting-minutes-detail.html',
})
export class MeetingMinutesDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  meeting = signal<Meeting | null>(null);
  loading = signal(false);

  quillModulesReadOnly = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.toastService.error('Acta no encontrada');
      return;
    }

    this.loading.set(true);
    this.hubsme
      .getMeeting(id)
      .then((response) => this.meeting.set(response.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  documentsPath() {
    return `/${this.hubsme.currentUser().role === 'pyme' ? 'pyme' : 'consultor'}/documents`;
  }

  title() {
    return 'Acta de reunion';
  }

  displayTitle() {
    const meeting = this.meeting();
    const title = meeting?.title || 'Sesion de consultoria';
    return title.replace(/^Acta\s*-\s*/i, '');
  }

  renderMarkdown(text: string | null | undefined): string {
    if (!text) return '';

    const isHtml = /<[a-z][\s\S]*>/i.test(text);
    if (isHtml) {
      return text;
    }

    let html = text
      .replace(/^### (.*$)/gim, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="text-xl font-anton lowercase mt-6 mb-3 border-b border-border pb-2">$1</h3>')
      .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-anton lowercase mt-8 mb-4">$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/gim, '<br>');

    return html;
  }

  meetingDate(value: string | null) {
    if (!value) return 'Sin fecha';
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  meetingTime(value: string) {
    return new Date(value).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  responsibleLabel(value: string) {
    const labels: Record<string, string> = {
      consultor: 'Consultor',
      pyme: 'PYME',
    };

    return labels[value.toLowerCase()] || value;
  }

  priorityClass(value: string | null | undefined) {
    const priority = (value || 'baja').toLowerCase();
    if (priority === 'alta') return 'bg-error/10 text-error';
    if (priority === 'media') return 'bg-secondary-50 text-secondary';
    return 'bg-success/10 text-success';
  }
}
