import { useAuth } from '../hooks/useAuth';
import Head from 'next/head';

export default function ManagerPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <Head>
        <title>Manager - RH App</title>
      </Head>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Espace Manager</h1>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Bienvenue dans l'espace Manager, {user?.employee?.firstName} {user?.employee?.lastName} !
              </p>
              <p className="text-gray-500">
                Cette section sera développée prochainement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 