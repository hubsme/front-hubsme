import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type ConsultantProfileData = ApiResponse<'consultant', 'findByUser'>;

type ConsultantForm = {
  name: string;
  bio: string;
  specialties: string;
  sectors: string;
  pricePerHour: number;
  photoUrl: string;
  videoUrl: string;
};

@Component({
  selector: 'app-consultor-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultor-profile.html',
})
export class ConsultorProfile implements OnInit {
  private api = inject(Api);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  uploadingPhoto = signal(false);
  uploadingVideo = signal(false);
  consultant = signal<ConsultantProfileData | null>(null);

  form = signal<ConsultantForm>({
    name: '',
    bio: '',
    specialties: '',
    sectors: '',
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
        this.form.set({
          name: data.name,
          bio: data.bio ?? '',
          specialties: data.specialties.join(', '),
          sectors: data.sectors.join(', '),
          pricePerHour: Number(data.pricePerHour),
          photoUrl: data.photoUrl ?? '',
          videoUrl: data.videoUrl ?? '',
        });
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  save() {
    const user = this.hubsme.currentUser();
    const form = this.form();
    const payload: ApiBody<'consultant', 'create'> = {
      userId: user.id,
      name: form.name,
      bio: form.bio || undefined,
      specialties: this.parseList(form.specialties),
      sectors: this.parseList(form.sectors),
      pricePerHour: Number(form.pricePerHour) || 0,
      photoUrl: form.photoUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      active: 'true',
      validated: this.consultant()?.validated ?? 'false',
    };
    const current = this.consultant();
    const request = current ? this.api.consultant.update({ id: current.id }, payload) : this.api.consultant.create(payload);

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
      .then((response) => this.updateForm('photoUrl', response.data.secureUrl))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.uploadingPhoto.set(false));
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

  private parseList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private getFile(event: Event): File | null {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return null;
    return target.files?.[0] ?? null;
  }
}
