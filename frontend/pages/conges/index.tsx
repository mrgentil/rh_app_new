import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface Leave {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  createdAt: string;
}

export default function CongesPage() {
  const { user, isAuthenticated } = useAuth();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    fetchLeaves();
  }, [isAuthenticated]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaves', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des congés');
      }
      
      const data = await response.json();
      setLeaves(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leaveId: number, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/leaves/${leaveId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      // Recharger la liste
      fetchLeaves();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteLeave = async (leaveId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande de congé ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchLeaves();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approuvé</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Refusé</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600 p-6">
          <p>Erreur: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>RH App - Gestion des Congés</title>
      </Head>
      <Layout>
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Congés</h1>
              <p className="text-gray-600 mt-2">
                Gérez les demandes de congés et les absences du personnel
              </p>
            </div>
            <Link 
              href="/conges/nouveau"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              Nouvelle Demande
            </Link>
          </div>

          {/* Tableau des congés */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de Congé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Raison
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {leave.employeeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {leave.leaveTypeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(leave.startDate).toLocaleDateString('fr-FR')} - {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {leave.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/conges/${leave.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Voir"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            href={`/conges/${leave.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Modifier"
                          >
                            <FaEdit />
                          </Link>
                          {leave.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(leave.id, 'approved')}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Approuver"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleStatusChange(leave.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Refuser"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteLeave(leave.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leaves.length === 0 && (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Aucune demande de congé trouvée</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
