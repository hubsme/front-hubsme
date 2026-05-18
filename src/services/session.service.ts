import { Injectable, signal, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Api, ApiResponse } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly STORAGE_KEY = 'user_session';
  private api = inject(Api);
  session = signal<ApiResponse<"auth","login"> | null>(null);
  profilePicture = signal<string | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedSession = this.getSessionFromStorage();
      if (savedSession) {
        this.session.set(savedSession);
        setTimeout(() => this.loadProfilePicture());
      }
    }
  }

  setSession(data: ApiResponse<"auth","login">): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.session.set(data);
      this.loadProfilePicture();
    }
  }

  removeSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.session.set(null);
      this.profilePicture.set(null);
    }
  }

  restoreSession(): void {
    if (typeof window === 'undefined') return;

    const session = localStorage.getItem('user_session');

    if (session) {
      this.session.set(JSON.parse(session));
      this.loadProfilePicture();
    }
  }

  loadProfilePicture(): void {
    const s = this.session();
    if (!s) {
      this.profilePicture.set(null);
      return;
    }

    const user = s.user;
    if (user.role === 'pyme') {
      this.api.pyme
        .findByUser({ userId: user.id })
        .then((res) => {
          this.profilePicture.set(res.data.logoUrl || null);
        })
        .catch(() => this.profilePicture.set(null));
    } else if (user.role === 'consultor') {
      this.api.consultant
        .findByUser({ userId: user.id })
        .then((res) => {
          this.profilePicture.set(res.data.photoUrl || null);
        })
        .catch(() => this.profilePicture.set(null));
    } else {
      this.profilePicture.set(null);
    }
  }

  private getSessionFromStorage(): ApiResponse<"auth","login"> | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing session data', error);
      return null;
    }
  }
}
