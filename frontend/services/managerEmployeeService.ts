import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configuration axios avec authentification par cookies (uniforme avec managerTeamService)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Utiliser les cookies pour l'authentification
});

// Intercepteur pour debug
api.interceptors.request.use((config) => {
  console.log('📤 ManagerEmployeeService - Envoi requête:', config.url);
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 ManagerEmployeeService - Erreur 401:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export interface ManagerEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  team: string;
  status: 'actif' | 'inactif' | 'congé';
  hireDate: string;
  birthDate: string;
  address: string;
  contractType: string;
  salary: number;
  profilePicture?: string;
}

export interface ManagerEmployeePersonal extends ManagerEmployee {
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  jobTitleDetails?: {
    title: string;
    description: string;
    requirements: string;
  };
  departmentDetails?: {
    name: string;
    description: string;
  };
  teamDetails?: {
    name: string;
    description: string;
  };
  contractDetails?: {
    type: string;
    salary: number;
    startDate: string;
    endDate?: string;
    benefits?: string;
  };
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitleId: number;
  departmentId: number;
  teamId: number;
  hireDate: string;
  birthDate: string;
  address: string;
  contractType: string;
  salary: number;
}

export interface TeamStats {
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
  departments: Array<{
    departmentId: number;
    name: string;
    count: number;
  }>;
  jobTitles: Array<{
    jobTitleId: number;
    title: string;
    count: number;
  }>;
  teams: number;
}

class ManagerEmployeeService {
  // Plus besoin de getAuthHeaders car on utilise les cookies
  // Méthode conservée pour compatibilité mais vide
  private getAuthHeaders() {
    return {}; // Les cookies sont automatiquement envoyés
  }

  /**
   * Récupère tous les employés de l'équipe du manager
   * Permission: employees:view_team
   */
  async getTeamEmployees(): Promise<ManagerEmployee[]> {
    try {
      const response = await api.get('/manager/employees/team');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération de l\'équipe');
      }
    } catch (error) {
      console.error('Erreur getTeamEmployees:', error);
      throw error;
    }
  }

  /**
   * Récupère les informations personnelles détaillées d'un employé de l'équipe
   * Permission: employees:view_personal_team
   */
  async getEmployeePersonalInfo(employeeId: number): Promise<ManagerEmployeePersonal> {
    try {
      const response = await api.get(`/manager/employees/team/${employeeId}/personal`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération des informations personnelles');
      }
    } catch (error) {
      console.error('Erreur getEmployeePersonalInfo:', error);
      throw error;
    }
  }

  /**
   * Crée un nouvel employé dans l'équipe du manager
   * Permission: employees:create_team
   */
  async createTeamEmployee(employeeData: CreateEmployeeData): Promise<ManagerEmployee> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/manager/employees/team`,
        employeeData,
        this.getAuthHeaders()
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erreur lors de la création de l\'employé');
      }
    } catch (error) {
      console.error('Erreur createTeamEmployee:', error);
      throw error;
    }
  }

  /**
   * Modifie un employé de l'équipe du manager
   * Permission: employees:edit_team
   */
  async updateTeamEmployee(employeeId: number, employeeData: Partial<CreateEmployeeData>): Promise<ManagerEmployee> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/manager/employees/team/${employeeId}`,
        employeeData,
        this.getAuthHeaders()
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour de l\'employé');
      }
    } catch (error) {
      console.error('Erreur updateTeamEmployee:', error);
      throw error;
    }
  }

  /**
   * Exporte les données des employés de l'équipe en CSV
   * Permission: employees:export_team
   */
  async exportTeamEmployeesCSV(): Promise<void> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/manager/employees/team/export?format=csv`,
        {
          ...this.getAuthHeaders(),
          responseType: 'blob'
        }
      );
      
      // Créer un lien de téléchargement
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `equipe_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur exportTeamEmployeesCSV:', error);
      throw error;
    }
  }

  /**
   * Exporte les données des employés de l'équipe en JSON
   * Permission: employees:export_team
   */
  async exportTeamEmployeesJSON(): Promise<any> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/manager/employees/team/export?format=json`,
        this.getAuthHeaders()
      );
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Erreur exportTeamEmployeesJSON:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques de l'équipe
   */
  async getTeamStats(): Promise<TeamStats> {
    try {
      const response = await api.get('/manager/employees/team/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération des statistiques');
      }
    } catch (error) {
      console.error('Erreur getTeamStats:', error);
      throw error;
    }
  }

  /**
   * Recherche des employés dans l'équipe
   */
  async searchTeamEmployees(searchTerm: string, filters?: {
    status?: string;
    department?: string;
    jobTitle?: string;
  }): Promise<ManagerEmployee[]> {
    try {
      const employees = await this.getTeamEmployees();
      
      return employees.filter(employee => {
        const matchesSearch = !searchTerm || 
          employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !filters?.status || employee.status === filters.status;
        const matchesDepartment = !filters?.department || employee.department === filters.department;
        const matchesJobTitle = !filters?.jobTitle || employee.jobTitle === filters.jobTitle;
        
        return matchesSearch && matchesStatus && matchesDepartment && matchesJobTitle;
      });
    } catch (error) {
      console.error('Erreur searchTeamEmployees:', error);
      throw error;
    }
  }

  /**
   * Valide les données d'un employé avant création/modification
   */
  validateEmployeeData(data: Partial<CreateEmployeeData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.firstName?.trim()) {
      errors.push('Le prénom est requis');
    }

    if (!data.lastName?.trim()) {
      errors.push('Le nom est requis');
    }

    if (!data.email?.trim()) {
      errors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('L\'email n\'est pas valide');
    }

    if (!data.phone?.trim()) {
      errors.push('Le téléphone est requis');
    }

    if (!data.jobTitleId) {
      errors.push('Le poste est requis');
    }

    if (!data.departmentId) {
      errors.push('Le département est requis');
    }

    if (!data.teamId) {
      errors.push('L\'équipe est requise');
    }

    if (!data.hireDate) {
      errors.push('La date d\'embauche est requise');
    }

    if (data.salary && data.salary <= 0) {
      errors.push('Le salaire doit être positif');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const managerEmployeeService = new ManagerEmployeeService();
