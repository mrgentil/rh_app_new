import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function testRoutes() {
  try {
    console.log('🧪 Test des nouvelles routes...\n');
    
    // Test 1: Connexion Admin
    console.log('1. Test de connexion Admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (loginResponse.data.user) {
      console.log('✅ Connexion Admin réussie');
      console.log(`   - Username: ${loginResponse.data.user.username}`);
      console.log(`   - Rôle: ${loginResponse.data.user.role}`);
      console.log(`   - Permissions: ${loginResponse.data.user.permissions}`);
    }
    
    // Test 2: Récupération des départements
    console.log('\n2. Test récupération départements...');
    const departmentsResponse = await axios.get(`${BASE_URL}/departments`);
    console.log(`✅ ${departmentsResponse.data.length} départements récupérés`);
    
    // Test 3: Récupération des postes
    console.log('\n3. Test récupération postes...');
    const jobTitlesResponse = await axios.get(`${BASE_URL}/job-titles`);
    console.log(`✅ ${jobTitlesResponse.data.length} postes récupérés`);
    
    // Test 4: Récupération des employés avec relations
    console.log('\n4. Test récupération employés...');
    const employeesResponse = await axios.get(`${BASE_URL}/employees`);
    console.log(`✅ ${employeesResponse.data.length} employés récupérés`);
    
    if (employeesResponse.data.length > 0) {
      const employee = employeesResponse.data[0];
      console.log(`   - Premier employé: ${employee.firstName} ${employee.lastName}`);
      console.log(`   - Poste: ${employee.JobTitle?.title || 'Non défini'}`);
      console.log(`   - Département: ${employee.Department?.name || 'Non défini'}`);
    }
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
  } catch (error: any) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
  }
}

testRoutes(); 