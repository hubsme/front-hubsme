import { Component, computed, inject, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';
import { SessionService } from '@service/session.service';
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
    const adminItems: MenuItem[] = [
      { label: 'Dashboard', path: buildPath(PATH.admin.dashboard), icon: 'fas fa-chart-pie' },
      { label: 'PYMEs', path: buildPath(PATH.admin.pymes), icon: 'fas fa-building' },
      { label: 'Consultores', path: buildPath(PATH.admin.consultants), icon: 'fas fa-user-tie' },
      { label: 'Reuniones', path: buildPath(PATH.admin.meetings), icon: 'fas fa-calendar-check' },
      { label: 'Tareas', path: buildPath(PATH.admin.tasks), icon: 'fas fa-list-check' },
      { label: 'Documentos', path: buildPath(PATH.admin.documents), icon: 'fas fa-file-lines' },
      { label: 'Diagnostico IA', path: buildPath(PATH.admin.diagnostics), icon: 'fas fa-clipboard-check' },
      { label: 'Suscripcion', path: buildPath(PATH.admin.subscription), icon: 'fas fa-credit-card' },
    ];

    const pymeItems: MenuItem[] = [
      { label: 'Dashboard', path: buildPath(PATH.admin.dashboard), icon: 'fas fa-table-cells-large' },
      { label: 'Diagnostico IA', path: buildPath(PATH.admin.diagnostics), icon: 'fas fa-clipboard-check' },
      { label: 'Consultores', path: buildPath(PATH.admin.consultants), icon: 'fas fa-user-group' },
      { label: 'Reuniones', path: buildPath(PATH.admin.meetings), icon: 'fas fa-calendar' },
      { label: 'Tareas', path: buildPath(PATH.admin.tasks), icon: 'fas fa-square-check' },
      { label: 'Documentos', path: buildPath(PATH.admin.documents), icon: 'fas fa-file-lines' },
    ];

    const consultorItems: MenuItem[] = [
      { label: 'Dashboard', path: buildPath(PATH.admin.dashboard), icon: 'fas fa-table-cells-large' },
      { label: 'Mis Clientes', path: buildPath(PATH.admin.pymes), icon: 'fas fa-user-group' },
      { label: 'Reuniones', path: buildPath(PATH.admin.meetings), icon: 'fas fa-calendar' },
      { label: 'Tareas', path: buildPath(PATH.admin.tasks), icon: 'fas fa-square-check' },
      { label: 'Documentos', path: buildPath(PATH.admin.documents), icon: 'fas fa-file-lines' },
      { label: 'Suscripcion', path: buildPath(PATH.admin.subscription), icon: 'fas fa-credit-card' },
    ];

    if (role === 'pyme') return pymeItems;
    if (role === 'consultor') return consultorItems;
    return adminItems;
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
