import { Role } from '../src/models';
import { sequelize } from '../src/models/sequelize';

async function initializeRoles() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie.');

    // Créer ou mettre à jour les rôles avec leurs permissions
    const rolesToCreate = [
      {
        name: 'Admin',
        permissions: JSON.stringify(['all'])
      },
      {
        name: 'RH',
        permissions: JSON.stringify([
          'employees:view',
          'employees:create',
          'employees:edit',
          'employees:view_salary',
          'employees:edit_salary',
          'employees:view_personal',
          'employees:edit_personal',
          'users:view',
          'users:create',
          'users:edit',
          'users:suspend',
          'users:activate',
          'roles:view',
          'departments:view',
          'departments:create',
          'departments:edit',
          'leaves:view_all',
          'leaves:approve',
          'leaves:reject',
          'payroll:view_all',
          'payroll:create',
          'payroll:edit',
          'payroll:process',
          'documents:view_all',
          'documents:upload',
          'documents:delete',
          'notifications:view',
          'notifications:send',
          'dashboard:view',
          'dashboard:view_stats',
          'dashboard:view_financial'
        ])
      },
      {
        name: 'Manager',
        permissions: JSON.stringify([
          'employees:view',
          'employees:view_personal',
          'leaves:view',
          'leaves:approve',
          'leaves:reject',
          'documents:view',
          'documents:upload',
          'notifications:view',
          'dashboard:view',
          'dashboard:view_stats'
        ])
      },
      {
        name: 'Employee',
        permissions: JSON.stringify([
          'employees:view',
          'employees:view_personal',
          'leaves:view',
          'leaves:create',
          'leaves:edit',
          'documents:view',
          'documents:upload',
          'notifications:view',
          'dashboard:view'
        ])
      }
    ];

    for (const roleData of rolesToCreate) {
      // Chercher le rôle existant ou en créer un nouveau
      const [role, created] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData
      });

      if (!created) {
        // Mettre à jour le rôle existant
        await role.update({ permissions: roleData.permissions });
        console.log(`🔄 Rôle "${roleData.name}" mis à jour avec ${JSON.parse(roleData.permissions).length} permissions.`);
      } else {
        console.log(`✅ Rôle "${roleData.name}" créé avec ${JSON.parse(roleData.permissions).length} permissions.`);
      }
    }

    console.log('\n🎉 Initialisation des rôles terminée avec succès !');
    console.log('\n📋 Rôles disponibles :');
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