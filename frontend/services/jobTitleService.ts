import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface JobTitle {
  id: number;
  name: string;
  description?: string;
  level?: number;
  departmentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobTitleData {
  name: string;
  description?: string;
  level?: number;
  departmentId?: number;
}

export interface UpdateJobTitleData {
  name?: string;
  description?: string;
  level?: number;
  departmentId?: number;
}

class JobTitleService {
  async getAllJobTitles(): Promise<JobTitle[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/job-titles`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des postes:', error);
      throw new Error('Impossible de récupérer les postes');
    }
  }

  async getJobTitleById(id: number): Promise<JobTitle> {
    try {
      const response = await axios.get(`${API_BASE_URL}/job-titles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du poste:', error);
      throw new Error('Impossible de récupérer le poste');
    }
  }

  async createJobTitle(data: CreateJobTitleData): Promise<JobTitle> {
    try {
      const response = await axios.post(`${API_BASE_URL}/job-titles`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du poste:', error);
      throw new Error('Impossible de créer le poste');
    }
  }

  async updateJobTitle(id: number, data: UpdateJobTitleData): Promise<JobTitle> {
    try {
      const response = await axios.put(`${API_BASE_URL}/job-titles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du poste:', error);
      throw new Error('Impossible de mettre à jour le poste');
    }
  }

  async deleteJobTitle(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/job-titles/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du poste:', error);
      throw new Error('Impossible de supprimer le poste');
    }
  }
}

export const jobTitleService = new JobTitleService(); 