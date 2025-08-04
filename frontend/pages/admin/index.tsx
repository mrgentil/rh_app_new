import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaUsers, 
  FaShieldAlt, 
  FaCog, 
  FaChartLine,
  FaClipboardList,
  FaBuilding,
  FaUserCog,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaDatabase,
  FaServer,
  FaLock,
  FaUnlock,
  FaHistory,
  FaDownload
} from 'react-icons/fa';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
}

interface SystemLog {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  level: 'info' | 'warning' | 'error';
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalRoles: number;
  systemHealth: number;
  lastBackup: string;
  diskUsage: number;
  memoryUsage: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalRoles: 0,
    systemHealth: 0,
    lastBackup: '',
    diskUsage: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    // Simuler des données utilisateurs
    const mockUsers: User[] = [
      { id: 1, username: 'admin', email: 'admin@company.com', role: 'Admin', department: 'IT', status: 'active', lastLogin: '2024-07-31 10:30', createdAt: '2022-01-01' },
      { id: 2, username: 'rh_manager', email: 'rh@company.com', role: 'RH', department: 'RH', status: 'active', lastLogin: '2024-07-31 09:15', createdAt: '2022-02-15' },
      { id: 3, username: 'manager1', email: 'manager1@company.com', role: 'Manager', department: 'IT', status: 'active', lastLogin: '2024-07-30 16:45', createdAt: '2022-03-20' },
      { id: 4, username: 'employee1', email: 'employee1@company.com', role: 'Employee', department: 'IT', status: 'active', lastLogin: '2024-07-31 08:30', createdAt: '2022-04-10' },
      { id: 5, username: 'test_user', email: 'test@company.com', role: 'Employee', department: 'Marketing', status: 'suspended', lastLogin: '2024-07-25 14:20', createdAt: '2023-01-15' },
      { id: 6, username: 'inactive_user', email: 'inactive@company.com', role: 'Employee', department: 'Sales', status: 'inactive', lastLogin: '2024-06-15 11:00', createdAt: '2022-08-05' }
    ];

    const mockRoles: Role[] = [
      { id: 1, name: 'Admin', description: 'Accès complet au système', permissions: ['all'], userCount: 1, isDefault: false },
      { id: 2, name: 'RH', description: 'Gestion des ressources humaines', permissions: ['employees:*', 'users:*', 'payroll:*'], userCount: 1, isDefault: false },
      { id: 3, name: 'Manager', description: 'Gestion d\'équipe', permissions: ['team:*', 'leaves:approve'], userCount: 2, isDefault: false },
      { id: 4, name: 'Employee', description: 'Utilisateur standard', permissions: ['profile:*', 'leaves:create'], userCount: 15, isDefault: true }
    ];

    const mockSystemLogs: SystemLog[] = [
      { id: 1, action: 'User Login', user: 'admin', timestamp: '2024-07-31 10:30:00', details: 'Connexion réussie', level: 'info' },
      { id: 2, action: 'Role Modified', user: 'admin', timestamp: '2024-07-31 10:15:00', details: 'Modification du rôle RH', level: 'info' },
      { id: 3, action: 'User Suspended', user: 'admin', timestamp: '2024-07-31 09:45:00', details: 'Utilisateur test_user suspendu', level: 'warning' },
      { id: 4, action: 'System Backup', user: 'system', timestamp: '2024-07-31 02:00:00', details: 'Sauvegarde automatique terminée', level: 'info' },
      { id: 5, action: 'Database Error', user: 'system', timestamp: '2024-07-30 23:15:00', details: 'Erreur de connexion à la base de données', level: 'error' },
      { id: 6, action: 'User Created', user: 'rh_manager', timestamp: '2024-07-30 16:30:00', details: 'Nouvel utilisateur créé: employee_new', level: 'info' }
    ];

    setUsers(mockUsers);
    setRoles(mockRoles);
    setSystemLogs(mockSystemLogs);
    
    setStats({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      suspendedUsers: mockUsers.filter(u => u.status === 'suspended').length,
      totalRoles: mockRoles.length,
      systemHealth: 95,
      lastBackup: '2024-07-31 02:00',
      diskUsage: 67,
      memoryUsage: 45
    });
  };

  const handleUserAction = (userId: number, action: 'activate' | 'suspend' | 'delete') => {
    setUsers(prev => 
      prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'activate':
              return { ...user, status: 'active' as const };
            case 'suspend':
              return { ...user, status: 'suspended' as const };
            case 'delete':
              return { ...user, status: 'inactive' as const };
            default:
              return user;
          }
        }
        return user;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: FaChartLine },
    { id: 'users', name: 'Utilisateurs', icon: FaUsers },
    { id: 'roles', name: 'Rôles & Permissions', icon: FaShieldAlt },
    { id: 'system', name: 'Système', icon: FaCog },
    { id: 'logs', name: 'Logs d\'audit', icon: FaClipboardList },
    { id: 'departments', name: 'Départements', icon: FaBuilding }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration Système</h1>
          <p className="text-gray-600 mt-2">
            Gestion complète du système, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
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
            {/* Statistiques système */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaUsers className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaCheckCircle className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaShieldAlt className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rôles</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRoles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <FaServer className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Santé Système</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.systemHealth}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* État du système */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">État du système</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Utilisation disque</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.diskUsage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{stats.diskUsage}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Utilisation mémoire</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.memoryUsage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{stats.memoryUsage}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dernière sauvegarde</span>
                      <span className="text-sm font-medium text-gray-900">{stats.lastBackup}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center space-x-2">
                      <FaUserCog className="w-4 h-4" />
                      <span>Gérer les utilisateurs</span>
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2">
                      <FaDatabase className="w-4 h-4" />
                      <span>Sauvegarde manuelle</span>
                    </button>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center space-x-2">
                      <FaShieldAlt className="w-4 h-4" />
                      <span>Gérer les rôles</span>
                    </button>
                    <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center justify-center space-x-2">
                      <FaHistory className="w-4 h-4" />
                      <span>Voir les logs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestion des utilisateurs</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>Ajouter un utilisateur</span>
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                            {user.status === 'active' ? 'Actif' : 
                             user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            {user.status === 'active' ? (
                              <button 
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <FaLock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUserAction(user.id, 'activate')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaUnlock className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-red-600 hover:text-red-900">
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestion des rôles</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>Créer un rôle</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-gray-900">{role.name}</h4>
                      {role.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{role.permissions.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{role.userCount} utilisateur(s)</span>
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        {!role.isDefault && (
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Configuration système</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Sauvegarde</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2">
                      <FaDatabase className="w-4 h-4" />
                      <span>Sauvegarde manuelle</span>
                    </button>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2">
                      <FaDownload className="w-4 h-4" />
                      <span>Télécharger la sauvegarde</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Maintenance</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center justify-center space-x-2">
                      <FaServer className="w-4 h-4" />
                      <span>Mode maintenance</span>
                    </button>
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center space-x-2">
                      <FaExclamationTriangle className="w-4 h-4" />
                      <span>Redémarrer le système</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Logs d'audit</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                <FaDownload className="w-4 h-4" />
                <span>Exporter les logs</span>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{log.action}</span>
                        </div>
                        <p className="text-sm text-gray-600">{log.details}</p>
                        <p className="text-xs text-gray-500 mt-1">Par: {log.user} - {log.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestion des départements</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>Ajouter un département</span>
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <FaBuilding className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Gestion des départements en cours de développement</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 