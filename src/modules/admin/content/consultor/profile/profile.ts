import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { MercadoPagoService } from '@service/admin/mercado-pago.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { SessionService } from '@service/session.service';
import { AlertService } from '@service/alert.service';
import { PhoneInputComponent } from '@component/phone-input/phone-input';
import { normalizePhoneForSubmit } from '@function/phone.function';
import {
  CONSULTANT_DIAGNOSTIC_AREAS,
  ConsultantDiagnosticArea,
} from '@enum/consultant-diagnostic-area.enum';

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
  diagnosticAreas: ConsultantDiagnosticArea[];
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
  cvUrl: string;
  pricePerHour: number;
  photoUrl: string;
  videoUrl: string;
  ownerPhone: string;
  active: 'true' | 'false';
};

type ChipField =
  | 'specialties'
  | 'sectors'
  | 'industries'
  | 'companyTypes'
  | 'services'
  | 'certifications'
  | 'workedSectors';

type PreviewList = 'specialties' | 'diagnosticAreas';
type DraggedPreviewItem = { list: PreviewList; index: number };

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, PhoneInputComponent],
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
  uploadingCv = signal(false);
  cvFileName = signal('');
  cvError = signal('');
  profilePreviewEditing = signal(false);
  previewMediaActive = signal(false);
  draggedPreviewItem = signal<DraggedPreviewItem | null>(null);
  consultant = signal<ConsultantProfileData | null>(null);
  readonly diagnosticAreaOptions = CONSULTANT_DIAGNOSTIC_AREAS;
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
    diagnosticAreas: [],
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
    cvUrl: '',
    pricePerHour: 0,
    photoUrl: '',
    videoUrl: '',
    ownerPhone: '',
    active: 'true',
  });

  readonly previewSpecialties = computed(() => this.form().specialties);
  readonly previewDiagnosticAreas = computed(() => this.form().diagnosticAreas);
  readonly visibleDiagnosticAreas = computed(() => this.form().diagnosticAreas.slice(0, 3));
  readonly primarySpecialty = computed(() => this.form().specialties[0] || 'Consultoría para PYMES');
  readonly previewDisplayName = computed(() => this.capitalizeName(this.form().fullName || 'Tu nombre'));

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
          diagnosticAreas: data.diagnosticAreas ?? [],
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
          cvUrl: data.cvUrl ?? '',
          pricePerHour: Number(data.pricePerHour),
          photoUrl: data.photoUrl ?? '',
          videoUrl: data.videoUrl ?? '',
          ownerPhone: data.ownerPhone ?? '',
          active: data.active,
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
    if (form.diagnosticAreas.length === 0) {
      this.toastService.warning('Selecciona al menos un área de diagnóstico.');
      return;
    }
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
      diagnosticAreas: form.diagnosticAreas,
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
      cvUrl: form.cvUrl || undefined,
      pricePerHour: Number(form.pricePerHour) || 0,
      photoUrl: form.photoUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      active: form.active,
      ownerPhone: normalizePhoneForSubmit(form.ownerPhone) || undefined,
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

  toggleActive() {
    this.updateForm('active', this.form().active === 'true' ? 'false' : 'true');
  }

  toggleProfilePreviewEdit(): void {
    this.profilePreviewEditing.update((editing) => !editing);
    this.previewMediaActive.set(false);
    this.draggedPreviewItem.set(null);
  }

  activatePreviewMedia(container: HTMLElement): void {
    if (this.profilePreviewEditing()) return;

    this.previewMediaActive.set(true);
    const video = container.querySelector('video');
    if (video) void video.play().catch(() => undefined);
  }

  deactivatePreviewMedia(container: HTMLElement): void {
    this.previewMediaActive.set(false);
    container.querySelector('video')?.pause();
  }

  onPreviewDragStart(event: DragEvent, list: PreviewList, index: number): void {
    if (!event.dataTransfer) return;

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${list}:${index}`);
    this.draggedPreviewItem.set({ list, index });
  }

  onPreviewDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  onPreviewDrop(event: DragEvent, list: PreviewList, targetIndex: number): void {
    event.preventDefault();
    const dragged = this.draggedPreviewItem();
    if (!dragged || dragged.list !== list) return;

    this.reorderPreviewItem(list, dragged.index, targetIndex);
    this.draggedPreviewItem.set(null);
  }

  onPreviewDragEnd(): void {
    this.draggedPreviewItem.set(null);
  }

  movePreviewItem(list: PreviewList, index: number, direction: -1 | 1): void {
    const items = list === 'specialties' ? this.previewSpecialties() : this.previewDiagnosticAreas();
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    this.reorderPreviewItem(list, index, targetIndex);
  }

  toggleDiagnosticArea(area: ConsultantDiagnosticArea): void {
    const selected = this.form().diagnosticAreas;
    this.updateForm(
      'diagnosticAreas',
      selected.includes(area)
        ? selected.filter((item) => item !== area)
        : [...selected, area],
    );
  }

  private reorderPreviewItem(list: PreviewList, fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;

    this.form.update((current) => {
      if (list === 'specialties') {
        const specialties = [...current.specialties];
        const [item] = specialties.splice(fromIndex, 1);
        if (!item) return current;
        specialties.splice(toIndex, 0, item);
        return { ...current, specialties };
      }

      const diagnosticAreas = [...current.diagnosticAreas];
      const [item] = diagnosticAreas.splice(fromIndex, 1);
      if (!item) return current;
      diagnosticAreas.splice(toIndex, 0, item);
      return { ...current, diagnosticAreas };
    });
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

  private capitalizeName(value: string): string {
    return value
      .toLocaleLowerCase('es-PE')
      .replace(/(^|[\s-])([a-záéíóúñü])/g, (_match, separator: string, letter: string) =>
        `${separator}${letter.toLocaleUpperCase('es-PE')}`,
      );
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

  uploadCv(event: Event) {
    const file = this.getFile(event);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.cvError.set('Sube un archivo PDF válido');
      return;
    }

    this.cvFileName.set(file.name);
    this.cvError.set('');
    this.uploadingCv.set(true);

    this.api.storage
      .upload({ folder: 'consultants/cvs' }, { file })
      .then((response) => {
        this.updateForm('cvUrl', response.data.secureUrl);
        return this.extractPdfText(file);
      })
      .then((text) => {
        if (text.length < 40) {
          throw new Error('No se pudo leer suficiente texto del PDF');
        }
        this.updateForm('cvText', text);
        return this.api.ia.runConsultantCv({ text });
      })
      .then((profile) => {
        this.prefillFormFromCv(profile.data);
        this.toastService.success('CV subido y perfil autocompletado correctamente. Revisa los datos antes de Guardar.');
      })
      .catch((error) => {
        const errorMsg = this.hubsme.getErrorMessage(error);
        this.cvError.set(errorMsg);
        this.toastService.error(errorMsg);
      })
      .finally(() => this.uploadingCv.set(false));
  }

  private async extractPdfText(file: File): Promise<string> {
    const pdfjs = (await import('pdfjs-dist')) as unknown as any;
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString();

    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str || '')
        .filter(Boolean)
        .join(' ');
      pages.push(pageText);
    }

    return pages.join('\n').trim();
  }

  private prefillFormFromCv(profile: any): void {
    const form = this.form();
    this.form.set({
      ...form,
      firstName: form.firstName.trim() ? form.firstName : (profile.firstName ?? ''),
      lastName: form.lastName.trim() ? form.lastName : (profile.lastName ?? ''),
      fullName: form.fullName.trim() ? form.fullName : (profile.fullName ?? ''),
      headline: form.headline.trim() ? form.headline : (profile.headline ?? ''),
      location: form.location.trim() ? form.location : (profile.location ?? ''),
      workModality: form.workModality.trim() ? form.workModality : (profile.workModality ?? ''),
      bio: form.bio.trim() ? form.bio : (profile.bio ?? ''),
      ownerPhone: form.ownerPhone.trim() ? form.ownerPhone : (profile.ownerPhone ?? ''),
      linkedinUrl: form.linkedinUrl.trim() ? form.linkedinUrl : (profile.linkedinUrl ?? ''),
      yearsExperience: form.yearsExperience > 0 ? form.yearsExperience : (profile.yearsExperience ?? 0),
      specialties: form.specialties.length > 0 ? form.specialties : (profile.specialties ?? []),
      sectors: form.sectors.length > 0 ? form.sectors : (profile.sectors ?? []),
      industries: form.industries.length > 0 ? form.industries : (profile.industries ?? []),
      companyTypes: form.companyTypes.length > 0 ? form.companyTypes : (profile.companyTypes ?? []),
      services: form.services.length > 0 ? form.services : (profile.services ?? []),
      certifications: form.certifications.length > 0 ? form.certifications : (profile.certifications ?? []),
      workedSectors: form.workedSectors.length > 0 ? form.workedSectors : (profile.workedSectors ?? []),
      education: form.education.length > 0 ? form.education : (profile.education ?? []),
      caseStudies: form.caseStudies.length > 0 ? form.caseStudies : (profile.caseStudies ?? []),
    });
  }
}
