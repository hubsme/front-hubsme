import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import Sortable from 'sortablejs';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { PymeInputSearch } from '@module/admin/components/input-search/pyme-input-search/pyme-input-search';
import { ConsultantInputSearch } from '@module/admin/components/input-search/consultant-input-search/consultant-input-search';

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

@Component({
  selector: 'app-pyme-tasks',
  imports: [CommonModule, FormsModule, ModalForm, PymeInputSearch, ConsultantInputSearch],
  templateUrl: './pyme-tasks.html',
})
export class PymeTasks implements OnInit, AfterViewInit, OnDestroy {
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

  tasks = signal<ApiResponse<'task', 'findAll'>['data']>([]);
  pymes = signal<ApiResponse<'pyme', 'findAll'>['data']>([]);
  consultants = signal<ApiResponse<'consultant', 'findAll'>['data']>([]);
  selectedConsultantId = signal<number | 'all'>('all');
  loading = signal(false);
  creating = signal(false);
  showCreate = signal(false);

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
    Promise.all([this.hubsme.listPymes('', 1, 100), this.hubsme.listConsultants('', 1, 100, 'true')])
      .then(([pymesRes, consultantsRes]) => {
        const pymes = pymesRes.data.data;
        const consultants = consultantsRes.data.data;
        this.pymes.set(pymes);
        this.consultants.set(consultants);
        this.form.update((current) => ({
          ...current,
          pymeId: current.pymeId || pymes[0]?.userId || 0,
          consultantId: current.consultantId || consultants[0]?.userId || 0,
        }));
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

  create() {
    const data = this.form();
    if (!data.pymeId || !data.title || !data.description) {
      this.toastService.error('Completa PYME, titulo y descripcion');
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
        this.showCreate.set(false);
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

  filteredTasks = computed(() => {
    const selected = this.selectedConsultantId();
    if (selected === 'all') return this.tasks();
    return this.tasks().filter((task) => task.consultantId === Number(selected));
  });

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
