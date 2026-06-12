import { Component, computed, inject, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';
import { SessionService } from '@service/session.service';
import { ThemeService } from '@service/theme.service';
import { filter } from 'rxjs';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private router = inject(Router);
  private sessionService = inject(SessionService);
  themeService = inject(ThemeService);
  private currentUrl = signal(this.router.url);

  isOpen = input(false);
  isCollapsed = input(false);
  close = output<void>();

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set((event as NavigationEnd).urlAfterRedirects));
  }

  menuItems = computed(() => {
    const role = this.sessionService.session()?.user.role;
    const pymePath = PATH.pyme;
    const consultorPath = PATH.consultor;
    const pymeItems: MenuItem[] = [
      { label: 'Dashboard', path: buildPath(pymePath.dashboard), icon: 'fas fa-table-cells-large' },
      { label: 'Perfil', path: buildPath(pymePath.profile), icon: 'fas fa-user-gear' },
      { label: 'Diagnostico IA', path: buildPath(pymePath.diagnostics), icon: 'fas fa-clipboard-check' },
      { label: 'Consultores', path: buildPath(pymePath.consultants), icon: 'fas fa-user-group' },
      { label: 'Inbox', path: buildPath(pymePath.inbox), icon: 'fas fa-inbox' },
      { label: 'Reuniones', path: buildPath(pymePath.meetings), icon: 'fas fa-calendar' },
      { label: 'Tareas', path: buildPath(pymePath.tasks), icon: 'fas fa-square-check' },
      { label: 'Documentos', path: buildPath(pymePath.documents), icon: 'fas fa-file-lines' },
    ];

    const consultorItems: MenuItem[] = [
      { label: 'Dashboard', path: buildPath(consultorPath.dashboard), icon: 'fas fa-table-cells-large' },
      { label: 'Perfil', path: buildPath(consultorPath.profile), icon: 'fas fa-user-gear' },
      { label: 'Mis Clientes', path: buildPath(consultorPath.pymes), icon: 'fas fa-user-group' },
      { label: 'Inbox', path: buildPath(consultorPath.inbox), icon: 'fas fa-inbox' },
      { label: 'Reuniones', path: buildPath(consultorPath.meetings), icon: 'fas fa-calendar' },
      { label: 'Disponibilidad', path: buildPath(consultorPath.availability), icon: 'fas fa-calendar-days' },
      { label: 'Tareas', path: buildPath(consultorPath.tasks), icon: 'fas fa-square-check' },
      { label: 'Documentos', path: buildPath(consultorPath.documents), icon: 'fas fa-file-lines' },
      { label: 'Suscripcion', path: buildPath(consultorPath.subscription), icon: 'fas fa-credit-card' },
    ];

    if (role === 'pyme') return pymeItems;
    if (role === 'consultor') return consultorItems;
    return [];
  });

  logout() {
    this.sessionService.removeSession();
    this.router.navigate([buildPath(PATH.auth.signIn)]);
  }

  closeSidebar() {
    this.close.emit();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeSidebar();
  }

  isActive(path: string) {
    return this.currentUrl().startsWith(`/${path}`);
  }
}
