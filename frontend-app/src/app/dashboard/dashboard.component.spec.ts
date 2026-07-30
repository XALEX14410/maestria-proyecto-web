import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('renders the Material shell with a full-width main content region', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    http.expectOne('http://localhost:8080/api/v1/tareas').flush([]);
    http.expectOne('http://localhost:8080/api/v1/mensajes').flush([]);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('mat-sidenav-container.workspace-container')).toBeTruthy();
    expect(element.querySelector('mat-sidenav-content.content-shell')).toBeTruthy();
    expect(element.querySelectorAll('header.topbar').length).toBe(1);
    expect(element.querySelector('main.main-content.workspace-area')).toBeTruthy();
  });

  it('switches to the Gantt timeline view without duplicating the header', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    http.expectOne('http://localhost:8080/api/v1/tareas').flush([
      { codigo: 'TH-1', nombre: 'Plan Gantt', estado: 'En progreso', responsable: 'Alex', prioridad: 'Alta' }
    ]);
    http.expectOne('http://localhost:8080/api/v1/mensajes').flush([]);

    component.setTaskView('gantt');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.gantt-view')).toBeTruthy();
    expect(element.querySelectorAll('header.topbar').length).toBe(1);
  });
});
