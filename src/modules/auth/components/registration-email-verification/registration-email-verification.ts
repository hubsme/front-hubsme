import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { HubsmeService } from '@service/hubsme.service';
import { Api } from 'api/backend.api';

@Component({
  selector: 'app-registration-email-verification',
  templateUrl: './registration-email-verification.html',
})
export class RegistrationEmailVerification {
  private readonly api = inject(Api);
  private readonly hubsme = inject(HubsmeService);
  readonly email = input.required<string>();
  readonly code = model('');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly sentTo = signal('');
  readonly normalizedEmail = computed(() => this.email().trim().toLowerCase());
  readonly canSend = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.normalizedEmail()));
  readonly codeRequested = computed(() => Boolean(this.sentTo()) && this.sentTo() === this.normalizedEmail());

  constructor() {
    effect(() => {
      this.normalizedEmail();
      this.code.set('');
      this.error.set('');
    });
  }

  async send() {
    if (!this.canSend() || this.busy()) return;
    const email = this.normalizedEmail();
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.auth.registrationEmailCode({ email });
      if (this.normalizedEmail() === email) {
        this.sentTo.set(email);
        this.code.set('');
      }
    } catch (error) {
      if (this.normalizedEmail() === email) this.error.set(this.hubsme.getErrorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  updateCode(input: HTMLInputElement) {
    const code = input.value.replace(/\D/g, '').slice(0, 8);
    input.value = code;
    this.code.set(code);
  }
}
