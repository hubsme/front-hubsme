import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api, ApiResponse } from 'api/backend.api';
import { PATH, buildPath } from '@route/path.route';
import { SessionService } from '@service/session.service';
import { ThemeService } from '@service/theme.service';

type LandingRole = 'pyme' | 'consultor';
type LandingConsultant = ApiResponse<'publicConsultant', 'publicconsultantFindAll'>['data'][number];

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
})
export class Landing implements OnInit, AfterViewInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private api = inject(Api);
  private session = inject(SessionService);
  themeService = inject(ThemeService);

  @ViewChild('heroVideo') private heroVideo?: ElementRef<HTMLVideoElement>;

  protected consultants = signal<LandingConsultant[]>([]);
  protected consultantsLoading = signal(false);

  protected readonly services = [
    {
      title: 'Consultoria de RRHH',
      description: 'Optimiza tu talento humano y tu cultura organizacional con acompanamiento experto.',
    },
    {
      title: 'Consultoria de Finanzas',
      description: 'Estrategias financieras concretas para ganar control, liquidez y rentabilidad.',
    },
    {
      title: 'Consultoria de Logistica',
      description: 'Mejora tu cadena de suministro, distribucion y capacidad de respuesta operativa.',
    },
    {
      title: 'Consultoria de Operaciones',
      description: 'Procesos mas simples, indicadores claros y ejecucion continua para crecer ordenadamente.',
    },
  ];

  protected readonly stats = [
    { value: '+120', label: 'Diagnosticos realizados' },
    { value: '92%', label: 'Empresas con plan accionable' },
    { value: '+45', label: 'Consultores validados' },
  ];

  ngOnInit(): void {
    this.loadConsultants();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.setTimeout(() => {
      this.syncHeroVideo();
      const initialSection = window.location.hash.replace('#', '');
      if (initialSection) this.scrollToSection(initialSection);
    });
  }

  protected goToLogin(): void {
    this.router.navigate([buildPath(PATH.auth.signIn)]);
  }

  protected goToSignUp(role: LandingRole): void {
    this.router.navigate([buildPath(PATH.auth.signUp)], {
      queryParams: { role, locked: true },
    });
  }

  protected startFreeDiagnostic(): void {
    this.session.restoreSession();
    if (this.session.session()) {
      this.router.navigate([buildPath(PATH.pyme.diagnostics)]);
      return;
    }

    this.goToSignUp('pyme');
  }

  protected consultantPhoto(consultant: LandingConsultant): string {
    return consultant.photoUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.name)}`;
  }

  protected consultantSpecialty(consultant: LandingConsultant): string {
    return consultant.specialties[0] ?? 'Consultoria para PYMES';
  }

  protected scrollToSection(sectionId: string, event?: Event): void {
    event?.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    const anchor = sectionId === 'top' ? target : target.firstElementChild ?? target;
    const top = anchor.getBoundingClientRect().top + window.scrollY - headerHeight - 96;

    window.history.pushState(null, '', `#${sectionId}`);
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  protected syncHeroVideo(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.loop = true;
  }

  protected restartHeroVideo(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    this.syncHeroVideo();
    video.currentTime = 0;
  }

  private loadConsultants(): void {
    this.consultantsLoading.set(true);
    this.api.publicConsultant
      .publicconsultantFindAll({ limit: 8 })
      .then((response) => this.consultants.set(response.data.data))
      .catch(() => this.consultants.set([]))
      .finally(() => this.consultantsLoading.set(false));
  }
}
