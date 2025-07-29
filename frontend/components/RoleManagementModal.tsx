import { useState, useCallback, memo } from 'react';
import { FaUsers, FaUserTie, FaUser, FaCog, FaSave, FaTimes } from 'react-icons/fa';

interface Permission {
  key: string;
  label: string;
  category: string;
  description: string;
}

interface RoleManagementModalProps {
  role?: any;
  onClose: () => void;
  onSave: (roleData: any) => void;
  loading: boolean;
}

// Permissions prédéfinies organisées par catégorie
const PREDEFINED_PERMISSIONS: Permission[] = [
  // Gestion des employés
  { key: 'employee.view', label: 'Voir la liste des employés', category: 'Gestion des employés', description: 'Permet de consulter la liste des employés' },
  { key: 'employee.create', label: 'Ajouter un employé', category: 'Gestion des employés', description: 'Permet de créer de nouveaux employés' },
  { key: 'employee.update', label: 'Modifier un employé', category: 'Gestion des employés', description: 'Permet de modifier les informations des employés' },
  { key: 'employee.delete', label: 'Supprimer un employé', category: 'Gestion des employés', description: 'Permet de supprimer des employés' },
  { key: 'employee.export', label: 'Exporter les données employés', category: 'Gestion des employés', description: 'Permet d\'exporter les données des employés' },
  
  // Gestion de la paie
  { key: 'payroll.view', label: 'Voir les salaires', category: 'Gestion de la paie', description: 'Permet de consulter les informations de salaire' },
  { key: 'payroll.update', label: 'Modifier les salaires', category: 'Gestion de la paie', description: 'Permet de modifier les salaires' },
  { key: 'payroll.generate', label: 'Générer les fiches de paie', category: 'Gestion de la paie', description: 'Permet de générer les fiches de paie' },
  { key: 'payroll.export', label: 'Exporter les données de paie', category: 'Gestion de la paie', description: 'Permet d\'exporter les données de paie' },
  
  // Gestion des congés
  { key: 'leave.view', label: 'Voir les demandes de congés', category: 'Gestion des congés', description: 'Permet de consulter les demandes de congés' },
  { key: 'leave.approve', label: 'Approuver/refuser les congés', category: 'Gestion des congés', description: 'Permet d\'approuver ou refuser les demandes de congés' },
  { key: 'leave.manage', label: 'Gérer le calendrier des congés', category: 'Gestion des congés', description: 'Permet de gérer le calendrier des congés' },
  { key: 'leave.request', label: 'Demander des congés', category: 'Gestion des congés', description: 'Permet de faire des demandes de congés' },
  
  // Gestion des utilisateurs
  { key: 'user.view', label: 'Voir la liste des utilisateurs', category: 'Gestion des utilisateurs', description: 'Permet de consulter la liste des utilisateurs' },
  { key: 'user.create', label: 'Créer un utilisateur', category: 'Gestion des utilisateurs', description: 'Permet de créer de nouveaux utilisateurs' },
  { key: 'user.update', label: 'Modifier un utilisateur', category: 'Gestion des utilisateurs', description: 'Permet de modifier les utilisateurs' },
  { key: 'user.delete', label: 'Supprimer un utilisateur', category: 'Gestion des utilisateurs', description: 'Permet de supprimer des utilisateurs' },
  { key: 'user.suspend', label: 'Suspendre un utilisateur', category: 'Gestion des utilisateurs', description: 'Permet de suspendre des utilisateurs' },
  
  // Gestion des rôles
  { key: 'role.view', label: 'Voir les rôles', category: 'Gestion des rôles', description: 'Permet de consulter les rôles' },
  { key: 'role.create', label: 'Créer un rôle', category: 'Gestion des rôles', description: 'Permet de créer de nouveaux rôles' },
  { key: 'role.update', label: 'Modifier un rôle', category: 'Gestion des rôles', description: 'Permet de modifier les rôles' },
  { key: 'role.delete', label: 'Supprimer un rôle', category: 'Gestion des rôles', description: 'Permet de supprimer des rôles' },
  
  // Gestion des départements
  { key: 'department.view', label: 'Voir les départements', category: 'Gestion des départements', description: 'Permet de consulter les départements' },
  { key: 'department.create', label: 'Créer un département', category: 'Gestion des départements', description: 'Permet de créer de nouveaux départements' },
  { key: 'department.update', label: 'Modifier un département', category: 'Gestion des départements', description: 'Permet de modifier les départements' },
  { key: 'department.delete', label: 'Supprimer un département', category: 'Gestion des départements', description: 'Permet de supprimer des départements' },
  
  // Administration système
  { key: 'system.logs', label: 'Voir les logs système', category: 'Administration système', description: 'Permet de consulter les logs système' },
  { key: 'system.settings', label: 'Modifier les paramètres système', category: 'Administration système', description: 'Permet de modifier les paramètres système' },
  { key: 'system.backup', label: 'Gérer les sauvegardes', category: 'Administration système', description: 'Permet de gérer les sauvegardes' },
  
  // Rapports et analytics
  { key: 'reports.view', label: 'Voir les rapports', category: 'Rapports et analytics', description: 'Permet de consulter les rapports' },
  { key: 'reports.generate', label: 'Générer des rapports', category: 'Rapports et analytics', description: 'Permet de générer des rapports' },
  { key: 'reports.export', label: 'Exporter les rapports', category: 'Rapports et analytics', description: 'Permet d\'exporter les rapports' },
  
  // Audit et sécurité
  { key: 'audit.view', label: 'Voir les logs d\'audit', category: 'Audit et sécurité', description: 'Permet de consulter les logs d\'audit' },
  { key: 'audit.export', label: 'Exporter les logs d\'audit', category: 'Audit et sécurité', description: 'Permet d\'exporter les logs d\'audit' }
];

// Rôles templates
const ROLE_TEMPLATES = {
  'Administrateur': {
    icon: FaCog,
    color: 'bg-red-100 text-red-800',
    description: 'Accès complet à toutes les fonctionnalités du système'
  },
  'RH': {
    icon: FaUsers,
    color: 'bg-blue-100 text-blue-800',
    description: 'Gestion des employés, paie, congés et rapports RH'
  },
  'Manager': {
    icon: FaUserTie,
    color: 'bg-green-100 text-green-800',
    description: 'Gestion de l\'équipe et approbation des congés'
  },
  'Employé': {
    icon: FaUser,
    color: 'bg-gray-100 text-gray-800',
    description: 'Accès limité à ses propres informations et demandes'
  }
};

const RoleManagementModal = memo(({ role, onClose, onSave, loading }: RoleManagementModalProps) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    permissions: role ? (() => {
      try {
        return JSON.parse(role.permissions || '[]');
      } catch {
        return [];
      }
    })() : []
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Grouper les permissions par catégorie
  const permissionsByCategory = PREDEFINED_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handlePermissionChange = useCallback((permissionKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionKey]
        : prev.permissions.filter(p => p !== permissionKey)
    }));
  }, []);

  const handleTemplateSelect = useCallback((templateName: string) => {
    setSelectedTemplate(templateName);
    
    // Appliquer les permissions du template
    const templatePermissions = {
      'Administrateur': PREDEFINED_PERMISSIONS.map(p => p.key),
      'RH': ['employee.view', 'employee.create', 'employee.update', 'employee.export', 'payroll.view', 'payroll.update', 'payroll.generate', 'payroll.export', 'leave.view', 'leave.approve', 'leave.manage', 'user.view', 'user.create', 'user.update', 'department.view', 'department.create', 'department.update', 'reports.view', 'reports.generate', 'reports.export'],
      'Manager': ['employee.view', 'employee.update', 'leave.view', 'leave.approve', 'leave.manage', 'reports.view'],
      'Employé': ['employee.view', 'leave.request', 'leave.view', 'reports.view']
    };
    
    setFormData(prev => ({
      ...prev,
      name: templateName,
      permissions: templatePermissions[templateName as keyof typeof templatePermissions] || []
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      permissions: JSON.stringify(formData.permissions)
    });
  }, [formData, onSave]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Gestion des employés': return FaUsers;
      case 'Gestion de la paie': return FaUserTie;
      case 'Gestion des congés': return FaUser;
      case 'Gestion des utilisateurs': return FaUsers;
      case 'Gestion des rôles': return FaCog;
      case 'Gestion des départements': return FaUsers;
      case 'Administration système': return FaCog;
      case 'Rapports et analytics': return FaUserTie;
      case 'Audit et sécurité': return FaUserTie;
      default: return FaCog;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {role ? 'Modifier le rôle' : 'Créer un nouveau rôle'}
            </h2>
            <p className="text-gray-600 mt-1">
              Configurez les permissions pour ce rôle
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Rôles templates */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rôles prêts à l'emploi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(ROLE_TEMPLATES).map(([templateName, template]) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={templateName}
                      type="button"
                      onClick={() => handleTemplateSelect(templateName)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTemplate === templateName
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-6 h-6 ${template.color.split(' ')[1]}`} />
                        <div className="text-left">
                          <h4 className="font-medium text-gray-800">{templateName}</h4>
                          <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nom du rôle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du rôle *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: RH, Manager, Employé..."
                required
              />
            </div>

            {/* Permissions par catégorie */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Permissions ({formData.permissions.length} sélectionnées)
              </h3>
              
              {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                const Icon = getCategoryIcon(category);
                const categoryPermissions = permissions.map(p => p.key);
                const selectedCount = formData.permissions.filter(p => categoryPermissions.includes(p)).length;
                const allSelected = categoryPermissions.every(p => formData.permissions.includes(p));

                const handleCategoryToggle = () => {
                  if (allSelected) {
                    // Désélectionner toute la catégorie
                    setFormData(prev => ({
                      ...prev,
                      permissions: prev.permissions.filter(p => !categoryPermissions.includes(p))
                    }));
                  } else {
                    // Sélectionner toute la catégorie
                    setFormData(prev => ({
                      ...prev,
                      permissions: [...new Set([...prev.permissions, ...categoryPermissions])]
                    }));
                  }
                };

                return (
                  <div key={category} className="border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <h4 className="font-medium text-gray-800">{category}</h4>
                        <span className="text-sm text-gray-500">
                          ({selectedCount}/{permissions.length})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCategoryToggle}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          allSelected
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {permissions.map((permission) => (
                        <label key={permission.key} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.key)}
                            onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{permission.label}</div>
                            <div className="text-sm text-gray-600">{permission.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer - Toujours visible */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  <span>{role ? 'Modifier' : 'Créer'} le rôle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

RoleManagementModal.displayName = 'RoleManagementModal';

export default RoleManagementModal; 