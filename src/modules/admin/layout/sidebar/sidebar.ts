import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  themeService = inject(ThemeService);
  private currentUrl = signal(this.router.url);
  private prefetchedRoutes = new Set<string>();
  private routePrefetchers = new Map<string, () => Promise<unknown>>([
    [
      buildPath(PATH.admin.pyme.dashboard),
      () => import('@module/admin/content/pyme/dashboard/dashboard'),
    ],
    [buildPath(PATH.admin.pyme.profile), () => import('@module/admin/content/pyme/profile/profile')],
    [
      buildPath(PATH.admin.pyme.diagnostics),
      () => import('@module/admin/content/pyme/diagnostics/diagnostics'),
    ],
    [
      buildPath(PATH.admin.pyme.consultants),
      () => import('@module/admin/content/pyme/consultants/consultants'),
    ],
    [
      buildPath(PATH.admin.pyme.meetings),
      () => import('@module/admin/content/pyme/meetings/meetings'),
    ],
    [buildPath(PATH.admin.pyme.tasks), () => import('@module/admin/content/pyme/tasks/tasks')],
    [
      buildPath(PATH.admin.pyme.documents),
      () => import('@module/admin/content/pyme/documents/documents'),
    ],
    [
      buildPath(PATH.admin.consultor.dashboard),
      () => import('@module/admin/content/consultor/dashboard/dashboard'),
    ],
    [
      buildPath(PATH.admin.consultor.profile),
      () => import('@module/admin/content/consultor/profile/profile'),
    ],
    [
      buildPath(PATH.admin.consultor.pymes),
      () => import('@module/admin/content/consultor/pymes/pymes'),
    ],
    [
      buildPath(PATH.admin.consultor.meetings),
      () => import('@module/admin/content/consultor/meetings/meetings'),
    ],
    [
      buildPath(PATH.admin.consultor.tasks),
      () => import('@module/admin/content/consultor/tasks/tasks'),
    ],
    [
      buildPath(PATH.admin.consultor.documents),
      () => import('@module/admin/content/consultor/documents/documents'),
    ],
    [
      buildPath(PATH.admin.consultor.subscription),
      () => import('@module/admin/content/consultor/subscription/subscription'),
    ],
  ]);

  isOpen = input(false);
  isCollapsed = input(false);
  close = output<void>();

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set((event as NavigationEnd).urlAfterRedirects));

    if (isPlatformBrowser(this.platformId)) {
      window.setTimeout(() => this.prefetchVisibleRoutes(), 0);
    }
  }

  menuItems = computed(() => {
    const role = this.sessionService.session()?.user.role;
    const pymePath = PATH.admin.pyme;
    const consultorPath = PATH.admin.consultor;
    const pymeItems: MenuItem[] = [
      { label: 'Dashboard', path: buildPath(pymePath.dashboard), icon: 'fas fa-table-cells-large' },
      { label: 'Perfil', path: buildPath(pymePath.profile), icon: 'fas fa-user-gear' },
      { label: 'Diagnósticos', path: buildPath(pymePath.diagnostics), icon: 'fas fa-clipboard-check' },
      { label: 'Consultores', path: buildPath(pymePath.consultants), icon: 'fas fa-user-group' },
      { label: 'Reuniones', path: buildPath(pymePath.meetings), icon: 'fas fa-calendar' },
      { label: 'Tareas', path: buildPath(pymePath.tasks), icon: 'fas fa-square-check' },
      { label: 'Documentos', path: buildPath(pymePath.documents), icon: 'fas fa-file-lines' },
    ];

    const consultorItems: MenuItem[] = [
      { label: 'Dashboard', path: buildPath(consultorPath.dashboard), icon: 'fas fa-table-cells-large' },
      { label: 'Perfil', path: buildPath(consultorPath.profile), icon: 'fas fa-user-gear' },
      { label: 'Mis Clientes', path: buildPath(consultorPath.pymes), icon: 'fas fa-user-group' },
      { label: 'Calendario', path: buildPath(consultorPath.meetings), icon: 'fas fa-calendar-days' },
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

  prefetchRoute(path: string) {
    if (!isPlatformBrowser(this.platformId) || this.prefetchedRoutes.has(path)) return;

    const prefetcher = this.routePrefetchers.get(path);
    if (!prefetcher) return;

    this.prefetchedRoutes.add(path);
    void prefetcher().catch(() => this.prefetchedRoutes.delete(path));
  }

  isActive(path: string) {
    return this.currentUrl().startsWith(`/${path}`);
  }

  private prefetchVisibleRoutes() {
    for (const item of this.menuItems()) {
      this.prefetchRoute(item.path);
    }
  }
}
