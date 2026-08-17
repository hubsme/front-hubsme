import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { PATH, buildPath } from '@route/path.route';
import { MeetingService } from '@service/admin/meeting.service';
import { SessionService } from '@service/session.service';
import { formatInPeru } from '@function/date.function';

type MeetingAccessData = ApiResponse<'meeting', 'access'>;
type AccessError = 'forbidden' | 'not-found' | 'generic';

@Component({
  selector: 'app-meeting-access',
  imports: [],
  templateUrl: './meeting-access.html',
})
export class MeetingAccess implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meetingService = inject(MeetingService);
  private readonly sessionService = inject(SessionService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loading = signal(true);
  readonly redirecting = signal(false);
  readonly access = signal<MeetingAccessData | null>(null);
  readonly error = signal<AccessError | null>(null);
  readonly meetingId = signal(0);

  readonly meetingDate = computed(() => this.formatDate(this.access()?.startTime));
  readonly meetingTime = computed(() => this.formatTime(this.access()?.startTime));
  readonly accessTime = computed(() => this.formatTime(this.access()?.accessStartsAt));

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.loading.set(false);
      this.error.set('not-found');
      return;
    }

    this.meetingId.set(id);
    this.loadAccess();
  }

  retry(): void {
    this.loadAccess();
  }

  openMinutes(): void {
    const role = this.sessionService.session()?.user.role;
    const documentsPath =
      role === 'consultor'
        ? buildPath(PATH.admin.consultor.documents)
        : buildPath(PATH.admin.pyme.documents);
    this.router.navigate([`/${documentsPath}`, this.meetingId()]);
  }

  openCalendar(): void {
    const role = this.sessionService.session()?.user.role;
    const meetingsPath =
      role === 'consultor'
        ? buildPath(PATH.admin.consultor.meetings)
        : buildPath(PATH.admin.pyme.meetings);
    this.router.navigate([`/${meetingsPath}`]);
  }

  private loadAccess(): void {
    const id = this.meetingId();
    if (!id || this.redirecting()) return;

    this.loading.set(true);
    this.error.set(null);

    this.meetingService
      .access(id)
      .then((access) => {
        this.access.set(access);
        if (access.status === 'available' && access.redirectUrl) {
          this.redirecting.set(true);
          window.location.replace(access.redirectUrl);
        }
      })
      .catch((error: unknown) => {
        this.access.set(null);
        const message = this.errorMessage(error).toLowerCase();
        if (message.includes('no tienes acceso')) {
          this.error.set('forbidden');
        } else if (message.includes('not found') || message.includes('no encontrada')) {
          this.error.set('not-found');
        } else {
          this.error.set('generic');
        }
      })
      .finally(() => this.loading.set(false));
  }

  private errorMessage(error: unknown): string {
    if (!error || typeof error !== 'object') return String(error);
    const apiError = error as {
      error?: { message?: string | string[] };
      message?: string | string[];
    };
    const message = apiError.error?.message ?? apiError.message ?? '';
    return Array.isArray(message) ? (message[0] ?? '') : message;
  }

  private formatDate(value: string | null | undefined): string {
    if (!value) return 'Fecha por confirmar';
    return formatInPeru(value, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private formatTime(value: string | null | undefined): string {
    if (!value) return 'Hora por confirmar';
    return formatInPeru(value, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
