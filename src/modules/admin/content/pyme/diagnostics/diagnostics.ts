import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.html',
})
export class Diagnostics {
  private router = inject(Router);

  takeTest() {
    this.router.navigate([buildPath(PATH.diagnostic)]);
  }
}
