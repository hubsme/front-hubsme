import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PymeServicesStore } from '../../../../services.store';

@Component({
  selector: 'app-service-request-chat-step',
  imports: [FormsModule],
  templateUrl: './chat-step.html',
})
export class ServiceRequestChatStep {
  private readonly chatTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('chatTextarea');
  readonly store = inject(PymeServicesStore);

  constructor() {
    effect(() => {
      this.store.chatInput();
      queueMicrotask(() => this.resizeTextarea());
    });
  }

  updateInput(value: string): void {
    this.store.chatInput.set(value);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    if (this.canSend()) void this.store.sendChatMessage();
  }

  canSend(): boolean {
    return (
      this.store.chatInput().trim().length >= 2 &&
      !this.store.chatLoading() &&
      !this.store.chatComplete()
    );
  }

  private resizeTextarea(): void {
    const textarea = this.chatTextarea()?.nativeElement;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }
}
