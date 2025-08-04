import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { usePageAuth } from '../../hooks/usePageAuth';
import { useToast } from '../../hooks/useToast';

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
  department: {
    id: number;
    name: string;
  };
  members: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  }>;
  objectives?: Array<{
    id: number;
    title: string;
    status: string;
    progress: number;
  }>;
  projects?: Array<{
    id: number;
    name: string;
    status: string;
    progress: number;
  }>;
}

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { showError } = useToast();
  const router = useRouter();

  // Vérifier l'authentification et les permissions
  usePageAuth({ requiredRoles: ['Admin', 'RH', 'Manager'] });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des équipes');
      }

      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors du chargement des équipes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Équipes</h1>
          <button
            onClick={() => router.push('/teams/nouveau')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvelle Équipe
          </button>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune équipe</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez par créer votre première équipe.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => router.push(`/teams/${team.id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(team.status)}`}>
                      {team.status === 'active' ? 'Active' : team.status === 'inactive' ? 'Inactive' : 'Archivée'}
                    </span>
                  </div>

                  {team.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{team.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Manager: {team.manager.firstName} {team.manager.lastName}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Département: {team.department?.name || 'Non assigné'}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{team.members.length} membre(s)</span>
                    </div>

                    {team.objectives && team.objectives.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Objectifs en cours</h4>
                        <div className="space-y-2">
                          {team.objectives.slice(0, 2).map((objective) => (
                            <div key={objective.id} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 truncate">{objective.title}</span>
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full ${getProgressColor(objective.progress)}`}
                                    style={{ width: `${objective.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">{objective.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {team.projects && team.projects.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Projets actifs</h4>
                        <div className="space-y-2">
                          {team.projects.slice(0, 2).map((project) => (
                            <div key={project.id} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 truncate">{project.name}</span>
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">{project.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeamsPage; 