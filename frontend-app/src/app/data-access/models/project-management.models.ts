export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'GUEST';

export type Permission =
  | 'workspace.read'
  | 'workspace.manage'
  | 'project.read'
  | 'project.create'
  | 'project.update'
  | 'project.delete'
  | 'task.read'
  | 'task.create'
  | 'task.update'
  | 'task.delete'
  | 'task.assign'
  | 'task.comment'
  | 'document.manage'
  | 'dashboard.manage';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'blocked' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  displayName: string;
  email: string;
  role: WorkspaceRole;
}

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  memberIds: string[];
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  displayName: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  color: string;
  archived: boolean;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: WorkspaceRole;
}

export interface ProjectList {
  id: string;
  projectId: string;
  name: string;
  statusIds: TaskStatus[];
  order: number;
}

export interface TaskAssignee {
  id: string;
  displayName: string;
  email?: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  actorId: string;
  actorName: string;
  action: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
}

export interface Task {
  id: string;
  projectId: string;
  listId: string;
  parentTaskId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds: string[];
  startDate: string;
  dueDate: string;
  estimatedDuration: number;
  progress: number;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archived: boolean;
  version?: number;
  subtasks: Task[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  dependencies: TaskDependency[];
  activity: TaskActivity[];
}

export interface TaskQuery {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  sortBy: 'title' | 'status' | 'priority' | 'dueDate' | 'progress';
  sortDirection: 'asc' | 'desc';
  pageIndex: number;
  pageSize: number;
}

export interface TaskPage {
  items: Task[];
  total: number;
}

export interface ApiTaskDto {
  codigo: string;
  nombre: string;
  estado: string;
  responsable: string;
  prioridad: string;
}
