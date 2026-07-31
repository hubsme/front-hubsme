import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { ConsultantService } from '@service/admin/consultant.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { normalizeLinkedInUrl } from '@function/url.function';

type Consultant = ApiResponse<'consultant', 'findByUser'>;

@Component({
  selector: 'app-consultant-profile',
  imports: [CommonModule],
  templateUrl: './consultant-profile.html',
})
export class ConsultantProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consultantService = inject(ConsultantService);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  consultant = signal<Consultant | null>(null);
  loading = signal(false);
  videoOpen = signal(false);
  showAllCaseStudies = signal(false);
  expandedCaseIndex = signal<number | null>(null);
  showAllExpertise = signal(false);
  showProfessionalDetails = signal(false);

  consultantUserId = computed(() => Number(this.route.snapshot.paramMap.get('id') ?? 0));
  linkedinUrl = computed(() => normalizeLinkedInUrl(this.consultant()?.linkedinUrl));
  caseStudies = computed(() => this.consultant()?.caseStudies ?? []);
  visibleCaseStudies = computed(() =>
    this.showAllCaseStudies() ? this.caseStudies() : this.caseStudies().slice(0, 2)
  );
  specialties = computed(() => this.consultant()?.specialties ?? []);
  industries = computed(() => this.consultant()?.industries ?? []);
  companyTypes = computed(() => this.consultant()?.companyTypes ?? []);
  services = computed(() => this.consultant()?.services ?? []);
  visibleSpecialties = computed(() =>
    this.showAllExpertise() ? this.specialties() : this.specialties().slice(0, 6)
  );
  visibleIndustries = computed(() =>
    this.showAllExpertise() ? this.industries() : this.industries().slice(0, 4)
  );
  visibleCompanyTypes = computed(() =>
    this.showAllExpertise() ? this.companyTypes() : this.companyTypes().slice(0, 3)
  );
  visibleServices = computed(() =>
    this.showAllExpertise() ? this.services() : this.services().slice(0, 5)
  );
  hasHiddenExpertise = computed(() =>
    this.specialties().length > 6 ||
    this.industries().length > 4 ||
    this.companyTypes().length > 0 ||
    this.services().length > 0
  );

  mockReviews = [
    {
      name: 'Mariela Gómez',
      role: 'Dueña de restaurante',
      comment: 'Nos ayudó a ordenar costos y entender nuestros números de verdad. La implementación de tableros de control fue inmediata.',
      rating: 5,
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mariela'
    },
    {
      name: 'Jorge Salas',
      role: 'Comercio minorista',
      comment: 'Muy claro, práctico y enfocado en resultados. Resolvió nuestras dudas fiscales en tiempo récord.',
      rating: 5,
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jorge'
    },
    {
      name: 'Rosa Huamán',
      role: 'Transporte y logística',
      comment: 'Detectó errores tributarios que no estábamos viendo. Gracias a su auditoría nos ahorramos multas costosas.',
      rating: 5,
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Rosa'
    }
  ];

  ngOnInit(): void {
    this.load();
  }

  load() {
    const userId = this.consultantUserId();
    if (!userId) {
      this.toastService.error('Consultor inválido');
      this.goBack();
      return;
    }

    this.loading.set(true);
    this.consultantService.findByUser(userId)
      .then((consultant) => {
        this.consultant.set(consultant);
      })
      .catch((error) => {
        this.toastService.error(this.hubsme.getErrorMessage(error));
        this.goBack();
      })
      .finally(() => this.loading.set(false));
  }

  goBack() {
    this.router.navigate([buildPath(PATH.admin.pyme.consultants)]);
  }

  schedule() {
    const cons = this.consultant();
    if (cons) {
      this.router.navigate([buildPath(PATH.admin.pyme.consultants.agendar), cons.userId]);
    }
  }

  toggleCaseDetail(index: number): void {
    this.expandedCaseIndex.update((current) => current === index ? null : index);
  }

  toggleCaseStudies(): void {
    this.showAllCaseStudies.update((current) => !current);
    if (this.showAllCaseStudies() === false && (this.expandedCaseIndex() ?? 0) > 1) {
      this.expandedCaseIndex.set(null);
    }
  }

  toggleExpertise(): void {
    this.showAllExpertise.update((current) => !current);
  }

  toggleProfessionalDetails(): void {
    this.showProfessionalDetails.update((current) => !current);
  }

  consultantPhoto(consultant: Consultant): string {
    return consultant.photoUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(consultant.fullName)}`;
  }

  rating(consultant: Consultant): string {
    return Number(consultant.rating || 0).toFixed(1);
  }

  getStarsArray(rating: string | number): number[] {
    const val = Math.round(Number(rating || 0));
    return Array.from({ length: 5 }, (_, i) => i < val ? 1 : 0);
  }
}
