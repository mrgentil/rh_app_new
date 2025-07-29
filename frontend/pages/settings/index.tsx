import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { FaCog, FaSave, FaBuilding, FaUser, FaBell, FaShieldAlt, FaDatabase, FaPalette } from 'react-icons/fa';

interface Settings {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    sessionTimeout: number;
    twoFactorAuth: boolean;
  };
}

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    company: {
      name: 'RH App',
      address: '123 Rue de la Paix, 75000 Paris',
      phone: '+33 1 23 45 67 89',
      email: 'contact@rh-app.com',
      website: 'https://rh-app.com'
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      twoFactorAuth: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    // Vérifier les permissions
    if (user?.role !== 'Admin') {
      window.location.href = '/unauthorized';
      return;
    }

    fetchSettings();
  }, [isAuthenticated, user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
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

  return (
    <>
      <Head>
        <title>RH App - Paramètres</title>
      </Head>
      <Layout>
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
              <p className="text-gray-600 mt-2">
                Configurez les paramètres de votre application RH
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

          {saved && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              ✅ Paramètres sauvegardés avec succès !
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations de l'entreprise */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FaBuilding className="text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Informations de l'entreprise</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={settings.company.name}
                    onChange={(e) => updateSettings('company', 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    value={settings.company.address}
                    onChange={(e) => updateSettings('company', 'address', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      value={settings.company.phone}
                      onChange={(e) => updateSettings('company', 'phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.company.email}
                      onChange={(e) => updateSettings('company', 'email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={settings.company.website}
                    onChange={(e) => updateSettings('company', 'website', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Paramètres système */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FaCog className="text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Paramètres système</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mode maintenance</label>
                    <p className="text-xs text-gray-500">Désactive l'accès public à l'application</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => updateSettings('system', 'maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mode debug</label>
                    <p className="text-xs text-gray-500">Active les logs détaillés</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.system.debugMode}
                      onChange={(e) => updateSettings('system', 'debugMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeout de session (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={settings.system.sessionTimeout}
                    onChange={(e) => updateSettings('system', 'sessionTimeout', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tentatives de connexion max
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.system.maxLoginAttempts}
                    onChange={(e) => updateSettings('system', 'maxLoginAttempts', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FaBell className="text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications email</label>
                    <p className="text-xs text-gray-500">Envoi d'emails pour les événements importants</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSettings('notifications', 'emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications SMS</label>
                    <p className="text-xs text-gray-500">Envoi de SMS pour les alertes urgentes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => updateSettings('notifications', 'smsNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications push</label>
                    <p className="text-xs text-gray-500">Notifications dans l'application</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => updateSettings('notifications', 'pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longueur minimale du mot de passe
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings('security', 'passwordMinLength', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Caractères spéciaux requis</label>
                    <p className="text-xs text-gray-500">Oblige l'utilisation de caractères spéciaux</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.requireSpecialChars}
                      onChange={(e) => updateSettings('security', 'requireSpecialChars', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Authentification à deux facteurs</label>
                    <p className="text-xs text-gray-500">Sécurité renforcée pour les comptes sensibles</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => updateSettings('security', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
} 