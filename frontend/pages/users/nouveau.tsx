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
  const [form, setForm] = useState<CreateUserData>({
    username: '',
    email: '',
    password: '',
    roleId: undefined,
    employeeId: undefined,
    photoUrl: '',
    salary: undefined,
    firstName: '',
    lastName: '',
    phone: '',
    departmentId: undefined,
    jobTitleId: undefined,
    address: '',
    birthDate: '',
    hireDate: '',
    status: 'actif',
    managerId: undefined,
    city: '',
    postalCode: '',
    country: 'France',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

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
      const [rolesData, employeesData, departmentsData, jobTitlesData] = await Promise.all([
        userService.getAvailableRoles(),
        userService.getAvailableEmployees(),
        fetch('/api/departments').then(res => res.json()),
        fetch('/api/job-titles').then(res => res.json())
      ]);
      setRoles(rolesData);
      setEmployees(employeesData);
      setDepartments(departmentsData);
      setJobTitles(jobTitlesData);
    } catch (err) {
      showError('Erreur lors du chargement des données');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'roleId' || name === 'employeeId' || name === 'departmentId' || name === 'jobTitleId' || name === 'managerId'
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
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche - Informations utilisateur */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations utilisateur</h2>
                
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
              </div>

              {/* Colonne droite - Informations employé */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations employé</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Prénom"
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
                    placeholder="Nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Téléphone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Département *</label>
                  <select
                    name="departmentId"
                    value={form.departmentId || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map((dept: any) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste *</label>
                  <select
                    name="jobTitleId"
                    value={form.jobTitleId || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un poste</option>
                    {jobTitles.map((job: any) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
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
                    <option value="">Sélectionner un manager (optionnel)</option>
                    {employees.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations personnelles</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
                  <input
                    name="hireDate"
                    type="date"
                    value={form.hireDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Adresse complète"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ville"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Code postal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pays"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact d'urgence</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contact</label>
                  <input
                    name="emergencyContactName"
                    value={form.emergencyContactName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du contact d'urgence"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone du contact</label>
                  <input
                    name="emergencyContactPhone"
                    value={form.emergencyContactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Téléphone du contact"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation avec le contact</label>
                  <select
                    name="emergencyContactRelationship"
                    value={form.emergencyContactRelationship}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner une relation</option>
                    <option value="Conjoint">Conjoint</option>
                    <option value="Parent">Parent</option>
                    <option value="Enfant">Enfant</option>
                    <option value="Frère/Sœur">Frère/Sœur</option>
                    <option value="Ami">Ami</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Photo et salaire */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Photo et rémunération</h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
                    <PhotoUpload
                      currentPhotoUrl={form.photoUrl}
                      onPhotoChange={handlePhotoChange}
                      employeeName={`${form.firstName} ${form.lastName}`}
                      disabled={loading}
                    />
                  </div>

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
                disabled={loading || !form.username || !form.email || !form.password || !form.roleId || !form.firstName || !form.lastName || !form.phone || !form.departmentId || !form.jobTitleId}
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
