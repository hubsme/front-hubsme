import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { QuillModule } from 'ngx-quill';
import { marked } from 'marked';

import { FormsModule } from '@angular/forms';

type Meeting = ApiResponse<'meeting', 'findOne'>;
type MeetingTask = NonNullable<Meeting['tasks']>[number];
type MeetingRecording = ApiResponse<'meeting', 'getRecordings'>[number];

type FinalizeTask = {
  title: string;
  description: string;
  assignedTo: 'pyme' | 'consultor';
  priority: 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada';
  dueDate?: string;
};

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
  recordings = signal<MeetingRecording[]>([]);
  loading = signal(false);
  recordingsLoading = signal(false);
  recordingsError = signal('');
  showRecordingCheckModal = signal(false);
  readyRecordingCount = computed(
    () => this.recordings().filter((recording) => Boolean(this.recordingUrl(recording))).length,
  );
  canContinueMinutesCreation = computed(
    () =>
      !this.recordingsLoading() &&
      !this.recordingsError() &&
      this.recordings().length > 0 &&
      this.readyRecordingCount() === this.recordings().length,
  );

  // Editing state signals
  isEditing = signal(false);
  isSaving = signal(false);
  editDescription = signal('');
  editTasks = signal<FinalizeTask[]>([]);

  // Copilot summary signals
  copilotLoading = signal(false);
  copilotError = signal('');

  quillModulesReadOnly = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
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
      .then((response) => {
        this.meeting.set(response.data);
        this.loadRecordings(response.data.id);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  private loadRecordings(meetingId: number) {
    this.recordingsLoading.set(true);
    this.recordingsError.set('');

    this.hubsme
      .getMeetingRecordings(meetingId)
      .then((response) => this.recordings.set(this.toRecordings(response.data)))
      .catch((error) => {
        this.recordings.set([]);
        this.recordingsError.set(this.hubsme.getErrorMessage(error));
      })
      .finally(() => this.recordingsLoading.set(false));
  }

  private toRecordings(value: unknown): MeetingRecording[] {
    return Array.isArray(value) ? (value as MeetingRecording[]) : [];
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
    const html = this.markdownToEditorHtml(text);
    return html
      .replace(/<h1(?:\s[^>]*)?>/gi, '<h1 class="mb-5 mt-0 text-lg font-inter-bold uppercase tracking-tight text-text">')
      .replace(/<h2(?:\s[^>]*)?>/gi, '<h2 class="mb-3 mt-7 text-base font-inter-bold uppercase tracking-wide text-text">')
      .replace(/<h3(?:\s[^>]*)?>/gi, '<h3 class="mb-2 mt-5 text-sm font-inter-bold uppercase tracking-wide text-text">')
      .replace(/<p(?:\s[^>]*)?>/gi, '<p class="mb-4 text-[0.92rem] leading-7 text-text">')
      .replace(/<ul(?:\s[^>]*)?>/gi, '<ul class="my-4 space-y-2 pl-5 text-[0.92rem] leading-7 text-text">')
      .replace(/<ol(?:\s[^>]*)?>/gi, '<ol class="my-4 space-y-2 pl-5 text-[0.92rem] leading-7 text-text">')
      .replace(/<li(?:\s[^>]*)?>/gi, '<li class="pl-1">')
      .replace(/<blockquote(?:\s[^>]*)?>/gi, '<blockquote class="my-4 border-l-2 border-secondary/40 pl-4 text-[0.92rem] leading-7 text-muted">');
  }

  private markdownToEditorHtml(text: string | null | undefined): string {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) return text;

    return marked.parse(text, { async: false }) as string;
  }

  private editorHtmlToMarkdown(value: string): string {
    if (!value || !/<[a-z][\s\S]*>/i.test(value)) return value.trim();

    const document = new DOMParser().parseFromString(`<div>${value}</div>`, 'text/html');
    const root = document.body.firstElementChild;
    if (!root) return value.trim();

    const markdown = this.htmlNodeToMarkdown(root);
    return markdown
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private htmlNodeToMarkdown(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();
    const content = () => Array.from(element.childNodes).map((child) => this.htmlNodeToMarkdown(child)).join('');

    if (tag === 'br') return '\n';
    if (tag === 'strong' || tag === 'b') return `**${content().trim()}**`;
    if (tag === 'em' || tag === 'i') return `*${content().trim()}*`;
    if (tag === 'del' || tag === 's') return `~~${content().trim()}~~`;
    if (tag === 'ul' || tag === 'ol') {
      const ordered = tag === 'ol';
      const items = Array.from(element.children)
        .filter((child) => child.tagName.toLowerCase() === 'li')
        .map((item, index) => {
          const itemText = Array.from(item.childNodes)
            .map((child) => this.htmlNodeToMarkdown(child))
            .join('')
            .replace(/\s*\n\s*/g, ' ')
            .trim();
          return `${ordered ? `${index + 1}.` : '-'} ${itemText}`;
        });
      return items.length ? `${items.join('\n')}\n\n` : '';
    }
    if (tag === 'li') return content();
    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag.slice(1));
      return `${'#'.repeat(level)} ${content().trim()}\n\n`;
    }
    if (tag === 'p' || tag === 'div' || tag === 'blockquote') {
      const value = content().trim();
      return value ? `${value}\n\n` : '';
    }

    return content();
  }

  meetingDate(value: string | null) {
    if (!value) return 'Sin fecha';
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'America/Lima',
    });
  }

  meetingDisplayStart(meeting: Meeting) {
    return meeting.startTime ?? meeting.proposedStartTimes?.[0] ?? meeting.createdAt;
  }

  meetingTime(value: string | null) {
    if (!value) return 'Sin hora';
    return new Date(value).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Lima',
    });
  }

  recordingDate(value?: string) {
    if (!value) return 'Fecha no disponible';

    return new Date(value).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Lima',
    });
  }

  recordingDuration(recording: MeetingRecording) {
    if (!recording.createdDateTime || !recording.endDateTime) return 'Duracion no disponible';

    const start = new Date(recording.createdDateTime).getTime();
    const end = new Date(recording.endDateTime).getTime();
    const minutes = Math.max(1, Math.round((end - start) / 60_000));
    return `${minutes} min`;
  }

  recordingUrl(recording: MeetingRecording) {
    return recording.publicUrl || recording.downloadUrl || recording.webUrl || null;
  }

  responsibleLabel(value: string) {
    const labels: Record<string, string> = {
      consultor: 'Consultor',
      pyme: 'PYME',
    };

    return labels[value.toLowerCase()] || value;
  }

  taskOriginLabel(meetingId: number | null | undefined) {
    return meetingId ? `Reunión #${meetingId}` : 'Creada manualmente';
  }

  taskStatusLabel(value: string | null | undefined) {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      en_progreso: 'En progreso',
      completada: 'Completada',
      bloqueada: 'Bloqueada',
    };

    return labels[value || ''] || 'Pendiente';
  }

  taskStatusClass(value: string | null | undefined) {
    if (value === 'completada') return 'bg-success/10 text-success';
    if (value === 'en_progreso') return 'bg-secondary/10 text-secondary';
    if (value === 'bloqueada') return 'bg-error/10 text-error';
    return 'bg-text/5 text-muted';
  }

  priorityClass(value: string | null | undefined) {
    const priority = (value || 'baja').toLowerCase();
    if (priority === 'alta') return 'bg-error/10 text-error';
    if (priority === 'media') return 'bg-secondary-50 text-secondary';
    return 'bg-success/10 text-success';
  }

  isConsultant() {
    return this.hubsme.currentUser()?.role === 'consultor';
  }

  handleMinutesAction() {
    const current = this.meeting();
    if (!current) return;

    if (current.description?.trim()) {
      this.startEdit();
      return;
    }

    this.showRecordingCheckModal.set(true);
    if (!this.recordingsLoading()) {
      this.loadRecordings(current.id);
    }
  }

  closeRecordingCheckModal() {
    this.showRecordingCheckModal.set(false);
  }

  refreshRecordings() {
    const current = this.meeting();
    if (!current || this.recordingsLoading()) return;

    this.loadRecordings(current.id);
  }

  continueMinutesCreation() {
    if (!this.canContinueMinutesCreation()) return;

    this.showRecordingCheckModal.set(false);
    this.startEdit();
    this.generateCopilotSummary();
  }

  startEdit() {
    const current = this.meeting();
    if (!current) return;

    this.editDescription.set(this.markdownToEditorHtml(current.description));

    const mappedTasks: FinalizeTask[] = (current.tasks || []).map((t: MeetingTask) => {
      let dueDateStr = '';
      if (t.dueDate) {
        const date = new Date(t.dueDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dueDateStr = `${year}-${month}-${day}`;
      }
      return {
        title: t.title || '',
        description: t.description || '',
        assignedTo: t.assignedTo === 'consultor' ? 'consultor' : 'pyme',
        priority: (t.priority?.toLowerCase() || 'media') as 'alta' | 'media' | 'baja',
        status: t.status || 'pendiente',
        dueDate: dueDateStr,
      };
    });

    this.editTasks.set(mappedTasks);
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  addTask() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${year}-${month}-${day}`;

    this.editTasks.update((tasks) => [
      {
        title: '',
        description: '',
        assignedTo: 'pyme',
        priority: 'media',
        status: 'pendiente',
        dueDate: defaultDate,
      },
      ...tasks,
    ]);
  }

  removeTask(index: number) {
    this.editTasks.update((tasks) => tasks.filter((_, i) => i !== index));
  }

  updateTask<K extends keyof FinalizeTask>(index: number, key: K, value: FinalizeTask[K]) {
    this.editTasks.update((tasks) => {
      const updated = [...tasks];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  }

  saveChanges() {
    const current = this.meeting();
    if (!current) return;

    const description = this.editorHtmlToMarkdown(this.editDescription());
    if (!description || !description.trim()) {
      this.toastService.error('El acta no puede estar vacía');
      return;
    }

    this.isSaving.set(true);

    const tasksPayload = this.editTasks().map((t) => ({
        ...t,
        title: t.title.trim() || 'Pendiente de la reunión',
        description: t.description.trim() || '.',
        assignedTo: t.assignedTo,
        dueDate: t.dueDate ? new Date(t.dueDate + 'T12:00:00').toISOString() : undefined,
        status: t.status,
      }));

    this.hubsme
      .finalizeMeeting(current.id, {
        description,
        tasks: tasksPayload,
      })
      .then((res) => {
        this.toastService.success('Acta y compromisos actualizados con éxito');
        this.isEditing.set(false);
        this.loading.set(true);
        return this.hubsme.getMeeting(current.id);
      })
      .then((response) => {
        if (response) {
          this.meeting.set(response.data);
        }
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => {
        this.isSaving.set(false);
        this.loading.set(false);
      });
  }

  generateCopilotSummary() {
    const current = this.meeting();
    if (!current) return;

    this.copilotLoading.set(true);
    this.copilotError.set('');

    this.hubsme
      .getCopilotSummary(current.id)
      .then((response) => {
        const actaText = response.data.summary?.trim() || '.';
        this.editDescription.set(this.markdownToEditorHtml(actaText));

        const suggestedTasks: FinalizeTask[] = (response.data.tasks || [])
          .map((t) => ({
            title: t.title || 'Pendiente de la reunión',
            description: t.description || '.',
            assignedTo: t.assignedTo === 'consultor' ? 'consultor' : 'pyme',
            priority: t.priority,
            status: 'pendiente',
            dueDate: t.dueDate || undefined,
          }));
        this.editTasks.set(suggestedTasks);

        this.toastService.success('Acta y compromisos sugeridos generados con IA');
      })
      .catch((error) => {
        this.copilotError.set(this.hubsme.getErrorMessage(error));
        this.toastService.error(this.hubsme.getErrorMessage(error));
      })
      .finally(() => {
        this.copilotLoading.set(false);
      });
  }
}
