import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { MdWork, MdAttachMoney } from 'react-icons/md';
import PhotoUpload from '../components/PhotoUpload';
import { userService } from '../services/userService';
import { useToast } from '../hooks/useToast';

interface ProfileForm {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  photoUrl: string;
  password: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, checkUserStatus } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    photoUrl: '',
    password: '',
    confirmPassword: ''
  });

  // Charger les données utilisateur au montage
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        photoUrl: user.photoUrl || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Synchroniser password et confirmPassword
    if (name === 'password') {
      setForm(prev => ({
        ...prev,
        confirmPassword: value ? prev.confirmPassword : ''
      }));
    } else if (name === 'confirmPassword') {
      setForm(prev => ({
        ...prev,
        password: value ? prev.password : ''
      }));
    }
  };

  const handlePhotoChange = (photoUrl: string) => {
    setForm(prev => ({
      ...prev,
      photoUrl
    }));
  };

  const validateForm = () => {
    // Validation de base
    if (!form.username.trim()) {
      showToast('Le nom d\'utilisateur est requis', 'error');
      return false;
    }

    if (!form.email.trim()) {
      showToast('L\'email est requis', 'error');
      return false;
    }

    if (!form.firstName.trim()) {
      showToast('Le prénom est requis', 'error');
      return false;
    }

    if (!form.lastName.trim()) {
      showToast('Le nom de famille est requis', 'error');
      return false;
    }

    // Validation du mot de passe si fourni
    if (form.password.trim()) {
      if (form.password.length < 8) {
        showToast('Le mot de passe doit contenir au moins 8 caractères', 'error');
        return false;
      }

      if (form.password !== form.confirmPassword) {
        showToast('Les mots de passe ne correspondent pas', 'error');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        photoUrl: form.photoUrl,
        ...(form.password && { password: form.password })
      };

      await userService.updateUser(user!.id, updateData);
      
      // Recharger les données utilisateur
      await checkUserStatus();
      
      setIsEditing(false);
      showToast('Profil mis à jour avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      showToast('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurer les données originales
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        photoUrl: user.photoUrl || '',
        password: '',
        confirmPassword: ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos paramètres</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte de profil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Photo de profil */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                    {form.photoUrl ? (
                      <img
                        src={form.photoUrl}
                        alt={`${form.firstName} ${form.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                          {form.firstName?.charAt(0)}{form.lastName?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <PhotoUpload onPhotoChange={handlePhotoChange} />
                    </div>
                  )}
                </div>

                {/* Informations de base */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {form.firstName} {form.lastName}
                </h2>
                <p className="text-gray-600 mb-4">{form.username}</p>

                {/* Statut */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Actif
                </div>
              </div>

              {/* Informations rapides */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FaEnvelope className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="truncate">{form.email}</span>
                </div>
                {form.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPhone className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{form.phone}</span>
                  </div>
                )}
                {form.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="truncate">{form.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulaire de profil */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header du formulaire */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaEdit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaTimes className="w-4 h-4 mr-2" />
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <FaSave className="w-4 h-4 mr-2" />
                        )}
                        Enregistrer
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Contenu du formulaire */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'utilisateur *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de famille *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* Changement de mot de passe */}
                {isEditing && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Laissez vide si vous ne changez pas le mot de passe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {form.password && (
                          <p className="mt-1 text-xs text-red-600">
                            ⚠️ La confirmation est obligatoire si vous changez le mot de passe
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Laissez vide si vous ne changez pas le mot de passe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {!form.password && (
                          <p className="mt-1 text-xs text-gray-500">
                            💡 Laissez les deux champs vides si vous ne souhaitez pas changer le mot de passe
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Informations professionnelles</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <MdWork className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Rôle</p>
                      <p className="text-sm text-gray-600">{user.roleName || user.role || 'Non défini'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Membre depuis</p>
                      <p className="text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non défini'}
                      </p>
                    </div>
                  </div>

                  {user.employee && (
                    <>
                      <div className="flex items-center">
                        <MdWork className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Poste</p>
                          <p className="text-sm text-gray-600">{user.employee.jobTitle || 'Non défini'}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <MdAttachMoney className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Salaire</p>
                          <p className="text-sm text-gray-600">
                            {user.employee.salary ? `${user.employee.salary.toLocaleString('fr-FR')} €` : 'Non défini'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 