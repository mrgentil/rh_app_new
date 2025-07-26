import { sequelize } from '../models/sequelize';

async function checkTables() {
  try {
    console.log('🔍 Vérification des tables créées...');
    
    // Lister toutes les tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📊 Tables existantes :');
    tables.forEach((table: any) => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
    // Vérifier les tables manquantes
    const expectedTables = [
      'employees', 'job_titles', 'departments', 'contracts',
      'job_offers', 'candidates', 'applications', 'trainings',
      'employee_trainings', 'leave_types', 'leaves', 'payrolls',
      'messages', 'announcements', 'roles', 'users', 'documents',
      'notifications', 'audit_logs', 'invoices'
    ];
    
    const existingTables = tables.map((table: any) => Object.values(table)[0]);
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('\n❌ Tables manquantes :');
      missingTables.forEach(table => console.log(`- ${table}`));
    } else {
      console.log('\n✅ Toutes les tables attendues sont présentes !');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await sequelize.close();
  }
}

checkTables(); 