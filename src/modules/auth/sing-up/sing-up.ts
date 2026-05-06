import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api, ApiBody } from 'api/backend.api';
import { PATH, buildPath } from '@route/path.route';
import { SessionService } from '@service/session.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-sing-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sing-up.html',
  styleUrl: './sing-up.css',
})
export class SingUp {
  private api = inject(Api);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private session = inject(SessionService);
  private toastService = inject(ToastService);

  name = signal('');
  email = signal('');
  password = signal('');
  role = signal<'pyme' | 'consultor'>('pyme');
  loading = signal(false);

  constructor() {
    const role = this.route.snapshot.queryParamMap.get('role');
    if (role === 'pyme' || role === 'consultor') {
      this.role.set(role);
    }
  }

  onRegister() {
    if (!this.name() || !this.email() || !this.password()) {
      this.toastService.error('Completa nombre, email y password');
      return;
    }

    const payload: ApiBody<'auth', 'register'> = {
      name: this.name(),
      email: this.email(),
      password: this.password(),
      role: this.role(),
    };

    this.loading.set(true);
    this.api.auth
      .register(payload)
      .then((res) => {
        this.session.setSession(res.data);
        this.toastService.success('Cuenta creada correctamente');
        this.router.navigate([buildPath(PATH.admin.dashboard)]);
      })
      .catch((error) => {
        const message = error.error?.message || error.message || 'No se pudo crear la cuenta';
        this.toastService.error(Array.isArray(message) ? message[0] : message);
      })
      .finally(() => this.loading.set(false));
  }

  goToSignIn() {
    this.router.navigate([buildPath(PATH.auth.signIn)]);
  }
}
