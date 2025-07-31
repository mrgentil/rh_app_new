// Test simple de l'API utilisateurs
const API_URL = 'http://localhost:3001/api';

async function testUserAPI() {
  try {
    console.log('🔧 Test de l\'API utilisateurs depuis le frontend...\n');

    // 1. Test de connexion
    console.log('1. Test de connexion au backend...');
    const healthResponse = await fetch('http://localhost:3001/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend accessible:', healthData);
    } else {
      console.log('❌ Backend non accessible');
      return;
    }

    // 2. Récupérer tous les utilisateurs
    console.log('\n2. Récupération de tous les utilisateurs...');
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
      console.log(`❌ Erreur HTTP: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log('Détails:', errorText);
      return;
    }
    
    const users = await response.json();
    console.log(`✅ ${users.length} utilisateurs trouvés`);
    
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`   - Utilisateur: ${firstUser.username}`);
      console.log(`   - Photo URL: ${firstUser.photoUrl || 'Non définie'}`);
      console.log(`   - Salaire: ${firstUser.salary || 'Non défini'}`);
      console.log(`   - Données complètes:`, JSON.stringify(firstUser, null, 2));
    }

    // 3. Récupérer un utilisateur spécifique
    if (users.length > 0) {
      console.log('\n3. Récupération d\'un utilisateur spécifique...');
      const userResponse = await fetch(`${API_URL}/users/${users[0].id}`);
      
      if (!userResponse.ok) {
        console.log(`❌ Erreur HTTP: ${userResponse.status} ${userResponse.statusText}`);
        return;
      }
      
      const user = await userResponse.json();
      console.log(`✅ Utilisateur trouvé: ${user.username}`);
      console.log(`   - Photo URL: ${user.photoUrl || 'Non définie'}`);
      console.log(`   - Salaire: ${user.salary || 'Non défini'}`);
      console.log(`   - Données complètes:`, JSON.stringify(user, null, 2));
    }

    console.log('\n✅ Test terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testUserAPI(); 