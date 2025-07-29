import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { FaPlus, FaEdit, FaTrash, FaEye, FaMoneyBillWave, FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import Link from 'next/link';

interface Payroll {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  createdAt: string;
}

export default function PaiePage() {
  const { user, isAuthenticated } = useAuth();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    fetchPayrolls();
  }, [isAuthenticated, selectedMonth, selectedYear]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payroll?month=${selectedMonth}&year=${selectedYear}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des bulletins de paie');
      }
      
      const data = await response.json();
      setPayrolls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayroll = async (payrollId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bulletin de paie ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/payroll/${payrollId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchPayrolls();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleDownloadPayslip = async (payrollId: number) => {
    try {
      const response = await fetch(`/api/payroll/${payrollId}/payslip`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin-paie-${payrollId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch(`/api/payroll/export?month=${selectedMonth}&year=${selectedYear}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'export');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paie-${selectedMonth}-${selectedYear}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'export');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>;
      case 'paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Payé</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Annulé</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
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
        <title>RH App - Gestion de la Paie</title>
      </Head>
      <Layout>
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion de la Paie</h1>
              <p className="text-gray-600 mt-2">
                Gérez les salaires et les bulletins de paie
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaFileExcel className="mr-2" />
                Export Excel
              </button>
              <Link 
                href="/paie/nouveau"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Nouveau Bulletin
              </Link>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Salaire Brut</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payrolls.reduce((sum, p) => sum + p.baseSalary, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Salaire Net</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payrolls.reduce((sum, p) => sum + p.netSalary, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Primes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payrolls.reduce((sum, p) => sum + p.bonus, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Déductions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payrolls.reduce((sum, p) => sum + p.deductions, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des bulletins de paie */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salaire Brut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Déductions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salaire Net
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrolls.map((payroll) => (
                    <tr key={payroll.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payroll.employeeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getMonthName(payroll.month)} {payroll.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(payroll.baseSalary)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(payroll.bonus)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(payroll.deductions)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payroll.netSalary)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payroll.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/paie/${payroll.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Voir"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            href={`/paie/${payroll.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Modifier"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDownloadPayslip(payroll.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Télécharger"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => handleDeletePayroll(payroll.id)}
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

            {payrolls.length === 0 && (
              <div className="text-center py-8">
                <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Aucun bulletin de paie trouvé pour cette période</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
