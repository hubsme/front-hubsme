import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import Sortable from 'sortablejs';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PymeService } from '@service/admin/pyme.service';
import {
  ConsultantInputSearch,
  ConsultantInputSearchFilters,
} from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';
import {
  TaskAssigneeFilter,
  TaskBoardFilters,
  TaskMeetingFilter,
  TaskMeetingOption,
  TaskPriorityFilter,
} from '@module/admin/content/shared/task-board-filters/task-board-filters';
import { dateKeyInPeru, formatInPeru, peruDateOnlyToUtc } from '@function/date.function';

type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada';
type TaskPriority = 'alta' | 'media' | 'baja';
type TaskAssignee = 'pyme' | 'consultor';

type TaskForm = {
  pymeId: number;
  consultantId: number;
  title: string;
  description: string;
  assignedTo: TaskAssignee;
  priority: TaskPriority;
  dueDate: string;
};

type ConsultantOption = ApiResponse<'pyme', 'meetingConsultants'>['data'][number];
type Task = ApiResponse<'task', 'findAll'>['data'][number];

@Component({
  selector: 'app-pyme-tasks',
  imports: [CommonModule, FormsModule, ModalForm, ConsultantInputSearch, TaskBoardFilters],
  templateUrl: './tasks.html',
})
export class Tasks implements OnInit, AfterViewInit, OnDestroy {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private pymeService = inject(PymeService);
  private sortables: Sortable[] = [];

  @ViewChildren('taskList') taskLists!: QueryList<ElementRef<HTMLElement>>;

  columns: { id: TaskStatus; label: string; className: string }[] = [
    { id: 'pendiente', label: 'Pendiente', className: 'bg-text/5 text-text/60' },
    { id: 'en_progreso', label: 'En progreso', className: 'bg-info/10 text-info' },
    { id: 'completada', label: 'Completada', className: 'bg-success/10 text-success' },
    { id: 'bloqueada', label: 'Bloqueada', className: 'bg-danger/10 text-danger' },
  ];

  readonly consultantFilters = {
    source: 'all',
  } satisfies ConsultantInputSearchFilters;
  tasks = signal<ApiResponse<'task', 'findAll'>['data']>([]);
  consultants = signal<ConsultantOption[]>([]);
  selectedConsultantId = signal<number | 'all'>('all');
  selectedPriority = signal<TaskPriorityFilter>('all');
  selectedAssignee = signal<TaskAssigneeFilter>('all');
  selectedMeeting = signal<TaskMeetingFilter>('all');
  loading = signal(false);
  creating = signal(false);
  showCreate = signal(false);
  editingTaskId = signal<number | null>(null);

  form = signal<TaskForm>({
    pymeId: 0,
    consultantId: 0,
    title: '',
    description: '',
    assignedTo: 'pyme',
    priority: 'media',
    dueDate: '',
  });

  ngOnInit() {
    const user = this.hubsme.currentUser();
    this.form.update((current) => ({
      ...current,
      pymeId: user.role === 'pyme' ? user.id : current.pymeId,
      consultantId: user.role === 'consultor' ? user.id : current.consultantId,
    }));
    this.loadLookups();
    this.load();
  }

  loadLookups() {
    this.pymeService
      .meetingConsultants({ page: 1, limit: 100, active: 'true' })
      .then((consultantsRes) => {
        const consultants = consultantsRes.data;
        this.consultants.set(consultants);
        this.form.update((current) => ({
          ...current,
          consultantId: consultants.some((consultant) => consultant.userId === current.consultantId)
            ? current.consultantId
            : (consultants[0]?.userId ?? 0),
        }));
        this.selectedConsultantId.update((current) =>
          current === 'all' ? (consultants[0]?.userId ?? 'all') : current,
        );
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
  }

  ngAfterViewInit() {
    this.taskLists.changes.subscribe(() => this.initSortables());
    this.initSortables();
  }

  ngOnDestroy() {
    this.destroySortables();
  }

  load() {
    this.loading.set(true);
    this.hubsme
      .listTasks()
      .then((res) => {
        this.tasks.set(res.data.data);
        this.initSortables();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  updateForm<K extends keyof TaskForm>(key: K, value: TaskForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  startCreate() {
    this.editingTaskId.set(null);
    this.form.update((current) => ({
      ...current,
      title: '',
      description: '',
      assignedTo: 'pyme',
      priority: 'media',
      dueDate: '',
    }));
    this.showCreate.set(true);
  }

  startEdit(task: Task) {
    this.editingTaskId.set(task.id);
    this.form.set({
      pymeId: task.pymeId,
      consultantId: task.consultantId ?? 0,
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: this.dateInputValue(task.dueDate),
    });
    this.showCreate.set(true);
  }

  closeForm() {
    this.showCreate.set(false);
    this.editingTaskId.set(null);
  }

  submit() {
    return this.editingTaskId() ? this.update() : this.create();
  }

  create() {
    const data = this.form();
    if (!data.pymeId || !data.consultantId || !data.title || !data.description) {
      this.toastService.error('Selecciona un consultor y completa titulo y descripcion');
      return;
    }

    this.creating.set(true);
    this.hubsme
      .createTask({
        pymeId: Number(data.pymeId),
        consultantId: Number(data.consultantId) || undefined,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        priority: data.priority,
        status: 'pendiente',
        dueDate: peruDateOnlyToUtc(data.dueDate)?.toISOString(),
      })
      .then(() => {
        this.toastService.success('Tarea creada');
        this.form.update((current) => ({ ...current, title: '', description: '', dueDate: '' }));
        this.closeForm();
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creating.set(false));
  }

  update() {
    const id = this.editingTaskId();
    const data = this.form();
    if (!id || !data.pymeId || !data.consultantId || !data.title || !data.description) {
      this.toastService.error('Selecciona un consultor y completa titulo y descripcion');
      return;
    }

    this.creating.set(true);
    this.hubsme
      .updateTask(id, {
        pymeId: Number(data.pymeId),
        consultantId: Number(data.consultantId) || undefined,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        priority: data.priority,
        dueDate: peruDateOnlyToUtc(data.dueDate)?.toISOString(),
      })
      .then(() => {
        this.toastService.success('Tarea actualizada');
        this.closeForm();
        this.load();
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.creating.set(false));
  }

  moveTask(id: number, status: TaskStatus) {
    const previousTasks = this.tasks();
    this.tasks.update((tasks) => tasks.map((task) => (task.id === id ? { ...task, status } : task)));

    this.hubsme
      .updateTaskStatus(id, status)
      .catch((error) => {
        this.tasks.set(previousTasks);
        this.toastService.error(this.hubsme.getErrorMessage(error));
      });
  }

  scopedTasks = computed(() => {
    const selected = this.selectedConsultantId();
    if (selected === 'all') return this.tasks();
    return this.tasks().filter((task) => task.consultantId === Number(selected));
  });

  meetingOptions = computed<TaskMeetingOption[]>(() => {
    const meetings = new Map<number, TaskMeetingOption>();
    for (const task of this.scopedTasks()) {
      if (!task.meetingId || meetings.has(task.meetingId)) continue;
      meetings.set(task.meetingId, {
        id: task.meetingId,
        title: task.meetingTitle ?? null,
        startTime: task.meetingStartTime ?? null,
      });
    }

    return [...meetings.values()].sort((a, b) =>
      (b.startTime ?? '').localeCompare(a.startTime ?? ''),
    );
  });

  filteredTasks = computed(() => {
    const priority = this.selectedPriority();
    const assignee = this.selectedAssignee();
    const meeting = this.selectedMeeting();

    return this.scopedTasks().filter((task) => {
      if (priority !== 'all' && task.priority !== priority) return false;
      if (assignee !== 'all' && task.assignedTo !== assignee) return false;
      if (meeting === 'manual') return task.meetingId === null;
      if (meeting !== 'all' && task.meetingId !== meeting) return false;
      return true;
    });
  });

  selectConsultant(consultantId: number | null) {
    this.selectedConsultantId.set(consultantId ?? 'all');
    this.selectedMeeting.set('all');
  }

  responsibleLabel(assignee: TaskAssignee) {
    return assignee === 'pyme' ? 'PYME' : 'Consultor';
  }

  meetingDateTime(task: Task) {
    if (!task.meetingId) return 'Tarea independiente';
    if (!task.meetingStartTime) return 'Reunión sin fecha programada';
    return formatInPeru(task.meetingStartTime, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  tasksByStatus(status: TaskStatus) {
    return this.filteredTasks().filter((task) => task.status === status);
  }

  priorityClass(priority: TaskPriority) {
    const classes: Record<TaskPriority, string> = {
      alta: 'bg-danger/10 text-danger',
      media: 'bg-accent/12 text-accent',
      baja: 'bg-success/10 text-success',
    };
    return classes[priority];
  }

  private dateInputValue(value: string | null) {
    return value ? dateKeyInPeru(value) : '';
  }

  private initSortables() {
    window.setTimeout(() => {
      if (!this.taskLists) return;

      this.destroySortables();
      this.sortables = this.taskLists.map((list) =>
        Sortable.create(list.nativeElement, {
          group: 'pyme-tasks',
          animation: 180,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          forceFallback: true,
          fallbackOnBody: true,
          fallbackTolerance: 4,
          scroll: true,
          bubbleScroll: true,
          draggable: '[data-task-id]',
          filter: '.is-empty',
          swapThreshold: 0.65,
          ghostClass: 'opacity-40',
          chosenClass: 'shadow-2xl',
          dragClass: 'opacity-90',
          onEnd: (event) => {
            const taskId = Number((event.item as HTMLElement).dataset['taskId']);
            const status = (event.to as HTMLElement).dataset['status'] as TaskStatus | undefined;
            const task = this.tasks().find((item) => item.id === taskId);

            if (!task || !status || task.status === status) {
              this.tasks.set([...this.tasks()]);
              return;
            }

            this.moveTask(taskId, status);
          },
        }),
      );
    });
  }

  private destroySortables() {
    this.sortables.forEach((sortable) => sortable.destroy());
    this.sortables = [];
  }
}
