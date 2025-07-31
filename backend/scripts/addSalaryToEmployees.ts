import { sequelize } from '../src/models/sequelize';

async function addSalaryToEmployees() {
  try {
    console.log('🔧 Ajout du champ salary à la table employees...');
    
    // Ajouter la colonne salary
    await sequelize.query(`
      ALTER TABLE employees 
      ADD COLUMN salary DECIMAL(10, 2) NULL 
      COMMENT 'Salaire brut annuel en euros'
    `);
    
    console.log('✅ Champ salary ajouté avec succès !');
    
    // Vérifier que la colonne a été ajoutée
    const [results] = await sequelize.query(`
      DESCRIBE employees
    `);
    
    const hasSalaryColumn = (results as any[]).some((column: any) => column.Field === 'salary');
    
    if (hasSalaryColumn) {
      console.log('✅ Vérification : la colonne salary existe bien');
    } else {
      console.log('❌ Erreur : la colonne salary n\'a pas été ajoutée');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout du champ salary:', error);
    process.exit(1);
  }
}

addSalaryToEmployees(); 