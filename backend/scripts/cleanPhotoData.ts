import { sequelize } from '../src/models/sequelize';

async function cleanPhotoData() {
  try {
    console.log('🧹 Nettoyage des données photoUrl...');

    // Vérifier d'abord la structure de la table
    const [results] = await sequelize.query(`
      DESCRIBE employees
    `);
    
    console.log('📋 Structure actuelle de la table employees:');
    (results as any[]).forEach((column: any) => {
      if (column.Field === 'photoUrl') {
        console.log(`   - ${column.Field}: ${column.Type}`);
      }
    });

    // Modifier la colonne photoUrl pour accepter des données plus longues
    await sequelize.query(`
      ALTER TABLE employees 
      MODIFY COLUMN photoUrl LONGTEXT
    `);

    console.log('✅ Colonne photoUrl modifiée en LONGTEXT');

    // Nettoyer les données photoUrl trop longues ou problématiques
    await sequelize.query(`
      UPDATE employees 
      SET photoUrl = NULL 
      WHERE LENGTH(photoUrl) > 1000
    `);

    console.log('✅ Données photoUrl trop longues nettoyées');

    // Vérifier la nouvelle structure
    const [newResults] = await sequelize.query(`
      DESCRIBE employees
    `);
    
    console.log('📋 Nouvelle structure de la table employees:');
    (newResults as any[]).forEach((column: any) => {
      if (column.Field === 'photoUrl') {
        console.log(`   - ${column.Field}: ${column.Type}`);
      }
    });

    console.log('🎉 Nettoyage terminé avec succès !');

  } catch (error: any) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
  } finally {
    await sequelize.close();
  }
}

cleanPhotoData(); 