import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '@service/alert.service';
import { AlertButton } from '@interface/alert.interface';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  alertService = inject(AlertService);

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-solid fa-circle-check';
      case 'error':
        return 'fa-solid fa-circle-xmark';
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      case 'info':
        return 'fa-solid fa-circle-info';
      case 'delete':
        return 'fa-solid fa-trash-can';
      default:
        return 'fa-solid fa-circle-info';
    }
  }

  getStyles(type: string) {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-success/10',
          icon: 'text-success',
        };
      case 'error':
        return {
          iconBg: 'bg-danger/10',
          icon: 'text-danger',
        };
      case 'warning':
        return {
          iconBg: 'bg-warning/10',
          icon: 'text-warning',
        };
      case 'info':
        return {
          iconBg: 'bg-info/10',
          icon: 'text-info',
        };
      case 'delete':
        return {
          iconBg: 'bg-danger/10',
          icon: 'text-danger',
        };
      default:
        return {
          iconBg: 'bg-text/10',
          icon: 'text-text/60',
        };
    }
  }

  getButtonStyles(style: string): string {
    switch (style) {
      case 'primary':
        return 'bg-secondary text-background hover:bg-secondary/90';
      case 'secondary':
        return 'bg-text/10 text-text hover:bg-text/20';
      case 'danger':
        return 'bg-danger text-background hover:bg-danger/90';
      case 'success':
        return 'bg-success text-background hover:bg-success/90';
      default:
        return 'bg-text/10 text-text hover:bg-text/20';
    }
  }

  handleButtonClick(button: AlertButton) {
    button.action();
  }

  closeAlert() {
    this.alertService.close();
  }
}
