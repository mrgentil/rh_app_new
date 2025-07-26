import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaSave, FaUserPlus } from 'react-icons/fa';
import Link from 'next/link';
import { employeeService, CreateEmployeeData } from '../../services/employeeService';
import { useAuth } from '../../hooks/useAuth';

export default function NouveauEmploye() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState<CreateEmployeeData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    hireDate: '',
    status: 'actif',
    jobTitleId: undefined,
    departmentId: undefined,
    managerId: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [managers, setManagers] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'jobTitleId' || name === 'departmentId' || name === 'managerId' 
        ? (value ? parseInt(value) : undefined) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await employeeService.createEmployee(form);
      router.push('/employes');
    } catch (err) {
      setError("Erreur lors de la création de l'employé");
    } finally {
      setLoading(false);
    }
  };

  // Vérifier les permissions
  useEffect(() => {
    if (user && !(user.roleName === 'Admin' || user.roleName === 'RH')) {
      router.push('/unauthorized');
    }
  }, [user, router]);

  if (!user || !(user.roleName === 'Admin' || user.roleName === 'RH')) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
        <div className="flex items-center gap-3 mb-6">
            <Link href="/employes" className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
            <FaArrowLeft /> <span>Retour</span>
          </Link>
            <h1 className="text-3xl font-bold text-gray-800">Nouvel Employé</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserPlus className="text-blue-600" />
                  Informations personnelles
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche *</label>
                <input
                  name="hireDate"
                  type="date"
                  value={form.hireDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="en_conge">En congé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                <select
                  name="departmentId"
                  value={form.departmentId || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un département</option>
                  {/* TODO: Charger les départements depuis l'API */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                <select
                  name="jobTitleId"
                  value={form.jobTitleId || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un poste</option>
                  {/* TODO: Charger les postes depuis l'API */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <select
                  name="managerId"
                  value={form.managerId || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un manager</option>
                  {/* TODO: Charger les managers depuis l'API */}
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-4">
              <Link
                href="/employes"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaSave />
                <span>{loading ? 'Création...' : 'Créer l\'employé'}</span>
          </button>
            </div>
        </form>
      </div>
    </div>
    </Layout>
  );
}
