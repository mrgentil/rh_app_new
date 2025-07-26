import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Configuration de l'API - utiliser les rewrites Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface User {
  id: number;
  username: string;
  role: string;
  permissions: string;
  employeeId: number | null;
  employee?: {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  const checkAuth = async () => {
    if (!mounted || authChecked) return;
    
    try {
      console.log('🔍 Vérification de l\'authentification...');
      const response = await axios.get(`${API_BASE_URL}/auth/me`, { 
        withCredentials: true 
      });
      console.log('✅ Utilisateur authentifié:', response.data);
      setUser(response.data);
    } catch (error) {
      console.log('❌ Non authentifié ou erreur:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Tentative de connexion...');
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      }, { withCredentials: true });
      
      console.log('✅ Connexion réussie:', response.data.user);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Déconnexion...');
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
    } finally {
      setUser(null);
      setAuthChecked(false);
      // Redirection simple après déconnexion
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    if (mounted && !authChecked) {
      checkAuth();
    }
  }, [mounted, authChecked]);

  const value = {
    user,
    loading: !mounted || loading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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