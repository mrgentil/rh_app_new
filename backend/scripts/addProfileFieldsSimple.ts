import { sequelize } from '../src/models/sequelize';

async function addProfileFieldsSimple() {
  try {
    console.log('🔧 Ajout des champs manquants pour le profil utilisateur...');

    // Ajouter les colonnes manquantes à la table employees
    try {
      await sequelize.query(`ALTER TABLE employees ADD COLUMN city VARCHAR(100) NULL`);
    } catch (e) { console.log('Colonne city existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE employees ADD COLUMN postalCode VARCHAR(20) NULL`);
    } catch (e) { console.log('Colonne postalCode existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE employees ADD COLUMN country VARCHAR(100) NULL DEFAULT 'France'`);
    } catch (e) { console.log('Colonne country existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE employees ADD COLUMN emergencyContactName VARCHAR(255) NULL`);
    } catch (e) { console.log('Colonne emergencyContactName existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE employees ADD COLUMN emergencyContactPhone VARCHAR(50) NULL`);
    } catch (e) { console.log('Colonne emergencyContactPhone existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE employees ADD COLUMN emergencyContactRelationship VARCHAR(100) NULL`);
    } catch (e) { console.log('Colonne emergencyContactRelationship existe déjà'); }

    console.log('✅ Colonnes ajoutées à la table employees');

    // Ajouter les colonnes manquantes à la table users
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN firstName VARCHAR(100) NULL`);
    } catch (e) { console.log('Colonne firstName existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN lastName VARCHAR(100) NULL`);
    } catch (e) { console.log('Colonne lastName existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL`);
    } catch (e) { console.log('Colonne phone existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN address TEXT NULL`);
    } catch (e) { console.log('Colonne address existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL`);
    } catch (e) { console.log('Colonne city existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN postalCode VARCHAR(20) NULL`);
    } catch (e) { console.log('Colonne postalCode existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN country VARCHAR(100) NULL DEFAULT 'France'`);
    } catch (e) { console.log('Colonne country existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN emergencyContactName VARCHAR(255) NULL`);
    } catch (e) { console.log('Colonne emergencyContactName existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN emergencyContactPhone VARCHAR(50) NULL`);
    } catch (e) { console.log('Colonne emergencyContactPhone existe déjà'); }
    
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN emergencyContactRelationship VARCHAR(100) NULL`);
    } catch (e) { console.log('Colonne emergencyContactRelationship existe déjà'); }

    console.log('✅ Colonnes ajoutées à la table users');

    // Mettre à jour les données existantes
    console.log('🔄 Mise à jour des données existantes...');

    // Copier les données des employés vers les utilisateurs
    await sequelize.query(`
      UPDATE users u
      INNER JOIN employees e ON u.employeeId = e.id
      SET 
        u.firstName = e.firstName,
        u.lastName = e.lastName,
        u.email = e.email,
        u.phone = e.phone,
        u.address = e.address,
        u.photoUrl = COALESCE(e.photoUrl, u.photoUrl),
        u.salary = COALESCE(e.salary, u.salary)
      WHERE u.employeeId IS NOT NULL
    `);

    console.log('✅ Données copiées des employés vers les utilisateurs');

    // Ajouter des contacts d'urgence par défaut
    await sequelize.query(`
      UPDATE employees 
      SET 
        emergencyContactName = 'Contact d''urgence',
        emergencyContactPhone = '+33 1 23 45 67 89',
        emergencyContactRelationship = 'Famille'
      WHERE emergencyContactName IS NULL
    `);

    await sequelize.query(`
      UPDATE users 
      SET 
        emergencyContactName = 'Contact d''urgence',
        emergencyContactPhone = '+33 1 23 45 67 89',
        emergencyContactRelationship = 'Famille'
      WHERE emergencyContactName IS NULL
    `);

    console.log('✅ Contacts d\'urgence ajoutés par défaut');

    // Créer une vue pour faciliter l'accès aux données de profil
    await sequelize.query(`
      CREATE OR REPLACE VIEW user_profiles AS
      SELECT 
        u.id as userId,
        u.username,
        u.email,
        u.firstName,
        u.lastName,
        u.phone,
        u.address,
        u.city,
        u.postalCode,
        u.country,
        u.photoUrl,
        u.salary,
        u.emergencyContactName,
        u.emergencyContactPhone,
        u.emergencyContactRelationship,
        u.createdAt as userCreatedAt,
        u.updatedAt as userUpdatedAt,
        e.id as employeeId,
        e.birthDate,
        e.hireDate,
        e.status as employeeStatus,
        e.employeeType,
        e.contractEndDate,
        d.name as departmentName,
        jt.title as jobTitle,
        r.name as roleName,
        r.permissions as rolePermissions
      FROM users u
      LEFT JOIN employees e ON u.employeeId = e.id
      LEFT JOIN departments d ON e.departmentId = d.id
      LEFT JOIN job_titles jt ON e.jobTitleId = jt.id
      LEFT JOIN roles r ON u.roleId = r.id
    `);

    console.log('✅ Vue user_profiles créée');

    console.log('🎉 Migration terminée avec succès !');
    console.log('\n📋 Champs ajoutés :');
    console.log('   - city, postalCode, country');
    console.log('   - emergencyContactName, emergencyContactPhone, emergencyContactRelationship');
    console.log('   - firstName, lastName, phone, address (dans users)');
    console.log('\n🔍 Vue créée : user_profiles');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await sequelize.close();
  }
}

addProfileFieldsSimple(); 