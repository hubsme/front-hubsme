import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TeamsCallService {
  meetingId = signal<number | null>(null);
  displayName = signal<string>('');
  isOpen = signal<boolean>(false);
  isMinimized = signal<boolean>(false);
  isFullscreen = signal<boolean>(false);

  startCall(meetingId: number, displayName: string) {
    this.meetingId.set(meetingId);
    this.displayName.set(displayName);
    this.isOpen.set(true);
    this.isMinimized.set(false);
    this.isFullscreen.set(false);
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

  closeCall() {
    this.isOpen.set(false);
    this.isMinimized.set(false);
    this.isFullscreen.set(false);
    this.meetingId.set(null);
  }
}
