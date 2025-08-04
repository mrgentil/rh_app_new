import { sequelize } from '../src/models/sequelize';

async function fixPhotoUrlColumn() {
  try {
    console.log('🔄 Correction de la colonne photoUrl...');

    // Modifier la colonne photoUrl pour accepter des données plus longues
    await sequelize.query(`
      ALTER TABLE employees 
      MODIFY COLUMN photoUrl TEXT
    `);

    console.log('✅ Colonne photoUrl corrigée avec succès !');

    // Vérifier la structure de la table
    const [results] = await sequelize.query(`
      DESCRIBE employees
    `);
    
    console.log('📋 Structure de la table employees:');
    (results as any[]).forEach((column: any) => {
      if (column.Field === 'photoUrl') {
        console.log(`   - ${column.Field}: ${column.Type}`);
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur lors de la correction:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixPhotoUrlColumn(); 