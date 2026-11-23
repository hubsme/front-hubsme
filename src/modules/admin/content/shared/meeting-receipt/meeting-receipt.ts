import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import type { MeetingReceiptResultDto } from 'api/backend.api';
import { MeetingReceiptService } from '@service/admin/meeting-receipt.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-meeting-receipt',
  imports: [DecimalPipe],
  templateUrl: './meeting-receipt.html',
})
export class MeetingReceipt {
  private readonly service = inject(MeetingReceiptService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly downloadLink = viewChild.required<ElementRef<HTMLAnchorElement>>('downloadLink');
  private requestSequence = 0;
  private destroyed = false;
  private blobUrl: string | null = null;

  readonly meetingId = input(0);
  readonly checkoutId = input<number | null>(null);
  readonly targetId = computed(() => this.checkoutId() ?? this.meetingId());
  readonly adminView = input(false);
  readonly fileName = input<string | null>(null);
  readonly state = signal<MeetingReceiptResultDto | null>(null);
  readonly loading = signal(false);
  readonly loadFailed = signal(false);
  readonly saving = signal(false);
  readonly downloading = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly originalName = computed(() => this.adminView() ? this.fileName() : this.state()?.receipt?.originalName);

  constructor() {
    effect(() => {
      const id = this.targetId();
      if (!this.adminView()) void this.load(id);
    });
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    });
  }

  async load(id = this.targetId()): Promise<void> {
    const request = ++this.requestSequence;
    this.state.set(null);
    this.selectedFile.set(null);
    this.loading.set(true);
    this.loadFailed.set(false);
    try {
      const state = await this.service.findOne(id, this.checkoutId() !== null);
      if (request === this.requestSequence && !this.destroyed) this.state.set(state);
    } catch {
      if (request === this.requestSequence && !this.destroyed) this.loadFailed.set(true);
    } finally {
      if (request === this.requestSequence && !this.destroyed) this.loading.set(false);
    }
  }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    this.selectedFile.set(null);
    if (!file) return;
    if (file.type !== 'application/pdf' || file.size <= 0 || file.size > 10 * 1024 * 1024) {
      this.toast.error('Selecciona un PDF de hasta 10 MB.');
      return;
    }
    this.selectedFile.set(file);
  }

  async save(): Promise<void> {
    const file = this.selectedFile();
    if (!file || !this.state()?.canUpload || this.saving()) return;
    const id = this.targetId();
    this.saving.set(true);
    try {
      const result = await this.service.upload(id, file, this.checkoutId() !== null);
      if (this.destroyed || id !== this.targetId()) return;
      this.state.set(result);
      this.selectedFile.set(null);
      this.toast.success('Recibo por honorarios guardado.');
    } catch (error) {
      this.toast.error(this.hubsme.getErrorMessage(error));
      if (!this.destroyed && id === this.targetId()) await this.load(id);
    } finally {
      this.saving.set(false);
    }
  }

  async download(): Promise<void> {
    if (this.downloading()) return;
    this.downloading.set(true);
    const id = this.targetId();
    try {
      const file = await this.service.download(id, this.adminView(), this.checkoutId() !== null);
      if (this.destroyed || id !== this.targetId()) return;
      if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = URL.createObjectURL(file);
      const anchor = this.downloadLink().nativeElement;
      anchor.href = this.blobUrl;
      anchor.download = this.originalName() || 'recibo-por-honorarios.pdf';
      anchor.click();
    } catch {
      this.toast.error('No se pudo descargar el recibo por honorarios.');
    } finally {
      this.downloading.set(false);
    }
  }
}
