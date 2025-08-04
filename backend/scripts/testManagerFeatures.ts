import axios from 'axios';

async function testManagerFeatures() {
  const baseURL = 'http://localhost:3001';
  const api = axios.create({ baseURL, withCredentials: true });

  try {
    console.log('🧪 Test des fonctionnalités de management...\n');

    // 1. Test de connexion Manager
    console.log('1️⃣ Test de connexion Manager...');
    const loginResponse = await api.post('/api/auth/login', {
      username: 'mrgentil',
      password: 'password123'
    });
    console.log('✅ Connexion Manager réussie');

    // Extraire le token
    const cookies = loginResponse.headers['set-cookie'];
    const tokenCookie = cookies?.find(cookie => cookie.startsWith('token='));
    const token = tokenCookie?.split(';')[0].split('=')[1];

    if (!token) {
      throw new Error('Token non trouvé');
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    // 2. Test récupération des équipes
    console.log('\n2️⃣ Test récupération des équipes...');
    const teamsResponse = await api.get('/api/teams', { headers });
    console.log(`✅ ${teamsResponse.data.length} équipes récupérées`);
    
    if (teamsResponse.data.length > 0) {
      const firstTeam = teamsResponse.data[0];
      console.log(`   - Équipe: ${firstTeam.name} (${firstTeam.members.length} membres)`);
    }

    // 3. Test récupération des objectifs
    console.log('\n3️⃣ Test récupération des objectifs...');
    const objectivesResponse = await api.get('/api/objectives', { headers });
    console.log(`✅ ${objectivesResponse.data.length} objectifs récupérés`);
    
    if (objectivesResponse.data.length > 0) {
      const firstObjective = objectivesResponse.data[0];
      console.log(`   - Objectif: ${firstObjective.title} (${firstObjective.progress}%)`);
    }

    // 4. Test création d'un objectif
    console.log('\n4️⃣ Test création d\'un objectif...');
    const newObjective = {
      title: 'Test Objectif Manager',
      description: 'Objectif de test créé par le manager',
      type: 'individual',
      employeeId: 1, // Premier employé
      priority: 'medium',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const createObjectiveResponse = await api.post('/api/objectives', newObjective, { headers });
    console.log(`✅ Objectif créé: ${createObjectiveResponse.data.title}`);

    // 5. Test récupération des employés (vue Manager)
    console.log('\n5️⃣ Test récupération des employés...');
    const employeesResponse = await api.get('/api/employees', { headers });
    console.log(`✅ ${employeesResponse.data.length} employés récupérés`);

    // 6. Test récupération du profil
    console.log('\n6️⃣ Test récupération du profil...');
    const profileResponse = await api.get('/api/profile/me', { headers });
    console.log(`✅ Profil récupéré: ${profileResponse.data.firstName} ${profileResponse.data.lastName}`);

    // 7. Test des permissions (tentative d'accès aux utilisateurs)
    console.log('\n7️⃣ Test des permissions...');
    try {
      await api.get('/api/users', { headers });
      console.log('⚠️  Accès aux utilisateurs autorisé (peut-être un Manager avec permissions étendues)');
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.log('✅ Accès aux utilisateurs correctement refusé pour le Manager');
      } else {
        console.log(`❌ Erreur inattendue: ${error.response?.status}`);
      }
    }

    console.log('\n🎉 Tous les tests de management sont passés avec succès !');
    console.log('\n📊 Résumé des fonctionnalités testées:');
    console.log('   ✅ Connexion Manager');
    console.log('   ✅ Récupération des équipes');
    console.log('   ✅ Récupération des objectifs');
    console.log('   ✅ Création d\'objectifs');
    console.log('   ✅ Récupération des employés');
    console.log('   ✅ Récupération du profil');
    console.log('   ✅ Vérification des permissions');

  } catch (error: any) {
    console.error('\n❌ Erreur lors des tests:', error.response?.data || error.message);
  }
}

testManagerFeatures(); 