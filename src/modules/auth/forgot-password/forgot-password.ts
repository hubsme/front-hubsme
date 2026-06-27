import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { Api } from 'api/backend.api';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private toastService = inject(ToastService);
  private router = inject(Router);
  private api = inject(Api);

  email = signal('');
  loading = signal(false);
  emailSent = signal(false);

  onSubmit(): void {
    const emailVal = this.email().trim();
    if (!emailVal) {
      this.toastService.error('Por favor, ingresa tu correo electrónico');
      return;
    }

    this.loading.set(true);

    this.api.auth
      .forgotPassword({ email: emailVal })
      .then((res) => {
        // If api client returns standard nested response or error properties
        if (res.error) {
          const msg = Array.isArray(res.error.message) ? res.error.message[0] : res.error.message;
          this.toastService.error(msg || 'No se pudo procesar la solicitud');
          return;
        }
        this.emailSent.set(true);
        this.toastService.success('Correo enviado correctamente');
      })
      .catch((error) => {
        const apiError = error as { error?: { message?: string | string[] }; message?: string };
        const message = apiError.error?.message || apiError.message || 'Ocurrió un error al enviar el correo';
        const text = Array.isArray(message) ? message[0] : message;
        this.toastService.error(text);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  goToSignIn(): void {
    this.router.navigate([buildPath(PATH.auth.signIn)]);
  }
}
