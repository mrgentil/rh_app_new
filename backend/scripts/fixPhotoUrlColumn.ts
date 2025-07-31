import { sequelize } from '../src/models/sequelize';

async function fixPhotoUrlColumn() {
  try {
    console.log('🔧 Correction de la colonne photoUrl...\n');

    // Vérifier la taille actuelle de la colonne
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'photoUrl'
    `);
    
    console.log('📋 Taille actuelle de la colonne photoUrl:');
    console.log(results);

    // Modifier la colonne pour accepter des URLs plus longues
    await sequelize.query(`
      ALTER TABLE users 
      MODIFY COLUMN photoUrl VARCHAR(10000)
    `);

    console.log('✅ Colonne photoUrl modifiée avec succès !');

    // Vérifier la nouvelle taille
    const [newResults] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'photoUrl'
    `);
    
    console.log('📋 Nouvelle taille de la colonne photoUrl:');
    console.log(newResults);

    console.log('\n✅ Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await sequelize.close();
  }
}

fixPhotoUrlColumn(); 