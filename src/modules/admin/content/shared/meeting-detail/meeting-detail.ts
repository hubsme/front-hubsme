import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ConsultantService } from '@service/admin/consultant.service';
import { PymeService } from '@service/admin/pyme.service';
import { MeetingService } from '@service/admin/meeting.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PATH, buildPath } from '@route/path.route';
import { formatInPeru, parseApiDate } from '@function/date.function';

type Meeting = ApiResponse<'meeting', 'findOne'>;
type Consultant = ApiResponse<'consultant', 'findByUser'>;
type Pyme = ApiResponse<'pyme', 'findByUser'>;

@Component({
  selector: 'app-meeting-detail',
  imports: [CommonModule, FormsModule, ModalForm, RouterLink],
  templateUrl: './meeting-detail.html',
})
export class MeetingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private consultantService = inject(ConsultantService);
  private pymeService = inject(PymeService);
  private meetingService = inject(MeetingService);

  readonly PATH = PATH;
  readonly buildPath = buildPath;

  meeting = signal<Meeting | null>(null);
  consultant = signal<Consultant | null>(null);
  pyme = signal<Pyme | null>(null);
  loading = signal(false);
  updatingStatus = signal(false);
  showCancellationModal = signal(false);
  cancellationReason = signal('');
  cancelling = signal(false);
  selectedProposedStartTime = signal<string | null>(null);
  confirmingProposedTime = signal(false);

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
    return (
      meeting.status === 'solicitada' &&
      meeting.requestedBy === 'consultor' &&
      user.role === 'pyme'
    );
  });

  canJoin = computed(() => {
    const meeting = this.meeting();
    return Boolean(meeting && meeting.status === 'confirmada' && meeting.hasMeetingLink);
  });

  canConfirmProposedTime = computed(() => {
    const meeting = this.meeting();
    if (!meeting || meeting.status !== 'por_confirmar') return false;

    try {
      return this.hubsme.currentUser().role === 'consultor';
    } catch {
      return false;
    }
  });

  canCancelPaidMeeting() {
    const meeting = this.meeting();
    if (!meeting || this.hubsme.currentUser().role !== 'consultor') return false;
    if (!['por_confirmar', 'confirmada'].includes(meeting.status)) return false;

    const meetingStart = meeting.startTime ?? meeting.proposedStartTimes?.[0];
    if (!meetingStart) return false;

    const cancellationDeadline = parseApiDate(meetingStart).getTime() + 24 * 60 * 60 * 1000;
    return Date.now() <= cancellationDeadline;
  }

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

  selectProposedStartTime(startTime: string) {
    if (!this.canConfirmProposedTime() || this.confirmingProposedTime()) return;
    this.selectedProposedStartTime.set(startTime);
  }

  confirmProposedStartTime() {
    const meeting = this.meeting();
    const selectedStartTime = this.selectedProposedStartTime();
    if (!meeting || !this.canConfirmProposedTime()) return;
    if (!selectedStartTime) {
      this.toastService.warning('Selecciona uno de los horarios propuestos');
      return;
    }

    this.confirmingProposedTime.set(true);
    this.meetingService
      .confirmOption(meeting.id, { selectedStartTime })
      .then((updatedMeeting) => {
        this.meeting.set(updatedMeeting);
        this.selectedProposedStartTime.set(null);
        this.toastService.success('Horario confirmado y reunión creada correctamente');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.confirmingProposedTime.set(false));
  }

  openPaidCancellation() {
    if (!this.canCancelPaidMeeting()) return;
    this.cancellationReason.set('');
    this.showCancellationModal.set(true);
  }

  closePaidCancellation() {
    if (this.cancelling()) return;
    this.showCancellationModal.set(false);
    this.cancellationReason.set('');
  }

  cancelPaidMeeting() {
    const meeting = this.meeting();
    const reason = this.cancellationReason().trim();
    if (!meeting || !this.canCancelPaidMeeting()) return;
    if (reason.length < 10) {
      this.toastService.warning('Explica el motivo de la cancelación con al menos 10 caracteres');
      return;
    }
    if (reason.length > 500) {
      this.toastService.warning('El motivo no puede superar 500 caracteres');
      return;
    }

    this.cancelling.set(true);
    this.meetingService
      .cancelByConsultant(meeting.id, { reason })
      .then((result) => {
        this.meeting.set(result.meeting);
        this.showCancellationModal.set(false);
        this.cancellationReason.set('');
        this.toastService.success('Reunión cancelada. La PYME recibirá un cupón de reposición');
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.cancelling.set(false));
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

  meetingDisplayStart(meeting: Meeting) {
    const selectedOption = meeting.status === 'por_confirmar' ? this.selectedProposedStartTime() : null;
    return parseApiDate(meeting.startTime ?? selectedOption ?? meeting.proposedStartTimes?.[0] ?? meeting.createdAt);
  }

  proposedTimes(meeting: Meeting) {
    return (meeting.proposedStartTimes?.length ? meeting.proposedStartTimes : [meeting.startTime]).filter(
      (value): value is string => Boolean(value),
    );
  }

  meetingDate(value: string | Date) {
    return formatInPeru(value, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  meetingTime(value: string | Date) {
    return formatInPeru(value, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  shortDate(value: string) {
    return formatInPeru(value, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  statusClass(status: Meeting['status']) {
    if (status === 'solicitada') return 'bg-warning/10 text-warning';
    if (status === 'por_confirmar') return 'bg-warning/10 text-warning';
    if (status === 'cancelada') return 'bg-danger/10 text-danger';
    if (status === 'finalizada') return 'bg-text/5 text-text';
    return 'bg-success/10 text-success';
  }

  requestedByLabel(value: Meeting['requestedBy']) {
    return value === 'pyme' ? 'PYME' : 'Consultor';
  }

  meetingModeLabel(hasMeetingLink: boolean) {
    return hasMeetingLink ? 'Teams' : 'Virtual';
  }
}
