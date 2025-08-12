-- =====================================================
-- SCHÉMA BASE DE DONNÉES RH & COLLABORATION TOUT-EN-UN
-- =====================================================
-- Version: 2.0
-- Date: 2025-01-27
-- Description: Nouvelle architecture modulaire pour application RH & Collaboration

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- =====================================================
-- 1. TABLES DE BASE (CORE)
-- =====================================================

-- Table des rôles et permissions
CREATE TABLE `roles` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Nom du rôle (Admin, CEO, RH, Manager, Employee, etc.)',
  `description` text COMMENT 'Description du rôle',
  `permissions` JSON NOT NULL COMMENT 'Permissions JSON du rôle',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rôles et permissions système';

-- Table des départements
CREATE TABLE `departments` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Nom du département',
  `description` text COMMENT 'Description du département',
  `manager_id` int UNSIGNED DEFAULT NULL COMMENT 'ID du manager du département',
  `parent_department_id` int UNSIGNED DEFAULT NULL COMMENT 'Département parent (hiérarchie)',
  `budget` decimal(12,2) DEFAULT NULL COMMENT 'Budget annuel du département',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_department_name` (`name`),
  KEY `idx_manager_id` (`manager_id`),
  KEY `idx_parent_department` (`parent_department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Départements de l''entreprise';

-- Table des postes/emplois
CREATE TABLE `job_titles` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT 'Titre du poste',
  `description` text COMMENT 'Description du poste',
  `department_id` int UNSIGNED DEFAULT NULL COMMENT 'Département associé',
  `level` int DEFAULT 1 COMMENT 'Niveau hiérarchique (1=junior, 2=senior, 3=expert, etc.)',
  `salary_min` decimal(10,2) DEFAULT NULL COMMENT 'Salaire minimum',
  `salary_max` decimal(10,2) DEFAULT NULL COMMENT 'Salaire maximum',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_job_title` (`title`),
  KEY `idx_department_id` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Postes et emplois';

-- =====================================================
-- 2. MODULE EMPLOYÉS (CORE RH)
-- =====================================================

-- Table des employés
CREATE TABLE `employees` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_number` varchar(20) NOT NULL COMMENT 'Numéro d''employé unique',
  `first_name` varchar(100) NOT NULL COMMENT 'Prénom',
  `last_name` varchar(100) NOT NULL COMMENT 'Nom',
  `email` varchar(255) NOT NULL COMMENT 'Email professionnel',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Téléphone',
  `mobile` varchar(20) DEFAULT NULL COMMENT 'Mobile',
  
  -- Informations personnelles
  `birth_date` date DEFAULT NULL COMMENT 'Date de naissance',
  `gender` enum('M','F','O') DEFAULT NULL COMMENT 'Genre',
  `nationality` varchar(50) DEFAULT NULL COMMENT 'Nationalité',
  `marital_status` enum('single','married','divorced','widowed') DEFAULT NULL COMMENT 'Statut marital',
  
  -- Adresse
  `address` text COMMENT 'Adresse complète',
  `city` varchar(100) DEFAULT NULL COMMENT 'Ville',
  `postal_code` varchar(20) DEFAULT NULL COMMENT 'Code postal',
  `country` varchar(100) DEFAULT 'France' COMMENT 'Pays',
  
  -- Informations professionnelles
  `job_title_id` int UNSIGNED DEFAULT NULL COMMENT 'Poste actuel',
  `department_id` int UNSIGNED DEFAULT NULL COMMENT 'Département actuel',
  `manager_id` int UNSIGNED DEFAULT NULL COMMENT 'Manager direct',
  `hire_date` date NOT NULL COMMENT 'Date d''embauche',
  `contract_end_date` date DEFAULT NULL COMMENT 'Date de fin de contrat',
  `employee_type` enum('permanent','temporary','intern','consultant','freelance') NOT NULL DEFAULT 'permanent' COMMENT 'Type d''employé',
  `employment_status` enum('active','inactive','suspended','terminated','resigned') NOT NULL DEFAULT 'active' COMMENT 'Statut d''emploi',
  
  -- Rémunération
  `base_salary` decimal(10,2) DEFAULT NULL COMMENT 'Salaire de base annuel',
  `currency` varchar(3) DEFAULT 'EUR' COMMENT 'Devise du salaire',
  
  -- Contact d'urgence
  `emergency_contact_name` varchar(255) DEFAULT NULL COMMENT 'Nom du contact d''urgence',
  `emergency_contact_phone` varchar(20) DEFAULT NULL COMMENT 'Téléphone du contact d''urgence',
  `emergency_contact_relationship` varchar(100) DEFAULT NULL COMMENT 'Relation avec le contact d''urgence',
  
  -- Métadonnées
  `photo_url` varchar(500) DEFAULT NULL COMMENT 'URL de la photo de profil',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_number` (`employee_number`),
  UNIQUE KEY `uk_employee_email` (`email`),
  KEY `idx_job_title_id` (`job_title_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_manager_id` (`manager_id`),
  KEY `idx_employment_status` (`employment_status`),
  KEY `idx_hire_date` (`hire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Employés de l''entreprise';

-- Table des contrats
CREATE TABLE `contracts` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` int UNSIGNED NOT NULL COMMENT 'ID de l''employé',
  `contract_type` enum('CDI','CDD','stage','alternance','freelance') NOT NULL COMMENT 'Type de contrat',
  `start_date` date NOT NULL COMMENT 'Date de début',
  `end_date` date DEFAULT NULL COMMENT 'Date de fin (si applicable)',
  `trial_period_end` date DEFAULT NULL COMMENT 'Fin de période d''essai',
  `base_salary` decimal(10,2) NOT NULL COMMENT 'Salaire de base',
  `currency` varchar(3) DEFAULT 'EUR' COMMENT 'Devise',
  `working_hours_per_week` int DEFAULT 35 COMMENT 'Heures de travail par semaine',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_contract_type` (`contract_type`),
  KEY `idx_start_date` (`start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Contrats des employés';

-- =====================================================
-- 3. MODULE UTILISATEURS ET AUTHENTIFICATION
-- =====================================================

-- Table des utilisateurs
CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` int UNSIGNED DEFAULT NULL COMMENT 'ID de l''employé associé (peut être NULL pour consultants)',
  `username` varchar(50) NOT NULL COMMENT 'Nom d''utilisateur unique',
  `email` varchar(255) NOT NULL COMMENT 'Email de connexion',
  `password_hash` varchar(255) NOT NULL COMMENT 'Hash du mot de passe',
  `role_id` int UNSIGNED NOT NULL COMMENT 'Rôle utilisateur',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Compte actif',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Email vérifié',
  `last_login` timestamp NULL DEFAULT NULL COMMENT 'Dernière connexion',
  `password_reset_token` varchar(255) DEFAULT NULL COMMENT 'Token de réinitialisation',
  `password_reset_expires` timestamp NULL DEFAULT NULL COMMENT 'Expiration du token',
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '2FA activé',
  `two_factor_secret` varchar(255) DEFAULT NULL COMMENT 'Secret 2FA',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_employee_id` (`employee_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Utilisateurs système';

-- Table des sessions
CREATE TABLE `user_sessions` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL COMMENT 'ID utilisateur',
  `session_token` varchar(255) NOT NULL COMMENT 'Token de session',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'Adresse IP',
  `user_agent` text COMMENT 'User agent',
  `expires_at` timestamp NOT NULL COMMENT 'Expiration de la session',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_token` (`session_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sessions utilisateurs';

-- =====================================================
-- 4. MODULE CONGÉS ET ABSENCES
-- =====================================================

-- Types de congés
CREATE TABLE `leave_types` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Nom du type de congé',
  `description` text COMMENT 'Description',
  `color` varchar(7) DEFAULT '#3B82F6' COMMENT 'Couleur pour le calendrier',
  `is_paid` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Congé payé',
  `requires_approval` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Nécessite approbation',
  `max_days_per_year` int DEFAULT NULL COMMENT 'Nombre max de jours par an',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_leave_type_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Types de congés';

-- Demandes de congés
CREATE TABLE `leave_requests` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` int UNSIGNED NOT NULL COMMENT 'ID employé',
  `leave_type_id` int UNSIGNED NOT NULL COMMENT 'Type de congé',
  `start_date` date NOT NULL COMMENT 'Date de début',
  `end_date` date NOT NULL COMMENT 'Date de fin',
  `start_time` time DEFAULT '09:00:00' COMMENT 'Heure de début (si demi-journée)',
  `end_time` time DEFAULT '17:00:00' COMMENT 'Heure de fin (si demi-journée)',
  `total_days` decimal(4,1) NOT NULL COMMENT 'Nombre total de jours',
  `reason` text COMMENT 'Motif du congé',
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Statut de la demande',
  `approved_by` int UNSIGNED DEFAULT NULL COMMENT 'Approuvé par',
  `approved_at` timestamp NULL DEFAULT NULL COMMENT 'Date d''approbation',
  `rejection_reason` text COMMENT 'Motif du refus',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_leave_type_id` (`leave_type_id`),
  KEY `idx_status` (`status`),
  KEY `idx_start_date` (`start_date`),
  KEY `idx_approved_by` (`approved_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Demandes de congés';

-- Solde de congés
CREATE TABLE `leave_balances` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` int UNSIGNED NOT NULL COMMENT 'ID employé',
  `leave_type_id` int UNSIGNED NOT NULL COMMENT 'Type de congé',
  `year` int NOT NULL COMMENT 'Année',
  `total_days` decimal(4,1) NOT NULL DEFAULT '0' COMMENT 'Total de jours accordés',
  `used_days` decimal(4,1) NOT NULL DEFAULT '0' COMMENT 'Jours utilisés',
  `remaining_days` decimal(4,1) NOT NULL DEFAULT '0' COMMENT 'Jours restants',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_leave_year` (`employee_id`, `leave_type_id`, `year`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_leave_type_id` (`leave_type_id`),
  KEY `idx_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Soldes de congés';

-- =====================================================
-- 5. MODULE PROJETS ET TÂCHES
-- =====================================================

-- Projets
CREATE TABLE `projects` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'Nom du projet',
  `description` text COMMENT 'Description du projet',
  `project_code` varchar(50) DEFAULT NULL COMMENT 'Code du projet',
  `manager_id` int UNSIGNED DEFAULT NULL COMMENT 'Chef de projet',
  `department_id` int UNSIGNED DEFAULT NULL COMMENT 'Département responsable',
  `client_name` varchar(255) DEFAULT NULL COMMENT 'Nom du client',
  `start_date` date DEFAULT NULL COMMENT 'Date de début',
  `end_date` date DEFAULT NULL COMMENT 'Date de fin prévue',
  `actual_end_date` date DEFAULT NULL COMMENT 'Date de fin réelle',
  `status` enum('planning','active','on_hold','completed','cancelled') NOT NULL DEFAULT 'planning' COMMENT 'Statut du projet',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium' COMMENT 'Priorité',
  `budget` decimal(12,2) DEFAULT NULL COMMENT 'Budget du projet',
  `progress` decimal(5,2) DEFAULT '0.00' COMMENT 'Progression en pourcentage',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_project_code` (`project_code`),
  KEY `idx_manager_id` (`manager_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_status` (`status`),
  KEY `idx_start_date` (`start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Projets';

-- Tâches
CREATE TABLE `tasks` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` int UNSIGNED DEFAULT NULL COMMENT 'Projet associé (peut être NULL pour tâches indépendantes)',
  `title` varchar(255) NOT NULL COMMENT 'Titre de la tâche',
  `description` text COMMENT 'Description de la tâche',
  `assigned_to` int UNSIGNED DEFAULT NULL COMMENT 'Assigné à',
  `assigned_by` int UNSIGNED DEFAULT NULL COMMENT 'Assigné par',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium' COMMENT 'Priorité',
  `status` enum('todo','in_progress','review','done','cancelled') NOT NULL DEFAULT 'todo' COMMENT 'Statut',
  `start_date` date DEFAULT NULL COMMENT 'Date de début',
  `due_date` date DEFAULT NULL COMMENT 'Date d''échéance',
  `completed_date` date DEFAULT NULL COMMENT 'Date de completion',
  `estimated_hours` decimal(5,2) DEFAULT NULL COMMENT 'Heures estimées',
  `actual_hours` decimal(5,2) DEFAULT NULL COMMENT 'Heures réelles',
  `progress` decimal(5,2) DEFAULT '0.00' COMMENT 'Progression en pourcentage',
  `parent_task_id` int UNSIGNED DEFAULT NULL COMMENT 'Tâche parent (sous-tâches)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_assigned_to` (`assigned_to`),
  KEY `idx_assigned_by` (`assigned_by`),
  KEY `idx_status` (`status`),
  KEY `idx_due_date` (`due_date`),
  KEY `idx_parent_task_id` (`parent_task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tâches';

-- =====================================================
-- 6. MODULE COMMUNICATION
-- =====================================================

-- Messages privés
CREATE TABLE `messages` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_id` int UNSIGNED NOT NULL COMMENT 'Expéditeur',
  `receiver_id` int UNSIGNED NOT NULL COMMENT 'Destinataire',
  `subject` varchar(255) DEFAULT NULL COMMENT 'Sujet du message',
  `content` text NOT NULL COMMENT 'Contenu du message',
  `message_type` enum('text','file','image','system') NOT NULL DEFAULT 'text' COMMENT 'Type de message',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Message lu',
  `read_at` timestamp NULL DEFAULT NULL COMMENT 'Date de lecture',
  `is_deleted_by_sender` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Supprimé par l''expéditeur',
  `is_deleted_by_receiver` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Supprimé par le destinataire',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_receiver_id` (`receiver_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Messages privés';

-- Canaux de discussion
CREATE TABLE `chat_channels` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Nom du canal',
  `description` text COMMENT 'Description du canal',
  `type` enum('public','private','direct') NOT NULL DEFAULT 'public' COMMENT 'Type de canal',
  `created_by` int UNSIGNED NOT NULL COMMENT 'Créé par',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_channel_name` (`name`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Canaux de discussion';

-- Messages de canal
CREATE TABLE `channel_messages` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `channel_id` int UNSIGNED NOT NULL COMMENT 'ID du canal',
  `sender_id` int UNSIGNED NOT NULL COMMENT 'Expéditeur',
  `content` text NOT NULL COMMENT 'Contenu du message',
  `message_type` enum('text','file','image','system') NOT NULL DEFAULT 'text' COMMENT 'Type de message',
  `reply_to_id` int UNSIGNED DEFAULT NULL COMMENT 'Réponse à un message',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_channel_id` (`channel_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_reply_to_id` (`reply_to_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Messages de canal';

-- Membres des canaux
CREATE TABLE `channel_members` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `channel_id` int UNSIGNED NOT NULL COMMENT 'ID du canal',
  `user_id` int UNSIGNED NOT NULL COMMENT 'ID utilisateur',
  `role` enum('member','admin','moderator') NOT NULL DEFAULT 'member' COMMENT 'Rôle dans le canal',
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_channel_user` (`channel_id`, `user_id`),
  KEY `idx_channel_id` (`channel_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Membres des canaux';

-- =====================================================
-- 7. MODULE NOTIFICATIONS
-- =====================================================

-- Notifications
CREATE TABLE `notifications` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Destinataire',
  `type` varchar(50) NOT NULL COMMENT 'Type de notification',
  `title` varchar(255) NOT NULL COMMENT 'Titre',
  `message` text NOT NULL COMMENT 'Message',
  `data` JSON DEFAULT NULL COMMENT 'Données supplémentaires',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Notification lue',
  `read_at` timestamp NULL DEFAULT NULL COMMENT 'Date de lecture',
  `is_sent_email` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Email envoyé',
  `is_sent_push` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Push notification envoyée',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Notifications';

-- =====================================================
-- 8. MODULE DOCUMENTS
-- =====================================================

-- Documents
CREATE TABLE `documents` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT 'Titre du document',
  `description` text COMMENT 'Description',
  `file_name` varchar(255) NOT NULL COMMENT 'Nom du fichier',
  `file_path` varchar(500) NOT NULL COMMENT 'Chemin du fichier',
  `file_size` bigint UNSIGNED NOT NULL COMMENT 'Taille en bytes',
  `file_type` varchar(100) NOT NULL COMMENT 'Type MIME',
  `category` varchar(100) DEFAULT NULL COMMENT 'Catégorie du document',
  `uploaded_by` int UNSIGNED NOT NULL COMMENT 'Uploadé par',
  `is_public` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Document public',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_uploaded_by` (`uploaded_by`),
  KEY `idx_category` (`category`),
  KEY `idx_is_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Documents';

-- Documents des employés
CREATE TABLE `employee_documents` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` int UNSIGNED NOT NULL COMMENT 'ID employé',
  `document_id` int UNSIGNED NOT NULL COMMENT 'ID document',
  `document_type` varchar(100) NOT NULL COMMENT 'Type de document (CV, contrat, etc.)',
  `is_required` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Document obligatoire',
  `expiry_date` date DEFAULT NULL COMMENT 'Date d''expiration',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_document_type` (`employee_id`, `document_type`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_document_id` (`document_id`),
  KEY `idx_expiry_date` (`expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Documents des employés';

-- =====================================================
-- 9. MODULE AUDIT ET LOGS
-- =====================================================

-- Logs d'audit
CREATE TABLE `audit_logs` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED DEFAULT NULL COMMENT 'Utilisateur qui a effectué l''action',
  `action` varchar(100) NOT NULL COMMENT 'Action effectuée',
  `table_name` varchar(100) NOT NULL COMMENT 'Table concernée',
  `record_id` int UNSIGNED DEFAULT NULL COMMENT 'ID de l''enregistrement',
  `old_values` JSON DEFAULT NULL COMMENT 'Anciennes valeurs',
  `new_values` JSON DEFAULT NULL COMMENT 'Nouvelles valeurs',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'Adresse IP',
  `user_agent` text COMMENT 'User agent',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_table_name` (`table_name`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs d''audit';

-- =====================================================
-- 10. CONTRAINTES DE CLÉS ÉTRANGÈRES
-- =====================================================

-- Contraintes pour les départements
ALTER TABLE `departments`
  ADD CONSTRAINT `fk_departments_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_departments_parent` FOREIGN KEY (`parent_department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Contraintes pour les postes
ALTER TABLE `job_titles`
  ADD CONSTRAINT `fk_job_titles_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Contraintes pour les employés
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_employees_job_title` FOREIGN KEY (`job_title_id`) REFERENCES `job_titles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_employees_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_employees_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Contraintes pour les contrats
ALTER TABLE `contracts`
  ADD CONSTRAINT `fk_contracts_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes pour les utilisateurs
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Contraintes pour les sessions
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes pour les congés
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `fk_leave_requests_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_leave_requests_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_leave_requests_approver` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `leave_balances`
  ADD CONSTRAINT `fk_leave_balances_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_leave_balances_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes pour les projets
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_projects_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projects_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Contraintes pour les tâches
ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tasks_assigned_to` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tasks_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tasks_parent` FOREIGN KEY (`parent_task_id`) REFERENCES `tasks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Contraintes pour les messages
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_messages_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes pour les canaux
ALTER TABLE `chat_channels`
  ADD CONSTRAINT `fk_channels_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `channel_messages`
  ADD CONSTRAINT `fk_channel_messages_channel` FOREIGN KEY (`channel_id`) REFERENCES `chat_channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_channel_messages_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_channel_messages_reply` FOREIGN KEY (`reply_to_id`) REFERENCES `channel_messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `channel_members`
  ADD CONSTRAINT `fk_channel_members_channel` FOREIGN KEY (`channel_id`) REFERENCES `chat_channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_channel_members_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes pour les notifications
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes pour les documents
ALTER TABLE `documents`
  ADD CONSTRAINT `fk_documents_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `employee_documents`
  ADD CONSTRAINT `fk_employee_documents_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_employee_documents_document` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes pour les logs d'audit
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- =====================================================
-- 11. DONNÉES INITIALES
-- =====================================================

-- Insertion des rôles de base
INSERT INTO `roles` (`name`, `description`, `permissions`) VALUES
('Admin', 'Administrateur système avec tous les droits', '["all"]'),
('CEO', 'Directeur général avec accès complet', '["dashboard:view","employees:view","employees:create","employees:edit","employees:delete","reports:view","reports:generate","projects:view","projects:create","projects:edit","projects:delete","finance:view","finance:edit"]'),
('RH', 'Ressources Humaines', '["employees:view","employees:create","employees:edit","employees:view_salary","leaves:view","leaves:approve","leaves:reject","payroll:view","payroll:create","payroll:edit","recruitment:view","recruitment:create","recruitment:edit","training:view","training:create","training:edit","reports:view"]'),
('Manager', 'Manager d''équipe', '["employees:view","employees:view_team","leaves:view","leaves:approve","leaves:reject","projects:view","projects:create","projects:edit","tasks:view","tasks:create","tasks:edit","tasks:assign","reports:view_team"]'),
('Employee', 'Employé standard', '["profile:view","profile:edit","leaves:view","leaves:create","leaves:edit","tasks:view","tasks:edit","projects:view","messages:view","messages:send","notifications:view"]'),
('Comptable', 'Comptable', '["payroll:view","payroll:create","payroll:edit","finance:view","finance:edit","reports:view_financial"]'),
('CFO', 'Directeur financier', '["finance:view","finance:edit","payroll:view","payroll:create","payroll:edit","reports:view","reports:generate","reports:view_financial"]'),
('Stagiaire', 'Stagiaire avec accès limité', '["profile:view","profile:edit","tasks:view","tasks:edit","projects:view","messages:view","messages:send"]'),
('Consultant', 'Consultant externe', '["profile:view","profile:edit","projects:view","tasks:view","tasks:edit","messages:view","messages:send"]');

-- Insertion des types de congés de base
INSERT INTO `leave_types` (`name`, `description`, `color`, `is_paid`, `requires_approval`, `max_days_per_year`) VALUES
('Congés Payés', 'Congés annuels payés', '#10B981', 1, 1, 25),
('RTT', 'Réduction du temps de travail', '#3B82F6', 1, 1, 10),
('Congé Maladie', 'Arrêt maladie', '#EF4444', 1, 0, NULL),
('Congé Maternité', 'Congé maternité', '#EC4899', 1, 0, NULL),
('Congé Paternité', 'Congé paternité', '#8B5CF6', 1, 0, NULL),
('Formation', 'Congé formation', '#F59E0B', 1, 1, 5),
('Congé Sans Solde', 'Congé sans rémunération', '#6B7280', 0, 1, NULL);

-- Insertion des départements de base
INSERT INTO `departments` (`name`, `description`) VALUES
('Direction Générale', 'Direction générale de l''entreprise'),
('Ressources Humaines', 'Gestion des ressources humaines'),
('Informatique', 'Développement et maintenance informatique'),
('Marketing', 'Marketing et communication'),
('Finance', 'Gestion financière et comptabilité'),
('Commercial', 'Vente et relation client'),
('Production', 'Production et logistique'),
('Recherche & Développement', 'R&D et innovation');

-- Insertion des postes de base
INSERT INTO `job_titles` (`title`, `description`, `department_id`, `level`) VALUES
('Directeur Général', 'Direction générale', 1, 5),
('Directeur RH', 'Direction des ressources humaines', 2, 5),
('Responsable RH', 'Gestion RH opérationnelle', 2, 4),
('Développeur Full-Stack', 'Développement web complet', 3, 3),
('Développeur Frontend', 'Interface utilisateur', 3, 2),
('Développeur Backend', 'Logique métier', 3, 2),
('Chef de Projet', 'Gestion de projets', 3, 4),
('Chargé de Marketing', 'Marketing digital', 4, 2),
('Comptable', 'Comptabilité générale', 5, 2),
('Commercial', 'Vente et prospection', 6, 2);

-- =====================================================
-- 12. INDEX OPTIMISATION
-- =====================================================

-- Index composites pour améliorer les performances
CREATE INDEX `idx_employees_department_status` ON `employees` (`department_id`, `employment_status`);
CREATE INDEX `idx_employees_manager_status` ON `employees` (`manager_id`, `employment_status`);
CREATE INDEX `idx_leave_requests_employee_status` ON `leave_requests` (`employee_id`, `status`);
CREATE INDEX `idx_leave_requests_date_range` ON `leave_requests` (`start_date`, `end_date`);
CREATE INDEX `idx_tasks_project_status` ON `tasks` (`project_id`, `status`);
CREATE INDEX `idx_tasks_assigned_status` ON `tasks` (`assigned_to`, `status`);
CREATE INDEX `idx_messages_conversation` ON `messages` (`sender_id`, `receiver_id`, `created_at`);
CREATE INDEX `idx_notifications_user_read` ON `notifications` (`user_id`, `is_read`, `created_at`);

COMMIT; 