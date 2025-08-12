import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { managerEmployeeService, ManagerEmployee, CreateEmployeeData } from '../../services/managerEmployeeService';
import { 
  FaUserPlus, 
  FaEdit, 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaFileCsv, 
  FaFileExcel,
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard
} from 'react-icons/fa';
import Link from 'next/link';



export default function ManagerEmployeesPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [employees, setEmployees] = useState<ManagerEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ManagerEmployee | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<Partial<CreateEmployeeData>>({});
  const [createLoading, setCreateLoading] = useState(false);

  // Charger les employés de l'équipe du manager
  useEffect(() => {
    loadTeamEmployees();
  }, [user]);

  const loadTeamEmployees = async () => {
    try {
      setLoading(true);
      const teamEmployees = await managerEmployeeService.getTeamEmployees();
      setEmployees(teamEmployees);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'équipe:', error);
      showError('Erreur lors du chargement de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || employee.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      case 'congé': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'actif': return 'Actif';
      case 'inactif': return 'Inactif';
      case 'congé': return 'En congé';
      default: return status;
    }
  };

  const handleExportCSV = async () => {
    try {
      await managerEmployeeService.exportTeamEmployeesCSV();
      showSuccess('Export CSV généré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      showError('Erreur lors de l\'export CSV');
    }
  };

  const handleExportExcel = async () => {
    try {
      const exportData = await managerEmployeeService.exportTeamEmployeesJSON();
      // Créer un fichier JSON pour simulation Excel
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `equipe_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess('Export JSON généré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      showError('Erreur lors de l\'export');
    }
  };

  const handleViewDetails = async (employee: ManagerEmployee) => {
    try {
      const personalInfo = await managerEmployeeService.getEmployeePersonalInfo(employee.id);
      setSelectedEmployee(personalInfo);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      showError('Erreur lors de la récupération des détails');
    }
  };

  const handleEditEmployee = (employeeId: number) => {
    showSuccess(`Redirection vers l'édition de l'employé ${employeeId}`);
    // Ici vous pourriez naviguer vers la page d'édition ou ouvrir un modal d'édition
  };

  const handleCreateEmployee = async () => {
    try {
      setCreateLoading(true);
      
      // Validation des données
      const validation = managerEmployeeService.validateEmployeeData(createFormData);
      if (!validation.isValid) {
        showError(validation.errors.join(', '));
        return;
      }
      
      await managerEmployeeService.createTeamEmployee(createFormData as CreateEmployeeData);
      showSuccess('Employé créé avec succès');
      setShowCreateModal(false);
      setCreateFormData({});
      
      // Recharger la liste
      await loadTeamEmployees();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      showError('Erreur lors de la création de l\'employé');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormChange = (field: keyof CreateEmployeeData, value: any) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de Mon Équipe</h1>
          <p className="text-gray-600">Gérez les employés de votre équipe</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <FaFileCsv className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaFileExcel className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <FaUserPlus className="w-4 h-4" />
            <span>Ajouter Employé</span>
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Équipe</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.status === 'actif').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaCalendarAlt className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Congé</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.status === 'congé').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaBriefcase className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Postes</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(employees.map(e => e.jobTitle)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="congé">En congé</option>
          </select>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredEmployees.length} employé(s) trouvé(s)
            </span>
          </div>
        </div>
      </div>

      {/* Liste des employés */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Employés de l'équipe</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'embauche
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FaEnvelope className="w-3 h-3 mr-1 text-gray-400" />
                      {employee.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaPhone className="w-3 h-3 mr-1 text-gray-400" />
                      {employee.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {getStatusText(employee.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(employee)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Voir les détails"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails employé */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de l'employé
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Poste</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.jobTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Département</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.department}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedEmployee.birthDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'embauche</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedEmployee.hireDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de contrat</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.contractType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salaire</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEmployee.salary.toLocaleString('fr-FR')} €/an
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact d'urgence</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {(selectedEmployee as any).emergencyContactName && (
                        <>
                          {(selectedEmployee as any).emergencyContactName}
                          {(selectedEmployee as any).emergencyContactPhone && (
                            <> - {(selectedEmployee as any).emergencyContactPhone}</>
                          )}
                          {(selectedEmployee as any).emergencyContactRelationship && (
                            <> ({(selectedEmployee as any).emergencyContactRelationship})</>
                          )}
                        </>
                      ) || 'Non renseigné'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleEditEmployee(selectedEmployee.id);
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'employé */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Ajouter un employé à l'équipe
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    value={createFormData.firstName || ''}
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={createFormData.lastName || ''}
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={createFormData.email || ''}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    value={createFormData.phone || ''}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Poste (ID)</label>
                  <input
                    type="number"
                    value={createFormData.jobTitleId || ''}
                    onChange={(e) => handleFormChange('jobTitleId', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="ID du poste"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Département (ID)</label>
                  <input
                    type="number"
                    value={createFormData.departmentId || ''}
                    onChange={(e) => handleFormChange('departmentId', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="ID du département"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Équipe (ID)</label>
                  <input
                    type="number"
                    value={createFormData.teamId || ''}
                    onChange={(e) => handleFormChange('teamId', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="ID de l'équipe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'embauche</label>
                  <input
                    type="date"
                    value={createFormData.hireDate || ''}
                    onChange={(e) => handleFormChange('hireDate', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                  <input
                    type="date"
                    value={createFormData.birthDate || ''}
                    onChange={(e) => handleFormChange('birthDate', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <input
                    type="text"
                    value={createFormData.address || ''}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Adresse complète"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de contrat</label>
                  <select 
                    value={createFormData.contractType || ''}
                    onChange={(e) => handleFormChange('contractType', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salaire (€/an)</label>
                  <input
                    type="number"
                    value={createFormData.salary || ''}
                    onChange={(e) => handleFormChange('salary', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="45000"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateEmployee}
                  disabled={createLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 flex items-center space-x-2"
                >
                  {createLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{createLoading ? 'Création...' : 'Ajouter'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
