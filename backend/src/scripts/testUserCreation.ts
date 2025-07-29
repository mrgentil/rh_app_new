import { userService } from '../services/userService';

async function testUserCreation() {
  try {
    console.log('🧪 Test de création d\'utilisateur avec informations employé...');
    
    // Test 1: Créer un utilisateur avec informations employé complètes
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0123456789',
      roleId: 1, // Admin
      departmentId: 1, // Ressources Humaines
      jobTitleId: 1, // Directeur RH
      address: '123 Rue de la Paix, 75001 Paris',
      birthDate: '1990-01-15',
      hireDate: '2023-01-01',
      status: 'actif'
    };

    console.log('📝 Création de l\'utilisateur...');
    const createdUser = await userService.createUser(userData);
    
    console.log('✅ Utilisateur créé avec succès !');
    console.log('📊 Détails de l\'utilisateur :');
    console.log(`- ID: ${createdUser.id}`);
    console.log(`- Username: ${createdUser.username}`);
    console.log(`- Email: ${createdUser.email}`);
    console.log(`- Rôle: ${createdUser.roleName}`);
    console.log(`- Statut: ${createdUser.isActive ? 'Actif' : 'Inactif'}`);
    
    if (createdUser.employee) {
      console.log('👤 Informations employé :');
      console.log(`- Nom complet: ${createdUser.employee.firstName} ${createdUser.employee.lastName}`);
      console.log(`- Téléphone: ${createdUser.employee.phone || 'Non défini'}`);
      console.log(`- Adresse: ${createdUser.employee.address || 'Non définie'}`);
      console.log(`- Date de naissance: ${createdUser.employee.birthDate || 'Non définie'}`);
      console.log(`- Date d'embauche: ${createdUser.employee.hireDate || 'Non définie'}`);
      console.log(`- Statut employé: ${createdUser.employee.status}`);
    } else {
      console.log('⚠️ Aucune information employé trouvée');
    }

    // Test 2: Récupérer l'utilisateur par ID
    console.log('\n🔍 Récupération de l\'utilisateur par ID...');
    const retrievedUser = await userService.getUserById(createdUser.id);
    
    if (retrievedUser) {
      console.log('✅ Utilisateur récupéré avec succès !');
      console.log(`- Username: ${retrievedUser.username}`);
      console.log(`- Email: ${retrievedUser.email}`);
      
      if (retrievedUser.employee) {
        console.log('👤 Informations employé récupérées :');
        console.log(`- Nom complet: ${retrievedUser.employee.firstName} ${retrievedUser.employee.lastName}`);
        console.log(`- Téléphone: ${retrievedUser.employee.phone || 'Non défini'}`);
        console.log(`- Adresse: ${retrievedUser.employee.address || 'Non définie'}`);
      }
    } else {
      console.log('❌ Erreur: Utilisateur non trouvé');
    }

    // Test 3: Récupérer tous les utilisateurs
    console.log('\n📋 Récupération de tous les utilisateurs...');
    const allUsers = await userService.getAllUsers();
    console.log(`✅ ${allUsers.length} utilisateurs récupérés`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.roleName}`);
      if (user.employee) {
        console.log(`   👤 ${user.employee.firstName} ${user.employee.lastName}`);
      }
    });

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testUserCreation(); 