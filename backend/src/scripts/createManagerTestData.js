// Script simple pour tester les routes Manager
console.log('🧪 Test des routes Manager...');

// Test simple avec curl
const { exec } = require('child_process');

function testManagerRoutes() {
  console.log('📋 Tests à effectuer manuellement dans Postman:');
  console.log('');
  console.log('1. Test de base:');
  console.log('   GET http://localhost:3001/api/manager/test/auth');
  console.log('');
  console.log('2. Test avec authentification:');
  console.log('   GET http://localhost:3001/api/manager/test/auth-required');
  console.log('   Headers: Cookie: token=VOTRE_TOKEN');
  console.log('');
  console.log('3. Test des permissions:');
  console.log('   GET http://localhost:3001/api/manager/test/permissions');
  console.log('   Headers: Cookie: token=VOTRE_TOKEN');
  console.log('');
  console.log('4. Test des routes Manager:');
  console.log('   GET http://localhost:3001/api/manager/employees/team');
  console.log('   GET http://localhost:3001/api/manager/employees/team/stats');
  console.log('   GET http://localhost:3001/api/manager/team-management/my-teams');
  console.log('   Headers: Cookie: token=VOTRE_TOKEN');
  console.log('');
  console.log('💡 Récupérez votre token depuis les DevTools du navigateur:');
  console.log('   - F12 → Application → Cookies → token');
  console.log('');
}

async function createManagerTestData() {
  testManagerRoutes();
}

// Exécuter le script si appelé directement
if (require.main === module) {
  createManagerTestData().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = { createManagerTestData };
