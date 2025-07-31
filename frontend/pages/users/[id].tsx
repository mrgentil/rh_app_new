import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import { userService, User } from '../../services/userService';
import { useToast } from '../../hooks/useToast';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaEnvelope, 
  FaShieldAlt, 
  FaIdCard, 
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaUserPlus,
  FaUserMinus,
  FaHistory,
  FaCog,
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
  FaEuroSign
} from 'react-icons/fa';
import Link from 'next/link';
import SalaryDisplay from '../../components/SalaryDisplay';

interface UserDetails extends User {
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    hireDate?: string;
    status: string;
    jobTitle?: {
      id: number;
      name: string;
    };
    department?: {
      id: number;
      name: string;
    };
  };
  role?: {
    id: number;
    name: string;
    permissions: string;
  };
  lastLogin?: string;
  loginCount?: number;
  failedLoginAttempts?: number;
  passwordChangedAt?: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    if (currentUser?.role !== 'Admin') {
      router.push('/unauthorized');
      return;
    }
    
    if (id) {
      fetchUserDetails();
    }
  }, [id, currentUser]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUserById(parseInt(id as string));
      setUser(userData as UserDetails);
    } catch (err) {
      showError('Erreur lors du chargement des détails utilisateur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async () => {
    if (!user) return;
    
    const reason = prompt('Raison de la suspension (optionnel):');
    const loadingToast = showLoading('Suspension de l\'utilisateur...');
    setActionLoading('suspend');
    
    try {
      await userService.suspendUser(user.id, reason || undefined);
      await fetchUserDetails(); // Recharger les données
      dismiss(loadingToast);
      showSuccess('Utilisateur suspendu avec succès');
    } catch (err) {
      dismiss(loadingToast);
      showError('Erreur lors de la suspension');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateUser = async () => {
    if (!user) return;
    
    const loadingToast = showLoading('Réactivation de l\'utilisateur...');
    setActionLoading('reactivate');
    
    try {
      await userService.reactivateUser(user.id);
      await fetchUserDetails(); // Recharger les données
      dismiss(loadingToast);
      showSuccess('Utilisateur réactivé avec succès');
    } catch (err) {
      dismiss(loadingToast);
      showError('Erreur lors de la réactivation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?')) return;
    
    const loadingToast = showLoading('Envoi de l\'email de réinitialisation...');
    setActionLoading('reset');
    
    try {
      await userService.resetUserPassword(user.id);
      dismiss(loadingToast);
      showSuccess('Email de réinitialisation envoyé avec succès');
    } catch (err) {
      dismiss(loadingToast);
      showError('Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action est irréversible.')) return;
    
    const loadingToast = showLoading('Suppression de l\'utilisateur...');
    setActionLoading('delete');
    
    try {
      await userService.deleteUser(user.id);
      dismiss(loadingToast);
      showSuccess('Utilisateur supprimé avec succès');
      router.push('/users');
    } catch (err) {
      dismiss(loadingToast);
      showError('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FaCheckCircle className="w-3 h-3 mr-1" />
        Actif
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <FaTimesCircle className="w-3 h-3 mr-1" />
        Suspendu
      </span>
    );
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

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilisateur non trouvé</h2>
          <Link href="/users" className="text-blue-600 hover:text-blue-800">
            Retour à la liste des utilisateurs
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/users" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour aux utilisateurs
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Détails de l'utilisateur</h1>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`/users/${user.id}/edit`}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaEdit className="w-4 h-4" />
              Modifier
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte utilisateur */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <FaUser className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2">
                    {getStatusBadge(user.isActive)}
                  </div>
                  {user.salary && (
                    <div className="flex items-center mt-2 text-green-600">
                      <FaEuroSign className="mr-1" />
                      <span className="font-semibold">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(user.salary)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de base */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Informations de base
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nom d'utilisateur</label>
                      <p className="text-gray-900">{user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rôle</label>
                      <p className="text-gray-900">{user.roleName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Statut</label>
                      <div className="mt-1">
                        {getStatusBadge(user.isActive)}
                      </div>
                    </div>
                    {user.photoUrl && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Photo de profil</label>
                        <div className="mt-2">
                          <img
                            src={user.photoUrl}
                            alt={user.username}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations employé */}
                {user.employee && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaIdCard className="text-green-600" />
                      Informations employé
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nom complet</label>
                        <p className="text-gray-900">{user.employee.firstName} {user.employee.lastName}</p>
                      </div>
                      {user.employee.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Téléphone</label>
                          <p className="text-gray-900">{user.employee.phone}</p>
                        </div>
                      )}
                      {user.employee.department && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Département</label>
                          <p className="text-gray-900">{user.employee.department.name}</p>
                        </div>
                      )}
                      {user.employee.jobTitle && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Poste</label>
                          <p className="text-gray-900">{user.employee.jobTitle.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations salariales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaEuroSign className="text-green-600" />
                Informations salariales
              </h3>
              {user.salary ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Salaire annuel brut</label>
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(user.salary)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Salaire mensuel brut</label>
                    <p className="text-lg text-gray-700">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(user.salary / 12)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Aucun salaire défini</p>
              )}
            </div>

            {/* Informations de sécurité */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-red-600" />
                Sécurité et accès
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dernière connexion</label>
                    <p className="text-gray-900">{user.lastLogin ? formatDate(user.lastLogin) : 'Jamais connecté'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Compte créé le</label>
                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dernière modification</label>
                    <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Permissions</label>
                    <div className="mt-1">
                      {user.role?.permissions ? (
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(user.role.permissions).map((perm: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {perm}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Aucune permission spécifique</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions et statistiques */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCog className="text-purple-600" />
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleResetPassword}
                  disabled={actionLoading === 'reset'}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaKey className="w-4 h-4" />
                  {actionLoading === 'reset' ? 'Envoi...' : 'Réinitialiser mot de passe'}
                </button>

                {user.isActive ? (
                  <button
                    onClick={handleSuspendUser}
                    disabled={actionLoading === 'suspend'}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FaUserMinus className="w-4 h-4" />
                    {actionLoading === 'suspend' ? 'Suspension...' : 'Suspendre'}
                  </button>
                ) : (
                  <button
                    onClick={handleReactivateUser}
                    disabled={actionLoading === 'reactivate'}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    {actionLoading === 'reactivate' ? 'Réactivation...' : 'Réactiver'}
                  </button>
                )}

                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading === 'delete'}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaTrash className="w-4 h-4" />
                  {actionLoading === 'delete' ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaHistory className="text-indigo-600" />
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Statut du compte</span>
                  {getStatusBadge(user.isActive)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Membre depuis</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {user.employee && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Statut employé</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      user.employee.status === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.employee.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
