import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { SessionService } from '@service/session.service';

type ConsultantProfileData = ApiResponse<'consultant', 'findByUser'>;
type MercadoPagoStatus = ApiResponse<'mercadoPago', 'mercadopagoStatus'>;
type MercadoPagoMessage = { type: 'hubsme:mercado-pago'; connected?: boolean; nickname?: string; email?: string; error?: string };

type ConsultantForm = {
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  specialties: string[];
  sectors: string[];
  pricePerHour: number;
  photoUrl: string;
  videoUrl: string;
};

type ChipField = 'specialties' | 'sectors';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit, OnDestroy {
  private api = inject(Api);
  private mercadoPagoService = inject(MercadoPagoService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private sessionService = inject(SessionService);
  private platformId = inject(PLATFORM_ID);
  private mercadoPagoPopup: Window | null = null;
  private mercadoPagoPopupTimer: ReturnType<typeof setInterval> | null = null;

  loading = signal(false);
  saving = signal(false);
  mercadoPagoLoading = signal(false);
  uploadingPhoto = signal(false);
  uploadingVideo = signal(false);
  consultant = signal<ConsultantProfileData | null>(null);
  mercadoPagoStatus = signal<MercadoPagoStatus>({
    connected: false,
    mercadoPagoUserId: null,
    nickname: null,
    email: null,
    connectedAt: null,
  });
  photoError = signal(false);
  specialtyInput = signal('');
  sectorInput = signal('');

  form = signal<ConsultantForm>({
    firstName: '',
    lastName: '',
    fullName: '',
    bio: '',
    specialties: [],
    sectors: [],
    pricePerHour: 0,
    photoUrl: '',
    videoUrl: '',
  });

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.clearMercadoPagoPopupTimer();
  }

  updateForm<K extends keyof ConsultantForm>(key: K, value: ConsultantForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  load() {
    const user = this.hubsme.currentUser();
    this.loading.set(true);
    this.api.consultant
      .findByUser({ userId: user.id })
      .then((response) => {
        const data = response.data;
        this.consultant.set(data);
        this.photoError.set(false);
        this.sessionService.profilePicture.set(data.photoUrl || null);
        this.form.set({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          fullName: data.fullName,
          bio: data.bio ?? '',
          specialties: data.specialties ?? [],
          sectors: data.sectors ?? [],
          pricePerHour: Number(data.pricePerHour),
          photoUrl: data.photoUrl ?? '',
          videoUrl: data.videoUrl ?? '',
        });
        this.loadMercadoPagoStatus(data.id);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  save() {
    this.commitChipInput('specialties');
    this.commitChipInput('sectors');

    const user = this.hubsme.currentUser();
    const form = this.form();
    const fullName = `${form.firstName} ${form.lastName}`.trim() || form.fullName;
    const payload: ApiBody<'consultant', 'create'> = {
      userId: user.id,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      fullName,
      bio: form.bio || undefined,
      specialties: form.specialties,
      sectors: form.sectors,
      pricePerHour: Number(form.pricePerHour) || 0,
      photoUrl: form.photoUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      active: 'true',
      validated: this.consultant()?.validated ?? 'false',
    };
    const current = this.consultant();
    const request = current
      ? this.api.consultant.update({ id: current.id }, payload)
      : this.api.consultant.create(payload);

    this.saving.set(true);
    request
      .then(() => {
        this.toastService.success('Perfil actualizado');
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.saving.set(false));
  }

  uploadPhoto(event: Event) {
    const file = this.getFile(event);
    if (!file) return;

    this.uploadingPhoto.set(true);
    this.api.storage
      .upload({ folder: 'consultants/photos' }, { file })
      .then((response) => {
        this.updateForm('photoUrl', response.data.secureUrl);
        this.photoError.set(false);
        this.sessionService.profilePicture.set(response.data.secureUrl);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.uploadingPhoto.set(false));
  }

  startMercadoPagoConnect(): void {
    const consultantId = this.consultant()?.id;
    if (!consultantId || !isPlatformBrowser(this.platformId)) return;

    this.mercadoPagoLoading.set(true);
    this.mercadoPagoService
      .authUrl({ consultantId })
      .then((response) => {
        this.mercadoPagoPopup = window.open(response.url, 'hubsme_mercado_pago', this.getMercadoPagoPopupFeatures());

        if (!this.mercadoPagoPopup) {
          this.toastService.error('Permite popups para conectar Mercado Pago');
          this.mercadoPagoLoading.set(false);
          return;
        }

        this.mercadoPagoPopup.focus();
        this.mercadoPagoPopupTimer = setInterval(() => {
          if (this.mercadoPagoPopup?.closed) {
            this.clearMercadoPagoPopupTimer();
            this.mercadoPagoLoading.set(false);
          }
        }, 500);
      })
      .catch((error) => {
        this.toastService.error(this.hubsme.getErrorMessage(error));
        this.mercadoPagoLoading.set(false);
      });
  }

  disconnectMercadoPago(): void {
    const consultantId = this.consultant()?.id;
    if (!consultantId) return;

    this.mercadoPagoLoading.set(true);
    this.mercadoPagoService
      .disconnect({ consultantId })
      .then((status) => {
        this.mercadoPagoStatus.set(status);
        this.toastService.success('Mercado Pago desconectado');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.mercadoPagoLoading.set(false));
  }

  mercadoPagoAccountLabel(): string {
    const status = this.mercadoPagoStatus();
    return status.nickname || status.email || status.mercadoPagoUserId || 'Cuenta conectada';
  }

  @HostListener('window:message', ['$event'])
  handleMercadoPagoMessage(event: MessageEvent<unknown>): void {
    if (!this.isMercadoPagoMessage(event.data)) return;

    this.clearMercadoPagoPopupTimer();
    this.mercadoPagoPopup?.close();
    this.mercadoPagoPopup = null;
    this.mercadoPagoLoading.set(false);

    if (event.data.error) {
      this.toastService.error(event.data.error);
      return;
    }

    this.toastService.success('Mercado Pago conectado');
    const consultantId = this.consultant()?.id;
    if (consultantId) {
      this.loadMercadoPagoStatus(consultantId);
    }
  }

  onPhotoError() {
    this.photoError.set(true);
  }

  getInitials(): string {
    const first = this.form().firstName?.trim()?.charAt(0) || '';
    const last = this.form().lastName?.trim()?.charAt(0) || '';
    return (first + last).toUpperCase() || 'C';
  }

  uploadVideo(event: Event) {
    const file = this.getFile(event);
    if (!file) return;

    this.uploadingVideo.set(true);
    this.api.storage
      .upload({ folder: 'consultants/videos' }, { file })
      .then((response) => this.updateForm('videoUrl', response.data.secureUrl))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.uploadingVideo.set(false));
  }

  updateChipInput(field: ChipField, value: string) {
    this.inputSignal(field).set(value);
  }

  addChip(field: ChipField) {
    this.commitChipInput(field);
  }

  removeChip(field: ChipField, index: number) {
    this.form.update((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  handleChipKeydown(event: KeyboardEvent, field: ChipField) {
    if (event.key !== 'Enter' && event.key !== ',') return;

    event.preventDefault();
    this.commitChipInput(field);
  }

  private commitChipInput(field: ChipField) {
    const input = this.inputSignal(field);
    const value = this.normalizeChip(input());
    if (!value) return;

    this.form.update((current) => {
      const exists = current[field].some((item) => item.toLowerCase() === value.toLowerCase());
      if (exists) return current;

      return {
        ...current,
        [field]: [...current[field], value],
      };
    });
    input.set('');
  }

  private inputSignal(field: ChipField) {
    return field === 'specialties' ? this.specialtyInput : this.sectorInput;
  }

  private normalizeChip(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  private getFile(event: Event): File | null {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return null;
    return target.files?.[0] ?? null;
  }

  private loadMercadoPagoStatus(consultantId: number): void {
    this.mercadoPagoService
      .status({ consultantId })
      .then((status) => this.mercadoPagoStatus.set(status))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  private clearMercadoPagoPopupTimer(): void {
    if (!this.mercadoPagoPopupTimer) return;
    clearInterval(this.mercadoPagoPopupTimer);
    this.mercadoPagoPopupTimer = null;
  }

  private getMercadoPagoPopupFeatures(): string {
    const width = 520;
    const height = 700;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

    return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
  }

  private isMercadoPagoMessage(value: unknown): value is MercadoPagoMessage {
    if (!value || typeof value !== 'object') return false;
    const message = value as { type?: unknown };
    return message.type === 'hubsme:mercado-pago';
  }
}
