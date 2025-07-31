import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaSave, FaUserEdit } from 'react-icons/fa';
import Link from 'next/link';
import { employeeService, UpdateEmployeeData, Employee } from '../../../services/employeeService';
import { useAuth } from '../../../hooks/useAuth';
import { roleService, Role } from '../../../services/roleService';
import PhotoUpload from '../../../components/PhotoUpload';
import SalaryDisplay from '../../../components/SalaryDisplay';

export default function EditEmployee() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<UpdateEmployeeData & { roleId?: number }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    hireDate: '',
    status: 'actif',
    photoUrl: '',
    salary: undefined,
    jobTitleId: undefined,
    departmentId: undefined,
    managerId: undefined,
    roleId: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // Vérifier si l'utilisateur peut créer un Admin
  const canCreateAdmin = user?.roleName === 'Admin';

  useEffect(() => {
    if (id && user) {
      if (!(user.roleName === 'Admin' || user.roleName === 'RH')) {
        router.push('/unauthorized');
        return;
      }
      fetchEmployee();
      loadAvailableRoles();
    }
  }, [id, user, router]);

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(Number(id));
      setEmployee(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        birthDate: data.birthDate.split('T')[0], // Format YYYY-MM-DD pour input date
        hireDate: data.hireDate.split('T')[0],
        status: data.status,
        photoUrl: data.photoUrl || '',
        salary: data.salary,
        jobTitleId: data.jobTitleId,
        departmentId: data.departmentId,
        managerId: data.managerId,
        roleId: undefined, // On ne peut pas modifier le rôle via cette interface pour l'instant
      });
    } catch (err) {
      setError("Erreur lors du chargement de l'employé");
    }
  };

  const loadAvailableRoles = async () => {
    try {
      const roles = await roleService.getAvailableRolesForEmployeeCreation(user?.roleName || '');
      setAvailableRoles(roles);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'jobTitleId' || name === 'departmentId' || name === 'managerId' || name === 'roleId'
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
    setLoading(true);
    setError(null);
    
    try {
      await employeeService.updateEmployee(Number(id), form);
      router.push(`/employes/${id}`);
    } catch (err) {
      setError("Erreur lors de la modification de l'employé");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !(user.roleName === 'Admin' || user.roleName === 'RH')) {
    return null;
  }

  if (!employee) {
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href={`/employes/${id}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
              <FaArrowLeft /> <span>Retour</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Modifier l'Employé</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserEdit className="text-blue-600" />
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

              {/* Photo de l'employé */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
                <PhotoUpload
                  currentPhotoUrl={form.photoUrl}
                  onPhotoChange={handlePhotoChange}
                  employeeName={`${form.firstName} ${form.lastName}`}
                  disabled={loading}
                />
              </div>

              {/* Informations salariales */}
              <div className="md:col-span-2">
                <SalaryDisplay
                  salary={form.salary}
                  onSalaryChange={handleSalaryChange}
                  editable={true}
                  disabled={loading}
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

              {/* Message d'information pour les RH */}
              {!canCreateAdmin && user?.roleName === 'RH' && (
                <div className="md:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note :</strong> En tant que RH, vous ne pouvez pas promouvoir un employé en Admin. 
                      Seul un Admin peut effectuer cette action.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-4">
              <Link
                href={`/employes/${id}`}
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
                <span>{loading ? 'Modification...' : 'Modifier l\'employé'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 