import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SERVICE_REQUEST_CATEGORY_OPTIONS,
  ServiceRequestCategory,
} from '@enum/service-request-category.enum';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ConsultantServiceOfferService } from '@service/admin/consultant-service-offer.service';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ConsultantServiceOfferCreateDto, ConsultantServiceOfferResultDto } from 'api/backend.api';

@Component({
  selector: 'app-consultant-service-offer-form',
  imports: [FormsModule, ModalForm],
  templateUrl: './service-offer-form.html',
})
export class ConsultantServiceOfferForm implements OnInit {
  private readonly offerService = inject(ConsultantServiceOfferService);
  private readonly hubsme = inject(HubsmeService);
  private readonly toastService = inject(ToastService);

  readonly offer = input<ConsultantServiceOfferResultDto | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();
  readonly categoryOptions = SERVICE_REQUEST_CATEGORY_OPTIONS;
  readonly title = signal('');
  readonly category = signal<ServiceRequestCategory | ''>('');
  readonly subcategory = signal('');
  readonly description = signal('');
  readonly expectedOutcome = signal('');
  readonly requirements = signal('');
  readonly deliverablesText = signal('');
  readonly exclusions = signal('');
  readonly estimatedDurationDays = signal('30');
  readonly workMethod = signal('Coordinación remota y seguimiento por los canales acordados.');
  readonly price = signal('');
  readonly pricePeriod = signal<ConsultantServiceOfferCreateDto['pricePeriod']>('one_time');
  readonly saving = signal(false);
  readonly validationMessages = computed(() => {
    const messages: string[] = [];
    const titleLength = this.title().trim().length;
    const descriptionLength = this.description().trim().length;
    const expectedOutcomeLength = this.expectedOutcome().trim().length;
    const requirementsLength = this.requirements().trim().length;
    const deliverables = this.deliverables();
    const duration = Number(this.estimatedDurationDays());
    const price = Number(this.price());

    if (titleLength < 3) messages.push(`Título: mínimo 3 caracteres (actual ${titleLength})`);
    if (!this.category()) messages.push('Selecciona una categoría');
    if (!this.subcategory()) messages.push('Selecciona una subcategoría');
    if (descriptionLength < 10) {
      messages.push(`Descripción: mínimo 10 caracteres (actual ${descriptionLength})`);
    }
    if (expectedOutcomeLength < 10) {
      messages.push(`Resultado esperado: mínimo 10 caracteres (actual ${expectedOutcomeLength})`);
    }
    if (requirementsLength < 5) {
      messages.push(`Requisitos para iniciar: mínimo 5 caracteres (actual ${requirementsLength})`);
    }
    if (!deliverables.length) messages.push('Agrega al menos un entregable');
    else if (deliverables.some((item) => item.length < 3)) {
      messages.push('Cada entregable debe tener al menos 3 caracteres');
    }
    if (!Number.isInteger(duration) || duration < 1 || duration > 365) {
      messages.push('La duración debe estar entre 1 y 365 días');
    }
    if (this.workMethod().trim().length < 5) {
      messages.push('Forma de trabajo: mínimo 5 caracteres');
    }
    if (!Number.isFinite(price) || price <= 0) messages.push('Ingresa un precio mayor a 0');

    return messages;
  });
  readonly showValidation = computed(
    () =>
      Boolean(this.title().trim()) ||
      Boolean(this.category()) ||
      Boolean(this.subcategory()) ||
      Boolean(this.description().trim()) ||
      Boolean(this.expectedOutcome().trim()) ||
      Boolean(this.requirements().trim()) ||
      Boolean(this.deliverablesText().trim()) ||
      Boolean(this.price().trim()),
  );
  readonly subcategoryOptions = computed(
    () =>
      this.categoryOptions.find((item) => item.category === this.category())?.subcategories ?? [],
  );
  readonly canSave = computed(() => {
    const deliverables = this.deliverables();
    const duration = Number(this.estimatedDurationDays());
    const price = Number(this.price());
    return (
      this.title().trim().length >= 3 &&
      Boolean(this.category()) &&
      Boolean(this.subcategory()) &&
      this.description().trim().length >= 10 &&
      this.expectedOutcome().trim().length >= 10 &&
      this.requirements().trim().length >= 5 &&
      deliverables.length > 0 &&
      deliverables.length <= 20 &&
      deliverables.every((item) => item.length >= 3) &&
      Number.isInteger(duration) &&
      duration >= 1 &&
      duration <= 365 &&
      this.workMethod().trim().length >= 5 &&
      Number.isFinite(price) &&
      price > 0
    );
  });

  ngOnInit(): void {
    const offer = this.offer();
    if (!offer) return;
    this.title.set(offer.title);
    this.category.set(offer.category);
    this.subcategory.set(offer.subcategory);
    this.description.set(offer.description);
    this.expectedOutcome.set(offer.expectedOutcome);
    this.requirements.set(offer.requirements);
    this.deliverablesText.set(offer.deliverables.join('\n'));
    this.exclusions.set(offer.exclusions ?? '');
    this.estimatedDurationDays.set(String(offer.estimatedDurationDays));
    this.workMethod.set(offer.workMethod);
    this.price.set(offer.price);
    this.pricePeriod.set(offer.pricePeriod);
  }

  changeCategory(value: string): void {
    const category = this.categoryOptions.find((item) => item.category === value)?.category ?? '';
    this.category.set(category);
    if (!this.subcategoryOptions().includes(this.subcategory())) this.subcategory.set('');
  }

  async submit(): Promise<void> {
    if (!this.canSave() || this.saving()) {
      this.toastService.warning('Completa todos los campos obligatorios de la publicación');
      return;
    }
    const category = this.category();
    if (!category) return;

    const payload: ConsultantServiceOfferCreateDto = {
      title: this.title().trim(),
      category,
      subcategory: this.subcategory().trim(),
      description: this.description().trim(),
      expectedOutcome: this.expectedOutcome().trim(),
      requirements: this.requirements().trim(),
      deliverables: this.deliverables(),
      exclusions: this.exclusions().trim() || undefined,
      estimatedDurationDays: Number(this.estimatedDurationDays()),
      workModality: 'remote',
      workMethod: this.workMethod().trim(),
      price: Number(this.price()),
      pricePeriod: this.pricePeriod(),
    };

    this.saving.set(true);
    try {
      const offer = this.offer();
      if (offer) await this.offerService.update(offer.id, payload);
      else await this.offerService.create(payload);
      this.toastService.success(offer ? 'Servicio actualizado' : 'Servicio publicado');
      this.saved.emit();
    } catch (error) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  private deliverables(): string[] {
    return [
      ...new Set(
        this.deliverablesText()
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
  }
}
