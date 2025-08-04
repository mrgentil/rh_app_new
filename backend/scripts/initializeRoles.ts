import { Role } from '../src/models';
import { sequelize } from '../src/models/sequelize';
import { ROLE_PERMISSIONS } from '../src/types/permissions';

async function initializeRoles() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie.');

    // Supprimer tous les rôles existants
    await Role.destroy({ where: {} });
    console.log('🗑️ Rôles existants supprimés.');

    // Créer les rôles avec leurs permissions
    const rolesToCreate = [
      {
        name: 'Admin',
        permissions: JSON.stringify(ROLE_PERMISSIONS.ADMIN)
      },
      {
        name: 'RH',
        permissions: JSON.stringify(ROLE_PERMISSIONS.RH)
      },
      {
        name: 'Manager',
        permissions: JSON.stringify(ROLE_PERMISSIONS.MANAGER)
      },
      {
        name: 'Employee',
        permissions: JSON.stringify(ROLE_PERMISSIONS.EMPLOYEE)
      }
    ];

    for (const roleData of rolesToCreate) {
      await Role.create(roleData);
      console.log(`✅ Rôle "${roleData.name}" créé avec ${JSON.parse(roleData.permissions).length} permissions.`);
    }

    console.log('\n🎉 Initialisation des rôles terminée avec succès !');
    console.log('\n📋 Rôles créés :');
    console.log('- Admin : Accès complet à toutes les fonctionnalités');
    console.log('- RH : Gestion des employés, utilisateurs, congés, paie');
    console.log('- Manager : Gestion de son équipe et approbation des congés');
    console.log('- Employee : Accès limité à ses propres données');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des rôles:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  initializeRoles();
}

export default initializeRoles; 