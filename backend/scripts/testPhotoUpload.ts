import axios from 'axios';

async function testPhotoUpload() {
  try {
    console.log('🧪 Test d\'upload de photo de profil');
    
    // 1. Connexion en tant que manager
    console.log('\n1️⃣ Connexion en tant que manager...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'mrgentil',
      password: 'password123'
    }, {
      withCredentials: true
    });

    if (loginResponse.status !== 200) {
      console.log('❌ Échec de la connexion');
      return;
    }

    console.log('✅ Connexion réussie');
    console.log('   - Utilisateur:', loginResponse.data.user.username);
    console.log('   - Rôle:', loginResponse.data.user.role);

    // 2. Test de l'endpoint /api/profile/me/photo
    console.log('\n2️⃣ Test de l\'endpoint /api/profile/me/photo...');
    
    // Créer une image base64 de test (1x1 pixel transparent)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const photoResponse = await axios.post('http://localhost:3001/api/profile/me/photo', {
      photoUrl: testImageBase64
    }, {
      withCredentials: true
    });

    if (photoResponse.status === 200) {
      console.log('✅ Upload de photo réussi');
      console.log('   - Message:', photoResponse.data.message);
      console.log('   - Photo URL:', photoResponse.data.photoUrl);
    } else {
      console.log('❌ Échec de l\'upload de photo');
      console.log('   - Status:', photoResponse.status);
      console.log('   - Erreur:', photoResponse.data);
    }

    // 3. Vérifier que la photo a été mise à jour
    console.log('\n3️⃣ Vérification de la mise à jour...');
    const profileResponse = await axios.get('http://localhost:3001/api/profile/me', {
      withCredentials: true
    });

    if (profileResponse.status === 200) {
      console.log('✅ Profil récupéré avec succès');
      console.log('   - Photo URL dans le profil:', profileResponse.data.photoUrl);
      console.log('   - Photo URL correspond:', profileResponse.data.photoUrl === testImageBase64);
    } else {
      console.log('❌ Impossible de récupérer le profil');
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

testPhotoUpload(); 