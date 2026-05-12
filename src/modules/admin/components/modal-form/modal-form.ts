import { Component, input, output, signal, effect } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-form',
  imports: [NgClass],
  templateUrl: './modal-form.html',
  styleUrl: './modal-form.css',
})
export class ModalForm {
  // Inputs
  title = input.required<string>();
  submitText = input<string>('Guardar');
  cancelText = input<string>('Cancelar');
  loading = input<boolean>(false);
  maxWidth = input<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>('md');

  // Outputs
  onSubmit = output<void>();
  onClose = output<void>();

  // Internal state for submission
  isSubmitting = signal<boolean>(false);
  private previousLoading = false;
  private resetTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Detectar cuando loading cambia de true a false
    effect(() => {
      const currentLoading = this.loading();

      if (this.previousLoading && !currentLoading && this.isSubmitting()) {
        // Si loading pasó de true a false, esperar 1 segundo extra
        if (this.resetTimeout) {
          clearTimeout(this.resetTimeout);
        }
        this.resetTimeout = setTimeout(() => {
          this.isSubmitting.set(false);
        }, 1000);
      }

      this.previousLoading = currentLoading;
    });
  }

  handleSubmit() {
    if (this.isSubmitting() || this.loading()) {
      return; // Evitar múltiples clicks
    }
    this.isSubmitting.set(true);
    this.onSubmit.emit();

    // Timeout de seguridad: si después de 5 segundos no hubo respuesta, resetear
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    this.resetTimeout = setTimeout(() => {
      this.isSubmitting.set(false);
    }, 5000);
  }

  handleClose() {
    this.onClose.emit();
  }

  getMaxWidthClass(): string {
    const widthMap = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl'
    };
    return widthMap[this.maxWidth()];
  }
}
