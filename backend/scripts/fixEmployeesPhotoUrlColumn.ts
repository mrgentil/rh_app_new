import { sequelize } from '../src/models/sequelize';
import dotenv from 'dotenv';

dotenv.config();

async function fixEmployeesPhotoUrlColumn() {
  try {
    console.log('🔧 Correction de la colonne photoUrl dans la table employees...');
    
    // Vérifier si la colonne existe
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'employees' AND COLUMN_NAME = 'photoUrl'
    `);
    
    if (results.length === 0) {
      console.log('❌ La colonne photoUrl n\'existe pas dans la table employees');
      return;
    }
    
    const column = results[0] as any;
    console.log(`📋 Colonne actuelle: ${column.COLUMN_NAME} - ${column.DATA_TYPE}(${column.CHARACTER_MAXIMUM_LENGTH})`);
    
    // Modifier la colonne pour augmenter sa taille
    await sequelize.query(`
      ALTER TABLE employees 
      MODIFY COLUMN photoUrl TEXT
    `);
    
    console.log('✅ Colonne photoUrl modifiée avec succès !');
    
    // Vérifier la modification
    const [newResults] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'employees' AND COLUMN_NAME = 'photoUrl'
    `);
    
    const newColumn = newResults[0] as any;
    console.log(`📋 Nouvelle colonne: ${newColumn.COLUMN_NAME} - ${newColumn.DATA_TYPE}(${newColumn.CHARACTER_MAXIMUM_LENGTH})`);
    
    console.log('✅ Vérification : la colonne photoUrl a été modifiée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors de la modification de la colonne photoUrl:', error);
  } finally {
    await sequelize.close();
  }
}

fixEmployeesPhotoUrlColumn(); 