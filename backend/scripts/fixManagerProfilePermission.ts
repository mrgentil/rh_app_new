import { sequelize } from '../src/models/sequelize';
import '../src/models'; // Import des associations
import { Role } from '../src/models/Role';

async function fixManagerProfilePermission() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Trouver le rôle Manager
    const managerRole = await Role.findOne({
      where: { name: 'Manager' }
    });

    if (!managerRole) {
      console.log('❌ Rôle Manager non trouvé');
      return;
    }

    console.log('🔍 Rôle Manager trouvé:');
    console.log('   - ID:', managerRole.id);
    console.log('   - Nom:', managerRole.name);
    console.log('   - Permissions actuelles:', managerRole.permissions);

    // Ajouter la permission 'profile' si elle n'existe pas déjà
    const currentPermissions = JSON.parse(managerRole.permissions || '[]');
    
    if (!currentPermissions.includes('profile')) {
      currentPermissions.push('profile');
      
      await managerRole.update({
        permissions: JSON.stringify(currentPermissions)
      });
      
      console.log('✅ Permission "profile" ajoutée au rôle Manager');
      console.log('   - Nouvelles permissions:', currentPermissions);
    } else {
      console.log('ℹ️ La permission "profile" existe déjà pour le rôle Manager');
    }

    // Vérifier les autres rôles qui devraient avoir la permission profile
    const allRoles = await Role.findAll();
    console.log('\n🔍 Vérification des permissions de tous les rôles:');
    
    allRoles.forEach(role => {
      const permissions = JSON.parse(role.permissions || '[]');
      const hasProfile = permissions.includes('profile');
      console.log(`   - ${role.name}: ${hasProfile ? '✅' : '❌'} profile`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

fixManagerProfilePermission(); 