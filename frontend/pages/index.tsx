import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { FaUsers, FaCalendarAlt, FaMoneyCheckAlt, FaChartLine, FaBell, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { MdDashboard, MdPerson, MdWork } from 'react-icons/md';
import Link from 'next/link';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  totalPayroll: number;
  recentActivities: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    status: 'success' | 'warning' | 'info';
  }>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    totalPayroll: 0,
    recentActivities: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const loadDashboardData = async () => {
      try {
        // Ici vous pourriez faire des appels API réels
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalEmployees: 24,
          activeEmployees: 22,
          pendingLeaves: 3,
          totalPayroll: 125000,
          recentActivities: [
            {
              id: 1,
              type: 'employee',
              message: 'Nouvel employé ajouté : Marie Dubois',
              time: 'Il y a 2 heures',
              status: 'success'
            },
            {
              id: 2,
              type: 'leave',
              message: 'Demande de congé en attente : Jean Martin',
              time: 'Il y a 4 heures',
              status: 'warning'
            },
            {
              id: 3,
              type: 'payroll',
              message: 'Paie du mois de décembre traitée',
              time: 'Il y a 1 jour',
              status: 'success'
            },
            {
              id: 4,
              type: 'system',
              message: 'Mise à jour du système terminée',
              time: 'Il y a 2 jours',
              status: 'info'
            }
          ]
        });
      } catch (error) {
        console.error('Erreur lors du chargement du tableau de bord:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <FaBell className="w-4 h-4 text-blue-500" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {user?.firstName || user?.username} ! Voici un aperçu de votre activité.
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100">
                <FaUsers className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                +{stats.activeEmployees} actifs
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <MdPerson className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                {((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}% taux d'activité
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaCalendarAlt className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Congés en Attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-yellow-600 font-medium">
                Nécessite votre attention
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaMoneyCheckAlt className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Masse Salariale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPayroll.toLocaleString('fr-FR')} €
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-purple-600 font-medium">
                Ce mois
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions rapides */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
              </div>
              <div className="p-6 space-y-4">
                <Link
                  href="/employes/nouveau"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-green-100">
                    <FaUsers className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Ajouter un employé</p>
                    <p className="text-xs text-gray-600">Créer un nouveau profil</p>
                  </div>
                </Link>

                <Link
                  href="/conges/nouveau"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100">
                    <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Demande de congé</p>
                    <p className="text-xs text-gray-600">Soumettre une demande</p>
                  </div>
                </Link>

                <Link
                  href="/paie/nouveau"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-purple-100">
                    <FaMoneyCheckAlt className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Gestion de la paie</p>
                    <p className="text-xs text-gray-600">Traiter les salaires</p>
                  </div>
                </Link>

                <Link
                  href="/users/nouveau"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-indigo-100">
                    <MdPerson className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Créer un utilisateur</p>
                    <p className="text-xs text-gray-600">Nouveau compte système</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Activités récentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Activités récentes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-start p-4 rounded-lg border ${getStatusColor(activity.status)}`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Voir toutes les activités →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique de performance (placeholder) */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Performance mensuelle</h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <FaChartLine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Graphique de performance à venir</p>
                <p className="text-sm text-gray-500">Intégration avec Chart.js ou Recharts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
