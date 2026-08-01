import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { AdminApiService } from '@service/admin-api.service';
import { ToastService } from '@service/toast.service';
import { FeedbackListItemDto, FeedbackResultDto, PaginationMetaDto } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

type FeedbackStatus = FeedbackListItemDto['status'];
type FeedbackRole = FeedbackListItemDto['userRole'];

@Component({
  selector: 'app-soporte',
  imports: [DatePipe, FormsModule, ModalForm, PaginationComponent],
  templateUrl: './soporte.html',
})
export class Soporte {
  private readonly adminApi = inject(AdminApiService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchTerms = new Subject<string>();
  private requestSequence = 0;
  private detailRequestSequence = 0;

  readonly tickets = signal<FeedbackListItemDto[]>([]);
  readonly selectedTicket = signal<FeedbackResultDto | null>(null);
  readonly meta = signal<PaginationMetaDto | null>(null);
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly showDetailModal = signal(false);
  readonly statusUpdating = signal(false);
  readonly replying = signal(false);
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly search = signal('');
  readonly status = signal<FeedbackStatus | ''>('');
  readonly userRole = signal<FeedbackRole | ''>('');
  readonly statusDraft = signal<FeedbackStatus>('new');
  readonly replyMessage = signal('');
  readonly totalTickets = computed(() => this.meta()?.total ?? 0);
  readonly newOnPage = computed(
    () => this.tickets().filter((ticket) => ticket.status === 'new').length,
  );
  readonly activeOnPage = computed(
    () => this.tickets().filter((ticket) => !['resolved', 'closed'].includes(ticket.status)).length,
  );

  constructor() {
    this.searchTerms
      .pipe(debounceTime(450), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page.set(1);
        void this.loadTickets();
      });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('feedback'));
      if (Number.isInteger(id) && id > 0 && this.selectedTicket()?.id !== id) {
        void this.openDetailById(id);
      }
    });

    void this.loadTickets();
  }

  async loadTickets() {
    const requestId = ++this.requestSequence;
    this.loading.set(true);
    try {
      const response = await this.adminApi.api.feedbackAdmin.feedbackadminFindAll({
        page: this.page(),
        limit: this.pageSize,
        search: this.search().trim() || undefined,
        status: this.status() || undefined,
        userRole: this.userRole() || undefined,
      });
      if (requestId !== this.requestSequence) return;
      this.tickets.set(response.data.data);
      this.meta.set(response.data.meta);
    } catch (error) {
      if (requestId === this.requestSequence) {
        this.toastService.error(this.errorMessage(error, 'No se pudieron cargar los comentarios.'));
      }
    } finally {
      if (requestId === this.requestSequence) this.loading.set(false);
    }
  }

  onSearchChange(value: string) {
    this.search.set(value);
    this.searchTerms.next(value.trim());
  }

  onStatusSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value as FeedbackStatus | '';
    this.status.set(value);
    this.page.set(1);
    void this.loadTickets();
  }

  onRoleSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value as FeedbackRole | '';
    this.userRole.set(value);
    this.page.set(1);
    void this.loadTickets();
  }

  onStatusDraftSelect(event: Event) {
    this.statusDraft.set((event.target as HTMLSelectElement).value as FeedbackStatus);
  }

  clearFilters() {
    this.search.set('');
    this.status.set('');
    this.userRole.set('');
    this.page.set(1);
    void this.loadTickets();
  }

  changePage(page: number) {
    if (page === this.page()) return;
    this.page.set(page);
    void this.loadTickets();
  }

  async openDetail(ticket: FeedbackListItemDto) {
    if (this.selectedTicket()?.id === ticket.id && this.showDetailModal()) return;
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { feedback: ticket.id },
      queryParamsHandling: 'merge',
    });
  }

  async openDetailById(id: number) {
    const requestId = ++this.detailRequestSequence;
    this.showDetailModal.set(true);
    this.selectedTicket.set(null);
    this.detailLoading.set(true);
    try {
      const response = await this.adminApi.api.feedbackAdmin.feedbackadminFindOne({ id });
      if (requestId !== this.detailRequestSequence) return;
      this.selectedTicket.set(response.data);
      this.statusDraft.set(response.data.status);
    } catch (error) {
      if (requestId !== this.detailRequestSequence) return;
      this.showDetailModal.set(false);
      this.toastService.error(this.errorMessage(error, 'No se pudo cargar el comentario.'));
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { feedback: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } finally {
      if (requestId === this.detailRequestSequence) this.detailLoading.set(false);
    }
  }

  async closeDetail() {
    this.detailRequestSequence += 1;
    this.showDetailModal.set(false);
    this.selectedTicket.set(null);
    this.replyMessage.set('');
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { feedback: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  async updateStatus() {
    const ticket = this.selectedTicket();
    if (!ticket || ticket.status === this.statusDraft() || this.statusUpdating()) return;

    this.statusUpdating.set(true);
    try {
      const response = await this.adminApi.api.feedbackAdmin.feedbackadminUpdateStatus(
        { id: ticket.id },
        { status: this.statusDraft() },
      );
      this.selectedTicket.set(response.data);
      this.statusDraft.set(response.data.status);
      this.syncTicket(response.data);
      this.toastService.success('Estado actualizado.');
      await this.loadTickets();
    } catch (error) {
      this.statusDraft.set(ticket.status);
      this.toastService.error(this.errorMessage(error, 'No se pudo actualizar el estado.'));
    } finally {
      this.statusUpdating.set(false);
    }
  }

  async sendReply() {
    const ticket = this.selectedTicket();
    const message = this.replyMessage().trim();
    if (!ticket || ticket.status === 'closed' || message.length < 2 || this.replying()) return;

    this.replying.set(true);
    try {
      const response = await this.adminApi.api.feedbackAdmin.feedbackadminReply(
        { id: ticket.id },
        { message },
      );
      this.selectedTicket.set(response.data);
      this.statusDraft.set(response.data.status);
      this.syncTicket(response.data);
      this.replyMessage.set('');
      this.toastService.success('Respuesta enviada.');
      await this.loadTickets();
    } catch (error) {
      this.toastService.error(this.errorMessage(error, 'No se pudo enviar la respuesta.'));
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

  roleLabel(role: FeedbackRole) {
    return role === 'pyme' ? 'PYME' : 'Consultor';
  }

  formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  canPreviewImage(mimeType: string) {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType.toLowerCase());
  }

  private syncTicket(ticket: FeedbackResultDto) {
    this.tickets.update((tickets) =>
      tickets.map((item) => (item.id === ticket.id ? ticket : item)),
    );
  }

  private errorMessage(error: unknown, fallback: string) {
    const apiError = error as { error?: { message?: string | string[] }; message?: string };
    const message = apiError.error?.message ?? apiError.message ?? fallback;
    return Array.isArray(message) ? message[0] : message;
  }
}
