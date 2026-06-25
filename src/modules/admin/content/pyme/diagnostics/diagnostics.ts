import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-diagnostics',
  imports: [CommonModule, RouterLink],
  templateUrl: './diagnostics.html',
})
export class Diagnostics implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  diagnostics = signal<ApiResponse<'diagnostic', 'findAll'>['data']>([]);
  loading = signal(false);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listDiagnostics()
      .then((res) => this.diagnostics.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  takeTest() {
    this.router.navigate([buildPath(PATH.diagnostic)]);
  }
}
