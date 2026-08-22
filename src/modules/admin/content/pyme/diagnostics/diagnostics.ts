import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';
import { HubsmeService } from '@service/hubsme.service';

@Component({
  selector: 'app-diagnostics',
  imports: [RouterLink],
  templateUrl: './diagnostics.html',
})
export class Diagnostics {
  private router = inject(Router);
  private hubsme = inject(HubsmeService);
  readonly canManage = computed(() => this.hubsme.canManageOrganization());
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  takeTest() {
    if (!this.canManage()) return;
    this.router.navigate([buildPath(PATH.diagnostic)]);
  }
}
