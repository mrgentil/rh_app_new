import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function simpleTest() {
  try {
    console.log('🧪 Test simple du serveur...\n');
    
    // Test 1: Vérifier si le serveur répond
    console.log('1. Test de connexion au serveur...');
    try {
      const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
      console.log('✅ Serveur accessible');
      console.log(`   - Status: ${response.status}`);
      console.log(`   - Data:`, response.data);
    } catch (error: any) {
      console.log('❌ Serveur non accessible');
      console.log(`   - Erreur: ${error.message}`);
      console.log('   - Assurez-vous que le serveur est démarré avec: npm run dev');
      return;
    }
    
    // Test 2: Test de connexion Admin
    console.log('\n2. Test de connexion Admin...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        username: 'admin',
        password: 'admin123'
      }, { timeout: 5000 });
      
      if (loginResponse.data.user) {
        console.log('✅ Connexion Admin réussie');
        console.log(`   - Username: ${loginResponse.data.user.username}`);
        console.log(`   - Rôle: ${loginResponse.data.user.role}`);
      }
    } catch (error: any) {
      console.log('❌ Erreur de connexion');
      console.log(`   - Erreur: ${error.response?.data?.error || error.message}`);
    }
    
    // Test 3: Test des départements
    console.log('\n3. Test récupération départements...');
    try {
      const departmentsResponse = await axios.get(`${BASE_URL}/api/departments`, { timeout: 5000 });
      console.log(`✅ ${departmentsResponse.data.length} départements récupérés`);
    } catch (error: any) {
      console.log('❌ Erreur récupération départements');
      console.log(`   - Erreur: ${error.response?.data?.error || error.message}`);
    }

    // Test 4: Test des rôles
    console.log('\n4. Test récupération rôles...');
    try {
      const rolesResponse = await axios.get(`${BASE_URL}/api/roles`, { timeout: 5000 });
      console.log(`✅ ${rolesResponse.data.length} rôles récupérés`);
      rolesResponse.data.forEach((role: any) => {
        console.log(`   - ${role.name} (${JSON.parse(role.permissions).length} permissions)`);
      });
    } catch (error: any) {
      console.log('❌ Erreur récupération rôles');
      console.log(`   - Erreur: ${error.response?.data?.error || error.message}`);
    }
    
  } catch (error: any) {
    console.error('❌ Erreur générale:', error.message);
  }
}

simpleTest(); 