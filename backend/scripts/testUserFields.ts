import { sequelize } from '../src/models/sequelize';
import { User } from '../src/models/User';
import { userService } from '../src/services/userService';

async function testUserFields() {
  try {
    console.log('🔧 Test des champs photoUrl et salary...\n');

    // 1. Récupérer tous les utilisateurs
    console.log('1. Récupération de tous les utilisateurs...');
    const users = await userService.getAllUsers();
    console.log(`✅ ${users.length} utilisateurs trouvés`);
    
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`   - Utilisateur: ${firstUser.username}`);
      console.log(`   - Photo URL: ${firstUser.photoUrl || 'Non définie'}`);
      console.log(`   - Salaire: ${firstUser.salary || 'Non défini'}`);
    }

    // 2. Récupérer un utilisateur spécifique
    if (users.length > 0) {
      console.log('\n2. Récupération d\'un utilisateur spécifique...');
      const user = await userService.getUserById(users[0].id);
      if (user) {
        console.log(`✅ Utilisateur trouvé: ${user.username}`);
        console.log(`   - Photo URL: ${user.photoUrl || 'Non définie'}`);
        console.log(`   - Salaire: ${user.salary || 'Non défini'}`);
      }
    }

    // 3. Test de mise à jour
    if (users.length > 0) {
      console.log('\n3. Test de mise à jour...');
      const testPhotoUrl = 'https://example.com/test-photo.jpg';
      const testSalary = 50000;
      
      const updatedUser = await userService.updateUser(users[0].id, {
        photoUrl: testPhotoUrl,
        salary: testSalary
      });
      
      console.log(`✅ Utilisateur mis à jour: ${updatedUser.username}`);
      console.log(`   - Nouvelle Photo URL: ${updatedUser.photoUrl}`);
      console.log(`   - Nouveau Salaire: ${updatedUser.salary}`);
    }

    console.log('\n✅ Test terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testUserFields(); 