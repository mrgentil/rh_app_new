import axios from 'axios';

async function testPhotoUploadSimple() {
  try {
    console.log('🧪 Test simple d\'upload de photo de profil');
    
    // Configuration axios pour gérer les cookies
    const axiosInstance = axios.create({
      withCredentials: true,
      baseURL: 'http://localhost:3001'
    });

    // 1. Connexion
    console.log('\n1️⃣ Connexion...');
    const loginResponse = await axiosInstance.post('/api/auth/login', {
      username: 'mrgentil',
      password: 'password123'
    });

    console.log('✅ Connexion réussie');
    console.log('   - Cookies reçus:', loginResponse.headers['set-cookie']);

    // 2. Test de l'endpoint /api/auth/me
    console.log('\n2️⃣ Test /api/auth/me...');
    const meResponse = await axiosInstance.get('/api/auth/me');
    console.log('✅ /api/auth/me accessible');
    console.log('   - Utilisateur:', meResponse.data.username);

    // 3. Test de l'endpoint /api/profile/me
    console.log('\n3️⃣ Test /api/profile/me...');
    const profileResponse = await axiosInstance.get('/api/profile/me');
    console.log('✅ /api/profile/me accessible');
    console.log('   - Photo actuelle:', profileResponse.data.photoUrl || 'Aucune');

    // 4. Test de l'upload de photo
    console.log('\n4️⃣ Test upload de photo...');
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const photoResponse = await axiosInstance.post('/api/profile/me/photo', {
      photoUrl: testImageBase64
    });

    console.log('✅ Upload de photo réussi');
    console.log('   - Message:', photoResponse.data.message);

    // 5. Vérification
    console.log('\n5️⃣ Vérification...');
    const verifyResponse = await axiosInstance.get('/api/profile/me');
    console.log('✅ Photo mise à jour');
    console.log('   - Nouvelle photo:', verifyResponse.data.photoUrl ? 'Présente' : 'Absente');

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Données:', error.response.data);
      console.error('   - Headers:', error.response.headers);
    }
  }
}

testPhotoUploadSimple(); 