import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { managerEmployeeService, ManagerEmployee } from '../services/managerEmployeeService';
import managerTeamService, { Team as ManagerTeam } from '../services/managerTeamService';
import { useRouter } from 'next/router';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaFileAlt,
  FaChartLine,
  FaBell,
  FaUserCog,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaDownload,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TeamMember {
  id: number;
  name: string;
  position: string;
  email: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

interface LeaveRequest {
  id: number;
  employeeName: string;
  employeeId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  days: number;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingLeaves: number;
  approvedLeaves: number;
  teamPerformance: number;
}

export default function ManagerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [teamEmployees, setTeamEmployees] = useState<ManagerEmployee[]>([]);
  const [teamStats, setTeamStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [myTeams, setMyTeams] = useState<ManagerTeam[]>([]);
  // Types locaux
  type TeamMember = {
    id: number;
    name: string;
    position: string;
    email: string;
    status: 'active' | 'inactive';
  };
  type LeaveRequest = {
    id: number;
    employeeName: string;
    type: string;
    days: number;
    startDate: string;
    endDate: string;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Charger les équipes du manager (gérées + rejointes)
  const loadMyTeams = async () => {
    try {
      const res = await managerTeamService.getMyTeams();
      setMyTeams(res.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement de mes équipes:', err);
      // On ne bloque pas le dashboard si cette section échoue
      setMyTeams([]);
    }
  };

  // Action sur une demande de congé (démonstration)
  const handleLeaveAction = (id: number, action: 'approve' | 'reject') => {
    setLeaveRequests((prev) =>
      prev.map((lr) =>
        lr.id === id
          ? { ...lr, status: action === 'approve' ? 'approved' : 'rejected' }
          : lr
      )
    );
  };

  useEffect(() => {
    loadManagerData();
    loadMyTeams();
  }, []);

  const loadManagerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des données Manager...');
      
      // Charger les données réelles via les APIs avec gestion d'erreurs améliorée
      let employees: ManagerEmployee[] = [];
      let stats = null;
      
      try {
        employees = await managerEmployeeService.getTeamEmployees();
        console.log('✅ Employés chargés:', employees.length);
      } catch (empError) {
        console.error('❌ Erreur chargement employés:', empError);
        // Continuer avec un tableau vide
      }
      
      try {
        stats = await managerEmployeeService.getTeamStats();
        console.log('✅ Stats chargées:', stats);
      } catch (statsError) {
        console.error('❌ Erreur chargement stats:', statsError);
        // Utiliser des stats par défaut
        stats = {
          total: employees.length || 0,
          active: employees.filter(e => e.status === 'actif').length || 0,
          onLeave: 0,
          inactive: 0,
          departments: [],
          jobTitles: [],
          teams: 1
        };
      }
      
      // Si pas de données, utiliser le fallback
      if (employees.length === 0) {
        console.log('⚠️ Aucune donnée trouvée, utilisation du fallback');
        setError('Aucune équipe trouvée. Affichage des données de démonstration.');
        
        // Fallback avec des données de démonstration
        const mockEmployees: ManagerEmployee[] = [
        {
          id: 1,
          firstName: 'Marie',
          lastName: 'Dubois',
          email: 'marie.dubois@company.com',
          phone: '0123456789',
          jobTitle: 'Développeur Senior',
          department: 'IT',
          team: 'Frontend',
          status: 'actif',
          hireDate: '2022-01-15',
          birthDate: '1990-05-20',
          address: '123 Rue de la Paix, Paris',
          contractType: 'CDI',
          salary: 55000
        },
        {
          id: 2,
          firstName: 'Jean',
          lastName: 'Martin',
          email: 'jean.martin@company.com',
          phone: '0123456790',
          jobTitle: 'Développeur Frontend',
          department: 'IT',
          team: 'Frontend',
          status: 'actif',
          hireDate: '2023-03-10',
          birthDate: '1992-08-15',
          address: '456 Avenue des Champs, Lyon',
          contractType: 'CDI',
          salary: 45000
        },
        {
          id: 3,
          firstName: 'Sophie',
          lastName: 'Bernard',
          email: 'sophie.bernard@company.com',
          phone: '0123456791',
          jobTitle: 'Designer UX/UI',
          department: 'Design',
          team: 'UX',
          status: 'congé',
          hireDate: '2022-06-01',
          birthDate: '1988-12-03',
          address: '789 Boulevard Saint-Germain, Paris',
          contractType: 'CDI',
          salary: 48000
        }
      ];
      
      employees = mockEmployees;
      stats = {
        total: mockEmployees.length,
        active: mockEmployees.filter(emp => emp.status === 'actif').length,
        onLeave: mockEmployees.filter(emp => emp.status === 'congé').length,
        inactive: mockEmployees.filter(emp => emp.status === 'inactif').length,
        departments: [
          { departmentId: 1, name: 'IT', count: 3 }
        ],
        jobTitles: [
          { jobTitleId: 1, title: 'Développeur Senior', count: 1 },
          { jobTitleId: 2, title: 'Développeur Frontend', count: 1 },
          { jobTitleId: 3, title: 'Designer UI/UX', count: 1 }
        ],
        teams: 1
      };
      }
      
      // Appliquer les données (réelles ou fallback)
      setTeamEmployees(employees);
      // Synchroniser l'affichage "Mon équipe" avec une structure simplifiée
      setTeamMembers(
        employees.map((e) => ({
          id: e.id,
          name: `${e.firstName} ${e.lastName}`,
          position: e.jobTitle || '',
          email: e.email,
          status: e.status === 'actif' ? 'active' : e.status === 'inactif' ? 'inactive' : 'active'
        }))
      );
      // Données de test pour les congés récents
      const mockLeaveRequests: LeaveRequest[] = [
        {
          id: 1,
          employeeName: 'Sophie Bernard',
          type: 'Congés payés',
          days: 5,
          startDate: '2025-08-20',
          endDate: '2025-08-24',
          reason: 'Vacances',
          status: 'pending'
        },
        {
          id: 2,
          employeeName: 'Jean Martin',
          type: 'RTT',
          days: 1,
          startDate: '2025-08-30',
          endDate: '2025-08-30',
          reason: 'RDV médical',
          status: 'approved'
        },
        {
          id: 3,
          employeeName: 'Emma Leroy',
          type: 'Sans solde',
          days: 2,
          startDate: '2025-09-05',
          endDate: '2025-09-06',
          reason: 'Déménagement',
          status: 'rejected'
        }
      ];
      setLeaveRequests(mockLeaveRequests);
      setTeamStats(stats);
      
    } catch (err) {
      console.error('❌ Erreur fatale lors du chargement des données Manager:', err);
      setError('Erreur technique. Veuillez rafraîchir la page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadManagerData();
      return;
    }
    
    try {
      const results = await managerEmployeeService.searchTeamEmployees(searchTerm, {
        status: filterStatus || undefined
      });
      setTeamEmployees(results);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
    }
  };

  const exportData = async (format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        await managerEmployeeService.exportTeamEmployeesCSV();
      } else {
        const data = await managerEmployeeService.exportTeamEmployeesJSON();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `team-employees-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      case 'congé': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Configuration des graphiques
  const departmentChartData = {
    labels: teamStats?.departments?.map((d: any) => d.name) || [],
    datasets: [
      {
        label: 'Employés par département',
        data: teamStats?.departments?.map((d: any) => d.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const statusChartData = {
    labels: ['Actifs', 'En congé', 'Inactifs'],
    datasets: [
      {
        data: [teamStats?.active || 0, teamStats?.onLeave || 0, teamStats?.inactive || 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: FaChartLine },
    { id: 'team', name: 'Mon équipe', icon: FaUsers },
    { id: 'analytics', name: 'Analytics', icon: FaChartLine },
    { id: 'documents', name: 'Documents', icon: FaFileAlt },
    { id: 'notifications', name: 'Notifications', icon: FaBell }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-lg">Chargement des données...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                  onClick={loadManagerData}
                  className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                >
                  Réessayer
                </button>
              </div>
            </div>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Espace Manager</h1>
              <p className="text-gray-600 mt-2">
                Bienvenue dans votre espace de gestion, {user?.firstName} {user?.lastName} !
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => exportData('csv')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => exportData('json')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mes équipes (gérées + rejointes) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">Mes équipes</h2>
            <button
              onClick={() => router.push('/manager/team-management')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Gérer les équipes
            </button>
          </div>

          {myTeams.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-gray-500 text-sm">
              Aucune équipe trouvée. Créez une équipe ou demandez à être ajouté comme membre.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTeams.map((t) => (
                <div key={t.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{t.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{t.department || 'Sans département'}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {t.memberCount} membres
                    </span>
                  </div>
                  {t.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{t.description}</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => router.push(`/manager/team-management?teamId=${t.id}`)}
                      className="text-sm px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Ouvrir
                    </button>
                    <button
                      onClick={() => router.push('/manager/team-management')}
                      className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Gérer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaUsers className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Équipe</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats?.total || 0}</p>
                    <div className="flex items-center mt-1">
                      <FaArrowUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 ml-1">+2 ce mois</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaCheckCircle className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Membres Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats?.active || 0}</p>
                    <div className="flex items-center mt-1">
                      <FaArrowUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 ml-1">Stable</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FaClock className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En Congé</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats?.onLeave || 0}</p>
                    <div className="flex items-center mt-1">
                      <FaArrowDown className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600 ml-1">-1 cette semaine</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaChartLine className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Départements</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats?.departments?.length || 0}</p>
                    <div className="flex items-center mt-1">
                      <FaArrowUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 ml-1">Diversifié</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Département</h3>
                <div className="h-64">
                  <Bar data={departmentChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Employés</h3>
                <div className="h-64">
                  <Doughnut data={statusChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            {/* Congés récents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Congés récents</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {leaveRequests.slice(0, 3).map((leave: LeaveRequest) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status === 'pending' ? 'En attente' : 
                           leave.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{leave.employeeName}</p>
                          <p className="text-sm text-gray-600">{leave.type} - {leave.days} jours</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{leave.startDate} → {leave.endDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setActiveTab('leaves')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Voir tous les congés →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mon équipe</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member: TeamMember) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {member.name.split(' ').map((n: string) => (n && n[0]) || '').join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.position}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status === 'active' ? 'Actif' : 'Inactif'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Gestion des congés</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {leaveRequests.map((leave: LeaveRequest) => (
                  <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                            {leave.status === 'pending' ? 'En attente' : 
                             leave.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                          </div>
                          <span className="text-sm text-gray-600">{leave.type}</span>
                        </div>
                        <p className="font-medium text-gray-900">{leave.employeeName}</p>
                        <p className="text-sm text-gray-600">{leave.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {leave.startDate} → {leave.endDate} ({leave.days} jours)
                        </p>
                      </div>
                      {leave.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'approve')}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center space-x-1"
                          >
                            <FaCheckCircle className="w-3 h-3" />
                            <span>Approuver</span>
                          </button>
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'reject')}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center space-x-1"
                          >
                            <FaTimesCircle className="w-3 h-3" />
                            <span>Rejeter</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Documents de l'équipe</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Gestion des documents en cours de développement</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <FaBell className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Nouvelle demande de congé</p>
                    <p className="text-sm text-blue-700">Emma Leroy a soumis une demande de congé pour le 30 août</p>
                    <p className="text-xs text-blue-600 mt-1">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Congé approuvé</p>
                    <p className="text-sm text-green-700">Le congé de Jean Martin a été approuvé</p>
                    <p className="text-xs text-green-600 mt-1">Il y a 1 jour</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Rappel de performance</p>
                    <p className="text-sm text-yellow-700">Rapport de performance de l'équipe disponible</p>
                    <p className="text-xs text-yellow-600 mt-1">Il y a 3 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 