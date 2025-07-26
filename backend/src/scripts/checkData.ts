import { sequelize } from '../models/sequelize';
import { Role, Department, JobTitle, LeaveType } from '../models';

async function checkData() {
  try {
    console.log('🔍 Vérification des données insérées...\n');
    
    // Vérifier les rôles
    const roles = await Role.findAll();
    console.log('👥 Rôles créés :');
    roles.forEach(role => {
      console.log(`- ${role.name} (${role.permissions})`);
    });
    
    console.log('\n🏢 Départements créés :');
    const departments = await Department.findAll();
    departments.forEach(dept => {
      console.log(`- ${dept.name}: ${dept.description}`);
    });
    
    console.log('\n💼 Postes créés :');
    const jobTitles = await JobTitle.findAll();
    jobTitles.forEach(job => {
      console.log(`- ${job.title}: ${job.description}`);
    });
    
    console.log('\n🏖️ Types de congés créés :');
    const leaveTypes = await LeaveType.findAll();
    leaveTypes.forEach(leaveType => {
      console.log(`- ${leaveType.name}: ${leaveType.description}`);
    });
    
    console.log('\n✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await sequelize.close();
  }
}

checkData(); 