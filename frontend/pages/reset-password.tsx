import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { useToast } from '../hooks/useToast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token as string);
    }
  }, [router.query.token]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      const errorMsg = 'Token de réinitialisation manquant';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (!passwordValidation.isValid) {
      const errorMsg = 'Le mot de passe ne respecte pas les critères de sécurité';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      const errorMsg = 'Les mots de passe ne correspondent pas';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    const loadingToast = showLoading('Définition du mot de passe en cours...');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la définition du mot de passe');
      }

      dismiss(loadingToast);
      showSuccess('Mot de passe défini avec succès ! Redirection vers la page de connexion...');
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Mot de passe défini !</h1>
          <p className="text-gray-600 mb-6">
            Votre mot de passe a été défini avec succès. Vous allez être redirigé vers la page de connexion.
          </p>
          <div className="animate-pulse">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Définir votre mot de passe</h1>
          <p className="text-gray-600">
            Créez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Entrez votre nouveau mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Confirmez votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Critères de sécurité */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Critères de sécurité :</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                {passwordValidation.minLength ? (
                  <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span className={passwordValidation.minLength ? 'text-green-700' : 'text-red-700'}>
                  Au moins 8 caractères
                </span>
              </div>
              <div className="flex items-center text-sm">
                {passwordValidation.hasUpperCase ? (
                  <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span className={passwordValidation.hasUpperCase ? 'text-green-700' : 'text-red-700'}>
                  Au moins une majuscule
                </span>
              </div>
              <div className="flex items-center text-sm">
                {passwordValidation.hasLowerCase ? (
                  <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span className={passwordValidation.hasLowerCase ? 'text-green-700' : 'text-red-700'}>
                  Au moins une minuscule
                </span>
              </div>
              <div className="flex items-center text-sm">
                {passwordValidation.hasNumbers ? (
                  <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span className={passwordValidation.hasNumbers ? 'text-green-700' : 'text-red-700'}>
                  Au moins un chiffre
                </span>
              </div>
              <div className="flex items-center text-sm">
                {passwordValidation.hasSpecialChar ? (
                  <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span className={passwordValidation.hasSpecialChar ? 'text-green-700' : 'text-red-700'}>
                  Au moins un caractère spécial
                </span>
              </div>
            </div>
          </div>

          {/* Correspondance des mots de passe */}
          {confirmPassword && (
            <div className={`text-sm ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
              {password === confirmPassword ? (
                <div className="flex items-center">
                  <FaCheck className="w-4 h-4 mr-2" />
                  Les mots de passe correspondent
                </div>
              ) : (
                <div className="flex items-center">
                  <FaTimes className="w-4 h-4 mr-2" />
                  Les mots de passe ne correspondent pas
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Définition en cours...
              </>
            ) : (
              'Définir le mot de passe'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 