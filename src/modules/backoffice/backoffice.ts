import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { buildPath, PATH } from '@route/path.route';
import { AdminSessionService } from '@service/admin-session.service';

@Component({
  selector: 'app-backoffice',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './backoffice.html',
})
export class Backoffice {
  private readonly adminSession = inject(AdminSessionService);
  private readonly router = inject(Router);

  readonly promotionCodesPath = `/${buildPath(PATH.backoffice.promotionCodes)}`;
  readonly pymesPath = `/${buildPath(PATH.backoffice.pymes)}`;
  readonly consultantsPath = `/${buildPath(PATH.backoffice.consultants)}`;
  readonly username = this.adminSession.session()?.user.username ?? 'Administrador';

  async logout() {
    this.adminSession.removeSession();
    await this.router.navigate([buildPath(PATH.auth.adminLogin)]);
  }
}
