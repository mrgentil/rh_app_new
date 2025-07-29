import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function TestAPIPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = {
        health: null,
        directAPI: null,
        rewriteAPI: null,
        employees: []
      };

      // Test 1: Health check
      console.log('🧪 Test 1: Health check...');
      const healthResponse = await fetch('http://localhost:3001/health');
      results.health = await healthResponse.json();

      // Test 2: API directe
      console.log('🧪 Test 2: API directe...');
      const directResponse = await fetch('http://localhost:3001/api/employees');
      if (directResponse.ok) {
        results.directAPI = { status: 'OK', count: (await directResponse.json()).length };
      } else {
        results.directAPI = { status: 'ERROR', error: directResponse.statusText };
      }

      // Test 3: API via rewrite
      console.log('🧪 Test 3: API via rewrite...');
      const rewriteResponse = await fetch('/api/employees');
      if (rewriteResponse.ok) {
        const employees = await rewriteResponse.json();
        results.rewriteAPI = { status: 'OK', count: employees.length };
        results.employees = employees;
      } else {
        results.rewriteAPI = { status: 'ERROR', error: rewriteResponse.statusText };
      }

      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Test de l'API Employés</h1>
        
        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Relancer les tests'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">❌ Erreur: {error}</p>
          </div>
        )}

        {testResults && (
          <div className="space-y-6">
            {/* Health Check */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Health Check Backend</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(testResults.health, null, 2)}
              </pre>
            </div>

            {/* API Directe */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. API Directe (localhost:3001)</h2>
              <div className={`p-4 rounded-lg ${
                testResults.directAPI?.status === 'OK' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p><strong>Statut:</strong> {testResults.directAPI?.status}</p>
                {testResults.directAPI?.count && (
                  <p><strong>Nombre d'employés:</strong> {testResults.directAPI.count}</p>
                )}
                {testResults.directAPI?.error && (
                  <p><strong>Erreur:</strong> {testResults.directAPI.error}</p>
                )}
              </div>
            </div>

            {/* API Rewrite */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. API via Rewrite Next.js (/api)</h2>
              <div className={`p-4 rounded-lg ${
                testResults.rewriteAPI?.status === 'OK' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p><strong>Statut:</strong> {testResults.rewriteAPI?.status}</p>
                {testResults.rewriteAPI?.count && (
                  <p><strong>Nombre d'employés:</strong> {testResults.rewriteAPI.count}</p>
                )}
                {testResults.rewriteAPI?.error && (
                  <p><strong>Erreur:</strong> {testResults.rewriteAPI.error}</p>
                )}
              </div>
            </div>

            {/* Liste des employés */}
            {testResults.employees.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Liste des Employés</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testResults.employees.map((emp: any) => (
                        <tr key={emp.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {emp.firstName} {emp.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              emp.status === 'actif' ? 'bg-green-100 text-green-800' :
                              emp.status === 'inactif' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 