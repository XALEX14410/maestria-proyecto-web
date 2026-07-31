import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskRepository } from './task.repository';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskRepository, provideHttpClient(), provideHttpClientTesting()]
    });

    repository = TestBed.inject(TaskRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads backend tasks into the shared domain source', () => {
    repository.loadTasks();

    http.expectOne('http://localhost:8080/api/v1/tareas').flush([
      { codigo: 'TH-1', nombre: 'Crear lista', estado: 'Pendiente', responsable: 'Alex', prioridad: 'Alta' }
    ]);

    expect(repository.allTasks().length).toBe(1);
    expect(repository.allTasks()[0].title).toBe('Crear lista');
    expect(repository.selectedTask()?.id).toBe('TH-1');
  });

  it('filters tasks by debounced query consumers without duplicating data', () => {
    repository.loadTasks();
    http.expectOne('http://localhost:8080/api/v1/tareas').flush([
      { codigo: 'TH-1', nombre: 'Crear lista', estado: 'Pendiente', responsable: 'Alex', prioridad: 'Alta' },
      { codigo: 'TH-2', nombre: 'Ajustar calendario', estado: 'En progreso', responsable: 'Sara', prioridad: 'Media' }
    ]);

    repository.updateQuery({ search: 'calendario' });

    expect(repository.filteredTasks().map(task => task.id)).toEqual(['TH-2']);
    expect(repository.allTasks().length).toBe(2);
  });

  it('reverts an optimistic Kanban status update when persistence fails', () => {
    repository.loadTasks();
    http.expectOne('http://localhost:8080/api/v1/tareas').flush([
      { codigo: 'TH-1', nombre: 'Mover tarjeta', estado: 'Pendiente', responsable: 'Alex', prioridad: 'Alta' }
    ]);

    repository.changeTaskStatus('TH-1', 'done');
    expect(repository.allTasks()[0].status).toBe('done');

    http.expectOne('http://localhost:8080/api/v1/tareas').flush({ message: 'fail' }, { status: 500, statusText: 'Error' });

    expect(repository.allTasks()[0].status).toBe('todo');
    expect(repository.error()).toContain('No se pudo actualizar');
  });
});
