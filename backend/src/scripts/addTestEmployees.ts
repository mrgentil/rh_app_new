import { sequelize } from '../models/sequelize';
import {
  JobTitle,
  Department,
  Employee,
} from '../models';

async function addTestEmployees() {
  try {
    console.log('👥 Ajout d\'employés de test...');
    
    // Récupérer les départements et postes existants
    const departments = await Department.findAll();
    const jobTitles = await JobTitle.findAll();
    
    if (departments.length === 0 || jobTitles.length === 0) {
      console.log('❌ Veuillez d\'abord exécuter le script de seed pour créer les départements et postes');
      return;
    }
    
    const testEmployees = [
      {
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@rh-app.com',
        phone: '0123456781',
        address: '456 Avenue de la Paix, 75001 Paris',
        birthDate: new Date('1985-03-15'),
        hireDate: new Date('2023-06-01'),
        jobTitleId: jobTitles.find(j => j.title === 'Responsable RH')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Ressources Humaines')?.id || departments[0].id,
        status: 'actif',
      },
      {
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@rh-app.com',
        phone: '0123456782',
        address: '789 Rue du Commerce, 75002 Paris',
        birthDate: new Date('1992-07-22'),
        hireDate: new Date('2023-08-15'),
        jobTitleId: jobTitles.find(j => j.title === 'Développeur Full-Stack')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Informatique')?.id || departments[0].id,
        status: 'actif',
      },
      {
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@rh-app.com',
        phone: '0123456783',
        address: '321 Boulevard Saint-Germain, 75006 Paris',
        birthDate: new Date('1988-11-08'),
        hireDate: new Date('2023-09-10'),
        jobTitleId: jobTitles.find(j => j.title === 'Chargé de Marketing')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Marketing')?.id || departments[0].id,
        status: 'actif',
      },
      {
        firstName: 'Pierre',
        lastName: 'Petit',
        email: 'pierre.petit@rh-app.com',
        phone: '0123456784',
        address: '654 Rue de Rivoli, 75001 Paris',
        birthDate: new Date('1990-04-12'),
        hireDate: new Date('2023-10-01'),
        jobTitleId: jobTitles.find(j => j.title === 'Comptable')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Finance')?.id || departments[0].id,
        status: 'actif',
      },
      {
        firstName: 'Lucie',
        lastName: 'Moreau',
        email: 'lucie.moreau@rh-app.com',
        phone: '0123456785',
        address: '987 Avenue des Champs-Élysées, 75008 Paris',
        birthDate: new Date('1995-09-30'),
        hireDate: new Date('2023-11-15'),
        jobTitleId: jobTitles.find(j => j.title === 'Commercial')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Commercial')?.id || departments[0].id,
        status: 'actif',
      },
      {
        firstName: 'Thomas',
        lastName: 'Leroy',
        email: 'thomas.leroy@rh-app.com',
        phone: '0123456786',
        address: '147 Rue de la Pompe, 75016 Paris',
        birthDate: new Date('1987-12-03'),
        hireDate: new Date('2024-01-20'),
        jobTitleId: jobTitles.find(j => j.title === 'Développeur Frontend')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Informatique')?.id || departments[0].id,
        status: 'actif',
      },
      {
        firstName: 'Emma',
        lastName: 'Roux',
        email: 'emma.roux@rh-app.com',
        phone: '0123456787',
        address: '258 Rue du Faubourg Saint-Honoré, 75008 Paris',
        birthDate: new Date('1993-05-18'),
        hireDate: new Date('2024-02-01'),
        jobTitleId: jobTitles.find(j => j.title === 'Chef de Projet')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Informatique')?.id || departments[0].id,
        status: 'en_conge',
      },
      {
        firstName: 'Antoine',
        lastName: 'Simon',
        email: 'antoine.simon@rh-app.com',
        phone: '0123456788',
        address: '369 Avenue Montaigne, 75008 Paris',
        birthDate: new Date('1989-08-25'),
        hireDate: new Date('2024-03-01'),
        jobTitleId: jobTitles.find(j => j.title === 'Développeur Backend')?.id || jobTitles[0].id,
        departmentId: departments.find(d => d.name === 'Informatique')?.id || departments[0].id,
        status: 'actif',
      }
    ];
    
    let createdCount = 0;
    let existingCount = 0;
    
    for (const employeeData of testEmployees) {
      const [employee, created] = await Employee.findOrCreate({
        where: { email: employeeData.email },
        defaults: employeeData
      });
      
      if (created) {
        console.log(`✅ Employé créé: ${employeeData.firstName} ${employeeData.lastName} (${employeeData.email})`);
        createdCount++;
      } else {
        console.log(`ℹ️ Employé existant: ${employeeData.firstName} ${employeeData.lastName} (${employeeData.email})`);
        existingCount++;
      }
    }
    
    console.log('\n🎉 Ajout d\'employés terminé !');
    console.log(`📊 Résumé :`);
    console.log(`- ${createdCount} nouveaux employés créés`);
    console.log(`- ${existingCount} employés déjà existants`);
    console.log(`- Total: ${createdCount + existingCount} employés traités`);
    
    // Afficher le total d'employés dans la base
    const totalEmployees = await Employee.count();
    console.log(`\n📈 Total d'employés dans la base: ${totalEmployees}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout d\'employés:', error);
  } finally {
    await sequelize.close();
  }
}

addTestEmployees(); 