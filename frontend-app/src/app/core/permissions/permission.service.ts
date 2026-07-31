import { Injectable, computed, signal } from '@angular/core';
import { Permission, WorkspaceRole } from '../../data-access/models/project-management.models';

const ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  OWNER: [
    'workspace.read',
    'workspace.manage',
    'project.read',
    'project.create',
    'project.update',
    'project.delete',
    'task.read',
    'task.create',
    'task.update',
    'task.delete',
    'task.assign',
    'task.comment',
    'document.manage',
    'dashboard.manage'
  ],
  ADMIN: [
    'workspace.read',
    'workspace.manage',
    'project.read',
    'project.create',
    'project.update',
    'project.delete',
    'task.read',
    'task.create',
    'task.update',
    'task.delete',
    'task.assign',
    'task.comment',
    'document.manage',
    'dashboard.manage'
  ],
  MANAGER: [
    'workspace.read',
    'project.read',
    'project.create',
    'project.update',
    'task.read',
    'task.create',
    'task.update',
    'task.assign',
    'task.comment',
    'dashboard.manage'
  ],
  MEMBER: ['workspace.read', 'project.read', 'task.read', 'task.create', 'task.update', 'task.comment'],
  GUEST: ['workspace.read', 'project.read', 'task.read']
};

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly activeRole = signal<WorkspaceRole>('MANAGER');
  readonly permissions = computed(() => new Set(ROLE_PERMISSIONS[this.activeRole()]));

  has(permission: Permission): boolean {
    return this.permissions().has(permission);
  }
}
