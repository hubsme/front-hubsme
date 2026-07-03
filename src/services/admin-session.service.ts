import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AdminLoginResponseDto } from 'api/backend.api';

export type AdminSession = {
  accessToken: string;
  user: {
    username: string;
    role: 'admin';
  };
};

@Injectable({ providedIn: 'root' })
export class AdminSessionService {
  private readonly storageKey = 'admin_session';
  readonly session = signal<AdminSession | null>(null);

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.restoreSession();
  }

  setSession(response: AdminLoginResponseDto) {
    if (
      !response.accessToken ||
      !response.user.username ||
      response.user.role !== 'admin'
    ) {
      return false;
    }

    const session: AdminSession = {
      accessToken: response.accessToken,
      user: response.user,
    };
    this.session.set(session);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    }
    return true;
  }

  restoreSession() {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as AdminSession;
      if (
        parsed.accessToken &&
        parsed.user?.username &&
        parsed.user.role === 'admin'
      ) {
        this.session.set(parsed);
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  removeSession() {
    this.session.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  }
}
