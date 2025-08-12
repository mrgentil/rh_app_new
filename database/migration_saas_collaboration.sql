-- Migration pour transformer RH App en SaaS RH & Collaboration
-- Date: 2025-08-05
-- Auteur: Cascade AI

-- =====================================================
-- 1. NOUVELLES TABLES POUR MODULE PROJETS & TÂCHES
-- =====================================================

-- Statuts de projets
CREATE TABLE project_statuses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#007bff',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Tâches Kanban
CREATE TABLE tasks (
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
  kanbanPosition INT DEFAULT 0,
  tags JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(id),
  FOREIGN KEY (assignedTo) REFERENCES employees(id),
  FOREIGN KEY (createdBy) REFERENCES employees(id)
);

-- Temps passé
CREATE TABLE time_entries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  taskId INT UNSIGNED,
  employeeId INT UNSIGNED NOT NULL,
  description VARCHAR(255),
  hours DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (taskId) REFERENCES tasks(id),
  FOREIGN KEY (employeeId) REFERENCES employees(id)
);

-- =====================================================
-- 2. MODULE COMMUNICATION TEMPS RÉEL
-- =====================================================

-- Canaux de communication
CREATE TABLE channels (
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
  FOREIGN KEY (createdBy) REFERENCES employees(id),
  FOREIGN KEY (departmentId) REFERENCES departments(id),
  FOREIGN KEY (projectId) REFERENCES projects(id)
);

-- Messages temps réel
CREATE TABLE chat_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  channelId INT UNSIGNED,
  senderId INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  messageType ENUM('text', 'file', 'image', 'system') DEFAULT 'text',
  fileUrl VARCHAR(500),
  replyToId INT UNSIGNED,
  isEdited BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (channelId) REFERENCES channels(id),
  FOREIGN KEY (senderId) REFERENCES employees(id)
);

-- =====================================================
-- 3. MODULE TEMPS & POINTAGE
-- =====================================================

-- Pointage
CREATE TABLE time_tracking (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employeeId INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  clockIn DATETIME,
  clockOut DATETIME,
  totalHours DECIMAL(4,2),
  overtimeHours DECIMAL(4,2) DEFAULT 0,
  status ENUM('present', 'absent', 'late', 'half_day') DEFAULT 'present',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_employee_date (employeeId, date),
  FOREIGN KEY (employeeId) REFERENCES employees(id)
);

-- =====================================================
-- 4. MODULE GAMIFICATION
-- =====================================================

-- Badges
CREATE TABLE badges (
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

-- Badges employés
CREATE TABLE employee_badges (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employeeId INT UNSIGNED NOT NULL,
  badgeId INT UNSIGNED NOT NULL,
  earnedAt DATETIME NOT NULL,
  UNIQUE KEY unique_employee_badge (employeeId, badgeId),
  FOREIGN KEY (employeeId) REFERENCES employees(id),
  FOREIGN KEY (badgeId) REFERENCES badges(id)
);

-- Sondages bien-être
CREATE TABLE surveys (
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
  FOREIGN KEY (createdBy) REFERENCES employees(id)
);

-- =====================================================
-- 5. MODIFICATIONS DES TABLES EXISTANTES
-- =====================================================

-- Améliorer projects
ALTER TABLE projects 
ADD COLUMN status ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled') DEFAULT 'planning',
ADD COLUMN priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
ADD COLUMN budget DECIMAL(12,2),
ADD COLUMN progress TINYINT DEFAULT 0,
ADD COLUMN tags JSON;

-- Améliorer employees
ALTER TABLE employees 
ADD COLUMN skills JSON,
ADD COLUMN workLocation ENUM('office', 'remote', 'hybrid') DEFAULT 'office',
ADD COLUMN gamificationPoints INT DEFAULT 0,
ADD COLUMN lastActiveAt DATETIME;

-- Améliorer notifications
ALTER TABLE notifications 
ADD COLUMN priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
ADD COLUMN actionUrl VARCHAR(500),
ADD COLUMN metadata JSON;

-- =====================================================
-- 6. DONNÉES INITIALES
-- =====================================================

-- Statuts de projets par défaut
INSERT INTO project_statuses (name, color, createdAt, updatedAt) VALUES
('Planifié', '#6c757d', NOW(), NOW()),
('En cours', '#007bff', NOW(), NOW()),
('En pause', '#ffc107', NOW(), NOW()),
('Terminé', '#28a745', NOW(), NOW()),
('Annulé', '#dc3545', NOW(), NOW());

-- Canaux par défaut
INSERT INTO channels (name, description, type, createdBy, createdAt, updatedAt) VALUES
('Général', 'Canal général de l\'entreprise', 'public', 1, NOW(), NOW()),
('RH', 'Canal des Ressources Humaines', 'public', 1, NOW(), NOW()),
('IT', 'Canal Informatique', 'public', 1, NOW(), NOW());

-- Badges par défaut
INSERT INTO badges (name, description, icon, points, rarity, createdAt, updatedAt) VALUES
('Bienvenue', 'Premier jour dans l\'entreprise', '🎉', 10, 'common', NOW(), NOW()),
('Collaborateur', '1 mois d\'ancienneté', '🤝', 50, 'common', NOW(), NOW()),
('Expert', '1 an d\'ancienneté', '⭐', 200, 'rare', NOW(), NOW()),
('Mentor', 'A formé 5 collègues', '🎓', 300, 'epic', NOW(), NOW());

COMMIT;
