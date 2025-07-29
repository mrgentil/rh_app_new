import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { userService, User, UserStats } from '../../services/userService';
import { roleService } from '../../services/roleService';
import { departmentService, Department } from '../../services/departmentService';
import { jobTitleService, JobTitle } from '../../services/jobTitleService';
import { useToast } from '../../hooks/useToast';
import CreateUserModal from '../../components/CreateUserModal';
import TestModal from '../../components/TestModal';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye, 
  FaEyeSlash, 
  FaKey, 
  FaUserPlus,
  FaChartBar,
  FaFilter,
  FaDownload
} from 'react-icons/fa';

export default function UsersManagementPage() {
  // Protection contre les erreurs JavaScript
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState('');
  const fetchingRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  useEffect(() => {
    // Attendre que l'authentification soit terminée
    if (authLoading) {
      return;
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }

    if (user?.role !== 'Admin') {
      console.log('User is not Admin, redirecting to unauthorized');
      router.push('/unauthorized');
      return;
    }

    // Charger les données seulement si l'utilisateur est Admin et que les données ne sont pas encore chargées
    if (!dataLoaded) {
      console.log('User is Admin, fetching data');
      fetchData();
    }
  }, [user, dataLoaded, authLoading]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, statusFilter]);

  const fetchData = async () => {
    // Protection contre les appels multiples avec useRef
    if (fetchingRef.current) {
      console.log('Already fetching, skipping fetchData');
      return;
    }
    
    try {
      console.log('Starting fetchData...');
      fetchingRef.current = true;
      setLoading(true);
      setError(''); // Reset error state
      
      const [usersData, statsData, rolesData, departmentsData, jobTitlesData] = await Promise.all([
        userService.getAllUsers(),
        userService.getUserStats(),
        roleService.getAllRoles(),
        departmentService.getAllDepartments(),
        jobTitleService.getAllJobTitles()
      ]);
      
      console.log('All data received, updating state...');
      setUsers(usersData);
      setStats(statsData);
      setRoles(rolesData);
      setDepartments(departmentsData);
      setJobTitles(jobTitlesData);
      setDataLoaded(true);
      console.log('Data fetched and state updated successfully');
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roleName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (selectedRole) {
      filtered = filtered.filter(user => user.roleName === selectedRole);
    }

    // Filtre par statut
    if (statusFilter === 'active') {
      filtered = filtered.filter(user => user.isActive);
    } else if (statusFilter === 'suspended') {
      filtered = filtered.filter(user => !user.isActive);
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (userData: any) => {
    console.log('handleCreateUser called with:', userData);
    
    // Protection contre les appels multiples
    if (actionLoading === -1) {
      console.log('Already creating user, ignoring call');
      return;
    }
    
    const loadingToast = showLoading('Création de l\'utilisateur en cours...');
    try {
      setActionLoading(-1);
      console.log('Creating user with data:', userData);
      
      const result = await userService.createUser(userData);
      console.log('User created successfully:', result);
      
      setShowCreateModal(false);
      await fetchData(); // Attendre que les données soient rechargées
      dismiss(loadingToast);
      showSuccess('Utilisateur créé avec succès ! Un email d\'activation a été envoyé.');
    } catch (err) {
      console.error('Error creating user:', err);
      dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const loadingToast = showLoading('Suppression de l\'utilisateur en cours...');
    try {
      setActionLoading(selectedUser.id);
      await userService.deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchData();
      dismiss(loadingToast);
      showSuccess('Utilisateur supprimé avec succès !');
    } catch (err) {
      dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendUser = async (userId: number, reason?: string) => {
    const loadingToast = showLoading('Suspension de l\'utilisateur en cours...');
    try {
      setActionLoading(userId);
      await userService.suspendUser(userId, reason);
      fetchData();
      dismiss(loadingToast);
      showSuccess('Utilisateur suspendu avec succès !');
    } catch (err) {
      dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suspension';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateUser = async (userId: number) => {
    const loadingToast = showLoading('Réactivation de l\'utilisateur en cours...');
    try {
      setActionLoading(userId);
      await userService.reactivateUser(userId);
      fetchData();
      dismiss(loadingToast);
      showSuccess('Utilisateur réactivé avec succès !');
    } catch (err) {
      dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la réactivation';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async (userId: number) => {
    const loadingToast = showLoading('Envoi de l\'email de réinitialisation...');
    try {
      setActionLoading(userId);
      await userService.resetUserPassword(userId);
      dismiss(loadingToast);
      showSuccess('Email de réinitialisation envoyé avec succès !');
    } catch (err) {
      dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la réinitialisation';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        Actif
      </span>
    ) : (
      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        Suspendu
      </span>
    );
  };

  if (authLoading || loading) {
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des utilisateurs</h1>
            <p className="text-gray-600 mt-2">Gérez les comptes utilisateurs et leurs permissions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
          >
            <FaUserPlus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </button>
          </div>

          {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaChartBar className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FaEye className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FaEyeSlash className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Suspendus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FaFilter className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rôles</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byRole).length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, email, rôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les rôles</option>
                {roles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="suspended">Suspendus</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('');
                  setStatusFilter('');
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Réinitialiser
              </button>
              </div>
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.employeeName && (
                            <div className="text-xs text-gray-400">{user.employeeName}</div>
                          )}
                        </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.roleName}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/users/${user.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/users/${user.id}/edit`)}
                          className="text-green-600 hover:text-green-900"
                            title="Modifier"
                          >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          disabled={actionLoading === user.id}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                          title="Réinitialiser le mot de passe"
                        >
                          {actionLoading === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                          ) : (
                            <FaKey className="w-4 h-4" />
                          )}
                        </button>
                        {user.isActive ? (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                            title="Suspendre"
                          >
                            {actionLoading === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                            ) : (
                              <FaEyeSlash className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivateUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Réactiver"
                          >
                            {actionLoading === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <FaEye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>

        {/* Modal de création d'utilisateur */}
        {showCreateModal && (
          <CreateUserModal
            roles={roles}
            departments={departments}
            jobTitles={jobTitles}
            users={users}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateUser}
            loading={actionLoading === -1}
          />
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && selectedUser && (
          <DeleteUserModal
            user={selectedUser}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUser(null);
            }}
            onConfirm={handleDeleteUser}
            loading={actionLoading === selectedUser.id}
          />
        )}

        {/* Affichage des erreurs */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur :</strong> {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}



// Composant modal de confirmation de suppression
function DeleteUserModal({ user, onClose, onConfirm, loading }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.username}</strong> ? 
          Cette action est irréversible et un email de notification sera envoyé.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
