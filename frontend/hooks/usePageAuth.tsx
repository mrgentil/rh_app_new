import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';

interface UsePageAuthOptions {
  requiredRole?: string;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function usePageAuth(options: UsePageAuthOptions = {}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Attendre que l'authentification soit terminée
    if (authLoading) {
      return;
    }

    // Si pas d'utilisateur, rediriger vers login
    if (!user) {
      router.push('/login');
      return;
    }

    // Vérifier les rôles requis
    if (options.requiredRole && user.role !== options.requiredRole) {
      router.push(options.redirectTo || '/unauthorized');
      return;
    }

    if (options.requiredRoles && !options.requiredRoles.includes(user.role)) {
      router.push(options.redirectTo || '/unauthorized');
      return;
    }

    // Page prête
    setPageReady(true);
  }, [user?.role, authLoading, options.requiredRole, options.requiredRoles, options.redirectTo, router]);

  return {
    user,
    authLoading,
    pageReady,
    isAuthenticated: !!user
  };
} 