import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import Head from 'next/head';

interface Role {
  id: number;
  name: string;
  permissions: string;
  createdAt: string;
  updatedAt: string;
}

export default function TestRolesPage() {
  const { user, isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRolesAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Test de l\'API des rôles...');
      
      // Test 1: Appel direct à l'API backend
      console.log('📡 Test 1: Appel direct à localhost:3001/api/roles');
      const directResponse = await fetch('http://localhost:3001/api/roles', {
        credentials: 'include'
      });
      
      if (directResponse.ok) {
        const directData = await directResponse.json();
        console.log('✅ Appel direct réussi:', directData);
      } else {
        console.log('❌ Appel direct échoué:', directResponse.status, directResponse.statusText);
      }
      
      // Test 2: Appel via Next.js rewrites
      console.log('📡 Test 2: Appel via Next.js rewrites (/api/roles)');
      const rewriteResponse = await fetch('/api/roles', {
        credentials: 'include'
      });
      
      if (rewriteResponse.ok) {
        const rewriteData = await rewriteResponse.json();
        console.log('✅ Appel via rewrites réussi:', rewriteData);
        setRoles(rewriteData);
      } else {
        console.log('❌ Appel via rewrites échoué:', rewriteResponse.status, rewriteResponse.statusText);
        setError(`Erreur ${rewriteResponse.status}: ${rewriteResponse.statusText}`);
      }
      
    } catch (err) {
      console.error('❌ Erreur lors du test:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      testRolesAPI();
    }
  }, [isAuthenticated]);

  const parsePermissions = (permissions: string): string[] => {
    try {
      const parsed = JSON.parse(permissions);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Erreur lors du parsing des permissions:', err);
      return [];
    }
  };

  return (
    <>
      <Head>
        <title>RH App - Test API Rôles</title>
      </Head>
      <Layout>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Test API Rôles</h1>
          
          <div className="mb-6">
            <button
              onClick={testRolesAPI}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Test en cours...' : 'Tester l\'API'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              ❌ Erreur: {error}
            </div>
          )}

          {roles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Rôles trouvés ({roles.length})
              </h2>
              
              <div className="space-y-4">
                {roles.map((role) => {
                  const permissions = parsePermissions(role.permissions);
                  return (
                    <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {role.name} (ID: {role.id})
                        </h3>
                        <span className="text-sm text-gray-500">
                          Créé le {new Date(role.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Permissions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {permissions.length > 0 ? (
                            permissions.map((permission, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {permission}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">Aucune permission</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <strong>Permissions brutes:</strong> {role.permissions}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && roles.length === 0 && !error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              ℹ️ Aucun rôle trouvé. Vérifiez que l'API fonctionne correctement.
            </div>
          )}
        </div>
      </Layout>
    </>
  );
} 