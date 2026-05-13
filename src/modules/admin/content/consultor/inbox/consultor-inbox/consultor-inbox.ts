import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

type Match = ApiResponse<'pymeConsultantMatch', 'pymeconsultantmatchFindAll'>['data'][number];
type MatchMessage = ApiResponse<'pymeConsultantMessage', 'pymeconsultantmessageFindAll'>['data'][number];

@Component({
  selector: 'app-consultor-inbox',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultor-inbox.html',
})
export class ConsultorInbox implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  user = this.hubsme.currentUser();
  matches = signal<Match[]>([]);
  messages = signal<MatchMessage[]>([]);
  selectedMatch = signal<Match | null>(null);
  messageText = signal('');
  loading = signal(false);
  loadingMessages = signal(false);
  sending = signal(false);

  conversations = computed(() => this.matches().filter((match) => match.status === 'aceptado'));

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listMatches(1, 100, 'aceptado')
      .then((res) => {
        this.matches.set(res.data.data);
        const current = this.selectedMatch();
        const nextMatch = current ? res.data.data.find((match) => match.id === current.id) : res.data.data[0];
        this.selectedMatch.set(nextMatch ?? null);
        if (nextMatch) this.loadMessages(nextMatch.id);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  selectMatch(match: Match) {
    this.selectedMatch.set(match);
    this.loadMessages(match.id);
  }

  loadMessages(matchId: number) {
    this.loadingMessages.set(true);
    this.hubsme
      .listMatchMessages(matchId)
      .then((res) => this.messages.set(res.data.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loadingMessages.set(false));
  }

  sendMessage() {
    const match = this.selectedMatch();
    const message = this.messageText().trim();
    if (!match || !message) return;

    this.sending.set(true);
    this.hubsme
      .sendMatchMessage(match.id, message)
      .then(() => {
        this.messageText.set('');
        this.loadMessages(match.id);
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.sending.set(false));
  }

  partnerName(match: Match): string {
    return match.pymeName ?? 'PYME';
  }
}
