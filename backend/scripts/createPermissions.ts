import { Role } from '../src/models';

// Permissions prédéfinies organisées par catégorie
const predefinedPermissions = {
  // Gestion des employés
  'employee.view': 'Voir la liste des employés',
  'employee.create': 'Ajouter un employé',
  'employee.update': 'Modifier un employé',
  'employee.delete': 'Supprimer un employé',
  'employee.export': 'Exporter les données employés',
  
  // Gestion de la paie
  'payroll.view': 'Voir les salaires',
  'payroll.update': 'Modifier les salaires',
  'payroll.generate': 'Générer les fiches de paie',
  'payroll.export': 'Exporter les données de paie',
  
  // Gestion des congés
  'leave.view': 'Voir les demandes de congés',
  'leave.approve': 'Approuver/refuser les congés',
  'leave.manage': 'Gérer le calendrier des congés',
  'leave.request': 'Demander des congés',
  
  // Gestion des utilisateurs
  'user.view': 'Voir la liste des utilisateurs',
  'user.create': 'Créer un utilisateur',
  'user.update': 'Modifier un utilisateur',
  'user.delete': 'Supprimer un utilisateur',
  'user.suspend': 'Suspendre un utilisateur',
  
  // Gestion des rôles
  'role.view': 'Voir les rôles',
  'role.create': 'Créer un rôle',
  'role.update': 'Modifier un rôle',
  'role.delete': 'Supprimer un rôle',
  
  // Gestion des départements
  'department.view': 'Voir les départements',
  'department.create': 'Créer un département',
  'department.update': 'Modifier un département',
  'department.delete': 'Supprimer un département',
  
  // Administration système
  'system.logs': 'Voir les logs système',
  'system.settings': 'Modifier les paramètres système',
  'system.backup': 'Gérer les sauvegardes',
  
  // Rapports et analytics
  'reports.view': 'Voir les rapports',
  'reports.generate': 'Générer des rapports',
  'reports.export': 'Exporter les rapports',
  
  // Audit et sécurité
  'audit.view': 'Voir les logs d\'audit',
  'audit.export': 'Exporter les logs d\'audit'
};

// Rôles templates avec leurs permissions
const roleTemplates = {
  'Administrateur': Object.keys(predefinedPermissions), // Toutes les permissions
  'RH': [
    'employee.view', 'employee.create', 'employee.update', 'employee.export',
    'payroll.view', 'payroll.update', 'payroll.generate', 'payroll.export',
    'leave.view', 'leave.approve', 'leave.manage',
    'user.view', 'user.create', 'user.update',
    'department.view', 'department.create', 'department.update',
    'reports.view', 'reports.generate', 'reports.export'
  ],
  'Manager': [
    'employee.view', 'employee.update',
    'leave.view', 'leave.approve', 'leave.manage',
    'reports.view'
  ],
  'Employé': [
    'employee.view', // Seulement ses propres infos
    'leave.request', 'leave.view', // Seulement ses propres congés
    'reports.view' // Rapports personnels
  ]
};

async function createPermissions() {
  try {
    console.log('🔧 Création des permissions prédéfinies...');
    
    // Créer ou mettre à jour les rôles templates
    for (const [roleName, permissions] of Object.entries(roleTemplates)) {
      console.log(`📋 Traitement du rôle: ${roleName}`);
      
      // Chercher le rôle existant ou le créer
      let role = await Role.findOne({ where: { name: roleName } });
      
      if (!role) {
        console.log(`✅ Création du rôle: ${roleName}`);
        role = await Role.create({
          name: roleName,
          permissions: JSON.stringify(permissions)
        });
      } else {
        console.log(`🔄 Mise à jour du rôle: ${roleName}`);
        await role.update({
          permissions: JSON.stringify(permissions)
        });
      }
      
      console.log(`✅ Rôle ${roleName} configuré avec ${permissions.length} permissions`);
    }
    
    console.log('🎉 Permissions et rôles templates créés avec succès!');
    console.log('\n📋 Permissions disponibles:');
    Object.entries(predefinedPermissions).forEach(([key, description]) => {
      console.log(`  • ${key}: ${description}`);
    });
    
    console.log('\n🎯 Rôles templates créés:');
    Object.keys(roleTemplates).forEach(roleName => {
      console.log(`  • ${roleName}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des permissions:', error);
    process.exit(1);
  }
}

createPermissions(); 