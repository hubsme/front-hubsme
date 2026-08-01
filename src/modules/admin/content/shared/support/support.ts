import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { FeedbackService } from '@service/admin/feedback.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { FeedbackListItemDto, FeedbackResultDto, PaginationMetaDto } from 'api/backend.api';

type FeedbackStatus = FeedbackListItemDto['status'];

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

@Component({
  selector: 'app-support',
  imports: [DatePipe, FormsModule, ModalForm, PaginationComponent],
  templateUrl: './support.html',
})
export class Support {
  private readonly feedbackService = inject(FeedbackService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private requestSequence = 0;
  private detailRequestSequence = 0;

  readonly tickets = signal<FeedbackListItemDto[]>([]);
  readonly selectedTicket = signal<FeedbackResultDto | null>(null);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly page = signal(1);
  readonly pageSize = 8;
  readonly statusFilter = signal<FeedbackStatus | ''>('');
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly showDetailModal = signal(false);
  readonly submitting = signal(false);
  readonly replying = signal(false);
  readonly title = signal('');
  readonly description = signal('');
  readonly selectedImages = signal<SelectedImage[]>([]);
  readonly replyMessage = signal('');
  readonly canSubmit = computed(
    () =>
      this.title().trim().length >= 3 &&
      this.description().trim().length >= 10 &&
      !this.submitting(),
  );
  readonly openTicketsOnPage = computed(
    () => this.tickets().filter((ticket) => !['resolved', 'closed'].includes(ticket.status)).length,
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.revokeAllPreviews());
    void this.loadTickets();
  }

  async loadTickets() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const result = await this.feedbackService.findAll({
        page: this.page(),
        limit: this.pageSize,
        status: this.statusFilter() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.tickets.set(result.data);
      this.meta.set(result.meta);
    } catch (error) {
      if (requestId === this.requestSequence) {
        this.toastService.error(this.hubsme.getErrorMessage(error));
      }
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadTickets();
  }

  changeStatusFilter(status: FeedbackStatus | '') {
    this.statusFilter.set(status);
    this.page.set(1);
    void this.loadTickets();
  }

  onStatusFilterSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.changeStatusFilter(select.value as FeedbackStatus | '');
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const candidates = Array.from(input.files ?? []);
    const existing = this.selectedImages();
    const remainingSlots = MAX_IMAGES - existing.length;

    if (remainingSlots <= 0) {
      this.toastService.warning(`Puedes adjuntar hasta ${MAX_IMAGES} imágenes.`);
      input.value = '';
      return;
    }

    let rejected = false;
    let exceededSlots = false;
    const additions: SelectedImage[] = [];
    for (const file of candidates) {
      if (additions.length >= remainingSlots) {
        exceededSlots = true;
        break;
      }
      const duplicate = [...existing, ...additions].some(
        (item) =>
          item.file.name === file.name &&
          item.file.size === file.size &&
          item.file.lastModified === file.lastModified,
      );
      if (duplicate) continue;
      if (!ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase()) || file.size > MAX_IMAGE_BYTES) {
        rejected = true;
        continue;
      }
      additions.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (exceededSlots) {
      this.toastService.warning(
        `Solo se agregaron imágenes hasta completar el máximo de ${MAX_IMAGES}.`,
      );
    } else if (rejected) {
      this.toastService.warning('Usa imágenes JPG, PNG, WEBP, HEIC o HEIF de máximo 8 MB.');
    }

    this.selectedImages.set([...existing, ...additions]);
    input.value = '';
  }

  removeImage(id: string) {
    const image = this.selectedImages().find((item) => item.id === id);
    if (image) URL.revokeObjectURL(image.previewUrl);
    this.selectedImages.update((images) => images.filter((item) => item.id !== id));
  }

  async submit() {
    if (!this.canSubmit()) {
      this.toastService.warning('Escribe un título y una descripción con suficiente detalle.');
      return;
    }

    this.submitting.set(true);
    const formData = new FormData();
    formData.append('title', this.title().trim());
    formData.append('description', this.description().trim());
    this.selectedImages().forEach(({ file }) => formData.append('images', file, file.name));

    try {
      const created = await this.feedbackService.create(formData);
      this.toastService.success('Tu comentario fue enviado al equipo de soporte.');
      this.resetForm();
      this.statusFilter.set('');
      this.page.set(1);
      await this.loadTickets();
      this.selectedTicket.set(created);
      this.showDetailModal.set(true);
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }

  async openTicket(ticket: FeedbackListItemDto) {
    const requestId = ++this.detailRequestSequence;
    this.showDetailModal.set(true);
    this.selectedTicket.set(null);
    this.detailLoading.set(true);
    try {
      const result = await this.feedbackService.findOne(ticket.id);
      if (requestId !== this.detailRequestSequence) return;
      this.selectedTicket.set(result);
    } catch (error) {
      if (requestId !== this.detailRequestSequence) return;
      this.showDetailModal.set(false);
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      if (requestId === this.detailRequestSequence) this.detailLoading.set(false);
    }
  }

  closeDetail() {
    this.detailRequestSequence += 1;
    this.showDetailModal.set(false);
    this.selectedTicket.set(null);
    this.replyMessage.set('');
  }

  async sendReply() {
    const ticket = this.selectedTicket();
    const message = this.replyMessage().trim();
    if (!ticket || ticket.status === 'closed' || message.length < 2 || this.replying()) return;

    this.replying.set(true);
    try {
      const updated = await this.feedbackService.reply(ticket.id, { message });
      this.selectedTicket.set(updated);
      this.tickets.update((tickets) =>
        tickets.map((item) => (item.id === updated.id ? updated : item)),
      );
      this.replyMessage.set('');
      this.toastService.success('Respuesta enviada.');
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.replying.set(false);
    }
  }

  statusLabel(status: FeedbackStatus) {
    const labels: Record<FeedbackStatus, string> = {
      new: 'Nuevo',
      in_review: 'En revisión',
      accepted: 'Aceptado',
      resolved: 'Resuelto',
      closed: 'Cerrado',
    };
    return labels[status];
  }

  statusClass(status: FeedbackStatus) {
    const classes: Record<FeedbackStatus, string> = {
      new: 'bg-info/10 text-info',
      in_review: 'bg-warning/10 text-warning',
      accepted: 'bg-primary/10 text-primary',
      resolved: 'bg-success/10 text-success',
      closed: 'bg-text/8 text-muted',
    };
    return classes[status];
  }

  formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  canPreviewImage(mimeType: string) {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType.toLowerCase());
  }

  private resetForm() {
    this.title.set('');
    this.description.set('');
    this.revokeAllPreviews();
    this.selectedImages.set([]);
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }

  private revokeAllPreviews() {
    this.selectedImages().forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }
}
