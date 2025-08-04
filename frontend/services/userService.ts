import { Employee } from './employeeService';

export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  roleName: string;
  employeeId?: number;
  employeeName?: string;
  isActive: boolean;
  photoUrl?: string;
  salary?: number;
  createdAt: string;
  updatedAt: string;
  // Informations employé complètes
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    hireDate?: string;
    status: string;
    photoUrl?: string;
    salary?: number;
    jobTitle?: {
      id: number;
      name: string;
    };
    department?: {
      id: number;
      name: string;
    };
  };
  // Informations rôle complètes
  role?: {
    id: number;
    name: string;
    permissions: string;
  };
}

export interface CreateUserData {
  username: string;
  email: string;
  password?: string;
  roleId: number;
  employeeId?: number;
  photoUrl?: string;
  salary?: number;
  // Informations employé obligatoires
  firstName: string;
  lastName: string;
  phone: string;
  departmentId: number;
  jobTitleId: number;
  // Informations employé optionnelles
  address?: string;
  birthDate?: string;
  hireDate?: string;
  status?: string;
  managerId?: number;
  city?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  roleId?: number;
  employeeId?: number;
  isActive?: boolean;
  photoUrl?: string;
  salary?: number;
  // Informations employé
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  hireDate?: string;
  status?: string;
  // Informations supplémentaires
  city?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  managerId?: number;
  departmentId?: number;
  jobTitleId?: number;
}

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  byRole: { [key: string]: number };
}

class UserService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Inclure les cookies
      ...options,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  // Récupérer les statistiques des utilisateurs
  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>('/users/stats');
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserData): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Mettre à jour un utilisateur
  async updateUser(id: number, userData: UpdateUserData): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Supprimer un utilisateur
  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Suspendre un utilisateur
  async suspendUser(id: number, reason?: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Réactiver un utilisateur
  async reactivateUser(id: number): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}/reactivate`, {
      method: 'PUT',
    });
  }

  // Réinitialiser le mot de passe d'un utilisateur
  async resetUserPassword(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}/reset-password`, {
      method: 'PUT',
    });
  }

  // Définir un nouveau mot de passe avec token
  async setNewPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/users/set-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Rechercher des utilisateurs
  async searchUsers(query: string): Promise<User[]> {
    return this.request<User[]>(`/users/search/${encodeURIComponent(query)}`);
  }

  // Toggle le statut d'un utilisateur (compatibilité)
  async toggleUserStatus(id: number, isActive: boolean): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  // Récupérer les employés disponibles (sans compte utilisateur)
  async getAvailableEmployees(): Promise<Employee[]> {
    const users = await this.getAllUsers();
    const employeesWithUsers = users
      .filter(user => user.employeeId)
      .map(user => user.employeeId);

    // Cette fonction nécessiterait un endpoint backend pour récupérer les employés sans compte
    // Pour l'instant, on retourne un tableau vide
    return [];
  }

  // Récupérer les rôles disponibles
  async getAvailableRoles(): Promise<any[]> {
    try {
      const response = await this.request<any[]>('/roles');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
      throw new Error('Impossible de récupérer la liste des rôles');
    }
  }

  // Valider les données de création d'utilisateur
  validateCreateUserData(data: CreateUserData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.username || data.username.trim().length < 3) {
      errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('L\'email n\'est pas valide');
    }

    if (!data.roleId || data.roleId <= 0) {
      errors.push('Un rôle doit être sélectionné');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Formater les données d'utilisateur pour l'affichage
  formatUserForDisplay(user: User): User & {
    statusBadge: string;
    statusColor: string;
    formattedCreatedAt: string;
  } {
    const statusBadge = user.isActive ? 'Actif' : 'Suspendu';
    const statusColor = user.isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';

    const formattedCreatedAt = new Date(user.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      ...user,
      statusBadge,
      statusColor,
      formattedCreatedAt
    };
  }
}

export const userService = new UserService(); 