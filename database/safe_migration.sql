-- Migration Sécurisée pour RH App vers SaaS RH & Collaboration
-- Date: 2025-08-05
-- IMPORTANT: Exécuter d'abord sur my_rh_app_test !

-- Vérification de l'existence des tables avant création
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- 1. VÉRIFICATIONS PRÉALABLES
-- =====================================================

-- Vérifier que nous sommes sur la bonne base
SELECT DATABASE() as current_database;

-- =====================================================
-- 2. NOUVELLES TABLES (avec vérification d'existence)
-- =====================================================

-- Table project_statuses
CREATE TABLE IF NOT EXISTS project_statuses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#007bff',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Table tasks
CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  projectId INT UNSIGNED,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignedTo INT UNSIGNED,
  createdBy INT UNSIGNED,
  status ENUM('todo', 'in_progress', 'review', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  estimatedHours DECIMAL(5,2),
  actualHours DECIMAL(5,2),
  dueDate DATETIME,
  startDate DATETIME,
  completedAt DATETIME,
  kanbanPosition INT DEFAULT 0,
  tags JSON,
  attachments JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_project (projectId),
  INDEX idx_assigned (assignedTo),
  INDEX idx_status (status)
);

-- Table task_comments
CREATE TABLE IF NOT EXISTS task_comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  taskId INT UNSIGNED NOT NULL,
  employeeId INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_task (taskId),
  INDEX idx_employee (employeeId)
);

-- Table time_entries
CREATE TABLE IF NOT EXISTS time_entries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  taskId INT UNSIGNED,
  employeeId INT UNSIGNED NOT NULL,
  description VARCHAR(255),
  hours DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_task (taskId),
  INDEX idx_employee (employeeId),
  INDEX idx_date (date)
);

-- Table channels
CREATE TABLE IF NOT EXISTS channels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type ENUM('public', 'private', 'direct') DEFAULT 'public',
  createdBy INT UNSIGNED NOT NULL,
  departmentId INT UNSIGNED,
  projectId INT UNSIGNED,
  isArchived BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_type (type),
  INDEX idx_department (departmentId),
  INDEX idx_project (projectId)
);

-- Table channel_members
CREATE TABLE IF NOT EXISTS channel_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  channelId INT UNSIGNED NOT NULL,
  employeeId INT UNSIGNED NOT NULL,
  role ENUM('admin', 'member') DEFAULT 'member',
  joinedAt DATETIME NOT NULL,
  UNIQUE KEY unique_channel_member (channelId, employeeId),
  INDEX idx_channel (channelId),
  INDEX idx_employee (employeeId)
);

-- Table chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  channelId INT UNSIGNED,
  senderId INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  messageType ENUM('text', 'file', 'image', 'system') DEFAULT 'text',
  fileUrl VARCHAR(500),
  fileName VARCHAR(255),
  fileSize INT,
  replyToId INT UNSIGNED,
  isEdited BOOLEAN DEFAULT FALSE,
  isDeleted BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_channel (channelId),
  INDEX idx_sender (senderId),
  INDEX idx_created (createdAt)
);

-- Table message_reactions
CREATE TABLE IF NOT EXISTS message_reactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  messageId INT UNSIGNED NOT NULL,
  employeeId INT UNSIGNED NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  createdAt DATETIME NOT NULL,
  UNIQUE KEY unique_reaction (messageId, employeeId, emoji),
  INDEX idx_message (messageId)
);

-- Table time_tracking
CREATE TABLE IF NOT EXISTS time_tracking (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employeeId INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  clockIn DATETIME,
  clockOut DATETIME,
  breakStart DATETIME,
  breakEnd DATETIME,
  totalHours DECIMAL(4,2),
  overtimeHours DECIMAL(4,2) DEFAULT 0,
  status ENUM('present', 'absent', 'late', 'half_day') DEFAULT 'present',
  notes TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_employee_date (employeeId, date),
  INDEX idx_employee (employeeId),
  INDEX idx_date (date)
);

-- Table work_schedules
CREATE TABLE IF NOT EXISTS work_schedules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employeeId INT UNSIGNED NOT NULL,
  dayOfWeek TINYINT NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  breakDuration INT DEFAULT 60,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_employee (employeeId)
);

-- Table badges
CREATE TABLE IF NOT EXISTS badges (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  criteria JSON,
  points INT DEFAULT 0,
  rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Table employee_badges
CREATE TABLE IF NOT EXISTS employee_badges (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employeeId INT UNSIGNED NOT NULL,
  badgeId INT UNSIGNED NOT NULL,
  earnedAt DATETIME NOT NULL,
  UNIQUE KEY unique_employee_badge (employeeId, badgeId),
  INDEX idx_employee (employeeId),
  INDEX idx_badge (badgeId)
);

-- Table surveys
CREATE TABLE IF NOT EXISTS surveys (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSON,
  isAnonymous BOOLEAN DEFAULT TRUE,
  isActive BOOLEAN DEFAULT TRUE,
  startDate DATETIME,
  endDate DATETIME,
  createdBy INT UNSIGNED NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_active (isActive),
  INDEX idx_dates (startDate, endDate)
);

-- Table survey_responses
CREATE TABLE IF NOT EXISTS survey_responses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  surveyId INT UNSIGNED NOT NULL,
  employeeId INT UNSIGNED,
  responses JSON,
  submittedAt DATETIME NOT NULL,
  INDEX idx_survey (surveyId),
  INDEX idx_employee (employeeId)
);

-- =====================================================
-- 3. MODIFICATIONS DES TABLES EXISTANTES (SÉCURISÉES)
-- =====================================================

-- Vérifier et ajouter colonnes à projects
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'status') = 0,
  'ALTER TABLE projects ADD COLUMN status ENUM(''planning'', ''active'', ''on_hold'', ''completed'', ''cancelled'') DEFAULT ''planning''',
  'SELECT "Column status already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'priority') = 0,
  'ALTER TABLE projects ADD COLUMN priority ENUM(''low'', ''medium'', ''high'', ''urgent'') DEFAULT ''medium''',
  'SELECT "Column priority already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'budget') = 0,
  'ALTER TABLE projects ADD COLUMN budget DECIMAL(12,2)',
  'SELECT "Column budget already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'progress') = 0,
  'ALTER TABLE projects ADD COLUMN progress TINYINT DEFAULT 0',
  'SELECT "Column progress already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'tags') = 0,
  'ALTER TABLE projects ADD COLUMN tags JSON',
  'SELECT "Column tags already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter colonnes à employees
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'skills') = 0,
  'ALTER TABLE employees ADD COLUMN skills JSON',
  'SELECT "Column skills already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'workLocation') = 0,
  'ALTER TABLE employees ADD COLUMN workLocation ENUM(''office'', ''remote'', ''hybrid'') DEFAULT ''office''',
  'SELECT "Column workLocation already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'gamificationPoints') = 0,
  'ALTER TABLE employees ADD COLUMN gamificationPoints INT DEFAULT 0',
  'SELECT "Column gamificationPoints already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'employees' AND COLUMN_NAME = 'lastActiveAt') = 0,
  'ALTER TABLE employees ADD COLUMN lastActiveAt DATETIME',
  'SELECT "Column lastActiveAt already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter colonnes à notifications
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notifications' AND COLUMN_NAME = 'priority') = 0,
  'ALTER TABLE notifications ADD COLUMN priority ENUM(''low'', ''medium'', ''high'', ''urgent'') DEFAULT ''medium''',
  'SELECT "Column priority already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notifications' AND COLUMN_NAME = 'actionUrl') = 0,
  'ALTER TABLE notifications ADD COLUMN actionUrl VARCHAR(500)',
  'SELECT "Column actionUrl already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notifications' AND COLUMN_NAME = 'metadata') = 0,
  'ALTER TABLE notifications ADD COLUMN metadata JSON',
  'SELECT "Column metadata already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 4. DONNÉES INITIALES (avec vérification)
-- =====================================================

-- Statuts de projets par défaut
INSERT IGNORE INTO project_statuses (name, color, createdAt, updatedAt) VALUES
('Planifié', '#6c757d', NOW(), NOW()),
('En cours', '#007bff', NOW(), NOW()),
('En pause', '#ffc107', NOW(), NOW()),
('Terminé', '#28a745', NOW(), NOW()),
('Annulé', '#dc3545', NOW(), NOW());

-- Canaux par défaut (vérifier qu'un employé avec id=1 existe)
INSERT IGNORE INTO channels (name, description, type, createdBy, createdAt, updatedAt) 
SELECT 'Général', 'Canal général de l\'entreprise', 'public', 1, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM employees WHERE id = 1);

INSERT IGNORE INTO channels (name, description, type, createdBy, createdAt, updatedAt) 
SELECT 'RH', 'Canal des Ressources Humaines', 'public', 1, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM employees WHERE id = 1);

INSERT IGNORE INTO channels (name, description, type, createdBy, createdAt, updatedAt) 
SELECT 'IT', 'Canal Informatique', 'public', 1, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM employees WHERE id = 1);

-- Badges par défaut
INSERT IGNORE INTO badges (name, description, icon, points, rarity, createdAt, updatedAt) VALUES
('Bienvenue', 'Premier jour dans l\'entreprise', '🎉', 10, 'common', NOW(), NOW()),
('Collaborateur', '1 mois d\'ancienneté', '🤝', 50, 'common', NOW(), NOW()),
('Expert', '1 an d\'ancienneté', '⭐', 200, 'rare', NOW(), NOW()),
('Mentor', 'A formé 5 collègues', '🎓', 300, 'epic', NOW(), NOW());

-- =====================================================
-- 5. AJOUT DES CLÉS ÉTRANGÈRES (après création des tables)
-- =====================================================

-- Ajouter les contraintes de clés étrangères si elles n'existent pas
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tasks' AND CONSTRAINT_NAME = 'tasks_ibfk_1') = 0,
  'ALTER TABLE tasks ADD CONSTRAINT tasks_ibfk_1 FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL',
  'SELECT "Foreign key tasks_ibfk_1 already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tasks' AND CONSTRAINT_NAME = 'tasks_ibfk_2') = 0,
  'ALTER TABLE tasks ADD CONSTRAINT tasks_ibfk_2 FOREIGN KEY (assignedTo) REFERENCES employees(id) ON DELETE SET NULL',
  'SELECT "Foreign key tasks_ibfk_2 already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Restaurer les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- =====================================================
-- 6. VÉRIFICATION FINALE
-- =====================================================

SELECT 'Migration terminée avec succès!' as status;
SELECT COUNT(*) as nouvelles_tables_creees FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (
  'project_statuses', 'tasks', 'task_comments', 'time_entries', 
  'channels', 'channel_members', 'chat_messages', 'message_reactions',
  'time_tracking', 'work_schedules', 'badges', 'employee_badges',
  'surveys', 'survey_responses'
);
