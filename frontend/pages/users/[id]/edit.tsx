import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Layout from '../../../components/Layout';
import { userService, User } from '../../../services/userService';
import { roleService } from '../../../services/roleService';
import { useToast } from '../../../hooks/useToast';
import { 
  FaArrowLeft, 
  FaSave, 
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
  FaEyeSlash as FaEyeSlashIcon,
  FaEye as FaEyeIcon
} from 'react-icons/fa';
import Link from 'next/link';

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
}

interface Role {
  id: number;
  name: string;
  permissions: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  
  const [user, setUser] = useState<UserDetails | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    employeeId: '',
    isActive: true,
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    birthDate: '',
    hireDate: '',
    status: 'actif'
  });

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
      fetchData();
    }
  }, [id, currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, rolesData] = await Promise.all([
        userService.getUserById(parseInt(id as string)),
        roleService.getAllRoles()
      ]);
      
      setUser(userData as UserDetails);
      setRoles(rolesData);
      
      // Remplir le formulaire
      setForm({
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        roleId: userData.roleId?.toString() || '',
        employeeId: userData.employeeId?.toString() || '',
        isActive: userData.isActive !== false,
        firstName: userData.employee?.firstName || '',
        lastName: userData.employee?.lastName || '',
        phone: userData.employee?.phone || '',
        address: userData.employee?.address || '',
        birthDate: userData.employee?.birthDate || '',
        hireDate: userData.employee?.hireDate || '',
        status: userData.employee?.status || 'actif'
      });
    } catch (err) {
      showError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      showError('Le nom d\'utilisateur est requis');
      return false;
    }
    
    if (!form.email.trim()) {
      showError('L\'email est requis');
      return false;
    }
    
    if (!form.roleId) {
      showError('Le rôle est requis');
      return false;
    }
    
    if (form.password && form.password !== form.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    if (form.password && form.password.length < 8) {
      showError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const loadingToast = showLoading('Enregistrement des modifications...');
    setSaving(true);
    
    try {
      const updateData: any = {
        username: form.username,
        email: form.email,
        roleId: parseInt(form.roleId),
        employeeId: form.employeeId ? parseInt(form.employeeId) : undefined,
        isActive: form.isActive,
        // Informations employé
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        birthDate: form.birthDate,
        hireDate: form.hireDate,
        status: form.status
      };

      // Ajouter le mot de passe seulement s'il est fourni
      if (form.password.trim()) {
        updateData.password = form.password;
      }

      await userService.updateUser(parseInt(id as string), updateData);
      
      dismiss(loadingToast);
      showSuccess('Utilisateur modifié avec succès');
      router.push(`/users/${id}`);
    } catch (err) {
      dismiss(loadingToast);
      showError('Erreur lors de la modification');
      console.error(err);
    } finally {
      setSaving(false);
    }
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
              href={`/users/${id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour aux détails
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l'utilisateur</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(user.isActive)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Informations de base
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur *
                </label>
                <input 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange} 
                  placeholder="Nom d'utilisateur" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Email" 
                  type="email" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="Laisser vide pour ne pas changer" 
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlashIcon /> : <FaEyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input 
                    name="confirmPassword" 
                    value={form.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Confirmer le mot de passe" 
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlashIcon /> : <FaEyeIcon />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rôle et permissions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaShieldAlt className="text-purple-600" />
              Rôle et permissions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle *
                </label>
                <select 
                  name="roleId" 
                  value={form.roleId} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un rôle</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Employé (optionnel)
                </label>
                <input 
                  name="employeeId" 
                  value={form.employeeId} 
                  onChange={handleChange} 
                  placeholder="ID Employé" 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={form.isActive} 
                  onChange={handleChange} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
                <label className="text-sm font-medium text-gray-700">
                  Compte actif
                </label>
              </div>
            </div>
          </div>

          {/* Informations employé */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaIdCard className="text-green-600" />
              Informations employé
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input 
                  name="firstName" 
                  value={form.firstName} 
                  onChange={handleChange} 
                  placeholder="Prénom" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input 
                  name="lastName" 
                  value={form.lastName} 
                  onChange={handleChange} 
                  placeholder="Nom" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="Téléphone" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut employé
                </label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="en_conge">En congé</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input 
                  name="birthDate" 
                  value={form.birthDate} 
                  onChange={handleChange} 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'embauche
                </label>
                <input 
                  name="hireDate" 
                  value={form.hireDate} 
                  onChange={handleChange} 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  placeholder="Adresse complète" 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Link
              href={`/users/${id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Annuler
            </Link>
            
            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={saving} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                <FaSave className="w-4 h-4" /> 
                <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
} 