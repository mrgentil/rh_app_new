import { emailService } from '../services/emailService';
import { sequelize } from '../models/sequelize';

async function testEmail() {
  try {
    console.log('🧪 Test de la configuration email...\n');

    // Test de connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie\n');

    // Test de la configuration email
    console.log('2. Test de la configuration email...');
    console.log('Configuration actuelle:');
    console.log(`- Host: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
    console.log(`- Port: ${process.env.EMAIL_PORT || '587'}`);
    console.log(`- User: ${process.env.EMAIL_USER || 'Non configuré'}`);
    console.log(`- Pass: ${process.env.EMAIL_PASS ? 'Configuré' : 'Non configuré'}\n`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Configuration email manquante !');
      console.log('Veuillez configurer EMAIL_USER et EMAIL_PASS dans votre fichier .env');
      return;
    }

    // Test d'envoi d'email
    console.log('3. Test d\'envoi d\'email...');
    const testEmail = process.env.EMAIL_USER; // Envoyer à l'expéditeur pour le test
    
    try {
      await emailService.sendPasswordResetEmail(
        testEmail,
        'testuser',
        emailService.generateResetToken(1, testEmail)
      );
      console.log(`✅ Email de test envoyé avec succès à ${testEmail}`);
      console.log('📧 Vérifiez votre boîte mail (et les spams)');
    } catch (error) {
      console.log('❌ Erreur lors de l\'envoi de l\'email:');
      console.log(error);
      
      if ((error as any).code === 'EAUTH') {
        console.log('\n🔧 Solutions possibles :');
        console.log('1. Vérifiez que l\'authentification à 2 facteurs est activée sur Gmail');
        console.log('2. Vérifiez que vous utilisez un mot de passe d\'application (pas votre mot de passe normal)');
        console.log('3. Vérifiez que EMAIL_USER et EMAIL_PASS sont corrects dans .env');
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testEmail();
}

export { testEmail }; 