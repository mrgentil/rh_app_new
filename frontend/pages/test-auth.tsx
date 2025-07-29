import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function TestAuth() {
  const { user, isAuthenticated } = useAuth();
  const [testResult, setTestResult] = useState('');

  const testAuth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'Test Role',
          permissions: JSON.stringify(['test.permission'])
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setTestResult('✅ Rôle créé avec succès !');
      } else {
        setTestResult(`❌ Erreur: ${data.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setTestResult(`❌ Erreur réseau: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Test d'authentification</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">État de l'authentification</h2>
          <div className="space-y-2">
            <p><strong>Connecté :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
            {user && (
              <>
                <p><strong>Utilisateur :</strong> {user.username}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Rôle :</strong> {user.role}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test de création de rôle</h2>
          <button
            onClick={testAuth}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tester la création de rôle
          </button>
          
          {testResult && (
            <div className="mt-4 p-4 rounded border">
              <p className={testResult.includes('✅') ? 'text-green-700' : 'text-red-700'}>
                {testResult}
              </p>
            </div>
          )}
        </div>

        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Vous n'êtes pas connecté</h3>
            <p className="text-yellow-700 mb-4">
              Pour créer des rôles, vous devez être connecté avec un compte administrateur.
            </p>
            <a
              href="/login"
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Se connecter
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 