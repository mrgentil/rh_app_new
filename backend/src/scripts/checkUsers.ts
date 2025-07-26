import { sequelize } from '../models/sequelize';
import { User, Employee, Role } from '../models';

async function checkUsers() {
  try {
    console.log('👥 Vérification des utilisateurs...\n');
    
    // Récupérer tous les utilisateurs avec leurs relations
    const users = await User.findAll({
      include: [
        {
          model: Employee,
          attributes: ['firstName', 'lastName', 'email', 'status']
        },
        {
          model: Role,
          attributes: ['name', 'permissions']
        }
      ]
    });
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`📊 ${users.length} utilisateur(s) trouvé(s) :\n`);
    
    users.forEach((user: any, index) => {
      console.log(`👤 Utilisateur ${index + 1}:`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Username: ${user.username}`);
      console.log(`   - Rôle: ${user.Role?.name}`);
      console.log(`   - Permissions: ${user.Role?.permissions}`);
      
      if (user.Employee) {
        console.log(`   - Employé: ${user.Employee.firstName} ${user.Employee.lastName}`);
        console.log(`   - Email: ${user.Employee.email}`);
        console.log(`   - Statut: ${user.Employee.status}`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await sequelize.close();
  }
}

checkUsers(); 