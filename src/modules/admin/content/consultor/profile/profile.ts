import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { SessionService } from '@service/session.service';

type ConsultantProfileData = ApiResponse<'consultant', 'findByUser'>;

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
export class Profile implements OnInit {
  private api = inject(Api);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private sessionService = inject(SessionService);

  loading = signal(false);
  saving = signal(false);
  uploadingPhoto = signal(false);
  uploadingVideo = signal(false);
  consultant = signal<ConsultantProfileData | null>(null);
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
}
