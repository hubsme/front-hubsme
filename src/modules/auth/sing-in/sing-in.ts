import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath, getDefaultRoute } from '@route/path.route';
import { Api, ApiBody } from 'api/backend.api';
import { SessionService } from '@service/session.service';

@Component({
  selector: 'app-sing-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.css',
})
export class SingIn implements OnInit {
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private session = inject(SessionService);
  private api = inject(Api);

  // Formulario de login
  email = signal('');
  password = signal('');

  ngOnInit(): void {
    // Si ya está logueado, redirigir al dashboard
    const currentSession = this.session.session();
    if (currentSession) {
      this.router.navigate([getDefaultRoute([currentSession.user.role])]);
    }
  }

  // Estados
  loading = signal(false);
  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onLogin(): void {
    if (!this.email() || !this.password()) {
      this.toastService.error('Please enter email and password');
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
          this.toastService.error(res.error.message[0]);
          return;
        }
        this.session.setSession(res.data);
        this.router.navigate([getDefaultRoute([res.data.user.role])]);
        this.toastService.success('Bienvenido!');
      })
      .catch((error) => {
        const message = error.error?.message || error.message || 'Ocurrió un error inesperado';
        const text = Array.isArray(message) ? message[0] : message;
        this.toastService.error(text);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  goToSignUp(): void {
    this.router.navigate([buildPath(PATH.auth.signUp)]);
  }
}
