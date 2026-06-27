import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { SessionService } from '@service/session.service';
import { AlertService } from '@service/alert.service';

type ConsultantProfileData = ApiResponse<'consultant', 'findByUser'>;
type MercadoPagoStatus = ApiResponse<'mercadoPago', 'mercadopagoStatus'>;
type MercadoPagoMessage = { type: 'hubsme:mercado-pago'; connected?: boolean; nickname?: string; email?: string; error?: string };

type ConsultantEducationItem = {
  degree: string;
  institution?: string;
  year?: string;
};

type ConsultantCaseStudy = {
  title: string;
  problem?: string;
  action?: string;
  result?: string;
  sector?: string;
};

type ConsultantForm = {
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string;
  location: string;
  workModality: string;
  linkedinUrl: string;
  bio: string;
  specialties: string[];
  sectors: string[];
  industries: string[];
  companyTypes: string[];
  services: string[];
  certifications: string[];
  workedSectors: string[];
  yearsExperience: number;
  education: ConsultantEducationItem[];
  caseStudies: ConsultantCaseStudy[];
  cvText: string;
  pricePerHour: number;
  photoUrl: string;
  videoUrl: string;
  ownerPhone: string;
};

type ChipField =
  | 'specialties'
  | 'sectors'
  | 'industries'
  | 'companyTypes'
  | 'services'
  | 'certifications'
  | 'workedSectors';

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
  private alertService = inject(AlertService);
  private platformId = inject(PLATFORM_ID);
  private mercadoPagoPopup: Window | null = null;
  private mercadoPagoPopupTimer: ReturnType<typeof setInterval> | null = null;

  loading = signal(false);
  saving = signal(false);
  mercadoPagoLoading = signal(false);
  uploadingPhoto = signal(false);
  uploadingVideo = signal(false);
  consultant = signal<ConsultantProfileData | null>(null);
  readonly chipFields: { field: ChipField; label: string; placeholder: string }[] = [
    { field: 'specialties', label: 'Especialidades', placeholder: 'Agregar especialidad...' },
    { field: 'industries', label: 'Industrias', placeholder: 'Agregar industria...' },
    { field: 'companyTypes', label: 'Tipo de empresa', placeholder: 'Agregar tipo...' },
    { field: 'services', label: 'Servicios', placeholder: 'Agregar servicio...' },
    { field: 'sectors', label: 'Sectores', placeholder: 'Agregar sector...' },
    { field: 'certifications', label: 'Certificaciones', placeholder: 'Agregar certificacion...' },
    { field: 'workedSectors', label: 'Sectores trabajados', placeholder: 'Agregar sector trabajado...' },
  ];
  mercadoPagoStatus = signal<MercadoPagoStatus>({
    connected: false,
    mercadoPagoUserId: null,
    nickname: null,
    email: null,
    connectedAt: null,
  });
  photoError = signal(false);
  chipInputs = signal<Record<ChipField, string>>({
    specialties: '',
    sectors: '',
    industries: '',
    companyTypes: '',
    services: '',
    certifications: '',
    workedSectors: '',
  });

  form = signal<ConsultantForm>({
    firstName: '',
    lastName: '',
    fullName: '',
    headline: '',
    location: '',
    workModality: '',
    linkedinUrl: '',
    bio: '',
    specialties: [],
    sectors: [],
    industries: [],
    companyTypes: [],
    services: [],
    certifications: [],
    workedSectors: [],
    yearsExperience: 0,
    education: [],
    caseStudies: [],
    cvText: '',
    pricePerHour: 0,
    photoUrl: '',
    videoUrl: '',
    ownerPhone: '',
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
          headline: data.headline ?? '',
          location: data.location ?? '',
          workModality: data.workModality ?? '',
          linkedinUrl: data.linkedinUrl ?? '',
          bio: data.bio ?? '',
          specialties: data.specialties ?? [],
          sectors: data.sectors ?? [],
          industries: data.industries ?? [],
          companyTypes: data.companyTypes ?? [],
          services: data.services ?? [],
          certifications: data.certifications ?? [],
          workedSectors: data.workedSectors ?? [],
          yearsExperience: data.yearsExperience ?? 0,
          education: data.education ?? [],
          caseStudies: data.caseStudies ?? [],
          cvText: data.cvText ?? '',
          pricePerHour: Number(data.pricePerHour),
          photoUrl: data.photoUrl ?? '',
          videoUrl: data.videoUrl ?? '',
          ownerPhone: data.ownerPhone ?? '',
        });
        this.loadMercadoPagoStatus(data.id);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  save() {
    this.chipFields.forEach((chip) => this.commitChipInput(chip.field));

    const user = this.hubsme.currentUser();
    const form = this.form();
    const fullName = `${form.firstName} ${form.lastName}`.trim() || form.fullName;
    const payload: ApiBody<'consultant', 'create'> = {
      userId: user.id,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      fullName,
      headline: form.headline || undefined,
      location: form.location || undefined,
      workModality: form.workModality || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      bio: form.bio || undefined,
      specialties: form.specialties,
      sectors: form.sectors,
      industries: form.industries,
      companyTypes: form.companyTypes,
      services: form.services,
      certifications: form.certifications,
      workedSectors: form.workedSectors,
      yearsExperience: Number(form.yearsExperience) || 0,
      education: form.education.filter((item) => item.degree.trim()),
      caseStudies: form.caseStudies.filter((item) => item.title.trim()),
      cvText: form.cvText || undefined,
      pricePerHour: Number(form.pricePerHour) || 0,
      photoUrl: form.photoUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      active: 'true',
      validated: this.consultant()?.validated ?? 'false',
      ownerPhone: form.ownerPhone || undefined,
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

  confirmDisconnectMercadoPago(): void {
    const account = this.mercadoPagoAccountLabel();
    const accountStr = account && account !== 'Cuenta conectada' ? ` la cuenta ${account}` : ' tu cuenta';
    this.alertService.confirm(
      'Desconectar Mercado Pago',
      `¿Estás seguro de que deseas desconectar${accountStr} de Mercado Pago? Esto impedirá que las PYMEs realicen reservas y pagos a tu cuenta.`,
      () => {
        this.disconnectMercadoPago();
      }
    );
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
    this.chipInputs.update((current) => ({ ...current, [field]: value }));
  }

  chipInput(field: ChipField): string {
    return this.chipInputs()[field];
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

  addEducation(): void {
    this.form.update((current) => ({
      ...current,
      education: [...current.education, { degree: '', institution: '', year: '' }],
    }));
  }

  removeEducation(index: number): void {
    this.form.update((current) => ({
      ...current,
      education: current.education.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  updateEducation<K extends keyof ConsultantEducationItem>(index: number, key: K, value: ConsultantEducationItem[K]): void {
    this.form.update((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  }

  addCaseStudy(): void {
    this.form.update((current) => ({
      ...current,
      caseStudies: [...current.caseStudies, { title: '', problem: '', action: '', result: '', sector: '' }],
    }));
  }

  removeCaseStudy(index: number): void {
    this.form.update((current) => ({
      ...current,
      caseStudies: current.caseStudies.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  updateCaseStudy<K extends keyof ConsultantCaseStudy>(index: number, key: K, value: ConsultantCaseStudy[K]): void {
    this.form.update((current) => ({
      ...current,
      caseStudies: current.caseStudies.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  }

  private commitChipInput(field: ChipField) {
    const value = this.normalizeChip(this.chipInputs()[field]);
    if (!value) return;

    this.form.update((current) => {
      const exists = current[field].some((item) => item.toLowerCase() === value.toLowerCase());
      if (exists) return current;

      return {
        ...current,
        [field]: [...current[field], value],
      };
    });
    this.chipInputs.update((current) => ({ ...current, [field]: '' }));
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
