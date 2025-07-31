import axios from 'axios';

// Configuration de l'API
const API_BASE_URL = '/api';

// Types
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  hireDate: string;
  status: string;
  photoUrl?: string;
  salary?: number;
  jobTitleId?: number;
  departmentId?: number;
  managerId?: number;
  contractEndDate?: string;
  employeeType?: string;
  Department?: {
    id: number;
    name: string;
    description: string;
  };
  JobTitle?: {
    id: number;
    title: string;
    description: string;
  };
  Contract?: {
    id: number;
    type: string;
    startDate: string;
    endDate?: string;
    salary: number;
  };
  manager?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  subordinates?: Employee[];
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  birthDate: string;
  hireDate: string;
  status: string;
  photoUrl?: string;
  salary?: number;
  jobTitleId?: number;
  departmentId?: number;
  managerId?: number;
  roleId?: number; // ID du rôle pour créer un compte utilisateur
  contractEndDate?: string;
  employeeType?: string;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {}

// Configuration axios avec credentials
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Rediriger vers login si non authentifié
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service des employés
export const employeeService = {
  // Récupérer tous les employés
  async getAllEmployees(): Promise<Employee[]> {
    const response = await apiClient.get('/employees');
    return response.data;
  },

  // Récupérer un employé par ID
  async getEmployeeById(id: number): Promise<Employee> {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  // Créer un nouvel employé
  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  // Mettre à jour un employé
  async updateEmployee(id: number, data: UpdateEmployeeData): Promise<Employee> {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  },

  // Supprimer un employé
  async deleteEmployee(id: number): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },

  // Exporter en CSV
  async exportToCSV(): Promise<Blob> {
    const response = await apiClient.get('/employees/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Exporter en Excel
  async exportToExcel(): Promise<Blob> {
    const response = await apiClient.get('/employees/export/excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Télécharger le contrat PDF
  async downloadContract(id: number): Promise<Blob> {
    const response = await apiClient.get(`/employees/${id}/contrat`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Rechercher des employés
  async searchEmployees(query: string): Promise<Employee[]> {
    const response = await apiClient.get(`/employees?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Filtrer les employés par département
  async getEmployeesByDepartment(departmentId: number): Promise<Employee[]> {
    const response = await apiClient.get(`/employees?departmentId=${departmentId}`);
    return response.data;
  },

  // Filtrer les employés par statut
  async getEmployeesByStatus(status: string): Promise<Employee[]> {
    const response = await apiClient.get(`/employees?status=${encodeURIComponent(status)}`);
    return response.data;
  }
};

// Utilitaires pour le téléchargement de fichiers
export const downloadUtils = {
  // Télécharger un fichier blob
  downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Télécharger le CSV des employés
  async downloadEmployeesCSV() {
    try {
      const blob = await employeeService.exportToCSV();
      downloadUtils.downloadBlob(blob, 'employes.csv');
    } catch (error) {
      console.error('Erreur lors du téléchargement CSV:', error);
      throw error;
    }
  },

  // Télécharger l'Excel des employés
  async downloadEmployeesExcel() {
    try {
      const blob = await employeeService.exportToExcel();
      downloadUtils.downloadBlob(blob, 'employes.xlsx');
    } catch (error) {
      console.error('Erreur lors du téléchargement Excel:', error);
      throw error;
    }
  },

  // Télécharger le contrat d'un employé
  async downloadEmployeeContract(employeeId: number, employeeName: string) {
    try {
      const blob = await employeeService.downloadContract(employeeId);
      const filename = `contrat_${employeeName.replace(/\s+/g, '_')}.pdf`;
      downloadUtils.downloadBlob(blob, filename);
    } catch (error) {
      console.error('Erreur lors du téléchargement du contrat:', error);
      throw error;
    }
  }
}; 