import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-diagnostics',
  imports: [RouterLink],
  templateUrl: './diagnostics.html',
})
export class Diagnostics {
  private router = inject(Router);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  takeTest() {
    this.router.navigate([buildPath(PATH.diagnostic)]);
  }
}
