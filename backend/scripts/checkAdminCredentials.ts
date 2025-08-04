import { sequelize } from '../src/models/sequelize';
import { User } from '../src/models/User';
import { Role } from '../src/models/Role';

async function checkAdminCredentials() {
  try {
    console.log('🔍 Vérification des identifiants admin...');

    // Vérifier les utilisateurs admin
    const adminUsers = await sequelize.query(`
      SELECT u.id, u.username, u.password, r.name as roleName
      FROM users u
      LEFT JOIN roles r ON u.roleId = r.id
      WHERE r.name = 'Admin'
    `);

    console.log('👥 Utilisateurs admin trouvés:');
    (adminUsers[0] as any[]).forEach((user: any) => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Role: ${user.roleName}`);
    });

    // Vérifier tous les utilisateurs
    const allUsers = await sequelize.query(`
      SELECT u.id, u.username, r.name as roleName
      FROM users u
      LEFT JOIN roles r ON u.roleId = r.id
      ORDER BY u.id
    `);

    console.log('\n👤 Tous les utilisateurs:');
    (allUsers[0] as any[]).forEach((user: any) => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Role: ${user.roleName}`);
    });

    // Vérifier les rôles
    const roles = await sequelize.query(`
      SELECT id, name, description
      FROM roles
      ORDER BY id
    `);

    console.log('\n🎭 Rôles disponibles:');
    (roles[0] as any[]).forEach((role: any) => {
      console.log(`  - ID: ${role.id}, Nom: ${role.name}, Description: ${role.description}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

checkAdminCredentials(); 