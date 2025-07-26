import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FaCalendarPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaEye, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { MdMoreVert, MdPerson, MdDateRange } from 'react-icons/md';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface Leave {
  id: number;
  employeId: number;
  type: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  commentaire?: string;
}

export default function CongesPage() {
  const [conges, setConges] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { user } = useAuth();

  const canValidate = user && (user.role === 'ADMIN' || user.role === 'MANAGER');

  const fetchConges = () => {
    setLoading(true);
    axios.get<Leave[]>('http://localhost:4000/api/conges', { withCredentials: true })
      .then(res => setConges(res.data))
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConges();
  }, []);

  const handleValider = async (id: number) => {
    await axios.patch(`http://localhost:4000/api/conges/${id}/valider`, {}, { withCredentials: true });
    fetchConges();
  };

  const handleRefuser = async (id: number) => {
    await axios.patch(`http://localhost:4000/api/conges/${id}/refuser`, {}, { withCredentials: true });
    fetchConges();
  };

  const filteredConges = conges.filter(conge => {
    const matchesSearch = `${conge.type} ${conge.commentaire || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || conge.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'validé': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'refusé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Congé annuel': 'bg-blue-100 text-blue-800',
      'Congé maladie': 'bg-red-100 text-red-800',
      'Congé maternité': 'bg-pink-100 text-pink-800',
      'Congé paternité': 'bg-purple-100 text-purple-800',
      'RTT': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const calculateDuration = (dateDebut: string, dateFin: string) => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Congés</h1>
              <p className="text-gray-600 mt-1">Gérez les demandes de congés et absences</p>
            </div>
            <Link 
              href="/conges/nouveau" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
            >
              <FaCalendarPlus />
              <span>Demander un congé</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Congés</p>
                  <p className="text-2xl font-bold text-gray-900">{conges.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaCalendarAlt className="text-xl text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{conges.filter(c => c.statut === 'en attente').length}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FaClock className="text-xl text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Validés</p>
                  <p className="text-2xl font-bold text-gray-900">{conges.filter(c => c.statut === 'validé').length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaCheck className="text-xl text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Refusés</p>
                  <p className="text-2xl font-bold text-gray-900">{conges.filter(c => c.statut === 'refusé').length}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaTimes className="text-xl text-red-600" />
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
                    placeholder="Rechercher un congé..."
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
                  <option value="en attente">En attente</option>
                  <option value="validé">Validé</option>
                  <option value="refusé">Refusé</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Congés Grid */}
        {error ? (
          <div className="text-center text-red-500 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConges.map(conge => (
              <div key={conge.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                        <FaCalendarAlt className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Employé #{conge.employeId}</h3>
                        <p className="text-sm text-gray-600">{conge.type}</p>
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
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MdDateRange className="text-gray-400" />
                      <span>
                        {new Date(conge.dateDebut).toLocaleDateString()} - {new Date(conge.dateFin).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaClock className="text-gray-400" />
                      <span>{calculateDuration(conge.dateDebut, conge.dateFin)} jour(s)</span>
                    </div>
                    {conge.commentaire && (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Commentaire:</p>
                        <p className="mt-1">{conge.commentaire}</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conge.statut)}`}>
                      {conge.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(conge.type)}`}>
                      {conge.type}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">ID: {conge.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/conges/${conge.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <FaEye />
                      </Link>
                      <Link 
                        href={`/conges/${conge.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <FaEdit />
                      </Link>
                      {canValidate && conge.statut === 'en attente' && (
                        <>
                          <button 
                            onClick={() => handleValider(conge.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Valider"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            onClick={() => handleRefuser(conge.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Refuser"
                          >
                            <FaTimes />
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

        {filteredConges.length === 0 && !loading && (
          <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-gray-400 mb-4">
              <FaCalendarAlt className="text-6xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun congé trouvé</h3>
            <p className="text-gray-600">Aucun congé ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
