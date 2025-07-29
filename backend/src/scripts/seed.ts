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
    
    // Vérifier et créer les rôles de base
    console.log('📋 Création des rôles...');
    const rolesData = [
      { name: 'Admin', permissions: JSON.stringify(['all']) },
      { name: 'RH', permissions: JSON.stringify(['employees', 'payroll', 'leaves']) },
      { name: 'Manager', permissions: JSON.stringify(['team', 'leaves']) },
      { name: 'Comptable', permissions: JSON.stringify(['payroll', 'employees']) },
      { name: 'Employé', permissions: JSON.stringify(['profile', 'leaves', 'employees']) },
      { name: 'Stagiaire', permissions: JSON.stringify(['profile', 'employees']) },
    ];
    
    const roles = [];
    for (const roleData of rolesData) {
      const [role, created] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData
      });
      roles.push(role);
      if (created) console.log(`✅ Rôle créé: ${roleData.name}`);
      else console.log(`ℹ️ Rôle existant: ${roleData.name}`);
    }
    
    // Vérifier et créer les départements de base
    console.log('🏢 Création des départements...');
    const departmentsData = [
      { name: 'Ressources Humaines', description: 'Gestion du personnel' },
      { name: 'Informatique', description: 'Développement et maintenance' },
      { name: 'Marketing', description: 'Communication et promotion' },
      { name: 'Finance', description: 'Gestion financière' },
      { name: 'Commercial', description: 'Vente et relation client' },
    ];
    
    const departments = [];
    for (const deptData of departmentsData) {
      const [dept, created] = await Department.findOrCreate({
        where: { name: deptData.name },
        defaults: deptData
      });
      departments.push(dept);
      if (created) console.log(`✅ Département créé: ${deptData.name}`);
      else console.log(`ℹ️ Département existant: ${deptData.name}`);
    }
    
    // Vérifier et créer les postes de base
    console.log('💼 Création des postes...');
    const jobTitlesData = [
      { title: 'Directeur RH', description: 'Direction des ressources humaines' },
      { title: 'Responsable RH', description: 'Gestion RH opérationnelle' },
      { title: 'Développeur Full-Stack', description: 'Développement web' },
      { title: 'Développeur Frontend', description: 'Interface utilisateur' },
      { title: 'Développeur Backend', description: 'Logique métier' },
      { title: 'Chef de Projet', description: 'Gestion de projets' },
      { title: 'Chargé de Marketing', description: 'Marketing digital' },
      { title: 'Comptable', description: 'Comptabilité générale' },
      { title: 'Commercial', description: 'Vente et prospection' },
    ];
    
    const jobTitles = [];
    for (const jobData of jobTitlesData) {
      const [job, created] = await JobTitle.findOrCreate({
        where: { title: jobData.title },
        defaults: jobData
      });
      jobTitles.push(job);
      if (created) console.log(`✅ Poste créé: ${jobData.title}`);
      else console.log(`ℹ️ Poste existant: ${jobData.title}`);
    }
    
    // Vérifier et créer les types de congés de base
    console.log('🏖️ Création des types de congés...');
    const leaveTypesData = [
      { name: 'Congés Payés', description: 'Congés annuels' },
      { name: 'Maladie', description: 'Arrêt maladie' },
      { name: 'RTT', description: 'Réduction du temps de travail' },
      { name: 'Congé Maternité', description: 'Congé maternité' },
      { name: 'Congé Paternité', description: 'Congé paternité' },
      { name: 'Formation', description: 'Congé formation' },
    ];
    
    const leaveTypes = [];
    for (const leaveData of leaveTypesData) {
      const [leave, created] = await LeaveType.findOrCreate({
        where: { name: leaveData.name },
        defaults: leaveData
      });
      leaveTypes.push(leave);
      if (created) console.log(`✅ Type de congé créé: ${leaveData.name}`);
      else console.log(`ℹ️ Type de congé existant: ${leaveData.name}`);
    }
    
    // Vérifier et créer un employé Admin
    console.log('👤 Création de l\'employé Admin...');
    const [adminEmployee, employeeCreated] = await Employee.findOrCreate({
      where: { email: 'admin@rh-app.com' },
      defaults: {
        firstName: 'Admin',
        lastName: 'Système',
        email: 'admin@rh-app.com',
        phone: '0123456789',
        address: '123 Rue Admin, 75000 Paris',
        birthDate: new Date('1990-01-01'),
        hireDate: new Date('2024-01-01'),
        jobTitleId: jobTitles.find(j => j.title === 'Directeur RH')?.id || 1,
        departmentId: departments.find(d => d.name === 'Ressources Humaines')?.id || 1,
        status: 'actif',
      }
    });
    
    if (employeeCreated) console.log('✅ Employé Admin créé');
    else console.log('ℹ️ Employé Admin existant');
    
    // Vérifier et créer un utilisateur Admin
    console.log('🔐 Création de l\'utilisateur Admin...');
    const adminRole = roles.find(role => role.name === 'Admin');
    if (adminRole) {
      const [adminUser, userCreated] = await User.findOrCreate({
        where: { username: 'admin' },
        defaults: {
          username: 'admin',
          password: await bcrypt.hash('admin123', 10),
          roleId: adminRole.id,
          employeeId: adminEmployee.id,
        }
      });
      
      if (userCreated) console.log('✅ Utilisateur Admin créé');
      else console.log('ℹ️ Utilisateur Admin existant');
    }
    
    console.log('\n🎉 Seeding terminé avec succès !');
    console.log(`📊 Résumé :`);
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