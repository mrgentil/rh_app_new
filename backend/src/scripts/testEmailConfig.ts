import { emailService } from '../services/emailService';
import { sequelize } from '../models/sequelize';
import dotenv from 'dotenv';

dotenv.config();

async function testEmailConfig() {
  try {
    console.log('🧪 Test de la configuration email...\n');

    // Afficher la configuration actuelle
    console.log('📧 Configuration email détectée:');
    console.log(`- Host: ${process.env.MAIL_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
    console.log(`- Port: ${process.env.MAIL_PORT || process.env.EMAIL_PORT || '587'}`);
    console.log(`- Username: ${process.env.MAIL_USERNAME || process.env.EMAIL_USER || 'Non configuré'}`);
    console.log(`- Password: ${process.env.MAIL_PASSWORD || process.env.EMAIL_PASS ? 'Configuré' : 'Non configuré'}`);
    console.log(`- Encryption: ${process.env.MAIL_ENCRYPTION || 'tls'}`);
    console.log(`- From Address: ${process.env.MAIL_FROM_ADDRESS || 'Non configuré'}`);
    console.log('');

    // Test de connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie\n');

    // Vérifier que les variables sont configurées
    const emailUser = process.env.MAIL_USERNAME || process.env.EMAIL_USER;
    const emailPass = process.env.MAIL_PASSWORD || process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.log('❌ Configuration email manquante !');
      console.log('Veuillez configurer MAIL_USERNAME et MAIL_PASSWORD dans votre fichier .env');
      return;
    }

    // Test d'envoi d'email
    console.log('2. Test d\'envoi d\'email...');
    const testEmail = emailUser; // Envoyer à l'expéditeur pour le test
    
    try {
      await emailService.sendPasswordResetEmail(
        testEmail,
        'testuser',
        emailService.generateResetToken(1, testEmail)
      );
      console.log(`✅ Email de test envoyé avec succès à ${testEmail}`);
      console.log('📧 Vérifiez votre boîte mail (et les spams)');
    } catch (error: any) {
      console.log('❌ Erreur lors de l\'envoi de l\'email:');
      console.log(error.message);
      
      if (error.code === 'EAUTH') {
        console.log('\n🔧 Solutions possibles :');
        console.log('1. Vérifiez que l\'authentification à 2 facteurs est activée sur Gmail');
        console.log('2. Vérifiez que vous utilisez un mot de passe d\'application (pas votre mot de passe normal)');
        console.log('3. Vérifiez que MAIL_USERNAME et MAIL_PASSWORD sont corrects dans .env');
        console.log('4. Vérifiez que le mot de passe d\'application est à jour');
      }
      
      if (error.code === 'ECONNECTION') {
        console.log('\n🔧 Problème de connexion :');
        console.log('1. Vérifiez votre connexion internet');
        console.log('2. Vérifiez que le port 587 n\'est pas bloqué par votre pare-feu');
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
  testEmailConfig();
}

export { testEmailConfig }; 