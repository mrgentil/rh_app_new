import bcrypt from 'bcryptjs';
import { User } from '../src/models';

async function checkJemimaPassword() {
  try {
    console.log('🔍 Vérification du mot de passe de jemima...\n');

    // Récupérer l'utilisateur jemima
    const jemima = await User.findOne({
      where: { username: 'jemima' },
      attributes: ['id', 'username', 'password', 'isActive']
    });

    if (!jemima) {
      console.log('❌ Utilisateur jemima non trouvé');
      return;
    }

    console.log(`✅ Utilisateur jemima trouvé (ID: ${jemima.id})`);
    console.log(`📊 Actif: ${jemima.isActive ? 'Oui' : 'Non'}`);
    console.log(`🔐 Hash du mot de passe: ${jemima.password.substring(0, 20)}...`);

    // Tester différents mots de passe courants
    const commonPasswords = [
      'password123',
      'jemima123',
      'rh123',
      'password',
      '123456',
      'admin',
      'jemima',
      'rh',
      'test123',
      'welcome123'
    ];

    console.log('\n🧪 Test des mots de passe courants:');
    
    for (const password of commonPasswords) {
      try {
        const isValid = await bcrypt.compare(password, jemima.password);
        if (isValid) {
          console.log(`✅ Mot de passe trouvé: "${password}"`);
          return;
        } else {
          console.log(`❌ "${password}" - Incorrect`);
        }
      } catch (error) {
        console.log(`❌ Erreur avec "${password}": ${error}`);
      }
    }

    console.log('\n❌ Aucun mot de passe courant ne correspond');
    console.log('💡 Tu devras peut-être réinitialiser le mot de passe de jemima');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

checkJemimaPassword(); 