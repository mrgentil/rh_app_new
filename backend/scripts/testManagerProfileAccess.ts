import axios from 'axios';

async function testManagerProfileAccess() {
  try {
    console.log('🧪 Test d\'accès au profil pour un utilisateur Manager');
    
    // 1. Connexion en tant que manager
    console.log('\n1️⃣ Tentative de connexion...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'mrgentil',
      password: 'password123'
    }, {
      withCredentials: true
    });

    if (loginResponse.status === 200) {
      console.log('✅ Connexion réussie');
      console.log('   - Utilisateur:', loginResponse.data.user.username);
      console.log('   - Rôle:', loginResponse.data.user.role);
      console.log('   - Permissions:', loginResponse.data.user.permissions);
    } else {
      console.log('❌ Échec de la connexion');
      return;
    }

    // 2. Test de l'endpoint /api/auth/me
    console.log('\n2️⃣ Test de l\'endpoint /api/auth/me...');
    const meResponse = await axios.get('http://localhost:3001/api/auth/me', {
      withCredentials: true
    });

    if (meResponse.status === 200) {
      console.log('✅ Endpoint /api/auth/me accessible');
      console.log('   - ID:', meResponse.data.id);
      console.log('   - Username:', meResponse.data.username);
      console.log('   - Rôle:', meResponse.data.role);
      console.log('   - Permissions:', meResponse.data.permissions);
    } else {
      console.log('❌ Endpoint /api/auth/me inaccessible');
      return;
    }

    // 3. Test de l'endpoint /api/profile/me
    console.log('\n3️⃣ Test de l\'endpoint /api/profile/me...');
    const profileResponse = await axios.get('http://localhost:3001/api/profile/me', {
      withCredentials: true
    });

    if (profileResponse.status === 200) {
      console.log('✅ Endpoint /api/profile/me accessible');
      console.log('   - Profil récupéré avec succès');
      console.log('   - Données:', {
        id: profileResponse.data.id,
        username: profileResponse.data.username,
        firstName: profileResponse.data.firstName,
        lastName: profileResponse.data.lastName,
        email: profileResponse.data.email
      });
    } else {
      console.log('❌ Endpoint /api/profile/me inaccessible');
      console.log('   - Status:', profileResponse.status);
      console.log('   - Erreur:', profileResponse.data);
    }

    // 4. Déconnexion
    console.log('\n4️⃣ Déconnexion...');
    const logoutResponse = await axios.post('http://localhost:3001/api/auth/logout', {}, {
      withCredentials: true
    });

    if (logoutResponse.status === 200) {
      console.log('✅ Déconnexion réussie');
    } else {
      console.log('❌ Erreur lors de la déconnexion');
    }

  } catch (error: any) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Données:', error.response.data);
    }
  }
}

testManagerProfileAccess(); 