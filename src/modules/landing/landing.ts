import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
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
export class Landing implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private api = inject(Api);
  private session = inject(SessionService);
  themeService = inject(ThemeService);

  @ViewChild('heroVideo') private heroVideo?: ElementRef<HTMLVideoElement>;

  protected consultants = signal<LandingConsultant[]>([]);
  protected consultantsLoading = signal(false);
  protected activeConsultantMediaKey = signal<string | null>(null);
  private consultantAudioEnabled = false;
  private activeConsultantVideo?: HTMLVideoElement;
  private readonly interactionCleanups: (() => void)[] = [];

  protected readonly services = [
    {
      title: 'Consultoria de RRHH',
      description:
        'Optimiza tu talento humano y tu cultura organizacional con acompanamiento experto.',
    },
    {
      title: 'Consultoria de Finanzas',
      description: 'Estrategias financieras concretas para ganar control, liquidez y rentabilidad.',
    },
    {
      title: 'Consultoria de Logistica',
      description:
        'Mejora tu cadena de suministro, distribucion y capacidad de respuesta operativa.',
    },
    {
      title: 'Consultoria de Operaciones',
      description:
        'Procesos mas simples, indicadores claros y ejecucion continua para crecer ordenadamente.',
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

    this.listenForUserInteraction();

    window.setTimeout(() => {
      this.syncHeroVideo();
      const initialSection = window.location.hash.replace('#', '');
      if (initialSection) this.scrollToSection(initialSection);
    });
  }

  ngOnDestroy(): void {
    this.interactionCleanups.forEach((cleanup) => cleanup());
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
    return (
      consultant.photoUrl ||
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName)}`
    );
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
    const anchor = sectionId === 'top' ? target : (target.firstElementChild ?? target);
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

  protected syncConsultantVideo(event: Event): void {
    const video = event.currentTarget instanceof HTMLVideoElement ? event.currentTarget : null;
    if (!video) return;

    this.prepareConsultantVideo(video);
  }

  protected playConsultantVideo(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const video = this.getConsultantVideo(event);
    if (!video) return;

    this.pauseConsultantVideos(video);
    this.activeConsultantVideo = video;
    this.prepareConsultantVideo(video);
    this.updateConsultantAudioButton(video, this.consultantAudioEnabled);
    void video.play().catch(() => {
      this.prepareConsultantVideo(video, false);
      this.updateConsultantAudioButton(video, false);
      return video.play().catch(() => undefined);
    });
  }

  protected activateConsultantMedia(key: string, event: Event): void {
    this.activeConsultantMediaKey.set(key);
    this.playConsultantVideo(event);
  }

  protected deactivateConsultantMedia(key: string, event: Event): void {
    if (this.activeConsultantMediaKey() === key) {
      this.activeConsultantMediaKey.set(null);
    }
    this.pauseConsultantVideo(event);
  }

  protected isConsultantMediaActive(key: string): boolean {
    return this.activeConsultantMediaKey() === key;
  }

  protected pauseConsultantVideo(event: Event): void {
    const video = this.getConsultantVideo(event);
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    this.prepareConsultantVideo(video, false);
    this.updateConsultantAudioButton(video, false);

    if (this.activeConsultantVideo === video) {
      this.activeConsultantVideo = undefined;
    }
  }

  protected unmuteConsultantVideo(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!isPlatformBrowser(this.platformId)) return;

    const button = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    const card = button?.closest('article');
    const video = card?.querySelector<HTMLVideoElement>('video') ?? null;
    if (!video) return;

    this.consultantAudioEnabled = !this.consultantAudioEnabled;
    this.pauseConsultantVideos(video);
    this.activeConsultantVideo = video;
    this.prepareConsultantVideo(video);
    this.updateConsultantAudioButton(video, this.consultantAudioEnabled);
    void video.play().catch(() => undefined);
  }

  private loadConsultants(): void {
    this.consultantsLoading.set(true);
    this.api.publicConsultant
      .publicconsultantFindAll({ limit: 8 })
      .then((response) => this.consultants.set(response.data.data))
      .catch(() => this.consultants.set([]))
      .finally(() => this.consultantsLoading.set(false));
  }

  private getConsultantVideo(event: Event): HTMLVideoElement | null {
    const card = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    return card?.querySelector<HTMLVideoElement>('video') ?? null;
  }

  private prepareConsultantVideo(
    video: HTMLVideoElement,
    withAudio = this.consultantAudioEnabled,
  ): void {
    video.muted = !withAudio;
    video.defaultMuted = !withAudio;
    video.volume = withAudio ? 1 : 0;
    video.loop = true;
    video.playsInline = true;
  }

  private pauseConsultantVideos(except?: HTMLVideoElement): void {
    document.querySelectorAll<HTMLVideoElement>('#consultores video').forEach((video) => {
      if (video === except) return;

      video.pause();
      video.currentTime = 0;
      this.prepareConsultantVideo(video, false);
      this.updateConsultantAudioButton(video, false);
    });
  }

  private updateAllConsultantAudioButtons(withAudio: boolean): void {
    document.querySelectorAll<HTMLVideoElement>('#consultores video').forEach((video) => {
      this.updateConsultantAudioButton(video, withAudio);
    });
  }

  private updateConsultantAudioButton(video: HTMLVideoElement, withAudio: boolean): void {
    const icon = video
      .closest('article')
      ?.querySelector<HTMLElement>('[data-consultant-audio-toggle] i');
    if (!icon) return;

    icon.classList.toggle('fa-volume-high', withAudio);
    icon.classList.toggle('fa-volume-xmark', !withAudio);
  }

  private listenForUserInteraction(): void {
    const enableAudio = () => {
      if (this.consultantAudioEnabled) return;

      this.consultantAudioEnabled = true;
      this.updateAllConsultantAudioButtons(true);
      if (this.activeConsultantVideo && !this.activeConsultantVideo.paused) {
        this.prepareConsultantVideo(this.activeConsultantVideo, true);
        this.updateConsultantAudioButton(this.activeConsultantVideo, true);
      }
    };

    document.addEventListener('pointerdown', enableAudio);
    document.addEventListener('keydown', enableAudio);

    this.interactionCleanups.push(
      () => document.removeEventListener('pointerdown', enableAudio),
      () => document.removeEventListener('keydown', enableAudio),
    );
  }
}
