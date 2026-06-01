import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, signal, input } from '@angular/core';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

// React imports
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';

// Azure Communication Services imports
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallComposite, CallAdapter, createAzureCommunicationCallAdapter } from '@azure/communication-react';

import { TeamsCallService } from '../../services/teams-call.service';

@Component({
  selector: 'app-teams-meeting-room',
  imports: [CommonModule],
  templateUrl: './teams-meeting-room.html',
})
export class TeamsMeetingRoom implements OnInit, OnDestroy {
  private hubsme = inject(HubsmeService);
  private toast = inject(ToastService);
  public teamsCall = inject(TeamsCallService);

  @ViewChild('reactContainer', { static: true }) reactContainer!: ElementRef<HTMLDivElement>;

  loading = signal(true);
  private reactRoot?: Root;
  private callAdapter?: CallAdapter;

  ngOnInit() {
    this.initializeMeeting().catch((err) => {
      this.loading.set(false);
      this.toast.error('Ocurrió un error inesperado al conectar a la llamada.');
      console.error(err);
    });
  }

  async initializeMeeting() {
    this.loading.set(true);
    try {
      const meetingId = this.teamsCall.meetingId();
      const displayName = this.teamsCall.displayName() || 'Invitado Hubsme';

      if (!meetingId) {
        throw new Error('No se especificó un ID de reunión válido.');
      }

      // 1. Obtener el token temporal desde tu backend
      const res = await this.hubsme.createTeamsJoinToken(meetingId, {
        displayName,
      });

      const { acsUserId, token, meetingUrl } = res.data;

      // 2. Inicializar credenciales de Azure
      const credential = new AzureCommunicationTokenCredential(token);

      // 3. Crear el adaptador de llamadas
      this.callAdapter = await createAzureCommunicationCallAdapter({
        userId: { communicationUserId: acsUserId },
        displayName,
        credential,
        locator: { meetingLink: meetingUrl },
      });

      // 4. Montar el componente de React en el contenedor HTML
      const container = this.reactContainer.nativeElement;
      this.reactRoot = createRoot(container);

      const reactElement = React.createElement(CallComposite, {
        adapter: this.callAdapter,
      });

      this.reactRoot.render(reactElement);
      this.loading.set(false);
    } catch (error: any) {
      this.loading.set(false);
      this.toast.error(this.hubsme.getErrorMessage(error));
      console.error('ACS/Teams Initialization error:', error);
    }
  }

  ngOnDestroy() {
    // 5. Limpieza estricta de cámara, micrófonos y renderizador React
    if (this.callAdapter) {
      this.callAdapter.dispose();
    }
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }
}
