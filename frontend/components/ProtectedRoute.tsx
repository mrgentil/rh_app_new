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

  useEffect(() => {
    if (!mounted || loading) return;

    const currentPath = window.location.pathname;

    if (!isAuthenticated && currentPath !== '/login') {
      window.location.href = '/login';
      return;
    }

    if (allowedRoles.length > 0) {
      const hasRole = allowedRoles.includes(user?.role || '');
      if (!hasRole) {
        window.location.href = '/unauthorized';
        return;
      }
    }

    if (allowedPermissions.length > 0 && user?.permissions) {
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
    }
  }, [mounted, user, loading, isAuthenticated, allowedRoles, allowedPermissions]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || ''))
    return null;

  return <>{children}</>;
}
