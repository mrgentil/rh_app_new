import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configuration axios avec cookies
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important pour envoyer les cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Role {
  id: number;
  name: string;
  permissions: string;
  createdAt: string;
  updatedAt: string;
  userCount?: number;
}

export interface CreateRoleData {
  name: string;
  permissions: string;
}

export interface UpdateRoleData {
  name?: string;
  permissions?: string;
}

class RoleService {
  async getAllRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
      throw new Error('Impossible de récupérer les rôles');
    }
  }

  async getRoleById(id: number): Promise<Role> {
    try {
      const response = await apiClient.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle:', error);
      throw new Error('Impossible de récupérer le rôle');
    }
  }

  async createRole(data: CreateRoleData): Promise<Role> {
    try {
      const response = await apiClient.post('/roles', data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du rôle:', error);
      if (error.response?.status === 401) {
        throw new Error('Vous devez être connecté pour créer un rôle');
      } else if (error.response?.status === 403) {
        throw new Error('Vous devez avoir le rôle Administrateur pour créer un rôle');
      } else {
        throw new Error(error.response?.data?.error || 'Impossible de créer le rôle');
      }
    }
  }

  async updateRole(id: number, data: UpdateRoleData): Promise<Role> {
    try {
      const response = await apiClient.put(`/roles/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      if (error.response?.status === 401) {
        throw new Error('Vous devez être connecté pour modifier un rôle');
      } else if (error.response?.status === 403) {
        throw new Error('Vous devez avoir le rôle Administrateur pour modifier un rôle');
      } else {
        throw new Error(error.response?.data?.error || 'Impossible de mettre à jour le rôle');
      }
    }
  }

  async deleteRole(id: number): Promise<void> {
    try {
      await apiClient.delete(`/roles/${id}`);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du rôle:', error);
      if (error.response?.status === 401) {
        throw new Error('Vous devez être connecté pour supprimer un rôle');
      } else if (error.response?.status === 403) {
        throw new Error('Vous devez avoir le rôle Administrateur pour supprimer un rôle');
      } else {
        throw new Error(error.response?.data?.error || 'Impossible de supprimer le rôle');
      }
    }
  }

  // Méthode utilitaire pour parser les permissions
  parsePermissions(permissionsString: string): string[] {
    try {
      const permissions = JSON.parse(permissionsString);
      return Array.isArray(permissions) ? permissions : [];
    } catch {
      return [];
    }
  }

  // Méthode utilitaire pour formater les permissions
  formatPermissions(permissions: string[]): string {
    return JSON.stringify(permissions);
  }

  // Méthode pour obtenir les permissions prédéfinies
  getPredefinedPermissions() {
    return {
      'employee.view': 'Voir la liste des employés',
      'employee.create': 'Ajouter un employé',
      'employee.update': 'Modifier un employé',
      'employee.delete': 'Supprimer un employé',
      'employee.export': 'Exporter les données employés',
      'payroll.view': 'Voir les salaires',
      'payroll.update': 'Modifier les salaires',
      'payroll.generate': 'Générer les fiches de paie',
      'payroll.export': 'Exporter les données de paie',
      'leave.view': 'Voir les demandes de congés',
      'leave.approve': 'Approuver/refuser les congés',
      'leave.manage': 'Gérer le calendrier des congés',
      'leave.request': 'Demander des congés',
      'user.view': 'Voir la liste des utilisateurs',
      'user.create': 'Créer un utilisateur',
      'user.update': 'Modifier un utilisateur',
      'user.delete': 'Supprimer un utilisateur',
      'user.suspend': 'Suspendre un utilisateur',
      'role.view': 'Voir les rôles',
      'role.create': 'Créer un rôle',
      'role.update': 'Modifier un rôle',
      'role.delete': 'Supprimer un rôle',
      'department.view': 'Voir les départements',
      'department.create': 'Créer un département',
      'department.update': 'Modifier un département',
      'department.delete': 'Supprimer un département',
      'system.logs': 'Voir les logs système',
      'system.settings': 'Modifier les paramètres système',
      'system.backup': 'Gérer les sauvegardes',
      'reports.view': 'Voir les rapports',
      'reports.generate': 'Générer des rapports',
      'reports.export': 'Exporter les rapports',
      'audit.view': 'Voir les logs d\'audit',
      'audit.export': 'Exporter les logs d\'audit'
    };
  }

  // Méthode pour obtenir les rôles templates
  getRoleTemplates() {
    return {
      'Administrateur': {
        permissions: Object.keys(this.getPredefinedPermissions()),
        description: 'Accès complet à toutes les fonctionnalités du système'
      },
      'RH': {
        permissions: [
          'employee.view', 'employee.create', 'employee.update', 'employee.export',
          'payroll.view', 'payroll.update', 'payroll.generate', 'payroll.export',
          'leave.view', 'leave.approve', 'leave.manage',
          'user.view', 'user.create', 'user.update',
          'department.view', 'department.create', 'department.update',
          'reports.view', 'reports.generate', 'reports.export'
        ],
        description: 'Gestion des employés, paie, congés et rapports RH'
      },
      'Manager': {
        permissions: [
          'employee.view', 'employee.update',
          'leave.view', 'leave.approve', 'leave.manage',
          'reports.view'
        ],
        description: 'Gestion de l\'équipe et approbation des congés'
      },
      'Employé': {
        permissions: [
          'employee.view',
          'leave.request', 'leave.view',
          'reports.view'
        ],
        description: 'Accès limité à ses propres informations et demandes'
      }
    };
  }
}

export const roleService = new RoleService(); 