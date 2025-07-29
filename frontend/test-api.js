// Script de test pour vérifier l'API des employés
const testAPI = async () => {
  try {
    console.log('🧪 Test de l\'API des employés...');
    
    // Test 1: Health check du backend
    console.log('1. Test du health check...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Récupération des employés
    console.log('2. Test de récupération des employés...');
    const employeesResponse = await fetch('http://localhost:3001/api/employees');
    
    if (!employeesResponse.ok) {
      throw new Error(`Erreur HTTP: ${employeesResponse.status} ${employeesResponse.statusText}`);
    }
    
    const employees = await employeesResponse.json();
    console.log('✅ Employés récupérés:', employees.length, 'employés');
    console.log('📋 Premier employé:', employees[0] || 'Aucun employé trouvé');
    
    // Test 3: Test via le rewrite Next.js
    console.log('3. Test via le rewrite Next.js...');
    const rewriteResponse = await fetch('/api/employees');
    
    if (!rewriteResponse.ok) {
      throw new Error(`Erreur rewrite: ${rewriteResponse.status} ${rewriteResponse.statusText}`);
    }
    
    const rewriteEmployees = await rewriteResponse.json();
    console.log('✅ Rewrite fonctionne:', rewriteEmployees.length, 'employés');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
};

// Exécuter le test si on est dans un navigateur
if (typeof window !== 'undefined') {
  testAPI();
} else {
  console.log('Ce script doit être exécuté dans un navigateur');
} 