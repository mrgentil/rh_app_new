import { sequelize } from '../src/models/sequelize';
import { Team, Objective, Project, PerformanceReview } from '../src/models';

async function createManagerTables() {
  try {
    console.log('🔄 Création des tables de gestion d\'équipe...');

    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: true });

    console.log('✅ Tables créées avec succès !');

    // Ajouter le champ teamId à la table employees si nécessaire
    try {
      await sequelize.query(`
        ALTER TABLE employees 
        ADD COLUMN teamId INT UNSIGNED NULL,
        ADD CONSTRAINT fk_employees_team 
        FOREIGN KEY (teamId) REFERENCES teams(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('✅ Champ teamId ajouté à la table employees');
    } catch (error: any) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Champ teamId déjà présent dans la table employees');
      } else {
        console.error('❌ Erreur lors de l\'ajout du champ teamId:', error.message);
      }
    }

    console.log('🎉 Toutes les tables de gestion d\'équipe sont prêtes !');
    
    // Afficher les tables créées
    const tables = await sequelize.showAllSchemas({});
    console.log('📋 Tables disponibles:', tables.map((t: any) => t.name));

  } catch (error: any) {
    console.error('❌ Erreur lors de la création des tables:', error.message);
  } finally {
    await sequelize.close();
  }
}

createManagerTables(); 