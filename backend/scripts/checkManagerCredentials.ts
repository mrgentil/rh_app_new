import { sequelize } from '../src/models/sequelize';
import '../src/models'; // Import des associations
import { User } from '../src/models/User';
import bcrypt from 'bcryptjs';

async function checkManagerCredentials() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Trouver l'utilisateur manager
    const managerUser = await User.findOne({
      where: { username: 'mrgentil' }
    });

    if (!managerUser) {
      console.log('❌ Utilisateur manager non trouvé');
      return;
    }

    console.log('🔍 Utilisateur manager trouvé:');
    console.log('   - ID:', managerUser.id);
    console.log('   - Username:', managerUser.username);
    console.log('   - Actif:', managerUser.isActive);
    console.log('   - Mot de passe hashé:', managerUser.password.substring(0, 20) + '...');

    // Tester différents mots de passe
    const testPasswords = [
      'password123',
      'password',
      '123456',
      'admin',
      'manager',
      'mrgentil'
    ];

    console.log('\n🔐 Test des mots de passe:');
    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, managerUser.password);
      console.log(`   - "${password}": ${isValid ? '✅' : '❌'}`);
    }

    // Créer un nouveau mot de passe si nécessaire
    console.log('\n🔧 Création d\'un nouveau mot de passe...');
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await managerUser.update({ password: hashedPassword });
    console.log('✅ Nouveau mot de passe créé: "password123"');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

checkManagerCredentials(); 