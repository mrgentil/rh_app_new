-- Mise à jour des rôles et permissions pour SaaS RH & Collaboration
-- Date: 2025-08-05

-- =====================================================
-- 1. CRÉATION DES RÔLES MANQUANTS
-- =====================================================

-- CFO (Directeur Financier)
INSERT INTO roles (name, permissions, createdAt, updatedAt) VALUES
('CFO', JSON_ARRAY(
  'dashboard:view',
  'dashboard:view_financial',
  'dashboard:view_budget',
  'payroll:view_all',
  'payroll:reports',
  'employees:view_salary',
  'reports:financial',
  'reports:budget',
  'reports:projections',
  'analytics:financial',
  'profile'
), NOW(), NOW())
ON DUPLICATE KEY UPDATE permissions = VALUES(permissions);

-- Consultant Externe
INSERT INTO roles (name, permissions, createdAt, updatedAt) VALUES
('Consultant', JSON_ARRAY(
  'projects:view_assigned',
  'tasks:view_assigned',
  'tasks:update_assigned',
  'documents:view_assigned',
  'documents:upload',
  'time_tracking:own',
  'channels:view_assigned',
  'chat:participate',
  'profile'
), NOW(), NOW())
ON DUPLICATE KEY UPDATE permissions = VALUES(permissions);

-- CEO (Direction Générale)
INSERT INTO roles (name, permissions, createdAt, updatedAt) VALUES
('CEO', JSON_ARRAY(
  'all',
  'dashboard:view_executive',
  'analytics:all',
  'reports:all',
  'performance:global',
  'budget:view',
  'strategy:view',
  'profile'
), NOW(), NOW())
ON DUPLICATE KEY UPDATE permissions = VALUES(permissions);

-- =====================================================
-- 2. MISE À JOUR DES RÔLES EXISTANTS
-- =====================================================

-- Employé (Employee) - Ajouter tâches et formations
UPDATE roles SET permissions = JSON_ARRAY(
  'employees:view_own',
  'profile:view',
  'profile:edit',
  'leaves:view_own',
  'leaves:create',
  'leaves:edit_own',
  'payroll:view_own',
  'documents:view_own',
  'documents:upload_own',
  'notifications:view',
  'dashboard:view_personal',
  'tasks:view_assigned',
  'tasks:update_assigned',
  'tasks:comment',
  'time_tracking:own',
  'trainings:view',
  'trainings:register',
  'channels:view_public',
  'chat:participate',
  'badges:view_own',
  'surveys:respond',
  'profile'
) WHERE name = 'Employee';

-- Manager - Permissions complètes pour gestion d'équipe
UPDATE roles SET permissions = JSON_ARRAY(
  'employees:view_team',
  'employees:view_personal_team',
  'employees:create_team',
  'employees:edit_team',
  'employees:export_team',
  'leaves:view_team',
  'leaves:approve',
  'leaves:reject',
  'leaves:create_team',
  'leaves:edit_team',
  'leaves:delete_team',
  'payroll:view_team',
  'payroll:create_team',
  'payroll:edit_team',
  'payroll:delete_team',
  'payroll:export_team',
  'documents:view_team',
  'documents:upload',
  'documents:delete_team',
  'notifications:view',
  'notifications:send_team',
  'notifications:create',
  'dashboard:view',
  'dashboard:view_team',
  'teams:view_managed',
  'teams:create',
  'teams:edit_managed',
  'teams:add_members',
  'teams:remove_members',
  'departments:view_managed',
  'job_titles:view',
  'projects:view_managed',
  'projects:create',
  'projects:edit_managed',
  'objectives:view_team',
  'objectives:create_team',
  'objectives:edit_team',
  'objectives:delete_team',
  'tasks:view_team',
  'tasks:create',
  'tasks:assign',
  'tasks:update_team',
  'time_tracking:view_team',
  'performance:view_team',
  'performance:evaluate',
  'trainings:view_team',
  'trainings:assign',
  'channels:create_team',
  'channels:manage_team',
  'chat:moderate',
  'badges:award_team',
  'surveys:create_team',
  'audit:view_team',
  'reports:team',
  'exports:team',
  'profile'
) WHERE name = 'Manager';

-- RH - Permissions complètes pour ressources humaines
UPDATE roles SET permissions = JSON_ARRAY(
  'employees:view_all',
  'employees:create',
  'employees:edit',
  'employees:delete',
  'employees:export',
  'employees:view_contracts',
  'employees:create_contracts',
  'employees:edit_contracts',
  'leaves:view_all',
  'leaves:create',
  'leaves:edit',
  'leaves:delete',
  'leaves:approve',
  'leaves:reject',
  'leaves:export',
  'payroll:view_all',
  'payroll:reports',
  'documents:view_all',
  'documents:upload',
  'documents:delete',
  'notifications:view_all',
  'notifications:create',
  'notifications:send_all',
  'dashboard:view',
  'dashboard:view_hr',
  'teams:view_all',
  'teams:create',
  'teams:edit',
  'teams:delete',
  'teams:add_members',
  'teams:remove_members',
  'departments:view_all',
  'departments:create',
  'departments:edit',
  'departments:delete',
  'job_titles:view_all',
  'job_titles:create',
  'job_titles:edit',
  'job_titles:delete',
  'objectives:view_all',
  'objectives:create',
  'objectives:edit',
  'objectives:delete',
  'performance:view_all',
  'performance:evaluate_all',
  'trainings:view_all',
  'trainings:create',
  'trainings:edit',
  'trainings:delete',
  'trainings:assign_all',
  'recruitment:view_all',
  'recruitment:create',
  'recruitment:edit',
  'recruitment:delete',
  'channels:create_all',
  'channels:manage_all',
  'chat:moderate_all',
  'badges:award_all',
  'surveys:create_all',
  'surveys:view_results',
  'audit:view_hr',
  'reports:hr',
  'reports:all',
  'exports:hr',
  'analytics:hr',
  'profile'
) WHERE name = 'RH';

-- Comptable - Permissions plus détaillées
UPDATE roles SET permissions = JSON_ARRAY(
  'payroll:view_all',
  'payroll:create',
  'payroll:edit',
  'payroll:delete',
  'payroll:process',
  'payroll:export',
  'payroll:reports',
  'payroll:pdf_export',
  'employees:view_financial',
  'employees:view_salary',
  'invoices:view',
  'invoices:create',
  'invoices:edit',
  'invoices:delete',
  'reports:financial',
  'reports:payroll',
  'exports:accounting',
  'exports:payroll',
  'dashboard:view_financial',
  'audit:view_financial',
  'profile'
) WHERE name = 'Comptable';

-- Admin - Permissions complètes système
UPDATE roles SET permissions = JSON_ARRAY(
  'all',
  'employees:all',
  'leaves:all',
  'payroll:all',
  'documents:all',
  'notifications:all',
  'dashboard:all',
  'teams:all',
  'departments:all',
  'job_titles:all',
  'roles:all',
  'users:all',
  'objectives:all',
  'performance:all',
  'trainings:all',
  'recruitment:all',
  'projects:all',
  'tasks:all',
  'time_tracking:all',
  'channels:all',
  'chat:all',
  'badges:all',
  'surveys:all',
  'audit:all',
  'reports:all',
  'exports:all',
  'analytics:all',
  'system:all',
  'setup:all',
  'profile'
) WHERE name IN ('Admin', 'Administrateur');

-- Stagiaire - Permissions limitées avec onboarding
UPDATE roles SET permissions = JSON_ARRAY(
  'profile:view',
  'profile:edit_limited',
  'employees:view_public',
  'employees:view_directory',
  'tasks:view_assigned',
  'tasks:update_assigned',
  'tasks:comment',
  'time_tracking:own',
  'documents:view_assigned',
  'documents:upload_own',
  'trainings:view_assigned',
  'trainings:complete',
  'trainings:progress',
  'onboarding:view',
  'onboarding:complete',
  'onboarding:progress',
  'channels:view_public',
  'channels:view_assigned',
  'chat:participate',
  'badges:view_own',
  'surveys:respond',
  'notifications:view_own',
  'dashboard:view_personal',
  'profile'
) WHERE name = 'Stagiaire';

-- =====================================================
-- 3. VÉRIFICATION DES RÉSULTATS
-- =====================================================

-- Afficher tous les rôles mis à jour
SELECT id, name, 
       JSON_LENGTH(permissions) as nb_permissions,
       CASE 
         WHEN name = 'Employee' THEN 'Employé'
         WHEN name = 'Manager' THEN 'Manager'
         WHEN name = 'RH' THEN 'Ressources Humaines'
         WHEN name = 'Comptable' THEN 'Comptable'
         WHEN name = 'CFO' THEN 'Directeur Financier'
         WHEN name = 'Stagiaire' THEN 'Stagiaire'
         WHEN name = 'Consultant' THEN 'Consultant Externe'
         WHEN name = 'Administrateur' THEN 'Admin Système'
         WHEN name = 'CEO' THEN 'Direction Générale'
         ELSE name
       END as role_description
FROM roles 
ORDER BY id;

-- Compter le nombre total de rôles
SELECT COUNT(*) as total_roles FROM roles;

COMMIT;
