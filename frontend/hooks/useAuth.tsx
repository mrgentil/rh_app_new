import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useToast } from './useToast';

interface User {
  id: number;
  username: string;
  role: string;
  roleName?: string;
  permissions: string;
  employeeId?: number;
  employee?: any;
  isActive?: boolean;
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkUserStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showError, showInfo } = useToast();

  // Vérifier le statut de l'utilisateur en temps réel
  const checkUserStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('🔍 Données utilisateur reçues:', {
          id: userData.id,
          username: userData.username,
          photoUrl: userData.photoUrl,
          firstName: userData.firstName,
          lastName: userData.lastName,
          employee: userData.employee
        });
        
        // Vérifier si l'utilisateur est toujours actif
        if (!userData.isActive) {
          // Utilisateur suspendu - déconnexion automatique
          showError('Votre compte a été suspendu. Vous avez été déconnecté.');
          logout();
          return;
        }
        
        setUser(userData);
      } else {
        // Token invalide ou expiré
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      setUser(null);
    }
  };

  // Vérification périodique du statut (toutes les 30 secondes)
  useEffect(() => {
    if (user && !loading) {
      const interval = setInterval(checkUserStatus, 30000); // 30 secondes
      return () => clearInterval(interval);
    }
  }, [user, loading]);

  // Vérification lors du changement de page - seulement si l'utilisateur est connecté
  useEffect(() => {
    if (user && !loading && router.pathname) {
      // Éviter les appels multiples en utilisant un debounce
      const timeoutId = setTimeout(() => {
        checkUserStatus();
      }, 500); // Augmenter le debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [router.pathname]); // Retirer user et loading des dépendances

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Vérifier si l'utilisateur est actif
        if (!data.user.isActive) {
          showError('Votre compte est suspendu. Contactez votre administrateur.');
          return false;
        }

        setUser(data.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 Déconnexion en cours...');
      
      // Appel à l'API de déconnexion
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('✅ Déconnexion réussie côté serveur');
      } else {
        console.warn('⚠️ Erreur lors de la déconnexion côté serveur');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer côté client
      console.log('🧹 Nettoyage côté client...');
      setUser(null);
      router.push('/login');
    }
  };

  // Vérification initiale de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Vérifier si l'utilisateur est actif
          if (!userData.isActive) {
            showError('Votre compte a été suspendu. Vous avez été déconnecté.');
            setUser(null);
            router.push('/login');
            return;
          }
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, checkUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 