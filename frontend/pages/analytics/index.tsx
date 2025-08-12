import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaChartBar, FaChartLine, FaUsers, FaClock, FaDownload, FaFilter } from 'react-icons/fa';

interface AnalyticsData {
  teamPerformance: {
    labels: string[];
    data: number[];
  };
  timeTracking: {
    totalHours: number;
    averageDaily: number;
    productivity: number;
  };
  leaveStats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  employeeMetrics: {
    active: number;
    onLeave: number;
    performance: number;
  };
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  // Données de démonstration
  useEffect(() => {
    setTimeout(() => {
      setAnalyticsData({
        teamPerformance: {
          labels: ['Jean D.', 'Marie M.', 'Pierre D.', 'Sophie L.', 'Marc T.'],
          data: [4.2, 3.8, 4.0, 4.5, 3.9]
        },
        timeTracking: {
          totalHours: 1240,
          averageDaily: 7.8,
          productivity: 85
        },
        leaveStats: {
          pending: 5,
          approved: 12,
          rejected: 2
        },
        employeeMetrics: {
          active: 15,
          onLeave: 3,
          performance: 4.1
        }
      });
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const renderPerformanceChart = () => {
    if (!analyticsData) return null;

    const maxScore = Math.max(...analyticsData.teamPerformance.data);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance de l'Équipe</h3>
        <div className="space-y-4">
          {analyticsData.teamPerformance.labels.map((label, index) => {
            const score = analyticsData.teamPerformance.data[index];
            const percentage = (score / 5) * 100;
            
            return (
              <div key={label} className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium text-gray-700">{label}</div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        score >= 4.5 ? 'bg-green-500' :
                        score >= 4.0 ? 'bg-blue-500' :
                        score >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-bold text-gray-900">{score.toFixed(1)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTimeChart = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
    const hours = [8.2, 7.5, 8.8, 7.9, 8.1];
    const maxHours = Math.max(...hours);

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Temps de Travail Hebdomadaire</h3>
        <div className="flex items-end justify-between h-40 space-x-2">
          {days.map((day, index) => (
            <div key={day} className="flex flex-col items-center flex-1">
              <div 
                className="bg-indigo-600 rounded-t-md w-full transition-all duration-300 hover:bg-indigo-700"
                style={{ height: `${(hours[index] / maxHours) * 120}px` }}
              ></div>
              <div className="mt-2 text-xs text-gray-600 text-center">
                <div className="font-medium">{day}</div>
                <div className="text-indigo-600 font-bold">{hours[index]}h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Rapports</h1>
          <p className="text-gray-600">Analysez les données de performance de votre équipe</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
            <FaDownload className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.employeeMetrics.active}</p>
              <p className="text-xs text-green-600">+2 ce mois</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaChartLine className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Performance Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.employeeMetrics.performance.toFixed(1)}/5</p>
              <p className="text-xs text-green-600">+0.2 vs mois dernier</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaClock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heures Travaillées</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.timeTracking.totalHours}h</p>
              <p className="text-xs text-blue-600">{analyticsData.timeTracking.averageDaily}h/jour</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaChartBar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productivité</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.timeTracking.productivity}%</p>
              <p className="text-xs text-green-600">+5% ce mois</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPerformanceChart()}
        {renderTimeChart()}
      </div>

      {/* Statistiques des congés */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion des Congés</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{analyticsData.leaveStats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analyticsData.leaveStats.approved}</div>
            <div className="text-sm text-gray-600">Approuvés</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{analyticsData.leaveStats.rejected}</div>
            <div className="text-sm text-gray-600">Refusés</div>
          </div>
        </div>
      </div>

      {/* Tendances */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tendances de l'Équipe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Points Forts</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Performance en hausse (+12%)</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Productivité élevée (85%)</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Faible taux d'absentéisme</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Points d'Amélioration</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Temps de réponse aux congés</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Formation continue</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Communication inter-équipes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-medium text-indigo-900 mb-3">Recommandations IA</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
            <p className="text-sm text-indigo-800">
              <strong>Performance :</strong> Organiser une session de feedback avec Marie M. pour améliorer ses résultats.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
            <p className="text-sm text-indigo-800">
              <strong>Formation :</strong> Planifier une formation en leadership pour l'équipe.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
            <p className="text-sm text-indigo-800">
              <strong>Congés :</strong> Traiter les 5 demandes en attente dans les 48h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
