import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatInPeru } from '@function/date.function';

export type TaskPriorityFilter = 'all' | 'alta' | 'media' | 'baja';
export type TaskAssigneeFilter = 'all' | 'pyme' | 'consultor';
export type TaskMeetingFilter = 'all' | 'manual' | number;

export type TaskMeetingOption = {
  id: number;
  title: string | null;
  startTime: string | null;
};

@Component({
  selector: 'app-task-board-filters',
  imports: [FormsModule],
  templateUrl: './task-board-filters.html',
})
export class TaskBoardFilters {
  readonly priority = input.required<TaskPriorityFilter>();
  readonly assignee = input.required<TaskAssigneeFilter>();
  readonly meeting = input.required<TaskMeetingFilter>();
  readonly meetings = input.required<readonly TaskMeetingOption[]>();

  readonly priorityChange = output<TaskPriorityFilter>();
  readonly assigneeChange = output<TaskAssigneeFilter>();
  readonly meetingChange = output<TaskMeetingFilter>();
  readonly open = signal(false);
  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.priority() !== 'all') count += 1;
    if (this.assignee() !== 'all') count += 1;
    if (this.meeting() !== 'all') count += 1;
    return count;
  });

  toggle(): void {
    this.open.update((current) => !current);
  }

  close(): void {
    this.open.set(false);
  }

  meetingLabel(option: TaskMeetingOption): string {
    if (!option.startTime) return option.title || 'Reunión sin fecha programada';

    const date = formatInPeru(option.startTime, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return option.title ? `${date} · ${option.title}` : date;
  }
}
