---
name: angular-components
description: ESPAÑOL - Guía para CREAR COMPONENTES UI REUSABLES.
  Usa esta skill cuando el usuario pida: crear componente visual, botón, alerta,
  modal, card, input custom, usar Signals en componentes, input.required,
  output(), o encapsular estilos con Tailwind.
---

# Angular Global Components

This skill demonstrates how to build reusable UI components (dumb/smart) that live in `src/components/`. We use the **Alert** component as the canonical example of a global overlay managed by a service.

## 1. Interface (`src/interfaces/alert.interface.ts`)

Define strong types for the component state.

```typescript
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'delete';

export interface AlertButton {
  text: string;
  style: 'primary' | 'secondary' | 'danger' | 'success';
  action: () => void;
}

export interface AlertMessage {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  buttons: AlertButton[];
}
```

## 2. Service (`src/services/alert.service.ts`)

Manage state using `signal`. This service allows any part of the app to trigger the alert.

```typescript
import { Injectable, signal } from '@angular/core';
import { AlertMessage, AlertType, AlertButton } from '@interface/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertIdCounter = 0;
  // Holds the current active alert (or null if closed)
  alert = signal<AlertMessage | null>(null);

  show(type: AlertType, title: string, message: string, buttons: AlertButton[]) {
    const id = this.alertIdCounter++;
    this.alert.set({ id, type, title, message, buttons });
  }

  // Helper methods for common types
  success(title: string, message: string, buttons: AlertButton[]) {
    this.show('success', title, message, buttons);
  }

  // ... (error, warning, info methods similar to success)

  delete(title: string, message: string, onConfirm: () => void, onCancel?: () => void) {
    // Pre-configured buttons for delete action
    this.show('delete', title, message, [
      {
        text: 'Cancelar',
        style: 'secondary',
        action: () => {
          this.close();
          onCancel?.();
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
    ]);
  }

  close() {
    this.alert.set(null);
  }
}
```

## 3. Component (`src/components/alert/`)

The UI implementation. It uses `CommonModule` and injects the service to read the signal.

**Logic: `alert.component.ts`**

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '@service/alert.service'; // Path Alias
import { AlertButton } from '@interface/alert.interface';

@Component({
  selector: 'app-alert',
  standalone: true, // Important for Angular 17+
  imports: [CommonModule],
  templateUrl: './alert.html', // External template
  // styleUrl: './alert.css' // Optional if using Tailwind classes directly
})
export class AlertComponent {
  alertService = inject(AlertService);

  // Computed styles based on type (Dry/Solid principles)
  getStyles(type: string) {
    // Returns Tailwind classes for colors/icons
    // e.g. success -> { iconBg: 'bg-success/10', icon: 'text-success' }
  }

  handleButtonClick(button: AlertButton) {
    button.action();
  }
}
```

**Template: `alert.html`**

```html
@if (alertService.alert(); as alert) {
<!-- Backdrop with animation -->
<div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in">
  <!-- Modal Container -->
  <div class="bg-background rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
    <!-- Content -->
    <div class="p-6 border-b border-text/10 flex items-start gap-4">
      <!-- Dynamic Icon & Colors from getStyles() -->
      <i class="{{ getIcon(alert.type) }} {{ getStyles(alert.type).icon }}"></i>

      <div>
        <h3 class="text-lg font-inter-bold text-text">{{ alert.title }}</h3>
        <p class="text-sm text-text/70">{{ alert.message }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="p-6 flex gap-3 justify-end">
      @for (button of alert.buttons; track $index) {
      <button (click)="handleButtonClick(button)" class="...tailwind classes...">
        {{ button.text }}
      </button>
      }
    </div>
  </div>
</div>
}
```

## 4. Unmount/Mount (`src/app/app.html`)

For global components like `Alert` or `Toast`, place them **once** in the root template. Do not repeat them in pages.

```html
<router-outlet></router-outlet>

<!-- Global Overlays -->
<app-alert></app-alert>
<app-toast></app-toast>
```
