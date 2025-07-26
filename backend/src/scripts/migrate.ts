import { sequelize } from '../models/sequelize';

// Importer tous les modèles pour qu'ils soient enregistrés
import '../models';

async function migrate() {
  try {
    console.log('🔄 Début de la migration...');
    
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');
    
    // Synchroniser tous les modèles avec la base de données
    console.log('📝 Création des tables...');
    await sequelize.sync({ force: true });
    
    console.log('✅ Migration terminée avec succès !');
    
    // Vérifier les tables créées
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📊 Tables créées :');
    tables.forEach((table: any) => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await sequelize.close();
  }
}

migrate(); 