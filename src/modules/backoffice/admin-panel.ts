import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { buildPath, PATH } from '@route/path.route';
import { AdminSessionService } from '@service/admin-session.service';

@Component({
  selector: 'app-admin-panel',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './admin-panel.html',
})
export class AdminPanel {
  private readonly adminSession = inject(AdminSessionService);
  private readonly router = inject(Router);

  readonly promotionCodesPath = buildPath(PATH.backoffice.promotionCodes);
  readonly username =
    this.adminSession.session()?.user.username ?? 'Administrador';

  async logout() {
    this.adminSession.removeSession();
    await this.router.navigate([buildPath(PATH.backoffice.login)]);
  }
}
