import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FaUserPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaBuilding, FaBriefcase, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaDownload, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { employeeService, downloadUtils, Employee } from '../../services/employeeService';

export default function EmployesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = user && (user.roleName === 'Admin' || user.roleName === 'RH');
  const canDelete = user && user.roleName === 'Admin';

  const handleDeleteEmployee = async (employeeId: number, employeeName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${employeeName} ?`)) {
      return;
    }

    try {
      await employeeService.deleteEmployee(employeeId);
      // Recharger la liste des employés
      await fetchEmployees();
    } catch (error) {
      setError('Erreur lors de la suppression de l\'employé');
    }
  };

  const handleExportCSV = async () => {
    try {
      await downloadUtils.downloadEmployeesCSV();
    } catch (error) {
      setError('Erreur lors de l\'export CSV');
    }
  };

  const handleExportExcel = async () => {
    try {
      await downloadUtils.downloadEmployeesExcel();
    } catch (error) {
      setError('Erreur lors de l\'export Excel');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.JobTitle?.title || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || emp.Department?.name === filterDepartment;
    const matchesStatus = !filterStatus || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(employees.map(emp => emp.Department?.name).filter(Boolean))];
  const statuses = [...new Set(employees.map(emp => emp.status))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      case 'en_conge': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateSeniority = (hireDate: string) => {
    const today = new Date();
    const hire = new Date(hireDate);
    const years = today.getFullYear() - hire.getFullYear();
    const months = today.getMonth() - hire.getMonth();
    if (months < 0) {
      return `${years - 1} an(s) et ${12 + months} mois`;
    }
    return `${years} an(s) et ${months} mois`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestion des Employés</h1>
              <p className="text-gray-600 mt-2">Gérez votre équipe et leurs informations complètes</p>
            </div>
            <div className="flex items-center space-x-3">
              {canEdit && (
                <Link 
                  href="/employes/nouveau" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                >
                  <FaUserPlus />
                  <span>Nouvel Employé</span>
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                  title="Exporter en CSV"
                >
                  <FaFileCsv />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                  title="Exporter en Excel"
                >
                  <FaFileExcel />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employés</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaUserPlus className="text-xl text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'actif').length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En congé</p>
                  <p className="text-2xl font-bold text-yellow-600">{employees.filter(e => e.status === 'en_conge').length}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Départements</p>
                  <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaBuilding className="text-xl text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un employé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tous les départements</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tous les statuts</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        {error ? (
          <div className="text-center text-red-500 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{emp.firstName} {emp.lastName}</h3>
                        <p className="text-sm text-gray-600">{emp.JobTitle?.title || 'Poste non défini'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                      {emp.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400 w-4 h-4" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaPhone className="text-gray-400 w-4 h-4" />
                      <span>{emp.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaBuilding className="text-gray-400 w-4 h-4" />
                      <span>{emp.Department?.name || 'Département non défini'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400 w-4 h-4" />
                      <span className="truncate">{emp.address || 'Adresse non renseignée'}</span>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Âge:</span>
                      <span className="ml-1 font-medium">{calculateAge(emp.birthDate)} ans</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ancienneté:</span>
                      <span className="ml-1 font-medium">{calculateSeniority(emp.hireDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Naissance:</span>
                      <span className="ml-1 font-medium">{formatDate(emp.birthDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Embauche:</span>
                      <span className="ml-1 font-medium">{formatDate(emp.hireDate)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                      {emp.status}
                    </span>
                    {emp.Department && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {emp.Department.name}
                      </span>
                    )}
                    {emp.JobTitle && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {emp.JobTitle.title}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      ID: {emp.id}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/employes/${emp.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <FaEye />
                      </Link>
                      {canEdit && (
                        <>
                          <Link 
                            href={`/employes/${emp.id}/edit`}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id, `${emp.firstName} ${emp.lastName}`)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredEmployees.length === 0 && !loading && (
          <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-gray-400 mb-4">
              <FaUserPlus className="text-6xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
            <p className="text-gray-600">Aucun employé ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

