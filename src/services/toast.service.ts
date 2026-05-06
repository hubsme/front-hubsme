import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastType } from '@interface/toast.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastIdCounter = 0;
  toasts = signal<ToastMessage[]>([]);

  show(type: ToastType, message: string, duration: number = 3000) {
    const id = this.toastIdCounter++;
    const toast: ToastMessage = { id, type, message, duration };

    this.toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration?: number) {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.show('error', message, duration);
  }

  warning(message: string, duration?: number) {
    this.show('warning', message, duration);
  }

  info(message: string, duration?: number) {
    this.show('info', message, duration);
  }

  remove(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
