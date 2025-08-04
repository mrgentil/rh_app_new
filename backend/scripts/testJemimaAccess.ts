import axios from 'axios';

async function testJemimaAccess() {
  try {
    console.log('🧪 Test d\'accès de l\'utilisateur jemima...');
    
    const baseURL = 'http://localhost:3001';
    const api = axios.create({ 
      baseURL,
      withCredentials: true 
    });

    // 1. Connexion avec jemima
    console.log('🔐 Connexion avec jemima...');
    const loginResponse = await api.post('/api/auth/login', {
      username: 'jemima',
      password: 'jemima123'
    });

    console.log('✅ Connexion jemima réussie');
    console.log('📊 Réponse de connexion:', JSON.stringify(loginResponse.data, null, 2));

    // Extraire le token du cookie
    const cookies = loginResponse.headers['set-cookie'];
    let token = '';
    if (cookies) {
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split(';')[0].split('=')[1];
      }
    }

    // 2. Test d'accès à la liste des utilisateurs
    console.log('\n📤 Test d\'accès à la liste des utilisateurs...');
    try {
      const usersResponse = await api.get('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Accès à la liste des utilisateurs réussi');
      console.log(`📊 Nombre d'utilisateurs: ${usersResponse.data.length}`);
      
    } catch (error: any) {
      console.log('❌ Erreur lors du test d\'accès aux utilisateurs:');
      console.log(`📊 Status: ${error.response?.status}`);
      console.log(`📋 Data: ${JSON.stringify(error.response?.data, null, 2)}`);
    }

    // 3. Test d'accès aux employés
    console.log('\n📤 Test d\'accès à la liste des employés...');
    try {
      const employeesResponse = await api.get('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Accès à la liste des employés réussi');
      console.log(`📊 Nombre d'employés: ${employeesResponse.data.length}`);
      
    } catch (error: any) {
      console.log('❌ Erreur lors du test d\'accès aux employés:');
      console.log(`📊 Status: ${error.response?.status}`);
      console.log(`📋 Data: ${JSON.stringify(error.response?.data, null, 2)}`);
    }

    // 4. Test d'accès au profil
    console.log('\n📤 Test d\'accès au profil...');
    try {
      const profileResponse = await api.get('/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Accès au profil réussi');
      console.log(`📊 Nom d'utilisateur: ${profileResponse.data.username}`);
      console.log(`📊 Rôle: ${profileResponse.data.role}`);
      
    } catch (error: any) {
      console.log('❌ Erreur lors du test d\'accès au profil:');
      console.log(`📊 Status: ${error.response?.status}`);
      console.log(`📋 Data: ${JSON.stringify(error.response?.data, null, 2)}`);
    }

  } catch (error: any) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📋 Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testJemimaAccess(); 