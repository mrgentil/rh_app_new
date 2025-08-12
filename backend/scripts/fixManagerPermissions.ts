import { sequelize } from '../src/models/sequelize';
import { User } from '../src/models/User';
import { Role } from '../src/models/Role';
import { getRolePermissions } from '../src/types/permissions';

async function fixManagerPermissions() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Trouver l'utilisateur mrgentil
    const user = await User.findOne({
      where: { username: 'mrgentil' }
    });

    if (!user) {
      console.log('❌ Utilisateur mrgentil non trouvé');
      return;
    }

    console.log('👤 Utilisateur trouvé:', {
      id: user.id,
      username: user.username,
      roleId: user.roleId
    });

    // Trouver le rôle MANAGER
    const managerRole = await Role.findOne({ where: { name: 'MANAGER' } });
    if (!managerRole) {
      console.log('❌ Rôle MANAGER non trouvé dans la base de données');
      return;
    }

    console.log('🔍 Rôle MANAGER actuel:', {
      id: managerRole.id,
      name: managerRole.name,
      permissions: managerRole.permissions
    });

    // Obtenir les nouvelles permissions du rôle MANAGER
    const managerPermissions = getRolePermissions('MANAGER');
    console.log('🔑 Nouvelles permissions du rôle MANAGER:', managerPermissions);

    // Mettre à jour les permissions du rôle MANAGER dans la base de données
    await managerRole.update({ 
      permissions: JSON.stringify(managerPermissions)
    });

    console.log('✅ Permissions du rôle MANAGER mises à jour dans la base de données');

    // Vérifier si l'utilisateur a le bon rôle
    if (user.roleId !== managerRole.id) {
      console.log('⚠️ L\'utilisateur n\'a pas le rôle MANAGER, mise à jour...');
      await user.update({ roleId: managerRole.id });
      console.log('✅ Rôle MANAGER assigné à l\'utilisateur');
    }

    // Vérifier la mise à jour
    const updatedRole = await Role.findOne({ where: { name: 'MANAGER' } });
    const updatedPermissions = JSON.parse(updatedRole?.permissions || '[]');
    
    console.log('🔍 Rôle MANAGER après mise à jour:', {
      id: updatedRole?.id,
      name: updatedRole?.name,
      permissions: updatedPermissions
    });

    // Vérifier spécifiquement la permission employees:view_team
    const hasViewTeamPermission = updatedPermissions.includes('employees:view_team');
    console.log('🎯 Permission employees:view_team:', hasViewTeamPermission ? '✅ Présente' : '❌ Manquante');

    if (hasViewTeamPermission) {
      console.log('\n🎉 Succès ! Le rôle MANAGER a maintenant la permission employees:view_team');
      console.log('🔄 Redémarrez le serveur backend pour que les changements prennent effet.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

fixManagerPermissions();
