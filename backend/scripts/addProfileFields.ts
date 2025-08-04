import { sequelize } from '../src/models/sequelize';
import { User } from '../src/models/User';
import { Employee } from '../src/models/Employee';
import { Department } from '../src/models/Department';
import { JobTitle } from '../src/models/JobTitle';
import { Role } from '../src/models/Role';

async function addProfileFields() {
  try {
    console.log('🔧 Ajout des champs manquants pour le profil utilisateur...');

    // Ajouter les colonnes manquantes à la table employees
    await sequelize.query(`
      ALTER TABLE employees 
      ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL,
      ADD COLUMN IF NOT EXISTS postalCode VARCHAR(20) NULL,
      ADD COLUMN IF NOT EXISTS country VARCHAR(100) NULL DEFAULT 'France',
      ADD COLUMN IF NOT EXISTS emergencyContactName VARCHAR(255) NULL,
      ADD COLUMN IF NOT EXISTS emergencyContactPhone VARCHAR(50) NULL,
      ADD COLUMN IF NOT EXISTS emergencyContactRelationship VARCHAR(100) NULL
    `);

    console.log('✅ Colonnes ajoutées à la table employees');

    // Ajouter les colonnes manquantes à la table users
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS firstName VARCHAR(100) NULL,
      ADD COLUMN IF NOT EXISTS lastName VARCHAR(100) NULL,
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL,
      ADD COLUMN IF NOT EXISTS address TEXT NULL,
      ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL,
      ADD COLUMN IF NOT EXISTS postalCode VARCHAR(20) NULL,
      ADD COLUMN IF NOT EXISTS country VARCHAR(100) NULL DEFAULT 'France',
      ADD COLUMN IF NOT EXISTS emergencyContactName VARCHAR(255) NULL,
      ADD COLUMN IF NOT EXISTS emergencyContactPhone VARCHAR(50) NULL,
      ADD COLUMN IF NOT EXISTS emergencyContactRelationship VARCHAR(100) NULL
    `);

    console.log('✅ Colonnes ajoutées à la table users');

    // Mettre à jour les données existantes
    console.log('🔄 Mise à jour des données existantes...');

    // Récupérer tous les utilisateurs
    const users = await User.findAll();

    for (const user of users) {
      if (user.employeeId) {
        // Récupérer l'employé associé
        const employee = await Employee.findByPk(user.employeeId);
        
        if (employee) {
          // Mettre à jour les informations utilisateur avec les données de l'employé
          await user.update({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            address: employee.address,
            photoUrl: employee.photoUrl || user.photoUrl,
            salary: employee.salary || user.salary
          });

          // Mettre à jour les informations d'urgence si elles n'existent pas
          if (!employee.emergencyContactName) {
            await sequelize.query(`
              UPDATE employees 
              SET emergencyContactName = 'Contact d\'urgence',
                  emergencyContactPhone = '+33 1 23 45 67 89',
                  emergencyContactRelationship = 'Famille'
              WHERE id = ?
            `, {
              replacements: [employee.id]
            });
          }
        }
      }
    }

    console.log('✅ Données mises à jour');

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

addProfileFields(); 