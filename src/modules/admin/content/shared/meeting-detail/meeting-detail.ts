import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ConsultantService } from '@service/admin/consultant.service';
import { PymeService } from '@service/admin/pyme.service';
import { PATH, buildPath } from '@route/path.route';

type Meeting = ApiResponse<'meeting', 'findOne'>;
type Consultant = ApiResponse<'consultant', 'findByUser'>;
type Pyme = ApiResponse<'pyme', 'findByUser'>;

@Component({
  selector: 'app-meeting-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './meeting-detail.html',
})
export class MeetingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private consultantService = inject(ConsultantService);
  private pymeService = inject(PymeService);

  meeting = signal<Meeting | null>(null);
  consultant = signal<Consultant | null>(null);
  pyme = signal<Pyme | null>(null);
  loading = signal(false);
  updatingStatus = signal(false);

  currentUserName = computed(() => {
    try {
      const user = this.hubsme.currentUser();
      return user?.name || 'Usuario Hubsme';
    } catch {
      return 'Usuario Hubsme';
    }
  });

  actaLink = computed(() => {
    const meeting = this.meeting();
    if (!meeting) return [];
    try {
      const role = this.hubsme.currentUser().role;
      return [role === 'consultor' ? buildPath(PATH.admin.consultor.documents) : buildPath(PATH.admin.pyme.documents), meeting.id];
    } catch {
      return [];
    }
  });

  canApprove = computed(() => {
    const meeting = this.meeting();
    if (!meeting) return false;

    const user = this.hubsme.currentUser();
    return meeting.status === 'solicitada' && meeting.requestedBy !== user.role;
  });

  consultantName = computed(() => {
    const meeting = this.meeting();
    return (
      this.consultant()?.fullName ||
      (meeting ? `Consultor ID ${meeting.consultantId}` : 'Consultor')
    );
  });

  pymeName = computed(() => {
    const meeting = this.meeting();
    return this.pyme()?.name || (meeting ? `PYME ID ${meeting.pymeId}` : 'PYME');
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.toastService.error('Reunion no encontrada');
      return;
    }

    this.loading.set(true);
    this.hubsme
      .getMeeting(id)
      .then((response) => {
        this.meeting.set(response.data);
        return this.loadProfiles(response.data);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  acceptMeeting() {
    const meeting = this.meeting();
    if (!meeting || !this.canApprove()) return;

    this.updatingStatus.set(true);
    this.hubsme
      .confirmMeeting(meeting.id)
      .then((response) => {
        this.meeting.set(response.data);
        this.toastService.success('Reunion aceptada');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.updatingStatus.set(false));
  }

  cancelMeeting() {
    const meeting = this.meeting();
    if (!meeting || meeting.status !== 'solicitada') return;

    this.updatingStatus.set(true);
    this.hubsme
      .updateMeeting(meeting.id, { status: 'cancelada' })
      .then((response) => {
        this.meeting.set(response.data);
        this.toastService.success('Reunion cancelada');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.updatingStatus.set(false));
  }

  private loadProfiles(meeting: Meeting) {
    return Promise.all([
      this.consultantService
        .findByUser(meeting.consultantId)
        .then((consultant) => this.consultant.set(consultant))
        .catch(() => this.consultant.set(null)),
      this.pymeService
        .findByUser(meeting.pymeId)
        .then((pyme) => this.pyme.set(pyme))
        .catch(() => this.pyme.set(null)),
    ]);
  }

  meetingDate(value: string) {
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  meetingTime(value: string) {
    return new Date(value).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  shortDate(value: string) {
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  statusClass(status: Meeting['status']) {
    if (status === 'solicitada') return 'bg-warning/10 text-warning';
    if (status === 'cancelada') return 'bg-danger/10 text-danger';
    if (status === 'finalizada') return 'bg-text/5 text-text';
    return 'bg-success/10 text-success';
  }

  requestedByLabel(value: Meeting['requestedBy']) {
    return value === 'pyme' ? 'PYME' : 'Consultor';
  }

  meetingModeLabel(meetingUrl: string | null) {
    return meetingUrl ? 'Teams' : 'Virtual';
  }

  copyToClipboard(url: string) {
    navigator.clipboard
      .writeText(url)
      .then(() => this.toastService.success('Enlace copiado al portapapeles'))
      .catch(() => this.toastService.error('No se pudo copiar el enlace'));
  }
}
