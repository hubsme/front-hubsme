import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { Api } from 'api/backend.api';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(Api);

  token = signal('');
  password = signal('');
  confirmPassword = signal('');
  loading = signal(false);
  passwordResetSuccess = signal(false);
  showPassword = signal(false);

  constructor() {
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (tokenParam) {
      this.token.set(tokenParam);
    } else {
      this.toastService.error('Falta el token de recuperación en el enlace');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  onSubmit(): void {
    const tokenVal = this.token().trim();
    const passVal = this.password();
    const confirmVal = this.confirmPassword();

    if (!tokenVal) {
      this.toastService.error('El enlace no contiene un token válido');
      return;
    }

    if (!passVal) {
      this.toastService.error('Ingresa tu nueva contraseña');
      return;
    }

    if (passVal.length < 6) {
      this.toastService.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passVal !== confirmVal) {
      this.toastService.error('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);

    this.api.auth
      .resetPassword({ token: tokenVal, password: passVal })
      .then((res) => {
        if (res.error) {
          const msg = Array.isArray(res.error.message) ? res.error.message[0] : res.error.message;
          this.toastService.error(msg || 'No se pudo restablecer la contraseña');
          return;
        }
        this.passwordResetSuccess.set(true);
        this.toastService.success('Contraseña restablecida con éxito');
      })
      .catch((error) => {
        const apiError = error as { error?: { message?: string | string[] }; message?: string };
        const message = apiError.error?.message || apiError.message || 'Error al restablecer la contraseña';
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
