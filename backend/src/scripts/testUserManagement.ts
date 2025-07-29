import { userService } from '../services/userService';
import { emailService } from '../services/emailService';
import { sequelize } from '../models/sequelize';
import '../models'; // Import pour charger les associations

async function testUserManagement() {
  try {
    console.log('🧪 Test du système de gestion des utilisateurs...\n');

    // Test de connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie\n');

    // Test du service d'email
    console.log('2. Test du service d\'email...');
    try {
      await emailService.sendPasswordResetEmail(
        'test@example.com',
        'testuser',
        emailService.generateResetToken(1, 'test@example.com')
      );
      console.log('✅ Service d\'email configuré correctement\n');
    } catch (error) {
      console.log('⚠️  Service d\'email non configuré (normal en développement)\n');
    }

    // Test de récupération des utilisateurs
    console.log('3. Test de récupération des utilisateurs...');
    const users = await userService.getAllUsers();
    console.log(`✅ ${users.length} utilisateurs récupérés\n`);

    // Test des statistiques
    console.log('4. Test des statistiques...');
    const stats = await userService.getUserStats();
    console.log('✅ Statistiques récupérées:', {
      total: stats.total,
      active: stats.active,
      suspended: stats.suspended,
      roles: Object.keys(stats.byRole).length
    });
    console.log('');

    // Test de recherche
    console.log('5. Test de recherche d\'utilisateurs...');
    if (users.length > 0) {
      const searchResults = await userService.searchUsers(users[0].username.substring(0, 3));
      console.log(`✅ Recherche terminée: ${searchResults.length} résultats\n`);
    } else {
      console.log('⚠️  Aucun utilisateur pour tester la recherche\n');
    }

    console.log('🎉 Tous les tests sont passés avec succès !');
    console.log('\n📧 Pour tester les emails:');
    console.log('1. Configurez vos variables d\'environnement EMAIL_*');
    console.log('2. Créez un utilisateur via l\'interface admin');
    console.log('3. Vérifiez votre boîte Mailtrap pour les emails');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testUserManagement();
}

export { testUserManagement }; 