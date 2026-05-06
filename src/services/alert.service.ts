import { Injectable, signal } from '@angular/core';
import { AlertMessage, AlertType, AlertButton } from '@interface/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertIdCounter = 0;
  alert = signal<AlertMessage | null>(null);

  show(type: AlertType, title: string, message: string, buttons: AlertButton[]) {
    const id = this.alertIdCounter++;
    const alert: AlertMessage = { id, type, title, message, buttons };
    this.alert.set(alert);
  }

  success(title: string, message: string, buttons: AlertButton[]) {
    this.show('success', title, message, buttons);
  }

  error(title: string, message: string, buttons: AlertButton[]) {
    this.show('error', title, message, buttons);
  }

  warning(title: string, message: string, buttons: AlertButton[]) {
    this.show('warning', title, message, buttons);
  }

  info(title: string, message: string, buttons: AlertButton[]) {
    this.show('info', title, message, buttons);
  }

  delete(title: string, message: string, onConfirm: () => void, onCancel?: () => void) {
    const buttons: AlertButton[] = [
      {
        text: 'Cancelar',
        style: 'secondary',
        action: () => {
          this.close();
          if (onCancel) onCancel();
        },
      },
      {
        text: 'Eliminar',
        style: 'danger',
        action: () => {
          this.close();
          onConfirm();
        },
      },
    ];
    this.show('delete', title, message, buttons);
  }

  confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void) {
    const buttons: AlertButton[] = [
      {
        text: 'Cancelar',
        style: 'secondary',
        action: () => {
          this.close();
          if (onCancel) onCancel();
        },
      },
      {
        text: 'Confirmar',
        style: 'primary',
        action: () => {
          this.close();
          onConfirm();
        },
      },
    ];
    this.show('warning', title, message, buttons);
  }

  close() {
    this.alert.set(null);
  }
}
