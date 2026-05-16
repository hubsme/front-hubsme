import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, computed, inject, signal } from '@angular/core';
import Sortable from 'sortablejs';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import {
  PymeInputSearch,
  PymeInputSearchFilters,
} from '@module/admin/components/input-search/pyme-input-search/pyme-input-search';

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

type Match = ApiResponse<'consultant', 'pymeContacts'>['data'][number];
type Task = ApiResponse<'task', 'findAll'>['data'][number];

@Component({
  selector: 'app-consultor-tasks',
  imports: [CommonModule, FormsModule, ModalForm, PymeInputSearch],
  templateUrl: './consultor-tasks.html',
})
export class ConsultorTasks implements OnInit, AfterViewInit, OnDestroy {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);
  private sortables: Sortable[] = [];

  @ViewChildren('taskList') taskLists!: QueryList<ElementRef<HTMLElement>>;

  columns: { id: TaskStatus; label: string; className: string }[] = [
    { id: 'pendiente', label: 'Pendiente', className: 'bg-text/5 text-text/60' },
    { id: 'en_progreso', label: 'En progreso', className: 'bg-info/10 text-info' },
    { id: 'completada', label: 'Completada', className: 'bg-success/10 text-success' },
    { id: 'bloqueada', label: 'Bloqueada', className: 'bg-danger/10 text-danger' },
  ];

  readonly pymeFilters = {
    source: 'matches',
    status: 'aceptado',
  } satisfies PymeInputSearchFilters;
  tasks = signal<ApiResponse<'task', 'findAll'>['data']>([]);
  acceptedMatches = signal<Match[]>([]);
  selectedPymeId = signal<number | 'all'>('all');
  showCreate = signal(false);
  loading = signal(false);
  creating = signal(false);
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

  ngAfterViewInit() {
    this.taskLists.changes.subscribe(() => this.initSortables());
    this.initSortables();
  }

  ngOnDestroy() {
    this.destroySortables();
  }

  loadLookups() {
    this.hubsme
      .listMatches(1, 100, 'aceptado')
      .then((matchesRes) => {
        const matches = matchesRes.data.data;
        this.acceptedMatches.set(matches);
        this.form.update((current) => ({
          ...current,
          pymeId: matches.some((match) => match.pymeId === current.pymeId)
            ? current.pymeId
            : (matches[0]?.pymeId ?? 0),
        }));
        this.selectedPymeId.update((current) =>
          current === 'all' ? (matches[0]?.pymeId ?? 'all') : current,
        );
      })
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
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
      this.toastService.error('Selecciona una PYME conectada y completa titulo y descripcion');
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
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
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
      this.toastService.error('Selecciona una PYME conectada y completa titulo y descripcion');
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
        dueDate: data.dueDate ? new Date(`${data.dueDate}T00:00:00`).toISOString() : undefined,
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

  tasksByStatus(status: TaskStatus) {
    return this.filteredTasks().filter((task) => task.status === status);
  }

  filteredTasks = computed(() => {
    const selected = this.selectedPymeId();
    if (selected === 'all') return this.tasks();
    return this.tasks().filter((task) => task.pymeId === Number(selected));
  });

  clientLabel = computed(() => {
    const selected = this.selectedPymeId();
    if (selected === 'all') return 'todas tus PYMES';
    return this.pymeName(Number(selected));
  });

  pymeName(id: number) {
    return this.acceptedMatches().find((match) => match.pymeId === id)?.pymeName ?? `pyme-${id}`;
  }

  priorityClass(priority: TaskPriority) {
    if (priority === 'alta') return 'bg-danger/10 text-danger';
    if (priority === 'media') return 'bg-accent/12 text-accent';
    return 'bg-success/10 text-success';
  }

  private dateInputValue(value: string | null) {
    return value ? new Date(value).toISOString().slice(0, 10) : '';
  }

  private initSortables() {
    window.setTimeout(() => {
      if (!this.taskLists) return;

      this.destroySortables();
      this.sortables = this.taskLists.map((list) =>
        Sortable.create(list.nativeElement, {
          group: 'consultor-tasks',
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
