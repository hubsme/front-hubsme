import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { SessionService } from '@service/session.service';
import { ToastService } from '@service/toast.service';
import { formatInPeru } from '@function/date.function';

type TeamResult = ApiResponse<'pyme', 'team'>;
type TeamMember = TeamResult['members'][number];
type TeamInvitation = TeamResult['pendingInvitations'][number];

@Component({
  selector: 'app-pyme-team',
  imports: [CommonModule, FormsModule],
  templateUrl: './team.html',
})
export class Team implements OnInit {
  private readonly api = inject(Api);
  private readonly hubsme = inject(HubsmeService);
  private readonly sessionService = inject(SessionService);
  private readonly toastService = inject(ToastService);

  readonly loading = signal(false);
  readonly inviting = signal(false);
  readonly processingKey = signal<string | null>(null);
  readonly email = signal('');
  readonly members = signal<TeamMember[]>([]);
  readonly pendingInvitations = signal<TeamInvitation[]>([]);
  readonly organizationName = computed(
    () => this.sessionService.session()?.organization?.name ?? 'Mi empresa',
  );
  readonly isOwner = computed(
    () => this.sessionService.session()?.organization?.membershipRole === 'owner',
  );

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await this.api.pyme.team();
      this.members.set(response.data.members);
      this.pendingInvitations.set(response.data.pendingInvitations);
    } catch (error: unknown) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  async invite(): Promise<void> {
    const email = this.email().trim().toLowerCase();
    if (!email) {
      this.toastService.error('Ingresa el correo de la persona que deseas invitar');
      return;
    }

    this.inviting.set(true);
    try {
      await this.api.pyme.createInvitation({ email });
      this.email.set('');
      this.toastService.success('Invitación enviada');
      await this.load();
    } catch (error: unknown) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.inviting.set(false);
    }
  }

  async revoke(invitation: TeamInvitation): Promise<void> {
    if (!confirm(`¿Revocar la invitación enviada a ${invitation.email}?`)) return;
    const key = `invitation:${invitation.id}`;
    this.processingKey.set(key);
    try {
      await this.api.pyme.revokeInvitation({ id: String(invitation.id) });
      this.toastService.success('Invitación revocada');
      await this.load();
    } catch (error: unknown) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.processingKey.set(null);
    }
  }

  async remove(member: TeamMember): Promise<void> {
    if (!confirm(`¿Quitar a ${member.name} de ${this.organizationName()}?`)) return;
    const key = `member:${member.userId}`;
    this.processingKey.set(key);
    try {
      await this.api.pyme.removeMember({ userId: String(member.userId) });
      this.toastService.success('Miembro retirado');
      await this.load();
    } catch (error: unknown) {
      this.toastService.error(this.hubsme.getErrorMessage(error));
    } finally {
      this.processingKey.set(null);
    }
  }

  joinedAt(value: string): string {
    return formatInPeru(value, { day: '2-digit', month: 'short', year: 'numeric' });
  }

  expiresAt(value: string): string {
    return formatInPeru(value, { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
