import { Component, OnInit, inject, input, signal } from '@angular/core';
import { MeetingService } from '@service/admin/meeting.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-meeting-rating',
  templateUrl: './meeting-rating.html',
})
export class MeetingRating implements OnInit {
  private readonly meetingService = inject(MeetingService);
  private readonly toastService = inject(ToastService);

  readonly meetingId = input.required<number>();
  readonly editable = input(false);
  readonly stars = [1, 2, 3, 4, 5] as const;
  readonly selectedStars = signal<number | null>(null);
  readonly savedStars = signal<number | null>(null);
  readonly loading = signal(true);
  readonly loadFailed = signal(false);
  readonly saving = signal(false);

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.loadFailed.set(false);
    try {
      const { stars } = await this.meetingService.getConsultantRating(this.meetingId());
      this.savedStars.set(stars);
      this.selectedStars.set(stars);
    } catch {
      this.loadFailed.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async save(event: Event): Promise<void> {
    event.preventDefault();
    const stars = this.selectedStars();
    if (!this.editable() || stars === null || stars === this.savedStars() || this.saving()) return;

    this.saving.set(true);
    try {
      const rating = await this.meetingService.setConsultantRating(this.meetingId(), { stars });
      this.savedStars.set(rating.stars);
      this.selectedStars.set(rating.stars);
      this.toastService.success('Calificación guardada.');
    } catch {
      this.toastService.error('No se pudo guardar la calificación. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }
}
