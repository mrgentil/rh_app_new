import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import Layout from '../components/Layout';

export default function TestUserAPI() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      testUserAPI();
    }
  }, [currentUser]);

  const testUserAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔧 Test de l\'API utilisateurs...');
      
      // Récupérer tous les utilisateurs
      const usersData = await userService.getAllUsers();
      console.log('✅ Utilisateurs récupérés:', usersData);
      setUsers(usersData);
      
      if (usersData.length > 0) {
        // Récupérer un utilisateur spécifique
        const userData = await userService.getUserById(usersData[0].id);
        console.log('✅ Utilisateur spécifique:', userData);
      }
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Non connecté</h2>
          <p>Veuillez vous connecter pour tester l'API.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test API Utilisateurs</h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Chargement...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Erreur:</strong> {error}
          </div>
        )}
        
        {users.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {users.length} utilisateur(s) trouvé(s)
            </h2>
            
            {users.map((user, index) => (
              <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Utilisateur {index + 1}: {user.username}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Informations de base:</h4>
                    <ul className="space-y-1 text-sm">
                      <li><strong>ID:</strong> {user.id}</li>
                      <li><strong>Email:</strong> {user.email}</li>
                      <li><strong>Rôle:</strong> {user.roleName}</li>
                      <li><strong>Actif:</strong> {user.isActive ? 'Oui' : 'Non'}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Nouveaux champs:</h4>
                    <ul className="space-y-1 text-sm">
                      <li><strong>Photo URL:</strong> {user.photoUrl || 'Non définie'}</li>
                      <li><strong>Salaire:</strong> {user.salary || 'Non défini'}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Données complètes (JSON):</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && users.length === 0 && !error && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucun utilisateur trouvé</h2>
            <p>Il semble qu'il n'y ait pas d'utilisateurs dans la base de données.</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 