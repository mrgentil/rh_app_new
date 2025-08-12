-- Script SQL pour créer des données de test Manager
-- À exécuter dans votre base de données MySQL

-- 1. Vérifier les données existantes
SELECT 'Utilisateur Manager:' as info;
SELECT id, username, employeeId FROM users WHERE id = 6;

SELECT 'Employé Manager:' as info;
SELECT id, firstName, lastName, email FROM employees WHERE id = 7;

-- 2. Créer un département IT si il n'existe pas
INSERT IGNORE INTO departments (name, description, isActive, createdAt, updatedAt) 
VALUES ('IT', 'Département Informatique', 1, NOW(), NOW());

-- 3. Récupérer l'ID du département IT
SET @dept_id = (SELECT id FROM departments WHERE name = 'IT' LIMIT 1);

-- 4. Créer des équipes pour le manager (employeeId = 7)
INSERT IGNORE INTO teams (name, description, managerId, departmentId, isActive, createdAt, updatedAt) 
VALUES 
('Équipe Frontend', 'Équipe de développement Frontend', 7, @dept_id, 1, NOW(), NOW()),
('Équipe Backend', 'Équipe de développement Backend', 7, @dept_id, 1, NOW(), NOW());

-- 5. Créer un poste de développeur si il n'existe pas
INSERT IGNORE INTO job_titles (title, description, departmentId, isActive, createdAt, updatedAt) 
VALUES ('Développeur', 'Développeur logiciel', @dept_id, 1, NOW(), NOW());

-- 6. Récupérer les IDs des équipes et du poste
SET @team1_id = (SELECT id FROM teams WHERE name = 'Équipe Frontend' AND managerId = 7 LIMIT 1);
SET @team2_id = (SELECT id FROM teams WHERE name = 'Équipe Backend' AND managerId = 7 LIMIT 1);
SET @job_id = (SELECT id FROM job_titles WHERE title = 'Développeur' LIMIT 1);

-- 7. Créer des employés de test
INSERT IGNORE INTO employees (
  firstName, lastName, email, phone, matricule, hireDate, status, 
  jobTitleId, departmentId, teamId, createdAt, updatedAt
) VALUES 
('Marie', 'Dubois', 'marie.dubois@company.com', '0123456789', 'EMP001', '2022-01-15', 'actif', @job_id, @dept_id, @team1_id, NOW(), NOW()),
('Jean', 'Martin', 'jean.martin@company.com', '0123456790', 'EMP002', '2023-03-10', 'actif', @job_id, @dept_id, @team1_id, NOW(), NOW()),
('Sophie', 'Bernard', 'sophie.bernard@company.com', '0123456791', 'EMP003', '2023-06-20', 'actif', @job_id, @dept_id, @team2_id, NOW(), NOW()),
('Lucas', 'Petit', 'lucas.petit@company.com', '0123456792', 'EMP004', '2023-09-01', 'actif', @job_id, @dept_id, @team2_id, NOW(), NOW());

-- 8. Vérification finale
SELECT 'Équipes créées:' as info;
SELECT t.id, t.name, t.description, COUNT(e.id) as membres_count
FROM teams t 
LEFT JOIN employees e ON t.id = e.teamId 
WHERE t.managerId = 7 
GROUP BY t.id, t.name, t.description;

SELECT 'Employés dans les équipes:' as info;
SELECT e.firstName, e.lastName, e.email, t.name as equipe
FROM employees e 
JOIN teams t ON e.teamId = t.id 
WHERE t.managerId = 7;

SELECT 'Résumé:' as info;
SELECT 
  (SELECT COUNT(*) FROM teams WHERE managerId = 7) as total_equipes,
  (SELECT COUNT(*) FROM employees e JOIN teams t ON e.teamId = t.id WHERE t.managerId = 7) as total_membres;
