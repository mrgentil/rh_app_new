import { sequelize } from '../models/sequelize';
import { User, Employee, Role, JobTitle, Department } from '../models';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    console.log('👤 Création de l\'utilisateur Admin...');
    
    // Vérifier si l'utilisateur Admin existe déjà
    const existingUser = await User.findOne({ where: { username: 'admin' } });
    if (existingUser) {
      console.log('⚠️ L\'utilisateur Admin existe déjà !');
      return;
    }
    
    // Récupérer le rôle Admin
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      console.log('❌ Le rôle Admin n\'existe pas. Exécutez d\'abord le seeding.');
      return;
    }
    
    // Récupérer le poste et département
    const jobTitle = await JobTitle.findOne({ where: { title: 'Directeur RH' } });
    const department = await Department.findOne({ where: { name: 'Ressources Humaines' } });
    
    if (!jobTitle || !department) {
      console.log('❌ Poste ou département manquant. Exécutez d\'abord le seeding.');
      return;
    }
    
    // Créer l'employé Admin
    const adminEmployee = await Employee.create({
      firstName: 'Admin',
      lastName: 'Système',
      email: 'admin@rh-app.com',
      phone: '0123456789',
      address: '123 Rue Admin, 75000 Paris',
      birthDate: new Date('1990-01-01'),
      hireDate: new Date('2024-01-01'),
      jobTitleId: jobTitle.id,
      departmentId: department.id,
      status: 'actif',
    });
    
    // Créer l'utilisateur Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      roleId: adminRole.id,
      employeeId: adminEmployee.id,
    });
    
    console.log('✅ Utilisateur Admin créé avec succès !');
    console.log('\n🔑 Identifiants Admin :');
    console.log(`- Username: admin`);
    console.log(`- Password: admin123`);
    console.log(`- Email: admin@rh-app.com`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'Admin:', error);
  } finally {
    await sequelize.close();
  }
}

createAdmin(); 