import { afterNextRender, Component, contentChildren, ElementRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';
import { RegistrationClause } from './registration-clause';

@Component({
  selector: 'app-registration-document',
  imports: [RouterLink],
  templateUrl: './registration-document.html',
})
export class RegistrationDocument {
  private readonly clauses = contentChildren(RegistrationClause);
  readonly homePath = ['/', buildPath(PATH.home)];

  constructor() {
    const route = inject(ActivatedRoute);
    const host = inject(ElementRef<HTMLElement>).nativeElement;
    afterNextRender(() => {
      const fragment = route.snapshot.fragment;
      if (!fragment || !this.clauses().some((clause) => clause.fragment() === fragment)) return;

      const document = host.ownerDocument;
      const target = document.getElementById(fragment);
      void document.fonts.ready.then(() => {
        if (host.isConnected && document.defaultView?.location.hash === `#${fragment}`) {
          target?.scrollIntoView();
        }
      });
    });
  }
}
