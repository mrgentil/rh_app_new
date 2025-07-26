import { User, Role, Employee } from '../models';

async function checkUserRole() {
  try {
    console.log('🔍 Vérification du rôle utilisateur...\n');

    // Récupérer l'utilisateur admin
    const user = await User.findOne({
      where: { username: 'admin' },
      include: [
        { model: Role, attributes: ['id', 'name', 'permissions'] },
        { model: Employee, attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    if (!user) {
      console.log('❌ Utilisateur admin non trouvé');
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log('   - ID:', user.id);
    console.log('   - Username:', user.username);
    console.log('   - Role ID:', user.roleId);
    console.log('   - Role Name:', (user as any).Role?.name);
    console.log('   - Role Permissions:', (user as any).Role?.permissions);
    console.log('   - Employee:', (user as any).Employee);

    // Vérifier tous les rôles disponibles
    console.log('\n📋 Rôles disponibles:');
    const roles = await Role.findAll();
    roles.forEach(role => {
      console.log(`   - ${role.name} (ID: ${role.id})`);
    });

    // Vérifier si le rôle Admin existe
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    const adminRoleUpper = await Role.findOne({ where: { name: 'ADMIN' } });

    console.log('\n🔍 Vérification du rôle Admin:');
    console.log('   - Admin (exact):', adminRole?.name);
    console.log('   - ADMIN (majuscules):', adminRoleUpper?.name);

    if (adminRole) {
      console.log('   ✅ Rôle Admin trouvé avec exact match');
    } else if (adminRoleUpper) {
      console.log('   ⚠️  Rôle ADMIN trouvé (majuscules)');
    } else {
      console.log('   ❌ Aucun rôle Admin trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkUserRole(); 