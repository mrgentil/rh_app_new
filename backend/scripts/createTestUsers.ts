import bcrypt from 'bcryptjs';
import { User, Employee, Role } from '../src/models';

async function createTestUsers() {
  try {
    console.log('🧪 Création d\'utilisateurs de test pour chaque rôle...');

    // Vérifier que les rôles existent
    const roles = await Role.findAll();
    console.log('📊 Rôles disponibles:', roles.map((r: any) => `${r.name} (ID: ${r.id})`));

    // Créer des employés et utilisateurs pour chaque rôle
    const testUsers = [
      {
        username: 'rh_user',
        email: 'rh@rh-app.com',
        password: 'rh123',
        roleId: 2, // RH
        firstName: 'Marie',
        lastName: 'Dupont',
        phone: '0123456789',
        departmentId: 1, // Ressources Humaines
        jobTitleId: 1, // Directeur RH
        status: 'actif'
      },
      {
        username: 'manager_user',
        email: 'manager@rh-app.com',
        password: 'manager123',
        roleId: 3, // Manager
        firstName: 'Jean',
        lastName: 'Martin',
        phone: '0123456790',
        departmentId: 2, // IT
        jobTitleId: 2, // Chef de projet
        status: 'actif'
      },
      {
        username: 'comptable_user',
        email: 'comptable@rh-app.com',
        password: 'comptable123',
        roleId: 4, // Comptable
        firstName: 'Sophie',
        lastName: 'Bernard',
        phone: '0123456791',
        departmentId: 3, // Comptabilité
        jobTitleId: 3, // Comptable
        status: 'actif'
      },
      {
        username: 'employee_user',
        email: 'employee@rh-app.com',
        password: 'employee123',
        roleId: 5, // Employé
        firstName: 'Pierre',
        lastName: 'Durand',
        phone: '0123456792',
        departmentId: 2, // IT
        jobTitleId: 4, // Développeur
        status: 'actif'
      },
      {
        username: 'stagiaire_user',
        email: 'stagiaire@rh-app.com',
        password: 'stagiaire123',
        roleId: 6, // Stagiaire
        firstName: 'Emma',
        lastName: 'Leroy',
        phone: '0123456793',
        departmentId: 2, // IT
        jobTitleId: 5, // Stagiaire
        status: 'actif'
      }
    ];

    for (const userData of testUsers) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({
          where: { username: userData.username }
        });

        if (existingUser) {
          console.log(`⚠️ L'utilisateur ${userData.username} existe déjà`);
          continue;
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Créer l'employé
        const employee = await Employee.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          departmentId: userData.departmentId,
          jobTitleId: userData.jobTitleId,
          status: userData.status,
          hireDate: new Date(),
          employeeType: 'permanent'
        });

        // Créer l'utilisateur
        const user = await User.create({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          roleId: userData.roleId,
          employeeId: employee.id,
          isActive: true,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone
        });

        console.log(`✅ Utilisateur ${userData.username} créé avec succès (Rôle: ${roles.find((r: any) => r.id === userData.roleId)?.name})`);
        console.log(`   - Email: ${userData.email}`);
        console.log(`   - Mot de passe: ${userData.password}`);

      } catch (error) {
        console.error(`❌ Erreur lors de la création de ${userData.username}:`, error);
      }
    }

    console.log('\n🎉 Création des utilisateurs de test terminée !');
    console.log('\n📋 Identifiants de connexion :');
    console.log('   - RH: rh_user / rh123');
    console.log('   - Manager: manager_user / manager123');
    console.log('   - Comptable: comptable_user / comptable123');
    console.log('   - Employé: employee_user / employee123');
    console.log('   - Stagiaire: stagiaire_user / stagiaire123');

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
  }
}

createTestUsers(); 