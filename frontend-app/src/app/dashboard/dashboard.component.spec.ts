import { BreakpointObserver } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let http: HttpTestingController;
  type BreakpointMockState = { matches: boolean; breakpoints: Record<string, boolean> };
  let breakpointState: BehaviorSubject<BreakpointMockState>;

  beforeEach(async () => {
    breakpointState = new BehaviorSubject<BreakpointMockState>({ matches: false, breakpoints: { '(max-width: 720px)': false } });

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BreakpointObserver, useValue: { observe: () => breakpointState.asObservable() } }
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

  it('uses overlay sidenav mode on handset breakpoints', () => {
    breakpointState.next({ matches: true, breakpoints: { '(max-width: 720px)': true } });
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    http.expectOne('http://localhost:8080/api/v1/tareas').flush([]);
    http.expectOne('http://localhost:8080/api/v1/mensajes').flush([]);
    fixture.detectChanges();

    const sidenav = fixture.debugElement.query(By.directive(MatSidenav)).componentInstance as MatSidenav;
    expect(sidenav.mode).toBe('over');
    expect(sidenav.opened).toBe(false);
    expect(fixture.componentInstance.isSidebarExpanded()).toBe(false);
  });
});
