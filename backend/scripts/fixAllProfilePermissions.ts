import { sequelize } from '../src/models/sequelize';
import '../src/models'; // Import des associations
import { Role } from '../src/models/Role';

async function fixAllProfilePermissions() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Rôles qui devraient avoir la permission profile
    const rolesThatNeedProfile = ['Admin', 'RH', 'Manager', 'Comptable', 'Employé', 'Stagiaire', 'Administrateur', 'Employee'];

    const allRoles = await Role.findAll();
    console.log('🔍 Mise à jour des permissions pour tous les rôles:');
    
    for (const role of allRoles) {
      const currentPermissions = JSON.parse(role.permissions || '[]');
      const hadProfile = currentPermissions.includes('profile');
      
      if (!hadProfile) {
        currentPermissions.push('profile');
        
        await role.update({
          permissions: JSON.stringify(currentPermissions)
        });
        
        console.log(`   ✅ ${role.name}: Permission "profile" ajoutée`);
      } else {
        console.log(`   ℹ️ ${role.name}: Permission "profile" déjà présente`);
      }
    }

    console.log('\n🔍 Vérification finale des permissions:');
    const updatedRoles = await Role.findAll();
    updatedRoles.forEach(role => {
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

fixAllProfilePermissions(); 