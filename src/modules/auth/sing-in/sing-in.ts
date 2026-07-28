import { Component, inject, signal, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath, getDefaultRoute } from '@route/path.route';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { SessionService } from '@service/session.service';

@Component({
  selector: 'app-sing-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.css',
})
export class SingIn implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private router = inject(Router);
  private session = inject(SessionService);
  private api = inject(Api);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);

  // Formulario de login
  email = signal('');
  password = signal('');
  googleLoading = signal(false);
  private googlePopup: Window | null = null;
  private googlePopupTimer: ReturnType<typeof setInterval> | null = null;
  private readonly googleMessageHandler = (event: MessageEvent<unknown>) => this.handleGoogleMessage(event);

  ngOnInit(): void {
    // Si ya está logueado, redirigir al dashboard o diagnóstico
    const currentSession = this.session.session();
    if (currentSession) {
      const diagnostic = this.route.snapshot.queryParamMap.get('diagnostic');
      if (diagnostic === 'true' && currentSession.user.role === 'pyme') {
        this.router.navigate([buildPath(PATH.diagnostic)]);
      } else {
        this.router.navigate([getDefaultRoute([currentSession.user.role])]);
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('message', this.googleMessageHandler);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('message', this.googleMessageHandler);
    }
    this.clearGooglePopupTimer();
  }

  // Estados
  loading = signal(false);
  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onLogin(): void {
    if (!this.email() || !this.password()) {
      this.toastService.error('Ingresa tu correo y contraseña.');
      return;
    }

    this.loading.set(true);

    const credentials: ApiBody<'auth', 'login'> = {
      email: this.email(),
      password: this.password(),
    };

    this.api.auth
      .login(credentials)
      .then((res) => {
        if (res.error) {
          this.toastService.error(this.translateErrorMessage(res.error.message[0]));
          return;
        }
        this.session.setSession(res.data);
        const diagnostic = this.route.snapshot.queryParamMap.get('diagnostic');
        if (diagnostic === 'true' && res.data.user.role === 'pyme') {
          this.router.navigate([buildPath(PATH.diagnostic)]);
        } else {
          this.router.navigate([getDefaultRoute([res.data.user.role])]);
        }
        this.toastService.success('Bienvenido!');
      })
      .catch((error) => {
        this.toastService.error(this.getErrorMessage(error));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  goToForgotPassword(): void {
    this.router.navigate([buildPath(PATH.auth.forgotPassword)]);
  }

  goToSignUp(): void {
    const diagnostic = this.route.snapshot.queryParamMap.get('diagnostic');
    this.router.navigate([buildPath(PATH.auth.signUp)], {
      queryParams: diagnostic ? { role: 'pyme', locked: true, diagnostic } : {},
    });
  }

  startGoogleLogin(): void {
    this.googleLoading.set(true);
    if (!isPlatformBrowser(this.platformId)) return;

    this.api.auth
      .googleUrl({ flow: 'login' })
      .then((res) => {
        this.googlePopup = window.open(
          res.data.url,
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
      .catch((error) => {
        this.toastService.error(this.getErrorMessage(error));
        this.googleLoading.set(false);
      });
  }

  private handleGoogleMessage(event: MessageEvent<unknown>): void {
    if (!this.isGoogleAuthMessage(event.data)) return;

    this.clearGooglePopupTimer();
    this.googlePopup?.close();
    this.googlePopup = null;
    this.googleLoading.set(false);

    if (event.data.error) {
      this.toastService.error(this.translateErrorMessage(event.data.error));
      return;
    }

    const session = event.data.session;
    if (!session) return;
    this.session.setSession(session);
    const diagnostic = this.route.snapshot.queryParamMap.get('diagnostic');
    if (diagnostic === 'true' && session.user.role === 'pyme') {
      this.router.navigate([buildPath(PATH.diagnostic)]);
    } else {
      this.router.navigate([getDefaultRoute([session.user.role])]);
    }
    this.toastService.success('Bienvenido!');
  }

  private isGoogleAuthMessage(value: unknown): value is { type: 'hubsme:google-auth'; session?: ApiResponse<'auth', 'login'>; error?: string } {
    if (!value || typeof value !== 'object') return false;
    const message = value as { type?: unknown };
    return message.type === 'hubsme:google-auth';
  }

  private clearGooglePopupTimer(): void {
    if (!this.googlePopupTimer) return;
    clearInterval(this.googlePopupTimer);
    this.googlePopupTimer = null;
  }

  private getErrorMessage(error: unknown): string {
    const apiError = error as { error?: { message?: string | string[] }; message?: string };
    const message = apiError.error?.message || apiError.message || 'Ocurrió un error inesperado';
    const text = Array.isArray(message) ? message[0] : message;
    return this.translateErrorMessage(text);
  }

  private translateErrorMessage(message: string): string {
    const normalizedMessage = message.trim().toLowerCase().replace(/[.!]+$/, '');

    if (normalizedMessage === 'invalid credentials') {
      return 'Correo o contraseña incorrectos.';
    }

    return message;
  }

  private getGooglePopupFeatures(): string {
    const width = 520;
    const height = 680;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

    return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
  }
}
