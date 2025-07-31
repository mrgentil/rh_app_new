import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  allowedPermissions = [],
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Vérification d'authentification et autorisation
  useEffect(() => {
    if (!mounted || loading) return;

    const currentPath = window.location.pathname;

    // Redirection si non authentifié
    if (!isAuthenticated && currentPath !== '/login') {
      window.location.href = '/login';
      return;
    }

    // Vérification des rôles
    if (allowedRoles.length > 0 && user?.role) {
      const hasRole = allowedRoles.includes(user.role);
      if (!hasRole) {
        window.location.href = '/unauthorized';
        return;
      }
    }

    // Vérification des permissions
    if (allowedPermissions.length > 0 && user?.permissions) {
      try {
        const userPermissions = Array.isArray(user.permissions)
          ? user.permissions
          : JSON.parse(user.permissions);

        const hasPermission = allowedPermissions.some(
          (permission) =>
            userPermissions.includes(permission) ||
            userPermissions.includes('all')
        );

        if (!hasPermission) {
          window.location.href = '/unauthorized';
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des permissions:', error);
        window.location.href = '/unauthorized';
        return;
      }
    }
  }, [mounted, loading, isAuthenticated, user?.role, user?.permissions, allowedRoles, allowedPermissions]);

  // Affichage du loader pendant le chargement
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Si non authentifié, ne rien afficher
  if (!isAuthenticated) {
    return null;
  }

  // Si rôles requis mais utilisateur n'a pas le bon rôle
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Afficher le contenu protégé
  return <>{children}</>;
}
