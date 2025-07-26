import axios from 'axios';

async function debugAuth() {
  try {
    console.log('🔍 Debug de l\'authentification...\n');

    // 1. Connexion
    console.log('1. Connexion...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    }, {
      withCredentials: true
    });

    console.log('✅ Connexion réussie');
    console.log('   - User ID:', loginResponse.data.user.id);
    console.log('   - Role:', loginResponse.data.user.role);
    console.log('   - Employee:', loginResponse.data.user.employee);
    console.log('');

    // 2. Test de récupération du profil
    console.log('2. Récupération du profil...');
    const profileResponse = await axios.get('http://localhost:3001/api/auth/me', {
      withCredentials: true
    });

    console.log('✅ Profil récupéré');
    console.log('   - User:', profileResponse.data);
    console.log('   - Role Name:', profileResponse.data.role);
    console.log('');

    // 3. Test des départements
    console.log('3. Test GET /api/departments...');
    const departmentsResponse = await axios.get('http://localhost:3001/api/departments', {
      withCredentials: true
    });
    console.log('✅ Départements récupérés:', departmentsResponse.data.length);
    console.log('');

    // 4. Test de création d'un département
    console.log('4. Test POST /api/departments...');
    const createResponse = await axios.post('http://localhost:3001/api/departments', {
      name: 'Test Department',
      description: 'Department de test'
    }, {
      withCredentials: true
    });
    console.log('✅ Département créé:', createResponse.data);
    const departmentId = createResponse.data.id;
    console.log('');

    // 5. Test de mise à jour
    console.log('5. Test PUT /api/departments/' + departmentId + '...');
    const updateResponse = await axios.put(`http://localhost:3001/api/departments/${departmentId}`, {
      name: 'Test Department Updated',
      description: 'Department de test mis à jour'
    }, {
      withCredentials: true
    });
    console.log('✅ Département mis à jour:', updateResponse.data);
    console.log('');

    // 6. Test de suppression
    console.log('6. Test DELETE /api/departments/' + departmentId + '...');
    await axios.delete(`http://localhost:3001/api/departments/${departmentId}`, {
      withCredentials: true
    });
    console.log('✅ Département supprimé');
    console.log('');

    console.log('🎉 Tous les tests sont passés !');

  } catch (error: any) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    if (error.response?.data) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

debugAuth(); 