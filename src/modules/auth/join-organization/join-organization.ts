import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api, ApiResponse } from 'api/backend.api';
import { PATH, buildPath, getDefaultRoute } from '@route/path.route';
import { HubsmeService } from '@service/hubsme.service';
import { SessionService } from '@service/session.service';
import { ToastService } from '@service/toast.service';

type Invitation = ApiResponse<'auth', 'invitation'>;
type GoogleAuthMessage = {
  type: 'hubsme:google-auth';
  session?: ApiResponse<'auth', 'login'>;
  error?: string;
};

@Component({
  selector: 'app-join-organization',
  imports: [CommonModule, FormsModule],
  templateUrl: './join-organization.html',
})
export class JoinOrganization implements OnInit, OnDestroy {
  private readonly api = inject(Api);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly toastService = inject(ToastService);
  private readonly hubsme = inject(HubsmeService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly token = signal('');
  readonly invitation = signal<Invitation | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly firstName = signal('');
  readonly lastName = signal('');
  readonly password = signal('');
  readonly passwordConfirmation = signal('');
  readonly showPassword = signal(false);
  readonly googleLoading = signal(false);
  readonly showEmailPasswordForm = signal(false);
  readonly session = this.sessionService.session;
  private googlePopup: Window | null = null;
  private googlePopupTimer: ReturnType<typeof setInterval> | null = null;
  private readonly googleMessageHandler = (event: MessageEvent<unknown>) =>
    this.handleGoogleMessage(event);
  readonly signedInWithInvitationEmail = computed(() => {
    const invitation = this.invitation();
    const session = this.session();
    return Boolean(
      invitation && session && invitation.email.toLowerCase() === session.user.email.toLowerCase(),
    );
  });

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token')?.trim() ?? '');
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('message', this.googleMessageHandler);
    }
    void this.loadInvitation();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('message', this.googleMessageHandler);
    }
    this.clearGooglePopupTimer();
  }

  async loadInvitation(): Promise<void> {
    if (!this.token()) {
      this.error.set('El enlace de invitación está incompleto.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    try {
      const response = await this.api.auth.invitation({ token: this.token() });
      this.invitation.set(response.data);
    } catch (error: unknown) {
      this.error.set(this.hubsme.getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  async acceptWithCurrentAccount(): Promise<void> {
    if (!this.signedInWithInvitationEmail()) return;
    this.submitting.set(true);
    try {
      const response = await this.api.auth.acceptInvitation({ token: this.token() });
      this.sessionService.setSession(response.data);
      this.toastService.success(
        `Ya formas parte de ${response.data.organization?.name ?? 'la empresa'}`,
      );
      await this.router.navigate([getDefaultRoute(['pyme'])]);
    } catch (error: unknown) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }

  startGoogleJoin(): void {
    if (!isPlatformBrowser(this.platformId) || !this.invitation()) return;

    this.googleLoading.set(true);
    this.api.auth
      .googleUrl({ flow: 'invitation', invitationToken: this.token() })
      .then((response) => {
        this.googlePopup = window.open(
          response.data.url,
          'hubsme_google_auth',
          this.getGooglePopupFeatures(),
        );

        if (!this.googlePopup) {
          this.toastService.error('Permite popups para continuar con Google');
          this.googleLoading.set(false);
          return;
        }

        this.googlePopup.focus();
        this.googlePopupTimer = setInterval(() => {
          if (this.googlePopup?.closed) {
            this.clearGooglePopupTimer();
            this.googleLoading.set(false);
          }
        }, 500);
      })
      .catch((error: unknown) => {
        this.toastService.error(this.hubsme.getErrorMessage(error));
        this.googleLoading.set(false);
      });
  }

  useEmailPassword(): void {
    this.showEmailPasswordForm.set(true);
  }

  async createAccount(): Promise<void> {
    const invitation = this.invitation();
    if (!invitation || invitation.hasAccount) return;
    const firstName = this.firstName().trim();
    const lastName = this.lastName().trim();
    if (!firstName || !lastName) {
      this.toastService.error('Completa tus nombres y apellidos');
      return;
    }
    if (this.password().length < 6) {
      this.toastService.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (this.password() !== this.passwordConfirmation()) {
      this.toastService.error('Las contraseñas no coinciden');
      return;
    }

    this.submitting.set(true);
    try {
      const response = await this.api.auth.register({
        invitationToken: this.token(),
        email: invitation.email,
        password: this.password(),
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        role: 'pyme',
      });
      this.sessionService.setSession(response.data);
      this.toastService.success(`Te uniste a ${invitation.organizationName}`);
      await this.router.navigate([getDefaultRoute(['pyme'])]);
    } catch (error: unknown) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }

  signIn(): void {
    this.router.navigate([buildPath(PATH.auth.signIn)], {
      queryParams: {
        returnUrl: `/${buildPath(PATH.auth.join)}?token=${encodeURIComponent(this.token())}`,
      },
    });
  }

  useAnotherAccount(): void {
    this.sessionService.removeSession();
    this.signIn();
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  private handleGoogleMessage(event: MessageEvent<unknown>): void {
    if (!this.isGoogleAuthMessage(event.data)) return;

    this.clearGooglePopupTimer();
    this.googlePopup?.close();
    this.googlePopup = null;

    if (event.data.error) {
      this.googleLoading.set(false);
      this.toastService.error(event.data.error);
      return;
    }

    const session = event.data.session;
    if (!session) {
      this.googleLoading.set(false);
      return;
    }

    this.sessionService.setSession(session);
    this.googleLoading.set(false);
    this.toastService.success(`Te uniste a ${session.organization?.name ?? 'la empresa'}`);
    void this.router.navigate([getDefaultRoute(['pyme'])]);
  }

  private isGoogleAuthMessage(value: unknown): value is GoogleAuthMessage {
    if (!value || typeof value !== 'object') return false;
    const message = value as { type?: unknown };
    return message.type === 'hubsme:google-auth';
  }

  private clearGooglePopupTimer(): void {
    if (!this.googlePopupTimer) return;
    clearInterval(this.googlePopupTimer);
    this.googlePopupTimer = null;
  }

  private getGooglePopupFeatures(): string {
    const width = 520;
    const height = 680;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

    return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
  }
}
