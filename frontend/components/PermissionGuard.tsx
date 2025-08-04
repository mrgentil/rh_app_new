import { useAuth } from '../hooks/useAuth';
import { PERMISSIONS } from '../types/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  roles?: string[];
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export default function PermissionGuard({
  children,
  permission,
  permissions = [],
  roles = [],
  fallback = null,
  showFallback = false
}: PermissionGuardProps) {
  const { user } = useAuth();

  // Fonction pour vérifier les permissions
  const hasPermission = (): boolean => {
    if (!user?.permissions) return false;
    
    try {
      const userPermissions = Array.isArray(user.permissions) 
        ? user.permissions 
        : JSON.parse(user.permissions);
      
      // Vérifier si l'utilisateur a toutes les permissions
      if (permissions.length > 0) {
        return permissions.every(perm => 
          userPermissions.includes(perm) || userPermissions.includes('all')
        );
      }
      
      // Vérifier une permission spécifique
      if (permission) {
        return userPermissions.includes(permission) || userPermissions.includes('all');
      }
      
      return true;
    } catch {
      return false;
    }
  };

  // Fonction pour vérifier les rôles
  const hasRole = (): boolean => {
    if (roles.length === 0) return true;
    if (!user?.role) return false;
    
    return roles.includes(user.role);
  };

  // Vérifier si l'utilisateur a les permissions et rôles requis
  const isAuthorized = hasPermission() && hasRole();

  // Si non autorisé et qu'on doit afficher le fallback
  if (!isAuthorized && showFallback) {
    return <>{fallback}</>;
  }

  // Si non autorisé, ne rien afficher
  if (!isAuthorized) {
    return null;
  }

  // Si autorisé, afficher le contenu
  return <>{children}</>;
}

// Composants spécialisés pour différents types d'actions
export function CreateButton({ children, permission, ...props }: any) {
  return (
    <PermissionGuard permission={permission}>
      <button
        {...props}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {children}
      </button>
    </PermissionGuard>
  );
}

export function EditButton({ children, permission, ...props }: any) {
  return (
    <PermissionGuard permission={permission}>
      <button
        {...props}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
      >
        {children}
      </button>
    </PermissionGuard>
  );
}

export function DeleteButton({ children, permission, ...props }: any) {
  return (
    <PermissionGuard permission={permission}>
      <button
        {...props}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
      >
        {children}
      </button>
    </PermissionGuard>
  );
}

export function ViewButton({ children, permission, ...props }: any) {
  return (
    <PermissionGuard permission={permission}>
      <button
        {...props}
        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
      >
        {children}
      </button>
    </PermissionGuard>
  );
}

// Composant pour les liens protégés
export function ProtectedLink({ children, permission, roles, href, ...props }: any) {
  return (
    <PermissionGuard permission={permission} roles={roles}>
      <a href={href} {...props}>
        {children}
      </a>
    </PermissionGuard>
  );
}

// Composant pour les sections protégées
export function ProtectedSection({ children, permission, roles, title, fallback }: any) {
  return (
    <PermissionGuard 
      permission={permission} 
      roles={roles}
      fallback={fallback}
      showFallback={true}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {title && (
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        )}
        {children}
      </div>
    </PermissionGuard>
  );
} 