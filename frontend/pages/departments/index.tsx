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
  status: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/departments', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des départements');
      }
      
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (departmentId: number) => {
    router.push(`/departments/${departmentId}`);
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur :</strong> {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Départements</h1>
          {user?.roleName === 'Admin' && (
            <button
              onClick={() => router.push('/departments/nouveau')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Nouveau Département
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div
              key={department.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {department.name}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {department.Employees?.length || 0} employé(s)
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {department.description}
                </p>

                <div className="space-y-2 mb-4">
                  {department.Employees && department.Employees.length > 0 ? (
                    department.Employees.slice(0, 3).map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {employee.firstName} {employee.lastName}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          employee.status === 'actif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucun employé</p>
                  )}
                  
                  {department.Employees && department.Employees.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{department.Employees.length - 3} autre(s) employé(s)
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleViewDetails(department.id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Aucun département trouvé
            </h3>
            <p className="text-gray-500">
              Commencez par créer votre premier département.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 