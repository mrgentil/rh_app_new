import { sequelize } from '../src/models/sequelize';

async function addPhotoAndSalaryToUsers() {
  try {
    console.log('🔧 Ajout des champs photoUrl et salary à la table users...');
    
    // Ajouter la colonne photoUrl
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN photoUrl VARCHAR(500) NULL 
      COMMENT 'URL de la photo de profil'
    `);
    
    // Ajouter la colonne salary
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN salary DECIMAL(10, 2) NULL 
      COMMENT 'Salaire brut annuel en euros'
    `);
    
    console.log('✅ Champs photoUrl et salary ajoutés avec succès !');
    
    // Vérifier que les colonnes ont été ajoutées
    const [results] = await sequelize.query(`
      DESCRIBE users
    `);
    
    const hasPhotoUrlColumn = (results as any[]).some((column: any) => column.Field === 'photoUrl');
    const hasSalaryColumn = (results as any[]).some((column: any) => column.Field === 'salary');
    
    if (hasPhotoUrlColumn && hasSalaryColumn) {
      console.log('✅ Vérification : les colonnes photoUrl et salary existent bien');
    } else {
      console.log('❌ Erreur : certaines colonnes n\'ont pas été ajoutées');
      console.log('photoUrl:', hasPhotoUrlColumn);
      console.log('salary:', hasSalaryColumn);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des champs:', error);
    process.exit(1);
  }
}

addPhotoAndSalaryToUsers(); 