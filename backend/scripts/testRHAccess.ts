import axios from 'axios';

async function testRHAccess() {
  try {
    console.log('🧪 Test d\'accès RH aux utilisateurs...');

    // Configurer axios pour gérer les cookies
    const axiosInstance = axios.create({
      withCredentials: true,
      baseURL: 'http://localhost:3001'
    });

    // D'abord, se connecter en tant que Manager (qui devrait avoir des permissions similaires)
    console.log('🔐 Connexion en tant que Manager...');
    const loginResponse = await axiosInstance.post('/api/auth/login', {
      username: 'mrgentil',
      password: 'password123' // Remplace par le vrai password
    });

    console.log('✅ Connexion Manager réussie');
    console.log('📊 Réponse de connexion:', JSON.stringify(loginResponse.data, null, 2));

    // Tester l'accès à la liste des utilisateurs
    console.log('📤 Test d\'accès à la liste des utilisateurs...');
    const usersResponse = await axiosInstance.get('/api/users');

    console.log('✅ Accès à la liste des utilisateurs réussi !');
    console.log('📊 Nombre d\'utilisateurs:', usersResponse.data.length);
    console.log('📊 Premier utilisateur:', JSON.stringify(usersResponse.data[0], null, 2));

    // Tester l'accès aux statistiques des utilisateurs
    console.log('📤 Test d\'accès aux statistiques des utilisateurs...');
    const statsResponse = await axiosInstance.get('/api/users/stats');

    console.log('✅ Accès aux statistiques réussi !');
    console.log('📊 Statistiques:', JSON.stringify(statsResponse.data, null, 2));

    // Tester l'accès à un utilisateur spécifique
    if (usersResponse.data.length > 0) {
      const firstUserId = usersResponse.data[0].id;
      console.log(`📤 Test d'accès à l'utilisateur ${firstUserId}...`);
      
      const userResponse = await axiosInstance.get(`/api/users/${firstUserId}`);
      
      console.log('✅ Accès à l\'utilisateur spécifique réussi !');
      console.log('📊 Détails utilisateur:', JSON.stringify(userResponse.data, null, 2));
    }

    console.log('🎉 Tous les tests d\'accès sont réussis !');

  } catch (error) {
    const err = error as any;
    console.error('❌ Erreur lors du test:', err.message);
    if (err.response) {
      console.error(`📊 Status: ${err.response.status}`);
      console.error(`📋 Data:`, err.response.data);
      
      if (err.response.status === 401) {
        console.error('🔐 Problème d\'authentification - vérifiez les identifiants');
      } else if (err.response.status === 403) {
        console.error('🚫 Problème de permissions - l\'utilisateur n\'a pas les bonnes permissions');
      }
    } else if (err.request) {
      console.error('📡 Erreur de connexion - le serveur ne répond pas');
    } else {
      console.error('❓ Erreur inconnue:', err);
    }
  }
}

testRHAccess(); 