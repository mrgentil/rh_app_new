import { useState } from 'react';
import Layout from '../../components/Layout';
import { FaUserPlus, FaFileCsv, FaFileExcel, FaTable, FaTh } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useEmployees } from '../../hooks/useEmployees';
import EmployeeTable from '../../components/EmployeeTable';
import { downloadUtils } from '../../services/employeeService';

export default function EmployesTablePage() {
  const { user } = useAuth();
  const { employees, loading, error, deleteEmployee } = useEmployees();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const canEdit = user && (user.role === 'Admin' || user.role === 'RH');
  const canDelete = user && user.role === 'Admin';

  const handleDeleteEmployee = async (employeeId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      return;
    }

    try {
      await deleteEmployee(employeeId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      await downloadUtils.downloadEmployeesCSV();
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      await downloadUtils.downloadEmployeesExcel();
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
    }
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
              <h1 className="text-3xl font-bold text-gray-800">Employés - Vue Tableau</h1>
              <p className="text-gray-600 mt-2">Gérez votre équipe avec une vue tabulaire</p>
          </div>
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vue tableau"
                >
                  <FaTable className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vue grille"
                >
                  <FaTh className="w-4 h-4" />
                </button>
            </div>

              {/* Export Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                  title="Exporter en CSV"
                >
                  <FaFileCsv />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                  title="Exporter en Excel"
                >
                  <FaFileExcel />
                  <span>Excel</span>
                </button>
              </div>

              {/* Add Employee Button */}
              {canEdit && (
                <Link 
                  href="/employes/nouveau" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                >
                  <FaUserPlus />
                  <span>Nouvel Employé</span>
                </Link>
              )}
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
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(employees.map(emp => emp.Department?.name).filter(Boolean)).size}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="text-xl text-purple-600 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        {viewMode === 'table' ? (
          <EmployeeTable
            employees={employees}
            onDelete={canDelete ? handleDeleteEmployee : undefined}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Vue grille non implémentée</p>
            <button
              onClick={() => setViewMode('table')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retour à la vue tableau
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/employes"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retour à la vue grille
          </Link>
        </div>
      </div>
    </Layout>
  );
} 