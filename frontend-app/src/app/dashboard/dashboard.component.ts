import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  public themeService = inject(ThemeService);

  isSidebarExpanded = signal(true);
  currentView = signal<string>('inicio');

  displayedColumns = ['status', 'name', 'assignee', 'priority', 'sprint', 'date', 'labels'];
  dataSource = signal<TaskItem[]>(TASK_DATA);

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
        this.router.navigate(['/login']);
      }
    });
  }
}
