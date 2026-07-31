import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { PremiumDialogComponent } from '../dialogs/premium-dialog/premium-dialog.component';
import { PermissionService } from '../core/permissions/permission.service';
import { AuthService } from '../core/services/auth.service';
=======
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
>>>>>>> parent of eb0c42c (Merge pull request #8 from XALEX14410/feature/clickup-core-mvp)
import { AiService } from '../services/ai';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PremiumDialogComponent } from '../dialogs/premium-dialog/premium-dialog.component';
import { ThemeService } from '../theme.service';
<<<<<<< HEAD
import { Task, TaskPriority, TaskStatus } from '../data-access/models/project-management.models';
import { TaskRepository } from '../data-access/repositories/task.repository';
import { environment } from '../../environments/environment';
=======
>>>>>>> parent of eb0c42c (Merge pull request #8 from XALEX14410/feature/clickup-core-mvp)

export interface TaskItem {
  id: string;
  name: string;
  status: string;
  assignee: string;
  priority: string;
  sprint: string;
  date: string;
  labels: string[];
}

const TASK_DATA: TaskItem[] = [
  { id: 'TH-142', name: 'Rediseño Arquitectura Cloud', status: 'En progreso', assignee: 'Alex', priority: 'Urgente', sprint: 'Sprint 42', date: 'Oct 15', labels: ['DevOps', 'Cloud'] },
  { id: 'TH-143', name: 'Migración Base de Datos', status: 'En revisión', assignee: 'Sara', priority: 'Alta', sprint: 'Sprint 42', date: 'Oct 20', labels: ['Backend', 'DB'] },
  { id: 'TH-144', name: 'Aplicación Móvil iOS', status: 'Backlog', assignee: 'David', priority: 'Media', sprint: 'Backlog', date: 'Nov 01', labels: ['Mobile', 'iOS'] },
  { id: 'TH-145', name: 'Integración API ERP', status: 'Pendiente', assignee: 'Alex', priority: 'Alta', sprint: 'Sprint 42', date: 'Oct 25', labels: ['API'] },
  { id: 'TH-146', name: 'Auditoría de Seguridad', status: 'Completada', assignee: 'Elena', priority: 'Baja', sprint: 'Sprint 40', date: 'Ago 10', labels: ['Security'] },
  { id: 'TH-147', name: 'Fix bug en el login', status: 'Bloqueada', assignee: 'Sara', priority: 'Urgente', sprint: 'Sprint 42', date: 'Oct 12', labels: ['Bug', 'Frontend'] },
  { id: 'TH-148', name: 'Diseñar nueva Landing', status: 'En progreso', assignee: 'David', priority: 'Media', sprint: 'Sprint 42', date: 'Oct 18', labels: ['Design'] },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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
    FormsModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
<<<<<<< HEAD
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly http = inject(HttpClient);
  private readonly aiService = inject(AiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly themeService = inject(ThemeService);
  readonly taskRepository = inject(TaskRepository);
  readonly permissions = inject(PermissionService);
  private readonly authService = inject(AuthService);
=======
  private router = inject(Router);
  private dialog = inject(MatDialog);
  public themeService = inject(ThemeService);
  private http = inject(HttpClient);
>>>>>>> parent of eb0c42c (Merge pull request #8 from XALEX14410/feature/clickup-core-mvp)

  isSidebarExpanded = signal(true);
  currentView = signal<string>('inicio');
  mensajes = signal<any[]>([]);

  textoUsuario: string = '';
  historialChat: { role: 'user' | 'ai' | 'error', content: string }[] = [];
  cargando: boolean = false;
  isChatOpen: boolean = false;

  private aiService = inject(AiService);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns = ['status', 'name', 'assignee', 'priority', 'sprint', 'date', 'labels'];
  dataSource = signal<TaskItem[]>(TASK_DATA);

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/api/v1/mensajes')
      .subscribe({
        next: (data) => this.mensajes.set(data),
        error: (err) => console.error('Error fetching messages', err)
      });
  }

  toggleSidebar() {
    this.isSidebarExpanded.set(!this.isSidebarExpanded());
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  changeView(view: string) {
    this.currentView.set(view);
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
        this.authService.logout();
      }
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  enviarPregunta() {
    if(!this.textoUsuario.trim()) {
      return; 
    }
    const pregunta = this.textoUsuario.trim();
    this.historialChat.push({ role: 'user', content: pregunta });
    this.textoUsuario = ''; 
    this.cargando = true; 

    this.aiService.consultarInteligenciaArtificial(pregunta).subscribe({
      next: (res) => {
        this.historialChat.push({ role: 'ai', content: res.respuesta });
        this.cargando = false;
        this.cdr.detectChanges(); 
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error al consultar la IA:', err);
        this.historialChat.push({ role: 'error', content: 'Ocurrió un error al procesar tu solicitud con el cerebro.' });
        this.cargando = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.ai-chat-scroll-area');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }
<<<<<<< HEAD

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
    this.http.get<NeonMessage[]>(`${environment.apiBaseUrl}/api/v1/mensajes`).subscribe({
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
=======
>>>>>>> parent of eb0c42c (Merge pull request #8 from XALEX14410/feature/clickup-core-mvp)
}
