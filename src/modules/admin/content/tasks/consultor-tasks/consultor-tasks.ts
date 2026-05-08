import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { ToastService } from '@service/toast.service';

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
  selector: 'app-consultor-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultor-tasks.html',
})
export class ConsultorTasks implements OnInit {
  private hubsme = inject(HubsmeService);
  private toastService = inject(ToastService);

  columns: { id: TaskStatus; label: string; className: string }[] = [
    { id: 'pendiente', label: 'Pendiente', className: 'bg-text/5 text-text/60' },
    { id: 'en_progreso', label: 'En progreso', className: 'bg-info/10 text-info' },
    { id: 'completada', label: 'Completada', className: 'bg-success/10 text-success' },
    { id: 'bloqueada', label: 'Bloqueada', className: 'bg-danger/10 text-danger' },
  ];

  tasks = signal<ApiResponse<'task', 'findAll'>['data']>([]);
  pymes = signal<ApiResponse<'pyme', 'findAll'>['data']>([]);
  consultants = signal<ApiResponse<'consultant', 'findAll'>['data']>([]);
  selectedPymeId = signal<number | 'all'>('all');
  showCreate = signal(false);
  loading = signal(false);
  creating = signal(false);

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

  load() {
    this.loading.set(true);
    this.hubsme
      .listTasks()
      .then((res) => this.tasks.set(res.data.data))
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
    this.hubsme
      .updateTaskStatus(id, status)
      .then(() => this.load())
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)));
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
    return this.pymes().find((pyme) => pyme.userId === id || pyme.id === id)?.name ?? `pyme-${id}`;
  }

  priorityClass(priority: TaskPriority) {
    if (priority === 'alta') return 'bg-danger/10 text-danger';
    if (priority === 'media') return 'bg-accent/15 text-amber-700';
    return 'bg-success/10 text-success';
  }
}
