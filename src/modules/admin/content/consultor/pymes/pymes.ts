import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type Pyme = ApiResponse<'pyme', 'findAll'>['data'][number];

@Component({
  selector: 'app-pymes',
  imports: [CommonModule, FormsModule],
  templateUrl: './pymes.html',
})
export class Pymes implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  pymes = signal<Pyme[]>([]);
  search = signal('');
  loading = signal(false);

  visiblePymes = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return this.pymes();
    return this.pymes().filter((pyme) =>
      [pyme.name, pyme.sector, pyme.ownerFirstName, pyme.ownerLastName, pyme.ownerEmail].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listPymes('', 1, 100)
      .then((res) => this.pymes.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  businessDescription(pyme: Pyme) {
    const owner = [pyme.ownerFirstName, pyme.ownerLastName].filter(Boolean).join(' ').trim();
    return owner ? `Contacto principal: ${owner}.` : 'Esta empresa aun no registro un contacto principal.';
  }

  businessSector(pyme: Pyme) {
    return pyme.sector?.trim() || 'Sector no registrado';
  }

  employeesLabel(pyme: Pyme) {
    return pyme.numEmployees ? `${pyme.numEmployees} empleados` : 'Empleados no registrados';
  }

  ownerLabel(pyme: Pyme) {
    return pyme.ownerEmail?.trim() || 'Correo no registrado';
  }

  initials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
}
