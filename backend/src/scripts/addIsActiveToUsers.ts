import { sequelize } from '../models/sequelize';

async function addIsActiveToUsers() {
  try {
    console.log('🔧 Ajout du champ isActive à la table users...');
    
    // Vérifier si la colonne existe déjà
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'isActive'
    `);
    
    if ((results as any[]).length > 0) {
      console.log('ℹ️ La colonne isActive existe déjà dans la table users');
      return;
    }
    
    // Ajouter la colonne isActive
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN isActive BOOLEAN DEFAULT TRUE
    `);
    
    console.log('✅ Colonne isActive ajoutée avec succès à la table users');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la colonne isActive:', error);
  } finally {
    await sequelize.close();
  }
}

addIsActiveToUsers(); 