import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaUserShield, FaUserCog } from 'react-icons/fa';
import { MdMoreVert, MdEmail, MdPerson } from 'react-icons/md';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface User {
  id: number;
  email: string;
  role: string;
  employeId?: number;
  employe?: { nom: string; prenom: string };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    axios.get<User[]>('http://localhost:4000/api/users', { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = user && user.role === 'ADMIN';

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.email} ${user.role} ${user.employe ? `${user.employe.prenom} ${user.employe.nom}` : ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-purple-100 text-purple-800';
      case 'EMPLOYE': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="text-gray-600 mt-1">Gérez les comptes utilisateurs et les permissions</p>
            </div>
            {isAdmin && (
              <Link 
                href="/users/nouveau" 
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
              >
                <FaPlus />
                <span>Ajouter un utilisateur</span>
              </Link>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaUserCog className="text-xl text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'ADMIN').length}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaUserShield className="text-xl text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'MANAGER').length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaUserShield className="text-xl text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Employés</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'EMPLOYE').length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaUserCog className="text-xl text-green-600" />
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
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tous les rôles</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="MANAGER">Manager</option>
                  <option value="EMPLOYE">Employé</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {error ? (
          <div className="text-center text-red-500 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                        <FaUserCog className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.email}</h3>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
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
                      <MdEmail className="text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MdPerson className="text-gray-400" />
                      <span>{user.employe ? `${user.employe.prenom} ${user.employe.nom}` : 'Aucun employé associé'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    {user.employe && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Employé #{user.employeId}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">ID: {user.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/users/${user.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <FaEye />
                      </Link>
                      {isAdmin && (
                        <>
                          <Link 
                            href={`/users/${user.id}`}
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

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-gray-400 mb-4">
              <FaUserCog className="text-6xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-600">Aucun utilisateur ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
