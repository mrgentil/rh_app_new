import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaSave, FaUserPlus } from 'react-icons/fa';
import Link from 'next/link';
import { userService, CreateUserData } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import PhotoUpload from '../../components/PhotoUpload';
import SalaryDisplay from '../../components/SalaryDisplay';

export default function NouveauUser() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [form, setForm] = useState<CreateUserData & { photoUrl?: string; salary?: number }>({
    username: '',
    email: '',
    password: '',
    roleId: undefined,
    employeeId: undefined,
    photoUrl: '',
    salary: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Vérifier les permissions
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      router.push('/unauthorized');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      const [rolesData, employeesData] = await Promise.all([
        userService.getAvailableRoles(),
        userService.getAvailableEmployees()
      ]);
      setRoles(rolesData);
      setEmployees(employeesData);
    } catch (err) {
      showError('Erreur lors du chargement des données');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'roleId' || name === 'employeeId'
        ? (value ? parseInt(value) : undefined) 
        : value
    }));
  };

  const handlePhotoChange = (photoUrl: string) => {
    setForm(prev => ({ ...prev, photoUrl }));
  };

  const handleSalaryChange = (salary: number) => {
    setForm(prev => ({ ...prev, salary }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = showLoading('Création de l\'utilisateur en cours...');
    setLoading(true);
    setError(null);
    
    try {
      await userService.createUser(form);
      dismiss(loadingToast);
      showSuccess('Utilisateur créé avec succès !');
      router.push('/users');
    } catch (err) {
      dismiss(loadingToast);
      const errorMessage = "Erreur lors de la création de l'utilisateur";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/users" className="text-blue-600 hover:text-blue-800 mb-4 flex items-center">
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Retour aux utilisateurs
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaUserPlus className="mr-3 text-blue-600" />
                Nouvel utilisateur
              </h1>
              <p className="text-gray-600 mt-2">Créez un nouveau compte utilisateur avec photo et informations salariales</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche - Informations de base */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de base</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur *</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom d'utilisateur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@exemple.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mot de passe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
                  <select
                    name="roleId"
                    value={form.roleId || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un rôle</option>
                    {roles.map((role: any) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employé associé</label>
                  <select
                    name="employeeId"
                    value={form.employeeId || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un employé (optionnel)</option>
                    {employees.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} - {emp.JobTitle?.title || 'Poste non défini'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Colonne droite - Photo et salaire */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Photo et rémunération</h2>
                
                {/* Photo de l'utilisateur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
                  <PhotoUpload
                    currentPhotoUrl={form.photoUrl}
                    onPhotoChange={handlePhotoChange}
                    employeeName={form.username}
                    disabled={loading}
                  />
                </div>

                {/* Informations salariales */}
                <div>
                  <SalaryDisplay
                    salary={form.salary}
                    onSalaryChange={handleSalaryChange}
                    editable={true}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-4">
              <Link
                href="/users"
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading || !form.username || !form.email || !form.password || !form.roleId}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 flex items-center"
              >
                <FaSave className="mr-2" />
                {loading ? 'Création...' : 'Créer l\'utilisateur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
