import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Token de test pour un utilisateur Manager (à remplacer par un vrai token)
const MANAGER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Token JWT d'un Manager

const headers = {
  'Authorization': `Bearer ${MANAGER_TOKEN}`,
  'Content-Type': 'application/json'
};

async function testManagerEmployeesIntegration() {
  console.log('🧪 Test d\'intégration - Gestion des Employés Manager');
  console.log('=' .repeat(60));

  try {
    // Test 1: Récupérer les employés de l'équipe
    console.log('\n1️⃣ Test: Récupération des employés de l\'équipe');
    try {
      const response = await axios.get(`${API_BASE_URL}/manager/employees/team`, { headers });
      console.log('✅ Succès - Employés récupérés:', response.data.data?.length || 0);
      console.log('📊 Données:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.log('❌ Erreur:', error.response?.data || error.message);
    }

    // Test 2: Récupérer les statistiques de l'équipe
    console.log('\n2️⃣ Test: Statistiques de l\'équipe');
    try {
      const response = await axios.get(`${API_BASE_URL}/manager/employees/team/stats`, { headers });
      console.log('✅ Succès - Statistiques récupérées');
      console.log('📊 Stats:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.log('❌ Erreur:', error.response?.data || error.message);
    }

    // Test 3: Créer un nouvel employé
    console.log('\n3️⃣ Test: Création d\'un nouvel employé');
    const newEmployee = {
      firstName: 'Test',
      lastName: 'Manager',
      email: `test.manager.${Date.now()}@company.com`,
      phone: '+33 1 23 45 67 99',
      jobTitleId: 1,
      departmentId: 1,
      teamId: 1,
      hireDate: '2024-01-15',
      birthDate: '1990-05-20',
      address: '123 Test Street, Paris',
      contractType: 'CDI',
      salary: 50000
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/manager/employees/team`, newEmployee, { headers });
      console.log('✅ Succès - Employé créé');
      console.log('👤 Nouvel employé:', JSON.stringify(response.data, null, 2));
      
      const createdEmployeeId = response.data.data?.id;

      // Test 4: Récupérer les informations personnelles
      if (createdEmployeeId) {
        console.log('\n4️⃣ Test: Informations personnelles détaillées');
        try {
          const personalResponse = await axios.get(
            `${API_BASE_URL}/manager/employees/team/${createdEmployeeId}/personal`, 
            { headers }
          );
          console.log('✅ Succès - Informations personnelles récupérées');
          console.log('🔍 Détails:', JSON.stringify(personalResponse.data, null, 2));
        } catch (error: any) {
          console.log('❌ Erreur infos personnelles:', error.response?.data || error.message);
        }

        // Test 5: Modifier l'employé
        console.log('\n5️⃣ Test: Modification de l\'employé');
        const updateData = {
          firstName: 'Test Updated',
          salary: 55000
        };

        try {
          const updateResponse = await axios.put(
            `${API_BASE_URL}/manager/employees/team/${createdEmployeeId}`, 
            updateData,
            { headers }
          );
          console.log('✅ Succès - Employé modifié');
          console.log('✏️ Employé mis à jour:', JSON.stringify(updateResponse.data, null, 2));
        } catch (error: any) {
          console.log('❌ Erreur modification:', error.response?.data || error.message);
        }
      }

    } catch (error: any) {
      console.log('❌ Erreur création:', error.response?.data || error.message);
    }

    // Test 6: Export CSV
    console.log('\n6️⃣ Test: Export CSV');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/manager/employees/team/export?format=csv`, 
        { 
          headers,
          responseType: 'text'
        }
      );
      console.log('✅ Succès - Export CSV généré');
      console.log('📄 Taille du CSV:', response.data.length, 'caractères');
      console.log('📄 Aperçu CSV (100 premiers caractères):', response.data.substring(0, 100));
    } catch (error: any) {
      console.log('❌ Erreur export CSV:', error.response?.data || error.message);
    }

    // Test 7: Export JSON
    console.log('\n7️⃣ Test: Export JSON');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/manager/employees/team/export?format=json`, 
        { headers }
      );
      console.log('✅ Succès - Export JSON généré');
      console.log('📄 Nombre d\'employés exportés:', response.data.data?.length || 0);
    } catch (error: any) {
      console.log('❌ Erreur export JSON:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('💥 Erreur générale:', error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Tests terminés');
}

// Test des permissions
async function testPermissions() {
  console.log('\n🔐 Test des permissions Manager');
  console.log('=' .repeat(40));

  const permissions = [
    'employees:view_team',
    'employees:view_personal_team', 
    'employees:create_team',
    'employees:edit_team',
    'employees:export_team'
  ];

  for (const permission of permissions) {
    console.log(`\n🔍 Test permission: ${permission}`);
    // Ici vous pourriez tester chaque permission individuellement
    // en créant des tokens avec des permissions spécifiques
  }
}

// Test de validation des données
function testDataValidation() {
  console.log('\n✅ Test de validation des données');
  console.log('=' .repeat(40));

  const testCases = [
    {
      name: 'Données valides',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+33123456789',
        jobTitleId: 1,
        departmentId: 1,
        teamId: 1,
        hireDate: '2024-01-01',
        salary: 50000
      },
      shouldBeValid: true
    },
    {
      name: 'Email invalide',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '+33123456789',
        jobTitleId: 1,
        departmentId: 1,
        teamId: 1,
        hireDate: '2024-01-01',
        salary: 50000
      },
      shouldBeValid: false
    },
    {
      name: 'Champs manquants',
      data: {
        firstName: 'John',
        // lastName manquant
        email: 'john@company.com'
      },
      shouldBeValid: false
    }
  ];

  testCases.forEach(testCase => {
    console.log(`\n📝 Test: ${testCase.name}`);
    // Ici vous pourriez utiliser la fonction de validation du service
    // const validation = managerEmployeeService.validateEmployeeData(testCase.data);
    // console.log(validation.isValid === testCase.shouldBeValid ? '✅' : '❌', 
    //   `Résultat attendu: ${testCase.shouldBeValid}, obtenu: ${validation.isValid}`);
  });
}

// Exécution des tests
if (require.main === module) {
  console.log('🚀 Démarrage des tests d\'intégration Manager Employees');
  
  // Vérifier que le serveur est démarré
  axios.get(`${API_BASE_URL}/health`)
    .then(() => {
      console.log('✅ Serveur backend accessible');
      return testManagerEmployeesIntegration();
    })
    .then(() => {
      return testPermissions();
    })
    .then(() => {
      testDataValidation();
    })
    .catch((error) => {
      console.log('❌ Serveur backend non accessible:', error.message);
      console.log('💡 Assurez-vous que le serveur backend est démarré sur le port 3001');
    });
}

export { testManagerEmployeesIntegration, testPermissions, testDataValidation };
