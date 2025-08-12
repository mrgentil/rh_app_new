import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaPlus, FaStar, FaChartLine, FaUser, FaCalendar, FaEdit, FaEye } from 'react-icons/fa';

interface Performance {
  id: number;
  employeeName: string;
  period: string;
  overallScore: number;
  goals: number;
  skills: number;
  behavior: number;
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  evaluationDate: string;
  evaluator: string;
  comments: string;
}

export default function PerformancePage() {
  const { user } = useAuth();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');

  // Données de démonstration
  useEffect(() => {
    setTimeout(() => {
      setPerformances([
        {
          id: 1,
          employeeName: 'Jean Dupont',
          period: '2024-Q1',
          overallScore: 4.2,
          goals: 4.5,
          skills: 4.0,
          behavior: 4.1,
          status: 'completed',
          evaluationDate: '2024-01-31',
          evaluator: 'Manager Principal',
          comments: 'Excellente performance, objectifs dépassés'
        },
        {
          id: 2,
          employeeName: 'Marie Martin',
          period: '2024-Q1',
          overallScore: 3.8,
          goals: 3.5,
          skills: 4.2,
          behavior: 3.7,
          status: 'in_progress',
          evaluationDate: '2024-02-05',
          evaluator: 'Manager Principal',
          comments: 'Bonne progression, à continuer'
        },
        {
          id: 3,
          employeeName: 'Pierre Durand',
          period: '2024-Q1',
          overallScore: 4.0,
          goals: 4.0,
          skills: 3.8,
          behavior: 4.2,
          status: 'approved',
          evaluationDate: '2024-01-28',
          evaluator: 'Manager Principal',
          comments: 'Performance solide et constante'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && <FaStar className="w-4 h-4 text-yellow-400 fill-current opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-medium">{score.toFixed(1)}</span>
      </div>
    );
  };

  const getAverageScore = () => {
    if (performances.length === 0) return 0;
    const total = performances.reduce((sum, p) => sum + p.overallScore, 0);
    return (total / performances.length).toFixed(1);
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
          <h1 className="text-2xl font-bold text-gray-900">Évaluations de Performance</h1>
          <p className="text-gray-600">Évaluez et suivez les performances de votre équipe</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="2024-Q1">Q1 2024</option>
            <option value="2023-Q4">Q4 2023</option>
            <option value="2023-Q3">Q3 2023</option>
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Nouvelle Évaluation</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaChartLine className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Score Moyen</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageScore()}/5</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaUser className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Évaluées</p>
              <p className="text-2xl font-bold text-gray-900">
                {performances.filter(p => p.status === 'completed' || p.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaCalendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {performances.filter(p => p.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaStar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Excellentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {performances.filter(p => p.overallScore >= 4.5).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique de performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des Performances</h3>
        <div className="h-64 flex items-end justify-center space-x-4">
          {performances.map((perf, index) => (
            <div key={perf.id} className="flex flex-col items-center">
              <div 
                className="bg-indigo-600 rounded-t-md w-12 transition-all duration-300 hover:bg-indigo-700"
                style={{ height: `${(perf.overallScore / 5) * 200}px` }}
              ></div>
              <div className="mt-2 text-xs text-gray-600 text-center">
                <div className="font-medium">{perf.employeeName.split(' ')[0]}</div>
                <div className={`font-bold ${getScoreColor(perf.overallScore)}`}>
                  {perf.overallScore.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des évaluations */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Évaluations de l'équipe</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score Global
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Objectifs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compétences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comportement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performances.map((performance) => (
                <tr key={performance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {performance.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{performance.employeeName}</div>
                        <div className="text-sm text-gray-500">{performance.period}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(performance.overallScore)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(performance.goals)}`}>
                      {performance.goals.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(performance.skills)}`}>
                      {performance.skills.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(performance.behavior)}`}>
                      {performance.behavior.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(performance.status)}`}>
                      {performance.status === 'approved' ? 'Approuvée' :
                       performance.status === 'completed' ? 'Terminée' :
                       performance.status === 'in_progress' ? 'En cours' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvelle Évaluation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employé</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="">Sélectionner un employé</option>
                    <option value="1">Jean Dupont</option>
                    <option value="2">Marie Martin</option>
                    <option value="3">Pierre Durand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Période</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="2024-Q1">Q1 2024</option>
                    <option value="2024-Q2">Q2 2024</option>
                    <option value="2024-Q3">Q3 2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'évaluation</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Commentaires</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Commentaires sur la performance..."
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
