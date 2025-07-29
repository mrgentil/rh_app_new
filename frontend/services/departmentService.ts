import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentData {
  name: string;
  description?: string;
  managerId?: number;
}

export interface UpdateDepartmentData {
  name?: string;
  description?: string;
  managerId?: number;
}

class DepartmentService {
  async getAllDepartments(): Promise<Department[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      throw new Error('Impossible de récupérer les départements');
    }
  }

  async getDepartmentById(id: number): Promise<Department> {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du département:', error);
      throw new Error('Impossible de récupérer le département');
    }
  }

  async createDepartment(data: CreateDepartmentData): Promise<Department> {
    try {
      const response = await axios.post(`${API_BASE_URL}/departments`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du département:', error);
      throw new Error('Impossible de créer le département');
    }
  }

  async updateDepartment(id: number, data: UpdateDepartmentData): Promise<Department> {
    try {
      const response = await axios.put(`${API_BASE_URL}/departments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du département:', error);
      throw new Error('Impossible de mettre à jour le département');
    }
  }

  async deleteDepartment(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/departments/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du département:', error);
      throw new Error('Impossible de supprimer le département');
    }
  }
}

export const departmentService = new DepartmentService(); 