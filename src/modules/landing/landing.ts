import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
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
  protected showAllServices = signal(false);
  protected searchQuery = signal('');
  protected carouselIndex = signal(0);
  protected visibleCards = signal(4);
  protected isTransitioning = signal(true);

  // Pagination states
  private currentPage = 1;
  private hasMore = true;
  private loadingNextPage = false;

  // Autoplay states
  private autoScrollInterval?: any;

  // Drag states
  protected isDragging = false;
  private startX = 0;
  protected dragOffset = signal(0);

  protected infiniteConsultants = computed(() => {
    const list = this.consultants();
    if (list.length === 0) return [];
    return [...list, ...list, ...list];
  });

  protected maxIndex = computed(() => {
    return Math.max(0, this.consultants().length - this.visibleCards());
  });

  protected translateX = computed(() => {
    const idx = this.carouselIndex();
    const percent = 100 / this.visibleCards();
    return `calc(-${idx * percent}% + ${this.dragOffset()}px)`;
  });

  private searchTimeout?: number;
  private resizeListener?: () => void;

  protected readonly services = [
    {
      title: 'Consultoría Legal Empresarial',
      description: 'Protege tu empresa con asesoría legal estratégica para contratos, cumplimiento y crecimiento seguro.',
    },
    {
      title: 'Consultoría de Marketing',
      description: 'Desarrolla estrategias efectivas para atraer y retener clientes, mejorando la visibilidad de tu marca y aumentando las ventas.',
    },
    {
      title: 'Consultoría de Planeamiento Estratégico',
      description: 'Formulación de planes estratégicos, estableciendo objetivos claros y alcanzables para guiar el crecimiento de tu empresa.',
    },
    {
      title: 'Consultoría Contable y Tributaria',
      description: 'Ordena tus finanzas y cumple tus obligaciones tributarias con mayor seguridad y eficiencia.',
    },
    {
      title: 'Consultoría en Inteligencia Artificial',
      description: 'Implementa soluciones de IA para optimizar procesos, mejorar la toma de decisiones y aumentar la eficiencia operativa en tu negocio.',
    },
    {
      title: 'Consultoría en Ingeniería de Sistemas',
      description: 'Diseña y gestiona sistemas tecnológicos que mejoren los procesos empresariales, garantizando seguridad y funcionalidad.',
    },
    {
      title: 'Consultoría en Calidad',
      description: 'Ayuda a establecer y mantener estándares de calidad en productos y servicios, asegurando la satisfacción del cliente y la mejora continua.',
    },
    {
      title: 'Consultoría en Ventas',
      description: 'Diseña estrategias de ventas para maximizar ingresos y rendimiento del equipo, fortaleciendo la relación con los clientes y fomentando la fidelización.',
    },
    {
      title: 'Consultoría en Innovación',
      description: 'Fomenta la creatividad y la innovación dentro de tu empresa, ayudando a implementar nuevas ideas y mejorar los productos y servicios existentes.',
    },
    {
      title: 'Consultoría en Desarrollo Sostenible',
      description: 'Implementación de prácticas empresariales sostenibles, contribuyendo al bienestar social y ambiental mientras se mantiene la rentabilidad.',
    },
    {
      title: 'Consultoría en Comercio Internacional',
      description: 'Expande tu negocio a mercados internacionales con estrategias de importación y exportación.',
    },
    {
      title: 'Consultoría de Data Analytics',
      description: 'Convierte datos en información útil para tomar decisiones más rápidas y estratégicas.',
    },
    {
      title: 'Consultoría de Experiencia del Cliente',
      description: 'Diseña experiencias que generen satisfacción, fidelización y recomendaciones constantes.',
    },
    {
      title: 'Consultoría de Ciberseguridad',
      description: 'Protege la información y los sistemas de tu empresa frente a riesgos y amenazas digitales.',
    },
    {
      title: 'Consultoría de Seguridad y Salud en el Trabajo',
      description: 'Fortalece la prevención de riesgos y crea ambientes laborales más seguros y saludables.',
    },
    {
      title: 'Consultoría de Mantenimiento',
      description: 'Optimiza el mantenimiento preventivo y correctivo para reducir fallas y aumentar productividad.',
    },
    {
      title: 'Consultoría para Empresas Familiares',
      description: 'Mejora la gestión, sucesión y gobierno corporativo para asegurar continuidad y crecimiento.',
    },
    {
      title: 'Consultoría de Gobierno Corporativo',
      description: 'Fortalece la toma de decisiones y la estructura empresarial con prácticas de gestión profesional.',
    },
    {
      title: 'Consultoría de Recursos Humanos',
      description: 'Optimiza tu talento humano y tu cultura organizacional con acompañamiento experto.',
    },
    {
      title: 'Consultoría de Finanzas',
      description: 'Estrategias financieras concretas para ganar control, liquidez y rentabilidad.',
    },
    {
      title: 'Consultoría de Logística',
      description: 'Mejora tu cadena de suministro, distribución y capacidad de respuesta operativa.',
    },
    {
      title: 'Consultoría de Operaciones',
      description: 'Procesos más simples, indicadores claros y ejecución continua para crecer ordenadamente.',
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

    this.updateVisibleCards();
    this.resizeListener = () => {
      this.updateVisibleCards();
      const L = this.consultants().length;
      if (L > 0 && (this.carouselIndex() < L || this.carouselIndex() >= 2 * L)) {
        this.carouselIndex.set(L);
      }
    };
    window.addEventListener('resize', this.resizeListener);

    this.startAutoScroll();

    window.setTimeout(() => {
      this.syncHeroVideo();
      const initialSection = window.location.hash.replace('#', '');
      if (initialSection) this.scrollToSection(initialSection);
    });
  }

  ngOnDestroy(): void {
    this.interactionCleanups.forEach((cleanup) => cleanup());
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.searchTimeout) {
      window.clearTimeout(this.searchTimeout);
    }
    this.stopAutoScroll();
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
      this.router.navigate([buildPath(PATH.diagnostic)]);
      return;
    }

    this.router.navigate([buildPath(PATH.auth.signUp)], {
      queryParams: { role: 'pyme', locked: true, diagnostic: true },
    });
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

  protected loadConsultants(search?: string): void {
    this.consultantsLoading.set(true);
    this.currentPage = 1;
    this.hasMore = true;
    const limit = search ? 20 : 10;

    this.api.publicConsultant
      .publicconsultantFindAll({ limit, page: 1, search })
      .then((response) => {
        this.consultants.set(response.data.data);
        const L = response.data.data.length;
        this.carouselIndex.set(L > 0 ? L : 0);
        if (!search && response.data.data.length < limit) {
          this.hasMore = false;
        }
      })
      .catch(() => this.consultants.set([]))
      .finally(() => this.consultantsLoading.set(false));
  }

  private loadNextPage(): void {
    if (this.searchQuery() || !this.hasMore || this.loadingNextPage) return;

    this.loadingNextPage = true;
    const nextPage = this.currentPage + 1;

    this.api.publicConsultant
      .publicconsultantFindAll({ limit: 10, page: nextPage })
      .then((response) => {
        const nextData = response.data.data;
        if (nextData.length > 0) {
          this.consultants.update((items) => [...items, ...nextData]);
          this.currentPage = nextPage;
        }
        if (nextData.length < 10) {
          this.hasMore = false;
        }
      })
      .catch(() => {
        this.hasMore = false;
      })
      .finally(() => {
        this.loadingNextPage = false;
      });
  }

  protected onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchQuery.set(value);

    if (this.searchTimeout) {
      window.clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
      this.loadConsultants(value);
      if (value) {
        this.stopAutoScroll();
      } else {
        this.startAutoScroll();
      }
    }, 500);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.loadConsultants();
    this.startAutoScroll();
  }

  private isResetting = false;

  private handleResetIndex() {
    const L = this.consultants().length;
    if (L === 0 || this.isResetting) return;

    const idx = this.carouselIndex();
    if (idx >= 2 * L) {
      this.isResetting = true;
      this.isTransitioning.set(false);
      this.carouselIndex.set(idx - L);
      setTimeout(() => {
        this.isTransitioning.set(true);
        this.isResetting = false;
      }, 50);
    } else if (idx < L) {
      this.isResetting = true;
      this.isTransitioning.set(false);
      this.carouselIndex.set(idx + L);
      setTimeout(() => {
        this.isTransitioning.set(true);
        this.isResetting = false;
      }, 50);
    }
  }

  protected nextSlide(): void {
    if (this.isResetting) return;
    const L = this.consultants().length;
    if (L === 0) return;

    const nextIdx = this.carouselIndex() + 4;
    this.carouselIndex.set(nextIdx);

    const originalIndex = (nextIdx - this.visibleCards() + L) % L;
    if (this.hasMore && originalIndex + this.visibleCards() >= L - 2) {
      this.loadNextPage();
    }

    setTimeout(() => {
      this.handleResetIndex();
    }, 500);
  }

  protected prevSlide(): void {
    if (this.isResetting) return;
    const L = this.consultants().length;
    if (L === 0) return;

    const prevIdx = this.carouselIndex() - 4;
    this.carouselIndex.set(prevIdx);

    setTimeout(() => {
      this.handleResetIndex();
    }, 500);
  }

  private startAutoScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopAutoScroll();

    this.autoScrollInterval = window.setInterval(() => {
      if (
        this.searchQuery() ||
        this.isDragging ||
        this.consultantsLoading() ||
        this.consultants().length === 0 ||
        this.isResetting
      )
        return;

      const L = this.consultants().length;
      const nextIdx = this.carouselIndex() + 4;
      this.carouselIndex.set(nextIdx);

      const originalIndex = (nextIdx - this.visibleCards() + L) % L;
      if (this.hasMore && originalIndex + this.visibleCards() >= L - 2) {
        this.loadNextPage();
      }

      setTimeout(() => {
        this.handleResetIndex();
      }, 500);
    }, 4000);
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      window.clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = undefined;
    }
  }

  protected onDragStart(event: MouseEvent | TouchEvent, container: HTMLElement): void {
    this.isDragging = true;
    this.startX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.stopAutoScroll();
  }

  protected onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    const currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const diff = currentX - this.startX;
    this.dragOffset.set(diff);
  }

  protected onDragEnd(container: HTMLElement): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const diff = this.dragOffset();
    this.dragOffset.set(0);

    const containerWidth = container.clientWidth;
    const cardWidth = containerWidth / this.visibleCards();
    const cardsMoved = Math.round(-diff / cardWidth);

    if (Math.abs(cardsMoved) > 0) {
      const targetIndex = this.carouselIndex() + cardsMoved;
      this.carouselIndex.set(targetIndex);

      const L = this.consultants().length;
      const originalIndex = (targetIndex - this.visibleCards() + L) % L;
      if (this.hasMore && originalIndex + this.visibleCards() >= L - 2) {
        this.loadNextPage();
      }

      setTimeout(() => {
        this.handleResetIndex();
      }, 500);
    }

    if (!this.searchQuery()) {
      this.startAutoScroll();
    }
  }

  protected calculateParallax(idx: number, isMediaActive: boolean): string {
    if (!isPlatformBrowser(this.platformId)) return isMediaActive ? 'scale(1.2)' : 'scale(1.15)';
    const currentIdx = this.carouselIndex();
    const L = this.consultants().length;
    if (L === 0) return isMediaActive ? 'scale(1.2)' : 'scale(1.15)';

    const container = document.querySelector('#carouselContainer');
    const containerWidth = container?.clientWidth ?? 1200;
    const cardWidth = containerWidth / this.visibleCards();
    const dragCards = this.dragOffset() / cardWidth;

    const relativePos = (currentIdx - dragCards) - idx;
    
    // Use a subtle parallax shift (max 5%) to ensure the scaled image (1.15) always covers the container
    const maxShift = 5;
    const shift = Math.max(-maxShift, Math.min(maxShift, relativePos * 1.8));
    const baseScale = isMediaActive ? 1.25 : 1.15;
    return `scale(${baseScale}) translateX(${shift}%)`;
  }

  private updateVisibleCards(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const width = window.innerWidth;
    if (width < 640) {
      this.visibleCards.set(1);
    } else if (width < 1024) {
      this.visibleCards.set(2);
    } else if (width < 1280) {
      this.visibleCards.set(3);
    } else {
      this.visibleCards.set(4);
    }
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
