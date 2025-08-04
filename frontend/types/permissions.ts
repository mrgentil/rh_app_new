// Définition des permissions disponibles dans le système
export const PERMISSIONS = {
  // Gestion des employés
  EMPLOYEES: {
    VIEW: 'employees:view',
    CREATE: 'employees:create',
    EDIT: 'employees:edit',
    DELETE: 'employees:delete',
    VIEW_SALARY: 'employees:view_salary',
    EDIT_SALARY: 'employees:edit_salary',
    VIEW_PERSONAL: 'employees:view_personal',
    EDIT_PERSONAL: 'employees:edit_personal',
  },
  
  // Gestion des utilisateurs
  USERS: {
    VIEW: 'users:view',
    CREATE: 'users:create',
    EDIT: 'users:edit',
    DELETE: 'users:delete',
    SUSPEND: 'users:suspend',
    ACTIVATE: 'users:activate',
  },
  
  // Gestion des rôles
  ROLES: {
    VIEW: 'roles:view',
    CREATE: 'roles:create',
    EDIT: 'roles:edit',
    DELETE: 'roles:delete',
  },
  
  // Gestion des départements
  DEPARTMENTS: {
    VIEW: 'departments:view',
    CREATE: 'departments:create',
    EDIT: 'departments:edit',
    DELETE: 'departments:delete',
  },
  
  // Gestion des congés
  LEAVES: {
    VIEW: 'leaves:view',
    CREATE: 'leaves:create',
    EDIT: 'leaves:edit',
    DELETE: 'leaves:delete',
    APPROVE: 'leaves:approve',
    REJECT: 'leaves:reject',
    VIEW_ALL: 'leaves:view_all',
  },
  
  // Gestion de la paie
  PAYROLL: {
    VIEW: 'payroll:view',
    CREATE: 'payroll:create',
    EDIT: 'payroll:edit',
    DELETE: 'payroll:delete',
    PROCESS: 'payroll:process',
    VIEW_ALL: 'payroll:view_all',
  },
  
  // Gestion des documents
  DOCUMENTS: {
    VIEW: 'documents:view',
    UPLOAD: 'documents:upload',
    DELETE: 'documents:delete',
    VIEW_ALL: 'documents:view_all',
  },
  
  // Audit et logs
  AUDIT: {
    VIEW: 'audit:view',
    EXPORT: 'audit:export',
  },
  
  // Notifications
  NOTIFICATIONS: {
    VIEW: 'notifications:view',
    SEND: 'notifications:send',
    MANAGE: 'notifications:manage',
  },
  
  // Tableau de bord
  DASHBOARD: {
    VIEW: 'dashboard:view',
    VIEW_STATS: 'dashboard:view_stats',
    VIEW_FINANCIAL: 'dashboard:view_financial',
  },
  
  // Administration système
  SYSTEM: {
    CONFIGURE: 'system:configure',
    BACKUP: 'system:backup',
    RESTORE: 'system:restore',
  }
};

// Rôles prédéfinis avec leurs permissions
export const ROLE_PERMISSIONS = {
  ADMIN: [
    // Toutes les permissions
    'all'
  ],
  
  RH: [
    // Employés
    PERMISSIONS.EMPLOYEES.VIEW,
    PERMISSIONS.EMPLOYEES.CREATE,
    PERMISSIONS.EMPLOYEES.EDIT,
    PERMISSIONS.EMPLOYEES.VIEW_SALARY,
    PERMISSIONS.EMPLOYEES.EDIT_SALARY,
    PERMISSIONS.EMPLOYEES.VIEW_PERSONAL,
    PERMISSIONS.EMPLOYEES.EDIT_PERSONAL,
    
    // Utilisateurs
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.EDIT,
    PERMISSIONS.USERS.SUSPEND,
    PERMISSIONS.USERS.ACTIVATE,
    
    // Rôles
    PERMISSIONS.ROLES.VIEW,
    
    // Départements
    PERMISSIONS.DEPARTMENTS.VIEW,
    PERMISSIONS.DEPARTMENTS.CREATE,
    PERMISSIONS.DEPARTMENTS.EDIT,
    
    // Congés
    PERMISSIONS.LEAVES.VIEW_ALL,
    PERMISSIONS.LEAVES.APPROVE,
    PERMISSIONS.LEAVES.REJECT,
    
    // Paie
    PERMISSIONS.PAYROLL.VIEW_ALL,
    PERMISSIONS.PAYROLL.CREATE,
    PERMISSIONS.PAYROLL.EDIT,
    PERMISSIONS.PAYROLL.PROCESS,
    
    // Documents
    PERMISSIONS.DOCUMENTS.VIEW_ALL,
    PERMISSIONS.DOCUMENTS.UPLOAD,
    PERMISSIONS.DOCUMENTS.DELETE,
    
    // Notifications
    PERMISSIONS.NOTIFICATIONS.VIEW,
    PERMISSIONS.NOTIFICATIONS.SEND,
    
    // Tableau de bord
    PERMISSIONS.DASHBOARD.VIEW,
    PERMISSIONS.DASHBOARD.VIEW_STATS,
    PERMISSIONS.DASHBOARD.VIEW_FINANCIAL,
  ],
  
  MANAGER: [
    // Employés (limité à son département)
    PERMISSIONS.EMPLOYEES.VIEW,
    PERMISSIONS.EMPLOYEES.VIEW_PERSONAL,
    
    // Congés
    PERMISSIONS.LEAVES.VIEW,
    PERMISSIONS.LEAVES.APPROVE,
    PERMISSIONS.LEAVES.REJECT,
    
    // Documents
    PERMISSIONS.DOCUMENTS.VIEW,
    PERMISSIONS.DOCUMENTS.UPLOAD,
    
    // Notifications
    PERMISSIONS.NOTIFICATIONS.VIEW,
    
    // Tableau de bord
    PERMISSIONS.DASHBOARD.VIEW,
    PERMISSIONS.DASHBOARD.VIEW_STATS,
  ],
  
  EMPLOYEE: [
    // Employés (seulement son profil)
    PERMISSIONS.EMPLOYEES.VIEW,
    PERMISSIONS.EMPLOYEES.VIEW_PERSONAL,
    
    // Congés
    PERMISSIONS.LEAVES.VIEW,
    PERMISSIONS.LEAVES.CREATE,
    PERMISSIONS.LEAVES.EDIT,
    
    // Documents
    PERMISSIONS.DOCUMENTS.VIEW,
    PERMISSIONS.DOCUMENTS.UPLOAD,
    
    // Notifications
    PERMISSIONS.NOTIFICATIONS.VIEW,
    
    // Tableau de bord
    PERMISSIONS.DASHBOARD.VIEW,
  ]
};

// Types TypeScript
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];
export type RoleName = keyof typeof ROLE_PERMISSIONS;

// Interface pour les permissions utilisateur
export interface UserPermissions {
  permissions: Permission[];
  role: RoleName;
  departmentId?: number;
  isManager?: boolean;
}

// Fonction utilitaire pour vérifier les permissions
export function hasPermission(userPermissions: string[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('all');
}

// Fonction pour obtenir les permissions d'un rôle
export function getRolePermissions(roleName: RoleName): Permission[] {
  return ROLE_PERMISSIONS[roleName] || [];
} 