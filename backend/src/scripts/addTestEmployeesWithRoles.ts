import { sequelize } from '../models/sequelize';
import {
  JobTitle,
  Department,
  Role,
  User,
  Employee,
} from '../models';
import bcrypt from 'bcryptjs';

async function addTestEmployeesWithRoles() {
  try {
    console.log('👥 Ajout d\'employés de test avec rôles...');
    
    // Récupérer les rôles
    const roles = await Role.findAll();
    const adminRole = roles.find(r => r.name === 'Admin');
    const rhRole = roles.find(r => r.name === 'RH');
    const managerRole = roles.find(r => r.name === 'Manager');
    const comptableRole = roles.find(r => r.name === 'Comptable');
    const employeRole = roles.find(r => r.name === 'Employé');
    const stagiaireRole = roles.find(r => r.name === 'Stagiaire');
    
    // Récupérer les départements
    const departments = await Department.findAll();
    const rhDept = departments.find(d => d.name === 'Ressources Humaines');
    const itDept = departments.find(d => d.name === 'Informatique');
    const marketingDept = departments.find(d => d.name === 'Marketing');
    const financeDept = departments.find(d => d.name === 'Finance');
    
    // Récupérer les postes
    const jobTitles = await JobTitle.findAll();
    const directeurRH = jobTitles.find(j => j.title === 'Directeur RH');
    const responsableRH = jobTitles.find(j => j.title === 'Responsable RH');
    const devFullStack = jobTitles.find(j => j.title === 'Développeur Full-Stack');
    const chefProjet = jobTitles.find(j => j.title === 'Chef de Projet');
    const chargéMarketing = jobTitles.find(j => j.title === 'Chargé de Marketing');
    const comptable = jobTitles.find(j => j.title === 'Comptable');
    
    // Données des employés de test
    const testEmployees = [
      {
        // RH
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@rh-app.com',
        phone: '0123456781',
        address: '123 Rue de la Paix, 75001 Paris',
        birthDate: new Date('1985-03-15'),
        hireDate: new Date('2023-01-15'),
        jobTitleId: responsableRH?.id,
        departmentId: rhDept?.id,
        status: 'actif',
        employeeType: 'permanent',
        role: rhRole,
        password: 'rh123'
      },
      {
        // Manager
        firstName: 'Pierre',
        lastName: 'Martin',
        email: 'pierre.martin@rh-app.com',
        phone: '0123456782',
        address: '456 Avenue des Champs, 75008 Paris',
        birthDate: new Date('1980-07-22'),
        hireDate: new Date('2022-06-01'),
        jobTitleId: chefProjet?.id,
        departmentId: itDept?.id,
        status: 'actif',
        employeeType: 'cdi',
        role: managerRole,
        password: 'manager123'
      },
      {
        // Comptable
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@rh-app.com',
        phone: '0123456783',
        address: '789 Boulevard Saint-Germain, 75006 Paris',
        birthDate: new Date('1990-11-08'),
        hireDate: new Date('2023-03-10'),
        jobTitleId: comptable?.id,
        departmentId: financeDept?.id,
        status: 'actif',
        employeeType: 'cdi',
        role: comptableRole,
        password: 'comptable123'
      },
      {
        // Employé permanent
        firstName: 'Thomas',
        lastName: 'Petit',
        email: 'thomas.petit@rh-app.com',
        phone: '0123456784',
        address: '321 Rue de Rivoli, 75001 Paris',
        birthDate: new Date('1992-05-12'),
        hireDate: new Date('2023-09-01'),
        jobTitleId: devFullStack?.id,
        departmentId: itDept?.id,
        status: 'actif',
        employeeType: 'permanent',
        role: employeRole,
        password: 'employe123'
      },
      {
        // Employé CDD
        firstName: 'Julie',
        lastName: 'Moreau',
        email: 'julie.moreau@rh-app.com',
        phone: '0123456785',
        address: '654 Rue du Commerce, 75015 Paris',
        birthDate: new Date('1995-09-30'),
        hireDate: new Date('2024-01-02'),
        jobTitleId: chargéMarketing?.id,
        departmentId: marketingDept?.id,
        status: 'actif',
        employeeType: 'cdd',
        contractEndDate: new Date('2024-12-31'),
        role: employeRole,
        password: 'cdd123'
      },
      {
        // Stagiaire
        firstName: 'Lucas',
        lastName: 'Leroy',
        email: 'lucas.leroy@rh-app.com',
        phone: '0123456786',
        address: '987 Rue de la Pompe, 75016 Paris',
        birthDate: new Date('2000-12-03'),
        hireDate: new Date('2024-02-01'),
        jobTitleId: devFullStack?.id,
        departmentId: itDept?.id,
        status: 'actif',
        employeeType: 'stagiaire',
        contractEndDate: new Date('2024-07-31'),
        role: stagiaireRole,
        password: 'stagiaire123'
      }
    ];
    
    for (const employeeData of testEmployees) {
      try {
        // Vérifier si l'employé existe déjà
        const existingEmployee = await Employee.findOne({
          where: { email: employeeData.email }
        });
        
        if (existingEmployee) {
          console.log(`ℹ️ Employé existant: ${employeeData.firstName} ${employeeData.lastName}`);
          continue;
        }
        
        // Créer l'employé
        const { role, password, ...employeeFields } = employeeData;
        const employee = await Employee.create(employeeFields);
        
        // Créer le compte utilisateur
        if (role) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await User.create({
            employeeId: employee.id,
            username: employee.email,
            password: hashedPassword,
            roleId: role.id
          });
          
          console.log(`✅ Employé créé: ${employee.firstName} ${employee.lastName} (${role.name})`);
          console.log(`🔑 Identifiants: ${employee.email} / ${password}`);
        }
        
      } catch (error) {
        console.error(`❌ Erreur lors de la création de ${employeeData.firstName} ${employeeData.lastName}:`, error);
      }
    }
    
    console.log('\n🎉 Ajout des employés de test terminé !');
    console.log('\n📋 Récapitulatif des comptes créés :');
    console.log('👤 RH: marie.dubois@rh-app.com / rh123');
    console.log('👤 Manager: pierre.martin@rh-app.com / manager123');
    console.log('👤 Comptable: sophie.bernard@rh-app.com / comptable123');
    console.log('👤 Employé: thomas.petit@rh-app.com / employe123');
    console.log('👤 CDD: julie.moreau@rh-app.com / cdd123');
    console.log('👤 Stagiaire: lucas.leroy@rh-app.com / stagiaire123');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des employés de test:', error);
  } finally {
    await sequelize.close();
  }
}

addTestEmployeesWithRoles(); 