import { useState } from 'react';
import axios from 'axios';
import { FaUserShield, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createAdmin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:4000/api/setup/create-admin');
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création de l\'administrateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl mb-4">
            <FaUserShield className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration Initiale</h1>
          <p className="text-gray-600">Créer l'utilisateur administrateur par défaut</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Cette action va créer un utilisateur administrateur avec les identifiants suivants :
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Identifiants par défaut :</p>
                <p className="font-mono text-sm">
                  <strong>Email :</strong> admin@rh-app.com<br />
                  <strong>Mot de passe :</strong> admin123
                </p>
              </div>
            </div>

            <button
              onClick={createAdmin}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création en cours...
                </div>
              ) : (
                'Créer l\'utilisateur administrateur'
              )}
            </button>

            {/* Résultat */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaCheck className="text-green-600 mr-2" />
                  <p className="text-sm text-green-800 font-medium">{result.message}</p>
                </div>
                {result.credentials && (
                  <div className="mt-3 p-3 bg-green-100 rounded">
                    <p className="text-xs text-green-700 font-medium mb-1">Identifiants créés :</p>
                    <p className="text-xs text-green-700 font-mono">
                      Email: {result.credentials.email}<br />
                      Mot de passe: {result.credentials.password}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-600 mr-2" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Une fois l'administrateur créé, vous pourrez vous connecter à l'application.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 RH App. Configuration initiale.
          </p>
        </div>
      </div>
    </div>
  );
} 