import {
  afterRenderEffect,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PymeServicesStore } from '../../../../services.store';

@Component({
  selector: 'app-service-request-chat-step',
  imports: [FormsModule],
  templateUrl: './chat-step.html',
})
export class ServiceRequestChatStep {
  private readonly chatScroll = viewChild<ElementRef<HTMLDivElement>>('chatScroll');
  private readonly chatTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('chatTextarea');
  readonly store = inject(PymeServicesStore);
  readonly summaryExpanded = signal(false);

  constructor() {
    effect(() => {
      this.store.chatInput();
      queueMicrotask(() => this.resizeTextarea());
    });

    afterRenderEffect(() => {
      const messageCount = this.store.chatMessages().length;
      const chatLoading = this.store.chatLoading();
      const chatComplete = this.store.chatComplete();
      const scrollContainer = this.chatScroll();

      if (!scrollContainer) return;

      scrollContainer.nativeElement.scrollTo({
        top: scrollContainer.nativeElement.scrollHeight,
        behavior: messageCount > 1 ? 'smooth' : 'auto',
      });

      if (!chatLoading && !chatComplete) {
        this.chatTextarea()?.nativeElement.focus({ preventScroll: true });
      }
    });
  }

  updateInput(value: string): void {
    this.store.chatInput.set(value);
  }

  toggleSummary(): void {
    this.summaryExpanded.update((expanded) => !expanded);
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
