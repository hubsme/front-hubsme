import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(ToastService);

  getOverlayClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-success/10';
      case 'error':
        return 'bg-danger/10';
      case 'warning':
        return 'bg-warning/10';
      case 'info':
        return 'bg-info/10';
      default:
        return 'bg-text/5';
    }
  }

  getIconBgClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-success/15';
      case 'error':
        return 'bg-danger/15';
      case 'warning':
        return 'bg-warning/15';
      case 'info':
        return 'bg-info/15';
      default:
        return 'bg-text/10';
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-check text-success';
      case 'error':
        return 'fa-xmark text-danger';
      case 'warning':
        return 'fa-exclamation text-warning';
      case 'info':
        return 'fa-info text-info';
      default:
        return 'fa-bell text-text/60';
    }
  }

  getTitleClass(type: string): string {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-danger';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-text';
    }
  }

  getTitle(type: string): string {
    switch (type) {
      case 'success':
        return '¡Éxito!';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return 'Notificación';
    }
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }
}
