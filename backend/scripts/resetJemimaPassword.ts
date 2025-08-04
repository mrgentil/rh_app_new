import bcrypt from 'bcryptjs';
import { User } from '../src/models';

async function resetJemimaPassword() {
  try {
    console.log('🔧 Réinitialisation du mot de passe de jemima...\n');

    // Récupérer l'utilisateur jemima
    const jemima = await User.findOne({
      where: { username: 'jemima' }
    });

    if (!jemima) {
      console.log('❌ Utilisateur jemima non trouvé');
      return;
    }

    console.log(`✅ Utilisateur jemima trouvé (ID: ${jemima.id})`);

    // Nouveau mot de passe
    const newPassword = 'jemima123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await jemima.update({
      password: hashedPassword
    });

    console.log('✅ Mot de passe mis à jour avec succès');
    console.log(`🔐 Nouveau mot de passe: "${newPassword}"`);
    console.log('\n📋 Identifiants de connexion:');
    console.log(`   - Nom d'utilisateur: jemima`);
    console.log(`   - Mot de passe: ${newPassword}`);

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  }
}

resetJemimaPassword(); 