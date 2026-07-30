# ClickUp Core MVP

## Objetivo de la rama

La rama `feature/clickup-core-mvp` introduce la base visual y arquitectonica para evolucionar TaskHive hacia una plataforma de gestion de proyectos inspirada en patrones de ClickUp, sin copiar su identidad visual ni implementar modulos fuera del primer MVP.

## Alcance implementado

- Navegacion principal: Inicio, Mi trabajo, Agenda, Espacios, Equipos, Proyectos, Documentos, Paneles, Notificaciones y Configuracion.
- Documentos y Paneles quedan marcados como proximamente y no simulan funcionalidad.
- Modelos TypeScript para organizacion, workspace, equipos, proyectos, listas, tareas, comentarios, adjuntos, dependencias, actividad, notificaciones, roles y permisos.
- Repositorio unico de tareas (`TaskRepository`) consumido por lista, Kanban, calendario, cronograma temporal y detalle.
- Estados de carga, error, vacio y reintento para tareas.
- Busqueda con debounce, filtros por estado/prioridad y ordenamiento.
- Kanban con Angular CDK DragDrop, actualizacion optimista y reversion ante error.
- Calendario mensual usando fechas de inicio y fecha limite.
- Cronograma temporal identificado como vista provisional, no como motor Gantt completo.
- Panel de detalle de tarea con campos editables potenciales, campos calculados y auditoria.
- Servicio de permisos frontend preparatorio para roles OWNER, ADMIN, MANAGER, MEMBER y GUEST.

## Arquitectura

La app actual usa Angular 22 con componentes standalone, SSR y lazy loading por `loadComponent`. Se mantuvo esa arquitectura y se agregaron carpetas compatibles con la evolucion por dominios:

- `src/app/data-access/models`: contratos de dominio.
- `src/app/data-access/repositories`: capa responsable de obtener y actualizar tareas.
- `src/app/core/permissions`: permisos frontend.
- `src/app/dashboard`: shell visual actual, preservando layout y widget de IA existente.

No se agrego NgRx porque el proyecto no lo tenia y Signals + RxJS son suficientes para esta iteracion.

## Decisiones tecnicas

- No se instalaron dependencias nuevas.
- Se reutilizaron Angular Material y Angular CDK ya instalados.
- El endpoint real `/api/v1/tareas` es limitado; se adapta a `Task` en una sola capa.
- Los campos extendidos de tarea quedan marcados como derivados/provisionales hasta que el backend entregue el contrato completo.
- El cronograma no se presenta como Gantt completo porque no se evaluo ni incorporo una libreria especializada.
- La validacion de permisos frontend no sustituye la autorizacion backend.

## Rutas

- `/login`
- `/dashboard`

Las vistas del MVP se controlan dentro del dashboard actual para evitar romper la navegacion existente. Una iteracion posterior puede extraer rutas hijas lazy cuando el modulo crezca.

## Backend usado

### Existente

`GET /api/v1/tareas`

Respuesta actual:

```json
[
  {
    "codigo": "TH-142",
    "nombre": "Rediseno Arquitectura Cloud",
    "estado": "En progreso",
    "responsable": "Alex",
    "prioridad": "Urgente"
  }
]
```

`POST /api/v1/tareas`

Usado provisionalmente para persistir cambios de estado Kanban con el DTO actual.

`GET /api/v1/mensajes`

Usado por el widget de datos Neon existente.

`GET /api/v1/ia/consulta?pregunta=...`

Usado por el widget IA existente.

## Endpoints pendientes sugeridos

### `GET /api/workspaces`

- Permiso: `workspace.read`.
- Response: lista paginable de workspaces del usuario.
- Errores: 401, 403, 500.

### `GET /api/workspaces/:workspaceId/projects`

- Permiso: `project.read`.
- Filtros: `archived`, `search`.
- Response: `Project[]`.
- Errores: 401, 403, 404, 500.

### `GET /api/projects/:projectId/lists`

- Permiso: `project.read`.
- Response: `ProjectList[]` ordenada.

### `GET /api/projects/:projectId/tasks`

- Permiso: `task.read`.
- Query: `search`, `status`, `priority`, `assigneeId`, `page`, `pageSize`, `sort`.
- Response: `{ items: Task[], total: number }`.
- Validaciones: `pageSize` maximo definido por backend.

### `POST /api/projects/:projectId/tasks`

- Permiso: `task.create`.
- Request: titulo, lista, prioridad, responsables, fechas y descripcion.
- Response: `Task`.
- Errores: 400, 401, 403, 404, 409, 500.

### `GET /api/tasks/:taskId`

- Permiso: `task.read`.
- Response: detalle completo con subtareas, comentarios, adjuntos, dependencias e historial.

### `PATCH /api/tasks/:taskId`

- Permiso: `task.update` o permisos especificos como `task.assign`.
- Request: cambios parciales con `version` para concurrencia.
- Response: `Task`.
- Errores: 400, 401, 403, 404, 409, 422, 500.

### `DELETE /api/tasks/:taskId`

- Permiso: `task.delete`.
- Comportamiento recomendado: archivado logico.

### Comentarios, actividad y adjuntos

- `POST /api/tasks/:taskId/comments`
- `GET /api/tasks/:taskId/activity`
- `POST /api/tasks/:taskId/attachments`

Validar contenido, tamano y tipo MIME. No aceptar HTML arbitrario en comentarios.

### Equipos y notificaciones

- `GET /api/teams`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

## Permisos

Roles contemplados:

- OWNER
- ADMIN
- MANAGER
- MEMBER
- GUEST

Permisos contemplados:

- `workspace.read`
- `workspace.manage`
- `project.read`
- `project.create`
- `project.update`
- `project.delete`
- `task.read`
- `task.create`
- `task.update`
- `task.delete`
- `task.assign`
- `task.comment`
- `document.manage`
- `dashboard.manage`

## Como ejecutar

Frontend:

```bash
cd frontend-app
npm install
npm start
```

Backend:

```bash
cd backend-app
./mvnw spring-boot:run
```

## Como probar

```bash
cd frontend-app
npm test
npm run build
```

No existe script de lint en `package.json` al momento de esta rama.

## Limitaciones

- La autenticacion sigue siendo visual; no hay token, guard ni interceptor.
- El backend de tareas no entrega todavia el modelo completo.
- La paginacion es local porque el backend actual no soporta paginacion.
- El Gantt es una vista temporal de cronograma.
- La creacion de tareas esta deshabilitada visualmente hasta contar con contrato completo.

## Trabajo pendiente

- Rutas hijas lazy por feature.
- Guards e interceptor HTTP.
- Backend completo de workspaces, proyectos, listas, tareas, comentarios, adjuntos y actividad.
- Campos personalizados.
- Constructor de formularios.
- Formularios que crean tareas.
- Plantillas.
- Paneles configurables.
- Registro de tiempo.
- Documentos.
