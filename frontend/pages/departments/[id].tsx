import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';

interface Department {
  id: number;
  name: string;
  description: string;
  Employees?: Employee[];
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  hireDate: string;
  birthDate: string;
  address: string;
  JobTitle?: {
    title: string;
    description: string;
  };
}

export default function DepartmentDetailsPage() {
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchDepartmentDetails();
    }
  }, [id]);

  const fetchDepartmentDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/departments/${id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Département non trouvé');
        }
        throw new Error('Erreur lors de la récupération des détails');
      }
      
      const data = await response.json();
      setDepartment(data);
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
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'inactif':
        return 'bg-red-100 text-red-800';
      case 'en_conge':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditDepartment = () => {
    router.push(`/departments/${id}/edit`);
  };

  const handleBackToList = () => {
    router.push('/departments');
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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur :</strong> {error}
          </div>
          <button
            onClick={handleBackToList}
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Retour à la liste
          </button>
        </div>
      </Layout>
    );
  }

  if (!department) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Département non trouvé</h2>
            <button
              onClick={handleBackToList}
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <button
              onClick={handleBackToList}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux départements
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{department.name}</h1>
            <p className="text-gray-600 text-lg">{department.description}</p>
          </div>
          
          {(user?.roleName === 'Admin' || user?.roleName === 'RH') && (
            <button
              onClick={handleEditDepartment}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Modifier
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {department.Employees?.length || 0}
            </div>
            <div className="text-gray-600">Total employés</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {department.Employees?.filter(emp => emp.status === 'actif').length || 0}
            </div>
            <div className="text-gray-600">Employés actifs</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {department.Employees?.filter(emp => emp.status === 'en_conge').length || 0}
            </div>
            <div className="text-gray-600">En congé</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {department.Employees?.filter(emp => emp.status === 'inactif').length || 0}
            </div>
            <div className="text-gray-600">Inactifs</div>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Membres du département</h2>
            <p className="text-gray-600 mt-1">
              {department.Employees?.length || 0} employé(s) dans ce département
            </p>
          </div>

          {department.Employees && department.Employees.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {department.Employees.map((employee) => (
                <div key={employee.id} className="p-6 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-gray-600">{employee.JobTitle?.title || 'Poste non défini'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-800">{employee.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Téléphone</label>
                          <p className="text-gray-800">{employee.phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Date d'embauche</label>
                          <p className="text-gray-800">{formatDate(employee.hireDate)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                          <p className="text-gray-800">{formatDate(employee.birthDate)}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Adresse</label>
                          <p className="text-gray-800">{employee.address || 'Non renseignée'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => router.push(`/employes/${employee.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Voir profil →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Aucun employé dans ce département
              </h3>
              <p className="text-gray-500 mb-4">
                Ce département ne contient actuellement aucun employé.
              </p>
              {user?.roleName === 'Admin' && (
                <button
                  onClick={() => router.push('/employes/nouveau')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Ajouter un employé
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 