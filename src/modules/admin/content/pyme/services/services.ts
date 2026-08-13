import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PymeRequestService } from './components/request-service/request-service';
import { PymeServiceFilters } from './layout/service-filters/service-filters';
import { PymeServiceList } from './layout/service-list/service-list';
import { PymeServicesStore } from './services.store';

@Component({
  selector: 'app-pyme-services',
  imports: [PymeRequestService, PymeServiceFilters, PymeServiceList],
  providers: [PymeServicesStore],
  templateUrl: './services.html',
})
export class PymeServices implements OnInit {
  readonly store = inject(PymeServicesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit() {
    const sourceMeetingId = Number(this.route.snapshot.queryParamMap.get('createFromMeeting'));
    if (!Number.isInteger(sourceMeetingId) || sourceMeetingId <= 0) return;

    void this.store.openCreateFromMeeting(sourceMeetingId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { createFromMeeting: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
