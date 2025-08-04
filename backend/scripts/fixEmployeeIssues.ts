import { sequelize } from '../src/models/sequelize';

async function fixEmployeeIssues() {
  try {
    console.log('🔧 Début de la correction des problèmes employés...');

    // 1. Vérifier et corriger les contraintes de clé étrangère managerId
    console.log('🔍 Vérification des contraintes managerId...');
    
    // Récupérer tous les employés avec un managerId invalide
    const employeesWithInvalidManager = await sequelize.query(`
      SELECT e1.id, e1.firstName, e1.lastName, e1.managerId
      FROM employees e1
      LEFT JOIN employees e2 ON e1.managerId = e2.id
      WHERE e1.managerId IS NOT NULL AND e2.id IS NULL
    `);

    if ((employeesWithInvalidManager[0] as any[]).length > 0) {
      console.log(`⚠️ ${(employeesWithInvalidManager[0] as any[]).length} employés avec un managerId invalide trouvés`);
      
      for (const emp of employeesWithInvalidManager[0] as any[]) {
        console.log(`  - ${emp.firstName} ${emp.lastName} (ID: ${emp.id}) a un managerId invalide: ${emp.managerId}`);
        
        // Mettre à jour pour mettre managerId à NULL
        await sequelize.query(`
          UPDATE employees 
          SET managerId = NULL 
          WHERE id = ${emp.id}
        `);
        console.log(`    ✅ managerId mis à NULL pour ${emp.firstName} ${emp.lastName}`);
      }
    } else {
      console.log('✅ Aucun employé avec managerId invalide trouvé');
    }

    // 2. Vérifier que la colonne matricule existe et a des valeurs
    console.log('🔍 Vérification de la colonne matricule...');
    
    const [matriculeCheck] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'my_rh_app' 
      AND TABLE_NAME = 'employees' 
      AND COLUMN_NAME = 'matricule'
    `);

    if ((matriculeCheck as any[]).length === 0) {
      console.log('❌ Colonne matricule manquante, ajout...');
      await sequelize.query(`
        ALTER TABLE employees 
        ADD COLUMN matricule VARCHAR(255) NULL
      `);
      console.log('✅ Colonne matricule ajoutée');
    } else {
      console.log('✅ Colonne matricule existe');
    }

    // Générer des matricules pour les employés qui n'en ont pas
    const employeesWithoutMatricule = await sequelize.query(`
      SELECT id, firstName, lastName 
      FROM employees 
      WHERE matricule IS NULL 
      ORDER BY id ASC
    `);

    if ((employeesWithoutMatricule[0] as any[]).length > 0) {
      console.log(`📝 Génération de matricules pour ${(employeesWithoutMatricule[0] as any[]).length} employés...`);
      
      // Trouver le dernier matricule existant
      const lastMatriculeResult = await sequelize.query(`
        SELECT matricule 
        FROM employees 
        WHERE matricule IS NOT NULL 
        ORDER BY id DESC 
        LIMIT 1
      `);

      let nextNumber = 1;
      if ((lastMatriculeResult[0] as any[]).length > 0) {
        const lastMatricule = (lastMatriculeResult[0] as any[])[0].matricule;
        const lastNumber = parseInt(lastMatricule.replace('EMP', ''));
        nextNumber = lastNumber + 1;
      }

      for (const employee of employeesWithoutMatricule[0] as any[]) {
        const matricule = `EMP${String(nextNumber).padStart(3, '0')}`;
        await sequelize.query(`
          UPDATE employees 
          SET matricule = '${matricule}' 
          WHERE id = ${employee.id}
        `);
        console.log(`  ✅ ${matricule} attribué à ${employee.firstName} ${employee.lastName}`);
        nextNumber++;
      }
    } else {
      console.log('✅ Tous les employés ont déjà un matricule');
    }

    // 3. Ajouter la contrainte UNIQUE et NOT NULL sur matricule si pas déjà fait
    console.log('🔒 Vérification des contraintes matricule...');
    
    const [uniqueCheck] = await sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_SCHEMA = 'my_rh_app' 
      AND TABLE_NAME = 'employees' 
      AND CONSTRAINT_NAME = 'unique_matricule'
    `);

    if ((uniqueCheck as any[]).length === 0) {
      console.log('🔒 Ajout de la contrainte UNIQUE sur matricule...');
      await sequelize.query(`
        ALTER TABLE employees 
        MODIFY COLUMN matricule VARCHAR(255) NOT NULL,
        ADD UNIQUE KEY unique_matricule (matricule)
      `);
      console.log('✅ Contrainte UNIQUE ajoutée');
    } else {
      console.log('✅ Contrainte UNIQUE existe déjà');
    }

    // 4. Vérifier que tous les champs requis existent
    console.log('🔍 Vérification des champs requis...');
    
    const requiredFields = [
      'salary', 'city', 'postalCode', 'country', 
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship'
    ];

    for (const field of requiredFields) {
      const [fieldCheck] = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'my_rh_app' 
        AND TABLE_NAME = 'employees' 
        AND COLUMN_NAME = '${field}'
      `);

      if ((fieldCheck as any[]).length === 0) {
        console.log(`❌ Champ ${field} manquant, ajout...`);
        // Ajouter le champ selon son type
        let sqlType = 'VARCHAR(255)';
        if (field === 'salary') sqlType = 'DECIMAL(10,2)';
        if (field === 'postalCode') sqlType = 'VARCHAR(20)';
        if (field === 'country') sqlType = 'VARCHAR(100)';
        if (field === 'emergencyContactPhone') sqlType = 'VARCHAR(50)';
        if (field === 'emergencyContactRelationship') sqlType = 'VARCHAR(100)';
        
        await sequelize.query(`
          ALTER TABLE employees 
          ADD COLUMN ${field} ${sqlType} DEFAULT NULL
        `);
        console.log(`✅ Champ ${field} ajouté`);
      } else {
        console.log(`✅ Champ ${field} existe`);
      }
    }

    console.log('🎉 Tous les problèmes ont été corrigés avec succès !');
    
    // Afficher un résumé
    const [totalResult] = await sequelize.query('SELECT COUNT(*) as total FROM employees');
    const totalEmployees = (totalResult as any[])[0].total;
    console.log(`📊 Résumé: ${totalEmployees} employés dans la base de données`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await sequelize.close();
  }
}

fixEmployeeIssues(); 