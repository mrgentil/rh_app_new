import { User, Employee, Role } from '../src/models';

async function checkExistingUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs existants...\n');

    // Récupérer tous les utilisateurs
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'isActive', 'firstName', 'lastName', 'roleId', 'employeeId']
    });

    console.log(`📊 Nombre total d'utilisateurs: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données');
      return;
    }

    // Récupérer tous les rôles
    const roles = await Role.findAll({
      attributes: ['id', 'name', 'permissions']
    });

    // Récupérer tous les employés
    const employees = await Employee.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'status']
    });

    // Afficher les détails de chaque utilisateur
    users.forEach((user: any, index: number) => {
      const role = roles.find((r: any) => r.id === user.roleId);
      const employee = employees.find((e: any) => e.id === user.employeeId);
      
      console.log(`${index + 1}. 👤 ${user.username} (${user.firstName} ${user.lastName})`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🏷️ Rôle: ${role?.name || 'Aucun rôle'} (ID: ${user.roleId})`);
      console.log(`   📋 Permissions: ${role?.permissions || 'Aucune'}`);
      console.log(`   ✅ Actif: ${user.isActive ? 'Oui' : 'Non'}`);
      console.log(`   👨‍💼 Employé ID: ${user.employeeId}`);
      if (employee) {
        console.log(`   📊 Statut employé: ${employee.status}`);
      }
      console.log('');
    });

    // Compter par rôle
    const roleCounts: { [key: string]: number } = {};
    users.forEach((user: any) => {
      const role = roles.find((r: any) => r.id === user.roleId);
      const roleName = role?.name || 'Sans rôle';
      roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
    });

    console.log('📈 Répartition par rôle:');
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   - ${role}: ${count} utilisateur(s)`);
    });

    // Vérifier spécifiquement l'utilisateur "jemima"
    const jemima = users.find((user: any) => user.username === 'jemima');
    if (jemima) {
      const jemimaRole = roles.find((r: any) => r.id === jemima.roleId);
      console.log('\n🎯 Utilisateur "jemima" trouvé:');
      console.log(`   - Rôle: ${jemimaRole?.name}`);
      console.log(`   - Permissions: ${jemimaRole?.permissions}`);
      console.log(`   - Actif: ${jemima.isActive ? 'Oui' : 'Non'}`);
    } else {
      console.log('\n❌ Utilisateur "jemima" non trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

checkExistingUsers(); 