import { User, UserRole } from './types';

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export function validateRolePermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    ADMIN: 4,
    MANAGER: 3,
    MEMBER: 2,
    CLIENT: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessModule(role: UserRole, moduleKey: string): boolean {
  if (role === 'ADMIN') return true;
  if (role === 'CLIENT') {
    return ['dashboard', 'portal', 'projects', 'invoices', 'proposals'].includes(moduleKey);
  }
  if (role === 'MEMBER' || role === 'MANAGER') {
    return moduleKey !== 'audit'; // Only admins see raw system audit log
  }
  return true;
}
