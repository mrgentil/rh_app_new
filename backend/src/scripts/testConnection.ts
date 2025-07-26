import { sequelize } from '../models/sequelize';

async function testConnection() {
  try {
    console.log('🔌 Test de connexion à la base de données...');
    
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');
    
    // Vérifier si la base existe
    const [results] = await sequelize.query('SHOW DATABASES LIKE "my_rh_app"');
    if (results.length > 0) {
      console.log('✅ Base de données "my_rh_app" existe');
    } else {
      console.log('❌ Base de données "my_rh_app" n\'existe pas');
      console.log('📝 Création de la base de données...');
      await sequelize.query('CREATE DATABASE IF NOT EXISTS my_rh_app');
      console.log('✅ Base de données créée !');
    }
    
    // Lister les tables existantes
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📊 Tables existantes :', tables);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection(); 