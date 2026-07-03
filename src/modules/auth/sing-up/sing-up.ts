import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, signal, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api, ApiBody, ApiResponse } from 'api/backend.api';
import { PATH, buildPath, getDefaultRoute } from '@route/path.route';
import { SessionService } from '@service/session.service';
import { ToastService } from '@service/toast.service';

type ConsultantCvProfile = ApiResponse<'ia', 'runConsultantCv'>;
type ConsultantCvPayload = Pick<
  ApiBody<'auth', 'register'>,
  | 'headline'
  | 'location'
  | 'workModality'
  | 'bio'
  | 'ownerPhone'
  | 'linkedinUrl'
  | 'specialties'
  | 'sectors'
  | 'industries'
  | 'companyTypes'
  | 'services'
  | 'yearsExperience'
  | 'education'
  | 'certifications'
  | 'workedSectors'
  | 'caseStudies'
  | 'cvText'
  | 'cvUrl'
>;

type PdfTextItem = { str: string };
type PdfTextContent = { items: unknown[] };
type PdfPage = { getTextContent(): Promise<PdfTextContent> };
type PdfDocument = { numPages: number; getPage(pageNumber: number): Promise<PdfPage> };
type PdfLoadTask = { promise: Promise<PdfDocument> };
type PdfJsModule = {
  getDocument(source: { data: Uint8Array }): PdfLoadTask;
  GlobalWorkerOptions: { workerSrc: string };
};

@Component({
  selector: 'app-sing-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sing-up.html',
  styleUrl: './sing-up.css',
})
export class SingUp implements OnInit, OnDestroy {
  private api = inject(Api);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private session = inject(SessionService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  companyName = signal('');
  ruc = signal('');
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  ownerPhone = signal('');
  ownerPosition = signal('');
  role = signal<'pyme' | 'consultor'>('pyme');
  roleLocked = signal(false);
  step = signal<1 | 2>(1);
  loading = signal(false);
  googleLoading = signal(false);
  cvFileName = signal('');
  cvProcessing = signal(false);
  cvError = signal('');
  cvText = signal('');
  cvUrl = signal('');
  consultantProfile = signal<ConsultantCvProfile | null>(null);
  profileComplete = computed(() => {
    const hasPerson = !!this.firstName().trim() && !!this.lastName().trim();
    if (this.role() === 'consultor') return hasPerson && !!this.consultantProfile();
    return hasPerson && !!this.companyName().trim() && !!this.ruc().trim();
  });

  showOnboarding = signal(false);
  currentOnboardingSlide = signal(0);

  nextSlide() {
    if (this.currentOnboardingSlide() < 2) {
      this.currentOnboardingSlide.update((s) => s + 1);
    } else {
      this.router.navigate([getDefaultRoute(['consultor'])]);
    }
  }

  prevSlide() {
    this.currentOnboardingSlide.update((s) => Math.max(0, s - 1));
  }
  private googlePopup: Window | null = null;
  private googlePopupTimer: ReturnType<typeof setInterval> | null = null;
  private readonly googleMessageHandler = (event: MessageEvent<unknown>) => this.handleGoogleMessage(event);

  constructor() {
    const role = this.route.snapshot.queryParamMap.get('role');
    if (role === 'pyme' || role === 'consultor') {
      this.role.set(role);
      this.roleLocked.set(this.route.snapshot.queryParamMap.get('locked') === 'true');
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('message', this.googleMessageHandler);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('message', this.googleMessageHandler);
    }
    this.clearGooglePopupTimer();
  }

  setRole(role: 'pyme' | 'consultor') {
    if (this.roleLocked()) return;
    this.role.set(role);
    this.step.set(1);
  }

  goToCredentialsStep() {
    if (!this.profileComplete()) {
      this.toastService.error(
        this.role() === 'pyme'
          ? 'Completa empresa, RUC, nombres y apellidos del dueno'
          : 'Sube tu CV en PDF y revisa el perfil extraido',
      );
      return;
    }
    this.step.set(2);
  }

  goToProfileStep() {
    this.step.set(1);
  }

  onRegister() {
    if (!this.profileComplete()) {
      this.goToCredentialsStep();
      return;
    }

    if (!this.email() || !this.password() || !this.firstName() || !this.lastName()) {
      this.toastService.error('Completa nombres, apellidos, email y password');
      return;
    }

    if (this.role() === 'pyme' && (!this.companyName() || !this.ruc())) {
      this.toastService.error('Completa nombre de empresa y RUC');
      return;
    }

    const payload: ApiBody<'auth', 'register'> = {
      name: this.role() === 'consultor' ? `${this.firstName()} ${this.lastName()}`.trim() : this.companyName(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
      role: this.role(),
      ruc: this.role() === 'pyme' ? this.ruc() : undefined,
      ownerPhone: this.role() === 'pyme' ? this.ownerPhone() || undefined : undefined,
      ownerPosition: this.role() === 'pyme' ? this.ownerPosition() || undefined : undefined,
      ...(this.role() === 'consultor' ? this.consultantProfilePayload() : {}),
    };

    this.loading.set(true);
    this.api.auth
      .register(payload)
      .then((res) => {
        this.session.setSession(res.data);
        this.toastService.success('Cuenta creada correctamente');
        const diagnostic = this.route.snapshot.queryParamMap.get('diagnostic');
        if (diagnostic === 'true' && res.data.user.role === 'pyme') {
          this.router.navigate([buildPath(PATH.diagnostic)]);
        } else if (res.data.user.role === 'consultor') {
          this.showOnboarding.set(true);
        } else {
          this.router.navigate([getDefaultRoute([res.data.user.role])]);
        }
      })
      .catch((error) => {
        this.toastService.error(this.getErrorMessage(error, 'No se pudo crear la cuenta'));
      })
      .finally(() => this.loading.set(false));
  }

  goToSignIn() {
    const diagnostic = this.route.snapshot.queryParamMap.get('diagnostic');
    this.router.navigate([buildPath(PATH.auth.signIn)], {
      queryParams: diagnostic ? { diagnostic } : {},
    });
  }

  startGoogleRegister() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.profileComplete()) {
      this.goToCredentialsStep();
      return;
    }

    this.googleLoading.set(true);

    this.api.auth
      .googleUrl({ flow: 'register', role: this.role() })
      .then((res) => {
        this.googlePopup = window.open(
          res.data.url,
          'hubsme_google_auth',
          this.getGooglePopupFeatures(),
        );

        if (!this.googlePopup) {
          this.toastService.error('Permite popups para continuar con Google');
          this.googleLoading.set(false);
          return;
        }

        this.googlePopup.focus();
        this.googlePopupTimer = setInterval(() => {
          if (this.googlePopup?.closed) {
            this.clearGooglePopupTimer();
            this.googleLoading.set(false);
          }
        }, 500);
      })
      .catch((error) => {
        this.toastService.error(this.getErrorMessage(error, 'No se pudo iniciar Google'));
        this.googleLoading.set(false);
      });
  }

  onConsultantCvSelected(event: Event) {
    const file = this.getFile(event);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.cvError.set('Sube un archivo PDF valido');
      this.consultantProfile.set(null);
      return;
    }

    this.cvFileName.set(file.name);
    this.cvError.set('');
    this.cvProcessing.set(true);
    this.consultantProfile.set(null);

    this.api.storage
      .upload({ folder: 'consultants/cvs' }, { file })
      .then((uploadRes) => {
        this.cvUrl.set(uploadRes.data.secureUrl);
        return this.extractPdfText(file);
      })
      .then((text) => {
        if (text.length < 40) {
          throw new Error('No se pudo leer suficiente texto del PDF');
        }
        this.cvText.set(text);
        return this.api.ia.runConsultantCv({ text });
      })
      .then((profile) => {
        this.consultantProfile.set(profile.data);
        this.prefillConsultantFromProfile(profile.data);
        this.toastService.success('CV subido y procesado correctamente');
      })
      .catch((error) => {
        this.cvError.set(this.getErrorMessage(error, 'No se pudo procesar el CV'));
      })
      .finally(() => this.cvProcessing.set(false));
  }

  private handleGoogleMessage(event: MessageEvent<unknown>): void {
    if (!this.isGoogleAuthMessage(event.data)) return;

    this.clearGooglePopupTimer();
    this.googlePopup?.close();
    this.googlePopup = null;

    if (event.data.error) {
      this.googleLoading.set(false);
      this.toastService.error(event.data.error);
      return;
    }

    if (!event.data.session) {
      this.googleLoading.set(false);
      return;
    }

    const session = event.data.session;
    this.session.setSession(session);
    this.completeGoogleProfile(session)
      .then(() => {
        this.toastService.success('Cuenta conectada con Google');
        const diagnostic = this.route.snapshot.queryParamMap.get('diagnostic');
        if (diagnostic === 'true' && session.user.role === 'pyme') {
          this.router.navigate([buildPath(PATH.diagnostic)]);
        } else if (session.user.role === 'consultor') {
          this.showOnboarding.set(true);
        } else {
          this.router.navigate([getDefaultRoute([session.user.role])]);
        }
      })
      .catch((error) => {
        this.toastService.error(this.getErrorMessage(error, 'No se pudo completar el perfil'));
      })
      .finally(() => this.googleLoading.set(false));
  }

  private isGoogleAuthMessage(value: unknown): value is { type: 'hubsme:google-auth'; session?: ApiResponse<'auth', 'login'>; error?: string } {
    if (!value || typeof value !== 'object') return false;
    const message = value as { type?: unknown };
    return message.type === 'hubsme:google-auth';
  }

  private clearGooglePopupTimer(): void {
    if (!this.googlePopupTimer) return;
    clearInterval(this.googlePopupTimer);
    this.googlePopupTimer = null;
  }

  private getGooglePopupFeatures(): string {
    const width = 520;
    const height = 680;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

    return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
  }

  private async completeGoogleProfile(session: ApiResponse<'auth', 'login'>): Promise<void> {
    const user = session.user;
    if (user.role === 'pyme') {
      const response = await this.api.pyme.findByUser({ userId: user.id });
      const payload: ApiBody<'pyme', 'update'> = {};

      const companyName = this.companyName().trim();
      const ruc = this.ruc().trim();
      const firstName = this.firstName().trim();
      const lastName = this.lastName().trim();
      const ownerPhone = this.ownerPhone().trim();
      const ownerPosition = this.ownerPosition().trim();

      if (companyName) payload.name = companyName;
      if (ruc) payload.ruc = ruc;
      if (firstName) payload.ownerFirstName = firstName;
      if (lastName) payload.ownerLastName = lastName;
      if (ownerPhone) payload.ownerPhone = ownerPhone;
      if (ownerPosition) payload.ownerPosition = ownerPosition;
      if (user.email) payload.ownerEmail = user.email;

      if (Object.keys(payload).length > 0) {
        await this.api.pyme.update({ id: response.data.id }, payload);
      }
      return;
    }

    if (user.role === 'consultor') {
      const response = await this.api.consultant.findByUser({ userId: user.id });
      const firstName = this.firstName().trim();
      const lastName = this.lastName().trim();
      const payload: ApiBody<'consultant', 'update'> = this.consultantProfilePayload();

      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;
      if (firstName || lastName) {
        payload.fullName = `${firstName} ${lastName}`.trim();
      }

      if (Object.keys(payload).length > 0) {
        await this.api.consultant.update({ id: response.data.id }, payload);
      }
    }
  }

  private consultantProfilePayload(): ConsultantCvPayload {
    const profile = this.consultantProfile();
    return {
      headline: profile?.headline || undefined,
      location: profile?.location || undefined,
      workModality: profile?.workModality || undefined,
      bio: profile?.bio || undefined,
      ownerPhone: profile?.ownerPhone || undefined,
      linkedinUrl: profile?.linkedinUrl || undefined,
      specialties: profile?.specialties ?? [],
      sectors: profile?.sectors ?? [],
      industries: profile?.industries ?? [],
      companyTypes: profile?.companyTypes ?? [],
      services: profile?.services ?? [],
      yearsExperience: profile?.yearsExperience ?? 0,
      education: profile?.education ?? [],
      certifications: profile?.certifications ?? [],
      workedSectors: profile?.workedSectors ?? [],
      caseStudies: profile?.caseStudies ?? [],
      cvText: this.cvText() || undefined,
      cvUrl: this.cvUrl() || undefined,
    };
  }

  private prefillConsultantFromProfile(profile: ConsultantCvProfile): void {
    if (!this.firstName().trim() && profile.firstName) this.firstName.set(profile.firstName);
    if (!this.lastName().trim() && profile.lastName) this.lastName.set(profile.lastName);
    if (!this.ownerPhone().trim() && profile.ownerPhone) this.ownerPhone.set(profile.ownerPhone);
  }

  private async extractPdfText(file: File): Promise<string> {
    const pdfjs = (await import('pdfjs-dist')) as unknown as PdfJsModule;
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString();

    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => (this.isPdfTextItem(item) ? item.str : ''))
        .filter(Boolean)
        .join(' ');
      pages.push(pageText);
    }

    return pages.join('\n').trim();
  }

  private isPdfTextItem(value: unknown): value is PdfTextItem {
    if (!value || typeof value !== 'object') return false;
    return typeof (value as { str?: unknown }).str === 'string';
  }

  private getFile(event: Event): File | null {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return null;
    return target.files?.[0] ?? null;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) return error.message;
    if (!error || typeof error !== 'object') return fallback;

    const candidate = error as { error?: { message?: string | string[] }; message?: string };
    const message = candidate.error?.message ?? candidate.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    return message || fallback;
  }
}
