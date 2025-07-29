import axios from 'axios';

async function testRolesAPI() {
  try {
    console.log('🔍 Test de l\'API des rôles...');
    
    // Test 1: Récupérer tous les rôles
    console.log('\n📋 Test 1: Récupération des rôles');
    const rolesResponse = await axios.get('http://localhost:3001/api/roles');
    const roles = rolesResponse.data;
    
    console.log(`✅ ${roles.length} rôles récupérés`);
    roles.forEach((role: any) => {
      const permissions = JSON.parse(role.permissions || '[]');
      console.log(`  • ${role.name}: ${permissions.length} permissions, ${role.userCount || 0} utilisateurs`);
    });
    
    // Test 2: Vérifier les permissions d'un rôle spécifique
    console.log('\n📋 Test 2: Vérification des permissions du rôle RH');
    const rhRole = roles.find((role: any) => role.name === 'RH');
    if (rhRole) {
      const permissions = JSON.parse(rhRole.permissions);
      console.log(`✅ Rôle RH trouvé avec ${permissions.length} permissions:`);
      permissions.forEach((permission: string) => {
        console.log(`  • ${permission}`);
      });
    } else {
      console.log('❌ Rôle RH non trouvé');
    }
    
    // Test 3: Vérifier la structure des données
    console.log('\n📋 Test 3: Structure des données');
    if (roles.length > 0) {
      const firstRole = roles[0];
      console.log('✅ Structure du premier rôle:');
      console.log(`  • id: ${firstRole.id}`);
      console.log(`  • name: ${firstRole.name}`);
      console.log(`  • permissions: ${typeof firstRole.permissions}`);
      console.log(`  • userCount: ${firstRole.userCount}`);
      console.log(`  • createdAt: ${firstRole.createdAt}`);
    }
    
    console.log('\n🎉 Tests terminés avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

testRolesAPI(); 