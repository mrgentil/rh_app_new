import axios from 'axios';

async function testEmployeeCreationAPI() {
  try {
    console.log('🧪 Test de création d\'employé via l\'API...');

    // D'abord, se connecter pour obtenir un token
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie, token obtenu');

    // Données de test pour un nouvel employé
    const testEmployeeData = {
      firstName: 'Test',
      lastName: 'API',
      email: `test.api.${Date.now()}@example.com`,
      phone: '0123456789',
      address: '123 Rue Test API, 75000 Paris',
      birthDate: '1990-01-01',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'actif',
      employeeType: 'permanent',
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
      emergencyContactName: 'Contact Test API',
      emergencyContactPhone: '0987654321',
      emergencyContactRelationship: 'Parent',
      salary: 45000,
      roleId: 2 // Rôle Employé
    };

    console.log('📤 Envoi de la requête de création...');
    console.log('📋 Données:', JSON.stringify(testEmployeeData, null, 2));

    // Créer l'employé via l'API
    const createResponse = await axios.post('http://localhost:3001/api/employees', testEmployeeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Employé créé avec succès !');
    console.log('📊 Réponse:', JSON.stringify(createResponse.data, null, 2));

    // Vérifier que le matricule a été généré
    if (createResponse.data.matricule) {
      console.log(`🆔 Matricule généré: ${createResponse.data.matricule}`);
    } else {
      console.log('❌ Aucun matricule généré');
    }

    // Vérifier que tous les champs sont présents
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'address', 
      'birthDate', 'hireDate', 'status', 'employeeType',
      'city', 'postalCode', 'country', 'emergencyContactName',
      'emergencyContactPhone', 'emergencyContactRelationship', 'salary'
    ];

    console.log('🔍 Vérification des champs...');
    for (const field of requiredFields) {
      if (createResponse.data[field] !== undefined) {
        console.log(`  ✅ ${field}: ${createResponse.data[field]}`);
      } else {
        console.log(`  ❌ ${field}: manquant`);
      }
    }

    console.log('🎉 Test terminé avec succès !');

  } catch (error) {
    const err = error as any;
    console.error('❌ Erreur lors du test:', err.message);
    if (err.response) {
      console.error(`📊 Status: ${err.response.status}`);
      console.error(`📋 Data:`, err.response.data);
    } else if (err.request) {
      console.error('📡 Erreur de connexion - le serveur ne répond pas');
    } else {
      console.error('❓ Erreur inconnue:', err);
    }
  }
}

testEmployeeCreationAPI(); 