import { Injectable, signal, inject } from '@angular/core';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class TeamsCallService {
  private hubsme = inject(HubsmeService);
  private toast = inject(ToastService);

  meetingId = signal<number | null>(null);
  displayName = signal<string>('');
  isOpen = signal<boolean>(false);
  isMinimized = signal<boolean>(false);
  isFullscreen = signal<boolean>(false);
  isRecording = signal<boolean>(false);

  startCall(meetingId: number, displayName: string) {
    this.meetingId.set(meetingId);
    this.displayName.set(displayName);
    this.isOpen.set(true);
    this.isMinimized.set(false);
    this.isFullscreen.set(false);
    this.isRecording.set(false);
  }

  minimizeCall() {
    this.isMinimized.set(true);
  }

  maximizeCall() {
    this.isMinimized.set(false);
  }

  toggleFullscreen() {
    this.isFullscreen.update((v) => !v);
  }

  toggleRecording() {
    const meetingId = this.meetingId();
    if (!meetingId) return;

    this.isRecording.update((v) => !v);
    
    if (this.isRecording()) {
      this.toast.success(
        'Grabación iniciada. Teams grabará de forma nativa. Al finalizar, podrás obtenerla desde tu OneDrive.'
      );
    } else {
      this.toast.success(
        'Grabación detenida. La grabación se procesará y guardará en tu OneDrive corporativo.'
      );
    }
  }

  closeCall() {
    this.isOpen.set(false);
    this.isMinimized.set(false);
    this.isFullscreen.set(false);
    this.isRecording.set(false);
    this.meetingId.set(null);
  }
}
