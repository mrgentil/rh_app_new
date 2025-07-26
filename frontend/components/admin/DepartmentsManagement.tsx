import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaBuilding, FaUsers } from 'react-icons/fa';

interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  createdAt: string;
  updatedAt: string;
  Employees?: Employee[];
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export default function DepartmentsManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Charger les départements
  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/departments', {
        withCredentials: true
      });
      setDepartments(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des départements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Gérer les changements du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ouvrir modal pour créer/éditer
  const openModal = (department?: Department) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        name: department.name,
        description: department.description || ''
      });
    } else {
      setEditingDepartment(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  // Fermer modal
  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    setFormData({ name: '', description: '' });
    setError('');
  };

  // Créer un département
  const createDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/departments', formData, {
        withCredentials: true
      });
      closeModal();
      loadDepartments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  // Mettre à jour un département
  const updateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;
    
    try {
      await axios.put(`http://localhost:3001/api/departments/${editingDepartment.id}`, formData, {
        withCredentials: true
      });
      closeModal();
      loadDepartments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  // Supprimer un département
  const deleteDepartment = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/departments/${id}`, {
        withCredentials: true
      });
      loadDepartments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des Départements</h3>
          <p className="text-sm text-gray-500">Gérez les départements de votre entreprise</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Nouveau Département</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div key={department.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaBuilding className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{department.name}</h4>
                  <p className="text-sm text-gray-500">
                    {department.Employees?.length || 0} employé(s)
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(department)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Modifier"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteDepartment(department.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Supprimer"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {department.description && (
              <p className="text-sm text-gray-600 mb-4">{department.description}</p>
            )}
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Créé le {new Date(department.createdAt).toLocaleDateString()}</span>
                <span>Modifié le {new Date(department.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {departments.length === 0 && !loading && (
        <div className="text-center py-12">
          <FaBuilding className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun département</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par créer votre premier département.</p>
          <div className="mt-6">
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Créer un département
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingDepartment ? 'Modifier le département' : 'Nouveau département'}
              </h3>
              
              <form onSubmit={editingDepartment ? updateDepartment : createDepartment}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du département *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Ressources Humaines"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description du département..."
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    {editingDepartment ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 