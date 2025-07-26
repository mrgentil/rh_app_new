import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaDownload, FaEye, FaMoneyCheckAlt, FaFileAlt } from 'react-icons/fa';
import { MdMoreVert, MdPerson, MdDateRange } from 'react-icons/md';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface Payroll {
  id: number;
  employeId: number;
  mois: string;
  annee: number;
  montant: number;
  statut: string;
}

export default function PaiePage() {
  const [paies, setPaies] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    axios.get<Payroll[]>('http://localhost:4000/api/paie', { withCredentials: true })
      .then(res => setPaies(res.data))
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  const canEdit = user && (user.role === 'ADMIN' || user.role === 'MANAGER');

  const filteredPaies = paies.filter(paie => {
    const matchesSearch = `${paie.mois} ${paie.annee}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || paie.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'payé': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMonthColor = (mois: string) => {
    const colors = {
      'Janvier': 'bg-blue-100 text-blue-800',
      'Février': 'bg-purple-100 text-purple-800',
      'Mars': 'bg-green-100 text-green-800',
      'Avril': 'bg-pink-100 text-pink-800',
      'Mai': 'bg-yellow-100 text-yellow-800',
      'Juin': 'bg-indigo-100 text-indigo-800',
      'Juillet': 'bg-red-100 text-red-800',
      'Août': 'bg-orange-100 text-orange-800',
      'Septembre': 'bg-teal-100 text-teal-800',
      'Octobre': 'bg-cyan-100 text-cyan-800',
      'Novembre': 'bg-amber-100 text-amber-800',
      'Décembre': 'bg-emerald-100 text-emerald-800'
    };
    return colors[mois as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalMontant = paies.reduce((sum, paie) => sum + (paie.montant || 0), 0);
  const moyenneMontant = paies.length > 0 ? totalMontant / paies.length : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion de la Paie</h1>
              <p className="text-gray-600 mt-1">Gérez les fiches de paie et les salaires</p>
            </div>
            {canEdit && (
              <Link 
                href="/paie/nouveau" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
              >
                <FaPlus />
                <span>Nouvelle fiche de paie</span>
              </Link>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fiches</p>
                  <p className="text-2xl font-bold text-gray-900">{paies.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaFileAlt className="text-xl text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Montant</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMontant.toLocaleString()}€</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaMoneyCheckAlt className="text-xl text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{moyenneMontant.toLocaleString()}€</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaMoneyCheckAlt className="text-xl text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payées</p>
                  <p className="text-2xl font-bold text-gray-900">{paies.filter(p => p.statut === 'payé').length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une fiche de paie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="payé">Payé</option>
                  <option value="en attente">En attente</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Paie Grid */}
        {error ? (
          <div className="text-center text-red-500 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaies.map(paie => (
              <div key={paie.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <FaMoneyCheckAlt className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Employé #{paie.employeId}</h3>
                        <p className="text-sm text-gray-600">{paie.mois} {paie.annee}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MdMoreVert />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Montant:</span>
                      <span className="text-lg font-bold text-gray-900">{paie.montant ? paie.montant.toLocaleString() : '0'}€</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MdDateRange className="text-gray-400" />
                      <span>{paie.mois} {paie.annee}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MdPerson className="text-gray-400" />
                      <span>ID: {paie.employeId}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paie.statut)}`}>
                      {paie.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMonthColor(paie.mois)}`}>
                      {paie.mois}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">ID: {paie.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/paie/${paie.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <FaEye />
                      </Link>
                      <a
                        href={`http://localhost:4000/api/paie/${paie.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Télécharger PDF"
                      >
                        <FaDownload />
                      </a>
                      {canEdit && (
                        <>
                          <Link 
                            href={`/paie/${paie.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <FaEdit />
                          </Link>
                          <button 
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

        {filteredPaies.length === 0 && !loading && (
          <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-gray-400 mb-4">
              <FaMoneyCheckAlt className="text-6xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune fiche de paie trouvée</h3>
            <p className="text-gray-600">Aucune fiche de paie ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
