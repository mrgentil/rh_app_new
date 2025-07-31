import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Head from 'next/head';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaBuilding } from 'react-icons/fa';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, user, isAuthenticated, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && isAuthenticated && user) {
      let targetUrl = '/employee';
      switch (user.role) {
        case 'Admin':
          targetUrl = '/admin';
          break;
        case 'RH':
          targetUrl = '/rh';
          break;
        case 'Manager':
          targetUrl = '/manager';
          break;
      }
      window.location.href = targetUrl;
    }
  }, [mounted, authLoading, isAuthenticated]); // Retirer user des dépendances

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        showSuccess('Connexion réussie ! Redirection en cours...');
      } else {
        const errorMsg = "Nom d'utilisateur ou mot de passe incorrect";
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = 'Erreur de connexion. Veuillez réessayer.';
      
      // Vérifier si c'est une erreur de suspension
      if (error.message && error.message.includes('suspendu')) {
        errorMsg = 'Votre compte est suspendu. Contactez votre administrateur.';
      }
      
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <>
        <Head><title>Connexion - RH App</title></Head>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  if (isAuthenticated && user) {
    return (
      <>
        <Head><title>Connexion - RH App</title></Head>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirection en cours...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Connexion - RH App</title></Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <FaBuilding className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">RH App</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Connectez-vous à votre espace de travail</p>
          </div>
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="h-5 w-5 text-gray-400" /></div>
                  <input id="username" name="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Entrez votre nom d'utilisateur" disabled={loading} />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="h-5 w-5 text-gray-400" /></div>
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Entrez votre mot de passe" disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" disabled={loading}>
                    {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion en cours...
                    </div>
                  ) : ('Se connecter')}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">Identifiants de test : admin / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

LoginPage.noAuth = true; // <- pour marquer la page comme publique
