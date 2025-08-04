import { sequelize } from '../src/models/sequelize';
import { Employee } from '../src/models/Employee';

async function addMatriculeToEmployees() {
  try {
    console.log('🔄 Début de l\'ajout du champ matricule...');

    // Vérifier si la colonne matricule existe déjà
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'my_rh_app' 
      AND TABLE_NAME = 'employees' 
      AND COLUMN_NAME = 'matricule'
    `);

    if ((results as any[]).length === 0) {
      console.log('📝 Ajout de la colonne matricule...');
      
      // D'abord, ajouter la colonne sans contrainte UNIQUE
      await sequelize.query(`
        ALTER TABLE employees 
        ADD COLUMN matricule VARCHAR(255) NULL
      `);
      console.log('✅ Colonne matricule ajoutée sans contrainte UNIQUE');
    } else {
      console.log('ℹ️ La colonne matricule existe déjà');
    }

    // Générer des matricules pour les employés existants
    const employees = await Employee.findAll({
      order: [['id', 'ASC']]
    });
    console.log(`📊 ${employees.length} employés trouvés`);

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const matricule = `EMP${String(i + 1).padStart(3, '0')}`;
      
      await employee.update({ matricule });
      console.log(`✅ Matricule ${matricule} attribué à ${employee.firstName} ${employee.lastName}`);
    }

    // Maintenant, ajouter la contrainte UNIQUE et NOT NULL
    console.log('🔒 Ajout de la contrainte UNIQUE et NOT NULL...');
    await sequelize.query(`
      ALTER TABLE employees 
      MODIFY COLUMN matricule VARCHAR(255) NOT NULL,
      ADD UNIQUE KEY unique_matricule (matricule)
    `);
    console.log('✅ Contrainte UNIQUE et NOT NULL ajoutée');

    console.log('🎉 Processus terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout du matricule:', error);
  } finally {
    await sequelize.close();
  }
}

addMatriculeToEmployees(); 