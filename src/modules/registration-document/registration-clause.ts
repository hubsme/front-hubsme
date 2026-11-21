import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'section[appRegistrationClause]',
  host: {
    '[attr.id]': 'fragment()',
    class: 'min-w-0 scroll-mt-6 rounded-2xl border border-border bg-surface p-5 sm:p-6',
  },
  template: `
    <h2 class="font-anton text-xl leading-snug text-text uppercase sm:text-2xl">
      @if (number(); as ordinal) {
        {{ ordinal }}.
      }
      {{ heading() }}
    </h2>
    <div class="mt-3 space-y-3 text-sm leading-7 text-text-600 [&_strong]:text-text">
      <ng-content />
    </div>
  `,
})
export class RegistrationClause {
  readonly heading = input.required<string>({ alias: 'appRegistrationClause' });
  readonly number = input<number>();
  readonly fragment = computed(() => (this.number() ? `clausula-${this.number()}` : 'anexo'));
}
