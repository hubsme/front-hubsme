import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PymeRequestService } from './components/request-service/request-service';
import { PymeServiceFilters } from './layout/service-filters/service-filters';
import { PymeServiceList } from './layout/service-list/service-list';
import { PymeServiceCatalog } from './layout/service-catalog/service-catalog';
import { PymeServicesStore } from './services.store';

@Component({
  selector: 'app-pyme-services',
  imports: [PymeRequestService, PymeServiceFilters, PymeServiceList, PymeServiceCatalog],
  providers: [PymeServicesStore],
  templateUrl: './services.html',
})
export class PymeServices implements OnInit {
  readonly store = inject(PymeServicesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit() {
    const sourceTaskId = Number(this.route.snapshot.queryParamMap.get('createFromTask'));
    if (!Number.isInteger(sourceTaskId) || sourceTaskId <= 0) return;

    void this.store.openCreateFromTask(sourceTaskId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { createFromTask: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
