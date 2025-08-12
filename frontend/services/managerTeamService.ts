import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configuration axios avec authentification par cookies (comme useAuth)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Utiliser les cookies pour l'authentification
});

// Intercepteur pour debug (plus besoin de token localStorage)
api.interceptors.request.use((config) => {
  console.log('📤 Envoi de la requête avec cookies:', config.url);
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 Erreur 401 - Token invalide ou expiré');
      console.error('📍 URL de la requête:', error.config?.url);
      console.error('🔍 Headers envoyés:', error.config?.headers);
      
      // Optionnel : rediriger vers la page de connexion
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface TeamMember {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  status: string;
  hireDate: string;
  photoUrl?: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  departmentId?: number;
  department: string;
  status: string;
  memberCount: number;
  createdAt: string;
}

export interface AvailableEmployee {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  currentTeam: string;
  photoUrl?: string;
  status: string;
}

export interface TeamWithMembers {
  team: {
    id: number;
    name: string;
    description?: string;
  };
  members: TeamMember[];
}

class ManagerTeamService {
  /**
   * Récupère toutes les équipes gérées par le manager connecté
   */
  async getMyTeams(): Promise<{ data: Team[]; total: number }> {
    try {
      const response = await api.get('/manager/team-management/my-teams');
      return response.data;
    } catch (error) {
      console.error('Erreur getMyTeams:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les membres d'une équipe spécifique
   */
  async getTeamMembers(teamId: number): Promise<{ data: TeamWithMembers; total: number }> {
    try {
      const response = await api.get(`/manager/team-management/team/${teamId}/members`);
      return response.data;
    } catch (error) {
      console.error('Erreur getTeamMembers:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les employés disponibles pour être ajoutés à une équipe
   */
  async getAvailableEmployees(params?: {
    search?: string;
    departmentId?: number;
    excludeTeamId?: number;
  }): Promise<{ data: AvailableEmployee[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.departmentId) queryParams.append('departmentId', params.departmentId.toString());
      if (params?.excludeTeamId) queryParams.append('excludeTeamId', params.excludeTeamId.toString());

      const response = await api.get(`/manager/team-management/available-employees?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erreur getAvailableEmployees:', error);
      throw error;
    }
  }

  /**
   * Ajoute un employé à une équipe
   */
  async addMemberToTeam(teamId: number, employeeId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/manager/team-management/team/${teamId}/add-member`, {
        employeeId
      });
      return response.data;
    } catch (error) {
      console.error('Erreur addMemberToTeam:', error);
      throw error;
    }
  }

  /**
   * Retire un employé d'une équipe
   */
  async removeMemberFromTeam(teamId: number, employeeId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/manager/team-management/team/${teamId}/remove-member/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur removeMemberFromTeam:', error);
      throw error;
    }
  }
}

export default new ManagerTeamService();
