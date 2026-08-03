CREATE TABLE IF NOT EXISTS users_app (
  user_id INTEGER PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  team_name VARCHAR(80),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS projects (
  project_id INTEGER PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_status VARCHAR(255) NOT NULL,
  starts_on DATE,
  due_on DATE
);

CREATE TABLE IF NOT EXISTS tasks (
  task_id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(project_id),
  task_title VARCHAR(255) NOT NULL,
  task_status VARCHAR(255) NOT NULL,
  priority_level VARCHAR(255) NOT NULL,
  due_on DATE
);

CREATE TABLE IF NOT EXISTS task_assignments (
  assignment_id INTEGER PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(task_id),
  user_id INTEGER NOT NULL REFERENCES users_app(user_id),
  assigned_on DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS task_updates (
  update_id INTEGER PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(task_id),
  update_note VARCHAR(240) NOT NULL,
  progress_percent INTEGER NOT NULL CHECK (progress_percent >= 0 AND progress_percent <= 100),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS mensajes (
  id BIGSERIAL PRIMARY KEY,
  texto VARCHAR(255),
  remitente VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_user_id ON task_assignments(user_id);

INSERT INTO users_app (user_id, full_name, team_name, active) VALUES
  (1, 'Andrea Ruiz', 'platform', TRUE),
  (2, 'Diego Nava', 'analytics', TRUE),
  (3, 'Fernanda Gil', 'platform', TRUE)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO projects (project_id, project_name, project_status, starts_on, due_on) VALUES
  (101, 'Task board redesign', 'active', '2026-06-01', '2026-06-30'),
  (102, 'Usage analytics cleanup', 'active', '2026-06-05', '2026-07-10'),
  (103, 'Billing sync review', 'planning', '2026-06-20', '2026-07-25')
ON CONFLICT (project_id) DO NOTHING;

INSERT INTO tasks (task_id, project_id, task_title, task_status, priority_level, due_on) VALUES
  (1001, 101, 'Refine backlog filters', 'in_progress', 'high', '2026-06-18'),
  (1002, 101, 'Fix board swimlanes', 'todo', 'medium', '2026-06-21'),
  (1003, 102, 'Rebuild retention query', 'blocked', 'high', '2026-06-17'),
  (1004, 102, 'Validate event taxonomy', 'done', 'medium', '2026-06-12')
ON CONFLICT (task_id) DO NOTHING;

INSERT INTO task_assignments (assignment_id, task_id, user_id, assigned_on) VALUES
  (1, 1001, 1, '2026-06-06'),
  (2, 1002, 3, '2026-06-10'),
  (3, 1003, 2, '2026-06-07'),
  (4, 1004, 2, '2026-06-05'),
  (5, 1003, 1, '2026-06-08')
ON CONFLICT (assignment_id) DO NOTHING;

INSERT INTO task_updates (update_id, task_id, update_note, progress_percent, created_at) VALUES
  (501, 1001, 'UI draft accepted', 60, '2026-06-12 10:00:00'),
  (502, 1003, 'Blocked by missing source mapping', 25, '2026-06-13 16:15:00'),
  (503, 1004, 'Validation completed', 100, '2026-06-12 18:40:00')
ON CONFLICT (update_id) DO NOTHING;
