import { sequelize } from '../src/models/sequelize';
import { Employee } from '../src/models/Employee';
import { Role } from '../src/models/Role';

async function testEmployeeCreation() {
  try {
    console.log('🧪 Test de création d\'employé avec matricule...');

    // Vérifier les employés existants
    const existingEmployees = await Employee.findAll({
      order: [['id', 'DESC']],
      limit: 5
    });

    console.log('📊 Employés existants:');
    existingEmployees.forEach(emp => {
      console.log(`  - ${emp.matricule}: ${emp.firstName} ${emp.lastName}`);
    });

    // Simuler la création d'un nouvel employé
    const testEmployeeData = {
      firstName: 'Test',
      lastName: 'Employé',
      email: `test.employe.${Date.now()}@example.com`,
      phone: '0123456789',
      address: '123 Rue Test, 75000 Paris',
      birthDate: new Date('1990-01-01'),
      hireDate: new Date(),
      status: 'actif',
      employeeType: 'permanent',
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
      emergencyContactName: 'Contact Test',
      emergencyContactPhone: '0987654321',
      emergencyContactRelationship: 'Parent'
    };

    // Trouver le dernier employé pour prédire le prochain matricule
    const lastEmployee = await Employee.findOne({
      order: [['id', 'DESC']]
    });

    let expectedMatricule = 'EMP001';
    if (lastEmployee && lastEmployee.matricule) {
      const lastNumber = parseInt(lastEmployee.matricule.replace('EMP', ''));
      expectedMatricule = `EMP${String(lastNumber + 1).padStart(3, '0')}`;
    }

    console.log(`🔮 Prochain matricule attendu: ${expectedMatricule}`);

    // Créer l'employé de test
    const newEmployee = await Employee.create(testEmployeeData);
    console.log(`✅ Employé créé avec succès:`);
    console.log(`   - ID: ${newEmployee.id}`);
    console.log(`   - Matricule: ${newEmployee.matricule}`);
    console.log(`   - Nom: ${newEmployee.firstName} ${newEmployee.lastName}`);
    console.log(`   - Email: ${newEmployee.email}`);

    // Vérifier que le matricule est correct
    if (newEmployee.matricule === expectedMatricule) {
      console.log('✅ Matricule généré correctement !');
    } else {
      console.log(`❌ Erreur: matricule attendu ${expectedMatricule}, obtenu ${newEmployee.matricule}`);
    }

    // Nettoyer - supprimer l'employé de test
    await newEmployee.destroy();
    console.log('🧹 Employé de test supprimé');

    console.log('🎉 Test terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

testEmployeeCreation(); 