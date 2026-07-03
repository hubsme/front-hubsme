import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { buildPath, PATH } from '@route/path.route';
import { AdminApiService } from '@service/admin-api.service';
import { AdminSessionService } from '@service/admin-session.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  private readonly adminApi = inject(AdminApiService);
  private readonly adminSession = inject(AdminSessionService);
  private readonly router = inject(Router);

  readonly username = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    if (this.adminSession.session()) {
      void this.router.navigate([
        buildPath(PATH.backoffice.promotionCodes),
      ]);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  async login() {
    if (!this.username().trim() || !this.password()) {
      this.errorMessage.set('Ingresa tu usuario y contraseña.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const response = await this.adminApi.api.adminAuth.adminauthLogin({
        username: this.username().trim(),
        password: this.password(),
      });
      if (!this.adminSession.setSession(response.data)) {
        throw new Error('La sesión administrativa recibida no es válida');
      }
      await this.router.navigate([
        buildPath(PATH.backoffice.promotionCodes),
      ]);
    } catch {
      this.errorMessage.set('Usuario o contraseña incorrectos.');
    } finally {
      this.loading.set(false);
    }
  }
}
