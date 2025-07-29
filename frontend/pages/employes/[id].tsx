import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { FaEdit, FaTrash, FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaBriefcase, FaCalendarAlt, FaUser, FaIdCard, FaClock, FaBirthdayCake, FaDownload } from 'react-icons/fa';
import Link from 'next/link';
import { employeeService, downloadUtils, Employee } from '../../services/employeeService';

export default function EmployeeDetailsPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const data = await employeeService.getEmployeeById(Number(id));
      setEmployee(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      case 'en_conge': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const handleEdit = () => {
    router.push(`/employes/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.')) {
      return;
    }

    try {
      await employeeService.deleteEmployee(Number(id));
      router.push('/employes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleDownloadContract = async () => {
    try {
      await downloadUtils.downloadEmployeeContract(Number(id), `${employee?.firstName} ${employee?.lastName}`);
    } catch (err) {
      setError('Erreur lors du téléchargement du contrat');
    }
  };

  const canEdit = user && (user.roleName === 'Admin' || user.roleName === 'RH');

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur :</strong> {error}
          </div>
          <button
            onClick={() => router.push('/employes')}
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Retour à la liste
          </button>
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Employé non trouvé</h2>
            <button
              onClick={() => router.push('/employes')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/employes')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Retour aux employés
          </button>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  {employee.JobTitle?.title || 'Poste non défini'}
                </p>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadContract}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
              >
                <FaDownload className="w-4 h-4 mr-2" />
                Contrat PDF
              </button>
              {canEdit && (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                  >
                    <FaEdit className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                  >
                    <FaTrash className="w-4 h-4 mr-2" />
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="w-5 h-5 mr-2 text-blue-600" />
                Informations de contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{employee.phone || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:col-span-2">
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium">{employee.address || 'Non renseignée'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaBriefcase className="w-5 h-5 mr-2 text-blue-600" />
                Informations professionnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaBuilding className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Département</p>
                    <p className="font-medium">{employee.Department?.name || 'Non défini'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaBriefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Poste</p>
                    <p className="font-medium">{employee.JobTitle?.title || 'Non défini'}</p>
                  </div>
                </div>
                {employee.JobTitle?.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Description du poste</p>
                    <p className="text-gray-700">{employee.JobTitle.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dates importantes */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="w-5 h-5 mr-2 text-blue-600" />
                Dates importantes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaBirthdayCake className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date de naissance</p>
                    <p className="font-medium">{formatDate(employee.birthDate)} ({calculateAge(employee.birthDate)} ans)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaClock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date d'embauche</p>
                    <p className="font-medium">{formatDate(employee.hireDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 md:col-span-2">
                  <FaClock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Ancienneté</p>
                    <p className="font-medium">{calculateSeniority(employee.hireDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaIdCard className="w-5 h-5 mr-2 text-blue-600" />
                Informations générales
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">ID Employé</p>
                  <p className="font-medium text-lg">{employee.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Âge</p>
                  <p className="font-medium">{calculateAge(employee.birthDate)} ans</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ancienneté</p>
                  <p className="font-medium">{calculateSeniority(employee.hireDate)}</p>
                </div>
              </div>
            </div>

            {/* Département */}
            {employee.Department && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaBuilding className="w-5 h-5 mr-2 text-blue-600" />
                  Département
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-medium">{employee.Department.name}</p>
                  </div>
                  {employee.Department.description && (
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-700">{employee.Department.description}</p>
                    </div>
                  )}
                  <Link
                    href={`/departments/${employee.Department.id}`}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition duration-200"
                  >
                    Voir le département
                  </Link>
                </div>
              </div>
            )}

            {/* Actions rapides */}
            {canEdit && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleEdit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <FaEdit className="w-4 h-4 mr-2" />
                    Modifier l'employé
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <FaTrash className="w-4 h-4 mr-2" />
                    Supprimer l'employé
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
