import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
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
  FaExclamationTriangle
} from 'react-icons/fa';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<TeamStats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    teamPerformance: 0
  });

  useEffect(() => {
    // Simuler le chargement des données
    loadManagerData();
  }, []);

  const loadManagerData = async () => {
    // Simuler des données d'équipe
    const mockTeamMembers: TeamMember[] = [
      { id: 1, name: 'Marie Dubois', position: 'Développeur Senior', email: 'marie.dubois@company.com', status: 'active' },
      { id: 2, name: 'Jean Martin', position: 'Développeur Frontend', email: 'jean.martin@company.com', status: 'active' },
      { id: 3, name: 'Sophie Bernard', position: 'Designer UX/UI', email: 'sophie.bernard@company.com', status: 'active' },
      { id: 4, name: 'Pierre Durand', position: 'Développeur Backend', email: 'pierre.durand@company.com', status: 'inactive' },
      { id: 5, name: 'Emma Leroy', position: 'Testeur QA', email: 'emma.leroy@company.com', status: 'active' },
      { id: 6, name: 'Lucas Moreau', position: 'DevOps Engineer', email: 'lucas.moreau@company.com', status: 'active' },
      { id: 7, name: 'Chloé Roux', position: 'Product Owner', email: 'chloe.roux@company.com', status: 'active' },
      { id: 8, name: 'Thomas Simon', position: 'Scrum Master', email: 'thomas.simon@company.com', status: 'active' }
    ];

    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: 1,
        employeeName: 'Marie Dubois',
        employeeId: 1,
        type: 'Congés payés',
        startDate: '2024-08-15',
        endDate: '2024-08-23',
        status: 'pending',
        reason: 'Vacances d\'été en famille',
        days: 7
      },
      {
        id: 2,
        employeeName: 'Jean Martin',
        employeeId: 2,
        type: 'Congés payés',
        startDate: '2024-09-02',
        endDate: '2024-09-06',
        status: 'approved',
        reason: 'Mariage de ma sœur',
        days: 5
      },
      {
        id: 3,
        employeeName: 'Sophie Bernard',
        employeeId: 3,
        type: 'Congé maladie',
        startDate: '2024-07-25',
        endDate: '2024-07-26',
        status: 'approved',
        reason: 'Grippe',
        days: 2
      },
      {
        id: 4,
        employeeName: 'Emma Leroy',
        employeeId: 5,
        type: 'Congés payés',
        startDate: '2024-08-30',
        endDate: '2024-09-13',
        status: 'pending',
        reason: 'Voyage en Asie',
        days: 10
      }
    ];

    setTeamMembers(mockTeamMembers);
    setLeaveRequests(mockLeaveRequests);
    
    setStats({
      totalMembers: mockTeamMembers.length,
      activeMembers: mockTeamMembers.filter(m => m.status === 'active').length,
      pendingLeaves: mockLeaveRequests.filter(l => l.status === 'pending').length,
      approvedLeaves: mockLeaveRequests.filter(l => l.status === 'approved').length,
      teamPerformance: 87
    });
  };

  const handleLeaveAction = (leaveId: number, action: 'approve' | 'reject') => {
    setLeaveRequests(prev => 
      prev.map(leave => 
        leave.id === leaveId 
          ? { ...leave, status: action === 'approve' ? 'approved' : 'rejected' }
          : leave
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: FaChartLine },
    { id: 'team', name: 'Mon équipe', icon: FaUsers },
    { id: 'leaves', name: 'Gestion des congés', icon: FaCalendarAlt },
    { id: 'documents', name: 'Documents', icon: FaFileAlt },
    { id: 'notifications', name: 'Notifications', icon: FaBell }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Espace Manager</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue dans votre espace de gestion, {user?.firstName} {user?.lastName} !
          </p>
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
                    <p className="text-sm font-medium text-gray-600">Membres de l'équipe</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaCheckCircle className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FaClock className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Congés en attente</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaChartLine className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Performance équipe</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.teamPerformance}%</p>
                  </div>
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
                  {leaveRequests.slice(0, 3).map((leave) => (
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
                {teamMembers.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {member.name.split(' ').map(n => n[0]).join('')}
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
                {leaveRequests.map((leave) => (
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