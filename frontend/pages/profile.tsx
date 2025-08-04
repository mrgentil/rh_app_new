import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import PhotoUpload from '../components/PhotoUpload';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaKey,
  FaShieldAlt,
  FaHistory
} from 'react-icons/fa';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  role: string;
  avatar?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  salary: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface ProfileSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Vérifier les permissions de l'utilisateur
  const canEditAll = user?.role === 'Admin' || user?.role === 'RH';
  const canEditPersonal = true; // Tout utilisateur peut modifier ses infos personnelles

  useEffect(() => {
    if (user && user.id) {
      loadUserProfile();
    } else {
      setLoading(false);
      setMessage({ type: 'error', text: 'Veuillez vous connecter pour voir votre profil.' });
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/profile/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('🔧 Données reçues de l\'API:', data);
      
      // Transformer les données de l'API en format attendu par le frontend
      const profileData: UserProfile = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        department: data.professional?.department || '',
        position: data.professional?.position || '',
        hireDate: data.professional?.hireDate ? new Date(data.professional.hireDate).toISOString().split('T')[0] : '',
        role: data.professional?.role || '',
        avatar: data.photoUrl,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        salary: data.salary || 0,
        emergencyContact: {
          name: data.emergencyContact?.name || '',
          phone: data.emergencyContact?.phone || '',
          relationship: data.emergencyContact?.relationship || ''
        }
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      showError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      // Préparer les données à envoyer
      const updateData = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country,
        emergencyContactName: profile.emergencyContact.name,
        emergencyContactPhone: profile.emergencyContact.phone,
        emergencyContactRelationship: profile.emergencyContact.relationship
      };
      
      console.log('🔧 État du profil avant envoi:', profile);
      console.log('🔧 Données à envoyer:', updateData);

      console.log('🔧 Envoi de la requête PUT...');
      const response = await fetch('http://localhost:3001/api/profile/me', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('🔧 Réponse reçue:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 Erreur de réponse:', errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      showSuccess(result.message || 'Profil mis à jour avec succès !');
      setIsEditing(false);
      
      // Recharger les données mises à jour
      await loadUserProfile();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError('Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserProfile(); // Recharger les données originales
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleEmergencyContactChange = (field: keyof UserProfile['emergencyContact'], value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      emergencyContact: {
        ...profile.emergencyContact,
        [field]: value
      }
    });
  };

  const handlePhotoChange = async (photoUrl: string) => {
    if (!profile) return;
    
    try {
      // Mettre à jour la photo dans le profil local
      setProfile({ ...profile, avatar: photoUrl });
      
      // Envoyer la photo au serveur
      const response = await fetch('http://localhost:3001/api/profile/me/photo', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrl }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      showSuccess('Photo de profil mise à jour avec succès !');
      
      // Recharger les données utilisateur dans le contexte d'authentification
      const { checkUserStatus } = useAuth();
      if (checkUserStatus) {
        await checkUserStatus();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      showError('Erreur lors de la mise à jour de la photo de profil');
    }
  };

  const sections: ProfileSection[] = [
    {
      id: 'personal',
      title: 'Informations personnelles',
      icon: <FaUser className="w-4 h-4" />,
      description: 'Gérez vos informations personnelles'
    },
    {
      id: 'professional',
      title: 'Informations professionnelles',
      icon: <FaBuilding className="w-4 h-4" />,
      description: 'Vos informations professionnelles'
    },
    {
      id: 'contact',
      title: 'Contact d\'urgence',
      icon: <FaPhone className="w-4 h-4" />,
      description: 'Informations de contact d\'urgence'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Impossible de charger le profil</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos informations personnelles et professionnelles
              </p>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <FaSave className="w-4 h-4" />
                    <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <FaTimes className="w-4 h-4" />
                    <span>Annuler</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message de notification */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Photo de profil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <PhotoUpload
                currentPhotoUrl={profile.avatar}
                onPhotoChange={handlePhotoChange}
                employeeName={`${profile.firstName} ${profile.lastName}`}
                disabled={!isEditing}
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600">{profile.position}</p>
              <p className="text-sm text-gray-500">{profile.department}</p>
              {!isEditing && (
                <p className="text-xs text-gray-400 mt-2">
                  Cliquez sur "Modifier" pour changer votre photo de profil
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === section.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'personal' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                    {!canEditAll && isEditing && (
                      <span className="ml-2 text-xs text-orange-600">(Admin/RH uniquement)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing || (!canEditAll && isEditing)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                    {!canEditAll && isEditing && (
                      <span className="ml-2 text-xs text-orange-600">(Admin/RH uniquement)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing || (!canEditAll && isEditing)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={profile.username}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                  <input
                    type="text"
                    value={profile.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Informations professionnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                  <input
                    type="text"
                    value={profile.position}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                  <input
                    type="text"
                    value={profile.department}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire annuel brut</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={profile.salary}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 pr-8"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
                  <input
                    type="date"
                    value={profile.hireDate}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire mensuel net (estimé)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={Math.round(profile.salary * 0.75 / 12)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 pr-8"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Estimation basée sur 25% de charges</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Contact d'urgence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contact</label>
                  <input
                    type="text"
                    value={profile.emergencyContact.name}
                    onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                  <input
                    type="text"
                    value={profile.emergencyContact.relationship}
                    onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 