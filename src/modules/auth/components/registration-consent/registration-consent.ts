import { Component, effect, inject, input, model, signal } from '@angular/core';
import { Api, ApiResponse } from 'api/backend.api';

@Component({
  selector: 'app-registration-consent',
  templateUrl: './registration-consent.html',
})
export class RegistrationConsent {
  private readonly api = inject(Api);
  private readonly requestRevision = signal(0);
  readonly role = input.required<'pyme' | 'consultor'>();
  readonly acceptedVersion = model<string | null>(null);
  readonly marketingConsent = model(false);
  readonly documents = signal<ApiResponse<'auth', 'registrationDocuments'> | null>(null);
  readonly failed = signal(false);

  constructor() {
    effect((onCleanup) => {
      const role = this.role();
      this.requestRevision();
      this.documents.set(null);
      this.failed.set(false);
      let active = true;
      onCleanup(() => { active = false; });
      void this.api.auth.registrationDocuments({ role }).then(({ data }) => {
        if (!active) return;
        if (this.acceptedVersion() !== data.version) this.acceptedVersion.set(null);
        this.documents.set(data);
      }).catch(() => {
        if (active) this.failed.set(true);
      });
    });
  }

  retry() {
    this.requestRevision.update((revision) => revision + 1);
  }
}
