import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaPlus, FaGraduationCap, FaUsers, FaClock, FaCheck, FaPlay, FaBook } from 'react-icons/fa';

interface Training {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: number; // en heures
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'active' | 'completed';
  enrolledCount: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  instructor: string;
}

interface Enrollment {
  id: number;
  trainingId: number;
  employeeName: string;
  enrolledDate: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'cancelled';
  progress: number; // pourcentage
}

export default function TrainingsPage() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trainings');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Données de démonstration
  useEffect(() => {
    setTimeout(() => {
      setTrainings([
        {
          id: 1,
          title: 'Formation Sécurité au Travail',
          description: 'Formation obligatoire sur les règles de sécurité et prévention des risques',
          category: 'Sécurité',
          duration: 4,
          level: 'beginner',
          status: 'active',
          enrolledCount: 12,
          maxParticipants: 20,
          startDate: '2024-02-15',
          endDate: '2024-02-16',
          instructor: 'Dr. Martin Sécurité'
        },
        {
          id: 2,
          title: 'Leadership et Management',
          description: 'Développer ses compétences de leadership pour managers',
          category: 'Management',
          duration: 16,
          level: 'intermediate',
          status: 'active',
          enrolledCount: 8,
          maxParticipants: 15,
          startDate: '2024-03-01',
          endDate: '2024-03-05',
          instructor: 'Sophie Leader'
        },
        {
          id: 3,
          title: 'Communication Efficace',
          description: 'Améliorer ses techniques de communication interpersonnelle',
          category: 'Communication',
          duration: 8,
          level: 'beginner',
          status: 'draft',
          enrolledCount: 0,
          maxParticipants: 25,
          startDate: '2024-04-10',
          endDate: '2024-04-11',
          instructor: 'Marc Communicant'
        }
      ]);

      setEnrollments([
        {
          id: 1,
          trainingId: 1,
          employeeName: 'Jean Dupont',
          enrolledDate: '2024-02-01',
          status: 'completed',
          progress: 100
        },
        {
          id: 2,
          trainingId: 1,
          employeeName: 'Marie Martin',
          enrolledDate: '2024-02-02',
          status: 'in_progress',
          progress: 75
        },
        {
          id: 3,
          trainingId: 2,
          employeeName: 'Pierre Durand',
          enrolledDate: '2024-02-05',
          status: 'enrolled',
          progress: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'enrolled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
          <p className="text-gray-600">Organisez et suivez les formations de votre équipe</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Nouvelle Formation</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaGraduationCap className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Formations Actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {trainings.filter(t => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {trainings.reduce((sum, t) => sum + t.enrolledCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaClock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heures Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {trainings.reduce((sum, t) => sum + t.duration, 0)}h
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaCheck className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Complétées</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrollments.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('trainings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trainings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Formations
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'enrollments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inscriptions
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'trainings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <div key={training.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{training.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(training.status)}`}>
                    {training.status === 'active' ? 'Active' : 
                     training.status === 'draft' ? 'Brouillon' : 'Terminée'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{training.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Catégorie:</span>
                    <span className="font-medium">{training.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Durée:</span>
                    <span className="font-medium">{training.duration}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Niveau:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(training.level)}`}>
                      {training.level === 'beginner' ? 'Débutant' :
                       training.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Participants:</span>
                    <span className="font-medium">{training.enrolledCount}/{training.maxParticipants}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700 flex items-center justify-center space-x-1">
                    <FaPlay className="w-3 h-3" />
                    <span>Gérer</span>
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 flex items-center justify-center space-x-1">
                    <FaBook className="w-3 h-3" />
                    <span>Détails</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'enrollments' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Inscriptions aux Formations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progression
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((enrollment) => {
                  const training = trainings.find(t => t.id === enrollment.trainingId);
                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {enrollment.employeeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{enrollment.employeeName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {training?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(enrollment.enrolledDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEnrollmentStatusColor(enrollment.status)}`}>
                          {enrollment.status === 'enrolled' ? 'Inscrit' :
                           enrollment.status === 'in_progress' ? 'En cours' :
                           enrollment.status === 'completed' ? 'Terminé' : 'Annulé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvelle Formation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Titre de la formation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Description de la formation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Sécurité">Sécurité</option>
                    <option value="Management">Management</option>
                    <option value="Communication">Communication</option>
                    <option value="Technique">Technique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durée (heures)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="8"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
