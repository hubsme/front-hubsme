import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly STORAGE_KEY = 'user_session';
  session = signal<ApiResponse<"auth","login"> | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedSession = this.getSessionFromStorage();
      if (savedSession) {
        this.session.set(savedSession);
      }
    }
  }

  setSession(data: ApiResponse<"auth","login">): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.session.set(data);
    }
  }

  removeSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.session.set(null);
    }
  }

  restoreSession(): void {
    if (typeof window === 'undefined') return;

    const session = localStorage.getItem('user_session');

    if (session) {
      this.session.set(JSON.parse(session));
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
