import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { QuillModule } from 'ngx-quill';

import { FormsModule } from '@angular/forms';

type Meeting = ApiResponse<'meeting', 'findOne'>;
type MeetingTask = NonNullable<Meeting['tasks']>[number];
type MeetingRecording = ApiResponse<'meeting', 'getRecordings'>[number];

type FinalizeTask = {
  title: string;
  description: string;
  assignedTo: 'pyme' | 'consultor';
  priority: 'alta' | 'media' | 'baja';
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
    if (!text) return '';

    const isHtml = /<[a-z][\s\S]*>/i.test(text);
    if (isHtml) {
      return text;
    }

    let html = text
      .replace(/^### (.*$)/gim, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>')
      .replace(
        /^## (.*$)/gim,
        '<h3 class="text-xl font-anton lowercase mt-6 mb-3 border-b border-border pb-2">$1</h3>',
      )
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

  recordingDate(value?: string) {
    if (!value) return 'Fecha no disponible';

    return new Date(value).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
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

  priorityClass(value: string | null | undefined) {
    const priority = (value || 'baja').toLowerCase();
    if (priority === 'alta') return 'bg-error/10 text-error';
    if (priority === 'media') return 'bg-secondary-50 text-secondary';
    return 'bg-success/10 text-success';
  }

  isConsultant() {
    return this.hubsme.currentUser()?.role === 'consultor';
  }

  startEdit() {
    const current = this.meeting();
    if (!current) return;

    this.editDescription.set(current.description || '');

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
        assignedTo: 'pyme',
        priority: (t.priority?.toLowerCase() || 'media') as 'alta' | 'media' | 'baja',
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
      ...tasks,
      {
        title: '',
        description: '',
        assignedTo: 'pyme',
        priority: 'media',
        dueDate: defaultDate,
      },
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

    const description = this.editDescription();
    if (!description || !description.trim()) {
      this.toastService.error('El acta no puede estar vacía');
      return;
    }

    this.isSaving.set(true);

    const tasksPayload = this.editTasks()
      .filter((task) => task.assignedTo === 'pyme')
      .map((t) => ({
        ...t,
        assignedTo: 'pyme' as const,
        dueDate: t.dueDate ? new Date(t.dueDate + 'T12:00:00').toISOString() : undefined,
      }));

    this.hubsme
      .finalizeMeeting(current.id, {
        description,
        tasks: tasksPayload,
      })
      .then((res) => {
        this.toastService.success('Acta y compromisos de la PYME actualizados con éxito');
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
        const actaText = response.data.summary || '';
        this.editDescription.set(actaText);

        if (response.data.tasks && response.data.tasks.length > 0) {
          const suggestedTasks: FinalizeTask[] = response.data.tasks
            .filter((t) => t.assignedTo === 'pyme')
            .map((t) => ({
              title: t.title,
              description: t.description,
              assignedTo: 'pyme',
              priority: t.priority,
              dueDate: t.dueDate || undefined,
            }));
          this.editTasks.set(suggestedTasks);
        }

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
