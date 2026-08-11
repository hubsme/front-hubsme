import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@module/admin/components/pagination/pagination';
import { buildPath, PATH } from '@route/path.route';
import { ServiceRequestResultDto } from 'api/backend.api';
import { PymeServicesStore } from '../../services.store';

type ServiceStatus = ServiceRequestResultDto['status'];

@Component({
  selector: 'app-pyme-service-list',
  imports: [DatePipe, PaginationComponent, RouterLink],
  templateUrl: './service-list.html',
})
export class PymeServiceList {
  readonly store = inject(PymeServicesStore);
  readonly PATH = PATH;
  readonly buildPath = buildPath;

  statusLabel(status: ServiceStatus): string {
    const labels: Record<ServiceStatus, string> = {
      requested: 'Esperando respuesta',
      proposal_sent: 'Cotización recibida',
      consultant_declined: 'No aceptada por consultor',
      payment_pending: 'Pago pendiente',
      paid: 'Servicio activo',
      completed: 'Completada',
      pyme_declined: 'No aceptada por mi empresa',
      cancelled: 'Cancelada',
    };
    return labels[status];
  }

  statusClass(status: ServiceStatus): string {
    const classes: Record<ServiceStatus, string> = {
      requested: 'bg-info/10 text-info',
      proposal_sent: 'bg-secondary/10 text-secondary',
      consultant_declined: 'bg-danger/10 text-danger',
      payment_pending: 'bg-warning/15 text-warning',
      paid: 'bg-success/10 text-success',
      completed: 'bg-secondary/10 text-secondary',
      pyme_declined: 'bg-danger/10 text-danger',
      cancelled: 'bg-text/10 text-muted',
    };
    return classes[status];
  }

  formatMoney(value: string | null | undefined, currency = 'PEN'): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(
      Number(value ?? 0),
    );
  }
}
