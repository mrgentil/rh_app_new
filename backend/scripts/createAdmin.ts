import { User, Role, Employee } from '../src/models';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    console.log('🔧 Création d\'un utilisateur administrateur...');
    
    // Vérifier si le rôle Admin existe
    let adminRole = await Role.findOne({ where: { name: 'Administrateur' } });
    if (!adminRole) {
      console.log('⚠️  Rôle Administrateur non trouvé, création...');
      adminRole = await Role.create({
        name: 'Administrateur',
        permissions: JSON.stringify(['all'])
      });
      console.log('✅ Rôle Administrateur créé');
    } else {
      console.log('✅ Rôle Administrateur trouvé');
    }
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ 
      where: { username: 'admin' }
    });
    
    if (existingAdmin) {
      console.log('⚠️  Utilisateur admin existe déjà');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Mot de passe: admin123');
      return;
    }
    
    // Créer l'employé admin
    const adminEmployee = await Employee.create({
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@example.com',
      phone: '0123456789',
      status: 'actif',
      birthDate: new Date('1990-01-01'),
      hireDate: new Date()
    });
    
    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole.id,
      employeeId: adminEmployee.id,
      isActive: true
    });
    
    console.log('🎉 Utilisateur administrateur créé avec succès!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Mot de passe: admin123');
    console.log('🆔 ID: ' + adminUser.id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
}

createAdmin(); 