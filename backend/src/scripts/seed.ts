import { sequelize } from '../models/sequelize';
import {
  JobTitle,
  Department,
  Role,
  LeaveType,
  User,
  Employee,
} from '../models';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Début du seeding...');
    
    // Créer les rôles de base
    const roles = await Role.bulkCreate([
      { name: 'Admin', permissions: JSON.stringify(['all']) },
      { name: 'RH', permissions: JSON.stringify(['employees', 'payroll', 'leaves']) },
      { name: 'Manager', permissions: JSON.stringify(['team', 'leaves']) },
      { name: 'Employé', permissions: JSON.stringify(['profile', 'leaves']) },
    ]);
    
    // Créer les départements de base
    const departments = await Department.bulkCreate([
      { name: 'Ressources Humaines', description: 'Gestion du personnel' },
      { name: 'Informatique', description: 'Développement et maintenance' },
      { name: 'Marketing', description: 'Communication et promotion' },
      { name: 'Finance', description: 'Gestion financière' },
      { name: 'Commercial', description: 'Vente et relation client' },
    ]);
    
    // Créer les postes de base
    const jobTitles = await JobTitle.bulkCreate([
      { title: 'Directeur RH', description: 'Direction des ressources humaines' },
      { title: 'Responsable RH', description: 'Gestion RH opérationnelle' },
      { title: 'Développeur Full-Stack', description: 'Développement web' },
      { title: 'Développeur Frontend', description: 'Interface utilisateur' },
      { title: 'Développeur Backend', description: 'Logique métier' },
      { title: 'Chef de Projet', description: 'Gestion de projets' },
      { title: 'Chargé de Marketing', description: 'Marketing digital' },
      { title: 'Comptable', description: 'Comptabilité générale' },
      { title: 'Commercial', description: 'Vente et prospection' },
    ]);
    
    // Créer les types de congés de base
    const leaveTypes = await LeaveType.bulkCreate([
      { name: 'Congés Payés', description: 'Congés annuels' },
      { name: 'Maladie', description: 'Arrêt maladie' },
      { name: 'RTT', description: 'Réduction du temps de travail' },
      { name: 'Congé Maternité', description: 'Congé maternité' },
      { name: 'Congé Paternité', description: 'Congé paternité' },
      { name: 'Formation', description: 'Congé formation' },
    ]);
    
    // Créer un employé Admin
    const adminEmployee = await Employee.create({
      firstName: 'Admin',
      lastName: 'Système',
      email: 'admin@rh-app.com',
      phone: '0123456789',
      address: '123 Rue Admin, 75000 Paris',
      birthDate: new Date('1990-01-01'),
      hireDate: new Date('2024-01-01'),
      jobTitleId: 1, // Directeur RH
      departmentId: 1, // RH
      status: 'actif',
    });
    
    // Créer un utilisateur Admin
    const adminRole = roles.find(role => role.name === 'Admin');
    if (adminRole) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        roleId: adminRole.id,
        employeeId: adminEmployee.id,
      });
    }
    
    console.log('✅ Seeding terminé avec succès !');
    console.log(`📊 Données créées :`);
    console.log(`- ${roles.length} rôles`);
    console.log(`- ${departments.length} départements`);
    console.log(`- ${jobTitles.length} postes`);
    console.log(`- ${leaveTypes.length} types de congés`);
    console.log(`- 1 employé Admin`);
    console.log(`- 1 utilisateur Admin`);
    console.log('\n🔑 Identifiants Admin :');
    console.log(`- Username: admin`);
    console.log(`- Password: admin123`);
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await sequelize.close();
  }
}

seed(); 