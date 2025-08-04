import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { usePageAuth } from '../../hooks/usePageAuth';
import { useToast } from '../../hooks/useToast';

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  jobTitle: {
    title: string;
  };
  department: {
    name: string;
  };
}

interface Objective {
  id: number;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  dueDate: string;
  progress: number;
  employee?: {
    firstName: string;
    lastName: string;
  };
  assignedByEmployee: {
    firstName: string;
    lastName: string;
  };
}

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  priority: string;
  startDate: string;
  endDate?: string;
  progress: number;
  budget?: number;
  client?: string;
}

interface Team {
  id: number;
  name: string;
  description?: string;
  status: string;
  manager: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  department?: {
    id: number;
    name: string;
  };
  members: TeamMember[];
  objectives: Objective[];
  projects: Project[];
}

const TeamDetailPage: React.FC = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { showError } = useToast();
  const router = useRouter();
  const { id } = router.query;

  // Vérifier l'authentification et les permissions
  usePageAuth({ requiredRoles: ['Admin', 'RH', 'Manager'] });

  useEffect(() => {
    if (id) {
      fetchTeam();
    }
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'équipe');
      }

      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors du chargement de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Équipe non trouvée</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              {team.description && (
                <p className="text-gray-600 mt-2">{team.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(team.status)}`}>
                {team.status === 'active' ? 'Active' : team.status === 'inactive' ? 'Inactive' : 'Archivée'}
              </span>
              <button
                onClick={() => router.push(`/teams/${team.id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Modifier
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Manager</h3>
              <p className="text-gray-600">{team.manager.firstName} {team.manager.lastName}</p>
              <p className="text-sm text-gray-500">{team.manager.email}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Département</h3>
              <p className="text-gray-600">{team.department?.name || 'Non assigné'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Membres</h3>
              <p className="text-2xl font-bold text-blue-600">{team.members.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Vue d\'ensemble', icon: '📊' },
              { id: 'members', name: 'Membres', icon: '👥' },
              { id: 'objectives', name: 'Objectifs', icon: '🎯' },
              { id: 'projects', name: 'Projets', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Objectifs récents</h3>
                  <div className="space-y-3">
                    {team.objectives.slice(0, 3).map((objective) => (
                      <div key={objective.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{objective.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(objective.priority)}`}>
                            {objective.priority}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Progression: {objective.progress}%</span>
                          <span>Échéance: {formatDate(objective.dueDate)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(objective.progress)}`}
                            style={{ width: `${objective.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Projets en cours</h3>
                  <div className="space-y-3">
                    {team.projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Progression: {project.progress}%</span>
                          {project.budget && <span>Budget: {project.budget}€</span>}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Membres de l'équipe</h3>
                <button
                  onClick={() => router.push(`/teams/${team.id}/members/add`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Ajouter un membre
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.members.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {member.firstName[0]}{member.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{member.jobTitle.title}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Objectifs de l'équipe</h3>
                <button
                  onClick={() => router.push(`/objectives/nouveau?teamId=${team.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Nouvel objectif
                </button>
              </div>
              <div className="space-y-4">
                {team.objectives.map((objective) => (
                  <div key={objective.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{objective.title}</h4>
                        {objective.description && (
                          <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(objective.priority)}`}>
                          {objective.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(objective.status)}`}>
                          {objective.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Assigné par: {objective.assignedByEmployee.firstName} {objective.assignedByEmployee.lastName}</span>
                      <span>Échéance: {formatDate(objective.dueDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(objective.progress)}`}
                          style={{ width: `${objective.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{objective.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Projets de l'équipe</h3>
                <button
                  onClick={() => router.push(`/projects/nouveau?teamId=${team.id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                >
                  Nouveau projet
                </button>
              </div>
              <div className="space-y-4">
                {team.projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Début:</span> {formatDate(project.startDate)}
                      </div>
                      {project.endDate && (
                        <div>
                          <span className="font-medium">Fin:</span> {formatDate(project.endDate)}
                        </div>
                      )}
                      {project.budget && (
                        <div>
                          <span className="font-medium">Budget:</span> {project.budget}€
                        </div>
                      )}
                      {project.client && (
                        <div>
                          <span className="font-medium">Client:</span> {project.client}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeamDetailPage; 