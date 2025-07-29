import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import RoleManagementModal from '../../components/RoleManagementModal';
import { useToast } from '../../hooks/useToast';
import { roleService } from '../../services/roleService';
import { 
  FaUsers, FaUserTie, FaUser, FaCog, FaPlus, FaEdit, FaTrash, 
  FaEye, FaShieldAlt, FaCheck, FaTimes 
} from 'react-icons/fa';

interface Role {
  id: number;
  name: string;
  permissions: string;
  createdAt: string;
  updatedAt: string;
  userCount?: number;
}

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesData = await roleService.getAllRoles();
      setRoles(rolesData);
    } catch (err) {
      console.error('Erreur lors du chargement des rôles:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData: any) => {
    const loadingToast = showLoading('Création du rôle en cours...');
    try {
      setActionLoading(-1);
      await roleService.createRole(roleData);
      showSuccess('Rôle créé avec succès !');
      setShowCreateModal(false);
      await fetchRoles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      showError(errorMessage);
    } finally {
      dismiss(loadingToast);
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (roleData: any) => {
    if (!editingRole) return;
    
    const loadingToast = showLoading('Modification du rôle en cours...');
    try {
      setActionLoading(editingRole.id);
      await roleService.updateRole(editingRole.id, roleData);
      showSuccess('Rôle modifié avec succès !');
      setEditingRole(null);
      await fetchRoles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification';
      showError(errorMessage);
    } finally {
      dismiss(loadingToast);
      setActionLoading(null);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible.')) {
      return;
    }

    const loadingToast = showLoading('Suppression du rôle en cours...');
    try {
      setActionLoading(roleId);
      await roleService.deleteRole(roleId);
      showSuccess('Rôle supprimé avec succès !');
      await fetchRoles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      showError(errorMessage);
    } finally {
      dismiss(loadingToast);
      setActionLoading(null);
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'administrateur':
      case 'admin':
        return FaCog;
      case 'rh':
      case 'ressources humaines':
        return FaUsers;
      case 'manager':
        return FaUserTie;
      case 'employé':
      case 'employee':
        return FaUser;
      default:
        return FaShieldAlt;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'administrateur':
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rh':
      case 'ressources humaines':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'employé':
      case 'employee':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const parsePermissions = (permissionsString: string) => {
    try {
      const permissions = JSON.parse(permissionsString);
      return Array.isArray(permissions) ? permissions : [];
    } catch {
      return [];
    }
  };

  const getPermissionCount = (permissionsString: string) => {
    return parsePermissions(permissionsString).length;
  };

  const getPermissionCategories = (permissionsString: string) => {
    const permissions = parsePermissions(permissionsString);
    const categories = new Set<string>();
    
    permissions.forEach((permission: string) => {
      if (permission.startsWith('employee.')) categories.add('Employés');
      else if (permission.startsWith('payroll.')) categories.add('Paie');
      else if (permission.startsWith('leave.')) categories.add('Congés');
      else if (permission.startsWith('user.')) categories.add('Utilisateurs');
      else if (permission.startsWith('role.')) categories.add('Rôles');
      else if (permission.startsWith('department.')) categories.add('Départements');
      else if (permission.startsWith('system.')) categories.add('Système');
      else if (permission.startsWith('reports.')) categories.add('Rapports');
      else if (permission.startsWith('audit.')) categories.add('Audit');
    });
    
    return Array.from(categories);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des rôles</h1>
            <p className="text-gray-600 mt-2">
              Configurez les rôles et permissions des utilisateurs
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Nouveau rôle</span>
          </button>
        </div>

        {/* Guide d'utilisation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🎯 Comment créer un rôle ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <div>
                <strong>Cliquez sur "Nouveau rôle"</strong>
                <p>Le modal s'ouvre avec les rôles prêts à l'emploi</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <div>
                <strong>Choisissez un template</strong>
                <p>Cliquez sur RH, Manager, etc. ou personnalisez</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <div>
                <strong>Cliquez "Créer le rôle"</strong>
                <p>Les boutons sont en bas du modal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total des rôles</p>
                <p className="text-2xl font-bold text-gray-800">{roles.length}</p>
              </div>
              <FaShieldAlt className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rôles actifs</p>
                <p className="text-2xl font-bold text-gray-800">
                  {roles.filter(role => role.userCount && role.userCount > 0).length}
                </p>
              </div>
              <FaCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permissions totales</p>
                <p className="text-2xl font-bold text-gray-800">
                  {roles.reduce((total, role) => total + getPermissionCount(role.permissions), 0)}
                </p>
              </div>
              <FaEye className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rôles système</p>
                <p className="text-2xl font-bold text-gray-800">
                  {roles.filter(role => ['Administrateur', 'RH', 'Manager', 'Employé'].includes(role.name)).length}
                </p>
              </div>
              <FaCog className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Liste des rôles */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Rôles disponibles</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => {
                  const Icon = getRoleIcon(role.name);
                  const permissionCount = getPermissionCount(role.permissions);
                  const categories = getPermissionCategories(role.permissions);
                  
                  return (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getRoleColor(role.name)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{role.name}</div>
                            <div className="text-sm text-gray-500">
                              {categories.length > 0 ? categories.join(', ') : 'Aucune permission'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{permissionCount}</span>
                          <span className="text-sm text-gray-500">permissions</span>
                        </div>
                        {categories.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {categories.slice(0, 2).join(', ')}
                            {categories.length > 2 && ` +${categories.length - 2} autres`}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <FaUsers className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {role.userCount || 0} utilisateur{role.userCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(role.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingRole(role)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Modifier"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          
                          {!['Administrateur', 'RH', 'Manager', 'Employé'].includes(role.name) && (
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              disabled={actionLoading === role.id}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                              title="Supprimer"
                            >
                              {actionLoading === role.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <FaTrash className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {roles.length === 0 && (
            <div className="text-center py-12">
              <FaShieldAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rôle trouvé</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer le premier rôle
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        {showCreateModal && (
          <RoleManagementModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateRole}
            loading={actionLoading === -1}
          />
        )}
        
        {editingRole && (
          <RoleManagementModal
            role={editingRole}
            onClose={() => setEditingRole(null)}
            onSave={handleUpdateRole}
            loading={actionLoading === editingRole.id}
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