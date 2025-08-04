import { sequelize } from '../src/models/sequelize';
import '../src/models'; // Import des associations
import { User } from '../src/models/User';
import { Role } from '../src/models/Role';
import { Employee } from '../src/models/Employee';

async function checkManagerPermissions() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Vérifier le rôle Manager
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
    console.log('   - Permissions:', managerRole.permissions);

    // Vérifier les utilisateurs avec le rôle Manager
    const managerUsers = await User.findAll({
      where: { roleId: managerRole.id },
      include: [
        { model: Role },
        { model: Employee }
      ]
    });

    console.log(`\n👥 Utilisateurs avec le rôle Manager (${managerUsers.length}):`);
    managerUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (ID: ${user.id})`);
      console.log(`      - Actif: ${user.isActive}`);
      console.log(`      - Employee ID: ${user.employeeId}`);
      console.log(`      - Employee: ${(user as any).Employee ? `${(user as any).Employee.firstName} ${(user as any).Employee.lastName}` : 'Aucun'}`);
    });

    // Vérifier si le rôle Manager a la permission 'profile'
    const permissions = JSON.parse(managerRole.permissions || '[]');
    console.log('\n🔐 Permissions du rôle Manager:');
    console.log('   - Permissions:', permissions);
    console.log('   - A la permission "profile":', permissions.includes('profile'));

    // Tester l'authentification d'un utilisateur manager
    if (managerUsers.length > 0) {
      const testUser = managerUsers[0];
      console.log(`\n🧪 Test d'authentification pour ${testUser.username}:`);
      console.log('   - ID:', testUser.id);
      console.log('   - Actif:', testUser.isActive);
      console.log('   - Rôle:', (testUser as any).Role?.name);
      console.log('   - Permissions:', (testUser as any).Role?.permissions);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

checkManagerPermissions(); 