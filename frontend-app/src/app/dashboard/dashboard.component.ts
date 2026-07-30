import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { PremiumDialogComponent } from '../dialogs/premium-dialog/premium-dialog.component';
import { PermissionService } from '../core/permissions/permission.service';
import { AiService } from '../services/ai';
import { ThemeService } from '../theme.service';
import { Task, TaskPriority, TaskStatus } from '../data-access/models/project-management.models';
import { TaskRepository } from '../data-access/repositories/task.repository';

interface NeonMessage {
  remitente: string;
  texto: string;
}

interface ChatMessage {
  role: 'user' | 'ai' | 'error';
  content: string;
}

interface NavigationItem {
  id: DashboardView;
  label: string;
  icon: string;
  comingSoon?: boolean;
}

type DashboardView =
  | 'inicio'
  | 'mi-trabajo'
  | 'agenda'
  | 'espacios'
  | 'equipos'
  | 'proyectos'
  | 'tareas'
  | 'notificaciones'
  | 'configuracion'
  | 'documentos'
  | 'paneles';

const STATUS_COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'Pendiente' },
  { id: 'in_progress', label: 'En progreso' },
  { id: 'review', label: 'En revision' },
  { id: 'blocked', label: 'Bloqueada' },
  { id: 'done', label: 'Completada' }
];

const NAVIGATION: NavigationItem[] = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'mi-trabajo', label: 'Mi trabajo', icon: 'assignment_ind' },
  { id: 'agenda', label: 'Agenda', icon: 'event' },
  { id: 'espacios', label: 'Espacios', icon: 'folder_copy' },
  { id: 'equipos', label: 'Equipos', icon: 'group' },
  { id: 'proyectos', label: 'Proyectos', icon: 'work' },
  { id: 'documentos', label: 'Documentos', icon: 'description', comingSoon: true },
  { id: 'paneles', label: 'Paneles', icon: 'dashboard', comingSoon: true }
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatBadgeModule,
    MatListModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly http = inject(HttpClient);
  private readonly aiService = inject(AiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly themeService = inject(ThemeService);
  readonly taskRepository = inject(TaskRepository);
  readonly permissions = inject(PermissionService);

  readonly navigation = NAVIGATION;
  readonly statusColumns = STATUS_COLUMNS;
  readonly displayedColumns = ['title', 'status', 'priority', 'assignees', 'startDate', 'dueDate', 'progress', 'tags', 'actions'];
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly isSidebarExpanded = signal(true);
  readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 720px)').pipe(map(result => result.matches)),
    { initialValue: false }
  );
  readonly currentView = signal<DashboardView>('inicio');
  readonly activeTaskView = signal<'list' | 'kanban' | 'calendar' | 'gantt'>('list');
  readonly calendarCursor = signal(new Date(2026, 6, 1));
  readonly mensajes = signal<NeonMessage[]>([]);

  textoUsuario = '';
  historialChat: ChatMessage[] = [];
  cargando = false;
  isChatOpen = false;

  readonly overdueTasks = computed(() => this.taskRepository.allTasks().filter(task => this.isOverdue(task)));
  readonly monthlyDays = computed(() => this.buildCalendarMonth(this.calendarCursor()));
  readonly connectedDropLists = computed(() => this.statusColumns.map(column => `kanban-${column.id}`));
  readonly ganttDays = computed(() => this.buildGanttDays(this.taskRepository.filteredTasks()));

  constructor() {
    effect(() => {
      if (this.isHandset()) {
        this.isSidebarExpanded.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.taskRepository.loadTasks();
    this.loadMessages();

    this.searchControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(search => this.taskRepository.updateQuery({ search }));
  }

  toggleSidebar(): void {
    this.isSidebarExpanded.update(value => !value);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  changeView(view: DashboardView): void {
    this.currentView.set(view);
    if (view === 'tareas' || view === 'proyectos') {
      this.activeTaskView.set('list');
    }
    if (this.isHandset()) {
      this.isSidebarExpanded.set(false);
    }
  }

  setTaskView(view: 'list' | 'kanban' | 'calendar' | 'gantt'): void {
    this.currentView.set('tareas');
    this.activeTaskView.set(view);
  }

  logout(): void {
    const dialogRef = this.dialog.open(PremiumDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'logout') {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  enviarPregunta(): void {
    if (!this.textoUsuario.trim()) {
      return;
    }

    const pregunta = this.textoUsuario.trim();
    this.historialChat.push({ role: 'user', content: pregunta });
    this.textoUsuario = '';
    this.cargando = true;

    this.aiService.consultarInteligenciaArtificial(pregunta).subscribe({
      next: res => {
        this.historialChat.push({ role: 'ai', content: res.respuesta });
        this.cargando = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: () => {
        this.historialChat.push({ role: 'error', content: 'Ocurrio un error al procesar tu solicitud con IA.' });
        this.cargando = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.ai-chat-scroll-area');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }

  taskByStatus(status: TaskStatus): Task[] {
    return this.taskRepository.filteredTasks().filter(task => task.status === status);
  }

  onKanbanDrop(event: CdkDragDrop<Task[]>, status: TaskStatus): void {
    const task = event.item.data as Task;
    if (!this.permissions.has('task.update')) {
      return;
    }

    this.taskRepository.changeTaskStatus(task.id, status);
  }

  selectTask(task: Task): void {
    this.taskRepository.selectTask(task.id);
  }

  closeTaskDetail(): void {
    this.taskRepository.selectedTaskId.set(null);
  }

  nextMonth(): void {
    this.calendarCursor.update(date => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  previousMonth(): void {
    this.calendarCursor.update(date => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  tasksForDay(day: Date): Task[] {
    const isoDate = this.toDateKey(day);
    return this.taskRepository.filteredTasks().filter(task => this.toDateKey(new Date(task.dueDate)) === isoDate || this.toDateKey(new Date(task.startDate)) === isoDate);
  }

  statusLabel(status: TaskStatus): string {
    return STATUS_COLUMNS.find(column => column.id === status)?.label ?? status;
  }

  priorityLabel(priority: TaskPriority): string {
    const labels: Record<TaskPriority, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente'
    };

    return labels[priority];
  }

  isOverdue(task: Task): boolean {
    return task.status !== 'done' && new Date(task.dueDate).getTime() < Date.now();
  }

  ganttGridColumns(): string {
    return `minmax(220px, 0.75fr) repeat(${this.ganttDays().length}, minmax(56px, 1fr))`;
  }

  ganttBarGridColumn(task: Task): string {
    const firstDay = this.ganttDays()[0] ?? new Date(task.startDate);
    const start = Math.max(0, this.daysBetween(firstDay, new Date(task.startDate)));
    const span = Math.max(1, this.daysBetween(new Date(task.startDate), new Date(task.dueDate)) + 1);

    return `${start + 2} / span ${span}`;
  }

  ganttDependencyOffset(task: Task): number {
    return task.dependencies.length > 0 ? 24 : 0;
  }

  trackTask(_index: number, task: Task): string {
    return task.id;
  }

  private loadMessages(): void {
    this.http.get<NeonMessage[]>('http://localhost:8080/api/v1/mensajes').subscribe({
      next: data => this.mensajes.set(data),
      error: () => this.mensajes.set([])
    });
  }

  private buildCalendarMonth(cursor: Date): Date[] {
    const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const firstGridDay = new Date(start);
    firstGridDay.setDate(start.getDate() - start.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstGridDay);
      date.setDate(firstGridDay.getDate() + index);
      return date;
    });
  }

  private buildGanttDays(tasks: Task[]): Date[] {
    if (tasks.length === 0) {
      return [];
    }

    const starts = tasks.map(task => new Date(task.startDate).getTime());
    const ends = tasks.map(task => new Date(task.dueDate).getTime());
    const first = new Date(Math.min(...starts));
    const last = new Date(Math.max(...ends));
    first.setDate(first.getDate() - 1);
    last.setDate(last.getDate() + 1);

    const totalDays = Math.min(21, this.daysBetween(first, last) + 1);
    return Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(first);
      date.setDate(first.getDate() + index);
      return date;
    });
  }

  private daysBetween(start: Date, end: Date): number {
    return Math.round((this.stripTime(end).getTime() - this.stripTime(start).getTime()) / 86400000);
  }

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
