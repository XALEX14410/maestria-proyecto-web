import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, delay, finalize, map, of, throwError } from 'rxjs';
import {
  ApiTaskDto,
  Task,
  TaskPage,
  TaskPriority,
  TaskQuery,
  TaskStatus
} from '../models/project-management.models';
import { RuntimeConfigService } from '../../core/config/runtime-config.service';

const DEFAULT_QUERY: TaskQuery = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'dueDate',
  sortDirection: 'asc',
  pageIndex: 0,
  pageSize: 20
};

@Injectable({ providedIn: 'root' })
export class TaskRepository {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);
  private readonly apiUrl = this.runtimeConfig.apiUrl('/api/v1/tareas');
  private readonly tasks = signal<Task[]>([]);
  private readonly query = signal<TaskQuery>(DEFAULT_QUERY);
  private readonly updatingTaskIds = signal<Set<string>>(new Set());

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedTaskId = signal<string | null>(null);

  readonly taskQuery = this.query.asReadonly();
  readonly allTasks = this.tasks.asReadonly();
  readonly updatingIds = this.updatingTaskIds.asReadonly();
  readonly selectedTask = computed(() => this.tasks().find(task => task.id === this.selectedTaskId()) ?? null);
  readonly filteredTasks = computed(() => this.applyQuery(this.tasks(), this.query()));
  readonly page = computed<TaskPage>(() => {
    const filtered = this.filteredTasks();
    const { pageIndex, pageSize } = this.query();
    const start = pageIndex * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length
    };
  });

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ApiTaskDto[]>(this.apiUrl).pipe(
      map(items => items.map((item, index) => this.toDomainTask(item, index))),
      catchError((error: HttpErrorResponse) => {
        this.error.set(`No se pudieron cargar las tareas (${error.status || 'sin respuesta'}).`);
        return of([]);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe(tasks => {
      this.tasks.set(tasks);
      if (!this.selectedTaskId() && tasks.length > 0) {
        this.selectedTaskId.set(tasks[0].id);
      }
    });
  }

  retry(): void {
    this.loadTasks();
  }

  updateQuery(partial: Partial<TaskQuery>): void {
    this.query.update(query => ({ ...query, ...partial, pageIndex: partial.pageIndex ?? 0 }));
  }

  selectTask(taskId: string): void {
    this.selectedTaskId.set(taskId);
  }

  changeTaskStatus(taskId: string, status: TaskStatus): void {
    const currentTasks = this.tasks();
    const task = currentTasks.find(item => item.id === taskId);

    if (!task || task.status === status || this.updatingTaskIds().has(taskId)) {
      return;
    }

    const previousStatus = task.status;
    this.setUpdating(taskId, true);
    this.tasks.update(items => items.map(item => item.id === taskId ? { ...item, status, updatedAt: new Date().toISOString() } : item));

    this.persistTaskStatus(taskId, status).pipe(
      catchError((error: HttpErrorResponse) => {
        this.tasks.update(items => items.map(item => item.id === taskId ? { ...item, status: previousStatus } : item));
        this.error.set(`No se pudo actualizar el estado de ${task.title} (${error.status || 'sin respuesta'}).`);
        return throwError(() => error);
      }),
      finalize(() => this.setUpdating(taskId, false))
    ).subscribe({ error: () => undefined });
  }

  private persistTaskStatus(taskId: string, status: TaskStatus) {
    const task = this.tasks().find(item => item.id === taskId);
    const payload: ApiTaskDto = {
      codigo: taskId,
      nombre: task?.title ?? '',
      estado: this.statusLabel(status),
      responsable: task?.assigneeIds[0] ?? '',
      prioridad: task ? this.priorityLabel(task.priority) : 'Media'
    };

    return this.http.post(this.apiUrl, payload).pipe(delay(200));
  }

  private setUpdating(taskId: string, updating: boolean): void {
    this.updatingTaskIds.update(ids => {
      const next = new Set(ids);
      updating ? next.add(taskId) : next.delete(taskId);
      return next;
    });
  }

  private applyQuery(tasks: Task[], query: TaskQuery): Task[] {
    const search = query.search.trim().toLowerCase();
    const filtered = tasks.filter(task => {
      const matchesSearch = !search || [task.title, task.id, task.description, ...task.tags].join(' ').toLowerCase().includes(search);
      const matchesStatus = query.status === 'all' || task.status === query.status;
      const matchesPriority = query.priority === 'all' || task.priority === query.priority;

      return matchesSearch && matchesStatus && matchesPriority && !task.archived;
    });

    return [...filtered].sort((left, right) => {
      const direction = query.sortDirection === 'asc' ? 1 : -1;
      const leftValue = this.sortValue(left, query.sortBy);
      const rightValue = this.sortValue(right, query.sortBy);

      return leftValue.localeCompare(rightValue) * direction;
    });
  }

  private sortValue(task: Task, sortBy: TaskQuery['sortBy']): string {
    return String(task[sortBy] ?? '');
  }

  private toDomainTask(task: ApiTaskDto, index: number): Task {
    const createdAt = new Date(Date.UTC(2026, 6, 1 + index)).toISOString();
    const startDate = new Date(Date.UTC(2026, 6, 6 + index)).toISOString();
    const dueDate = new Date(Date.UTC(2026, 6, 12 + index * 3)).toISOString();
    const status = this.parseStatus(task.estado);
    const priority = this.parsePriority(task.prioridad);

    return {
      id: task.codigo,
      projectId: 'project-platform-core',
      listId: status === 'done' ? 'list-release' : 'list-sprint-42',
      title: task.nombre,
      description: 'Tarea sincronizada desde el backend actual. Los campos extendidos quedan pendientes del contrato MVP.',
      status,
      priority,
      assigneeIds: task.responsable ? [task.responsable] : [],
      startDate,
      dueDate,
      estimatedDuration: 8 + index * 2,
      progress: status === 'done' ? 100 : status === 'in_progress' ? 65 : status === 'review' ? 80 : 20,
      tags: index % 2 === 0 ? ['Backend', 'MVP'] : ['Frontend'],
      createdBy: 'system',
      createdAt,
      updatedAt: createdAt,
      completedAt: status === 'done' ? dueDate : undefined,
      archived: false,
      version: 1,
      subtasks: [],
      comments: [
        {
          id: `${task.codigo}-comment-1`,
          taskId: task.codigo,
          authorId: 'system',
          authorName: 'Sistema',
          content: 'Comentario de auditoria creado desde datos existentes del backend.',
          createdAt
        }
      ],
      attachments: [],
      dependencies: index > 0 ? [{ id: `${task.codigo}-dep`, taskId: task.codigo, dependsOnTaskId: `TH-${141 + index}` }] : [],
      activity: [
        {
          id: `${task.codigo}-activity-1`,
          taskId: task.codigo,
          actorId: 'system',
          actorName: 'Sistema',
          action: 'Tarea importada desde /api/v1/tareas',
          createdAt
        }
      ]
    };
  }

  private parseStatus(value: string): TaskStatus {
    const normalized = value.toLowerCase();
    if (normalized.includes('progreso')) return 'in_progress';
    if (normalized.includes('revision') || normalized.includes('revisión')) return 'review';
    if (normalized.includes('bloque')) return 'blocked';
    if (normalized.includes('complet')) return 'done';
    if (normalized.includes('backlog')) return 'backlog';
    return 'todo';
  }

  private parsePriority(value: string): TaskPriority {
    const normalized = value.toLowerCase();
    if (normalized.includes('urgent')) return 'urgent';
    if (normalized.includes('alta')) return 'high';
    if (normalized.includes('baja')) return 'low';
    return 'medium';
  }

  private statusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      backlog: 'Backlog',
      todo: 'Pendiente',
      in_progress: 'En progreso',
      review: 'En revision',
      blocked: 'Bloqueada',
      done: 'Completada'
    };

    return labels[status];
  }

  private priorityLabel(priority: TaskPriority): string {
    const labels: Record<TaskPriority, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente'
    };

    return labels[priority];
  }
}
