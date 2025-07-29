import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Debug de la configuration email...\n');

console.log('📧 Variables d\'environnement détectées:');
console.log('=====================================');

// Variables MAIL_*
console.log('\n🔹 Variables MAIL_*:');
console.log(`MAIL_HOST: "${process.env.MAIL_HOST}"`);
console.log(`MAIL_PORT: "${process.env.MAIL_PORT}"`);
console.log(`MAIL_USERNAME: "${process.env.MAIL_USERNAME}"`);
console.log(`MAIL_PASSWORD: "${process.env.MAIL_PASSWORD ? '***MASQUE***' : 'NON CONFIGURÉ'}"`);
console.log(`MAIL_ENCRYPTION: "${process.env.MAIL_ENCRYPTION}"`);
console.log(`MAIL_FROM_ADDRESS: "${process.env.MAIL_FROM_ADDRESS}"`);

// Variables EMAIL_*
console.log('\n🔹 Variables EMAIL_*:');
console.log(`EMAIL_HOST: "${process.env.EMAIL_HOST}"`);
console.log(`EMAIL_PORT: "${process.env.EMAIL_PORT}"`);
console.log(`EMAIL_USER: "${process.env.EMAIL_USER}"`);
console.log(`EMAIL_PASS: "${process.env.EMAIL_PASS ? '***MASQUE***' : 'NON CONFIGURÉ'}"`);

// Variables calculées
console.log('\n🔹 Variables calculées:');
const host = process.env.MAIL_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
const port = process.env.MAIL_PORT || process.env.EMAIL_PORT || '587';
const user = process.env.MAIL_USERNAME || process.env.EMAIL_USER;
const pass = process.env.MAIL_PASSWORD || process.env.EMAIL_PASS;

console.log(`Host final: "${host}"`);
console.log(`Port final: "${port}"`);
console.log(`User final: "${user}"`);
console.log(`Pass final: "${pass ? '***MASQUE***' : 'NON CONFIGURÉ'}"`);

// Test de validation
console.log('\n🔹 Validation:');
console.log(`Host valide: ${host ? '✅' : '❌'}`);
console.log(`Port valide: ${port ? '✅' : '❌'}`);
console.log(`User valide: ${user ? '✅' : '❌'}`);
console.log(`Pass valide: ${pass ? '✅' : '❌'}`);

if (!user || !pass) {
  console.log('\n❌ PROBLÈME: Username ou Password manquant!');
  console.log('\n🔧 Solutions:');
  console.log('1. Vérifiez que votre fichier .env contient les bonnes variables');
  console.log('2. Utilisez .\\update-env.bat pour mettre à jour automatiquement');
  console.log('3. Ou créez manuellement le fichier .env avec:');
  console.log('   EMAIL_USER=tshitshob@gmail.com');
  console.log('   EMAIL_PASS=votre_mot_de_passe_d_application');
} else {
  console.log('\n✅ Configuration semble correcte!');
}

console.log('\n📁 Fichier .env trouvé:', require('fs').existsSync('.env') ? '✅' : '❌'); 