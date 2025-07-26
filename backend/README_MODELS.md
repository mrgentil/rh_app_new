# 📊 Modélisation de la Base de Données - Application RH

## 🏗️ Structure Générale

L'application RH suit une modélisation complète et structurée avec les modules suivants :

### A. Gestion des Employés

#### `employees` - Employés
- **Champs principaux** : `firstName`, `lastName`, `email`, `phone`, `address`, `birthDate`, `hireDate`
- **Relations** : `jobTitleId`, `departmentId`, `managerId` (auto-relation), `status`
- **Statuts** : `actif`, `suspendu`, `démissionnaire`, `licencié`

#### `job_titles` - Postes/Fonctions
- **Champs** : `title`, `description`
- **Relation** : 1:N avec `employees`

#### `departments` - Départements
- **Champs** : `name`, `description`
- **Relation** : 1:N avec `employees` et `job_offers`

#### `contracts` - Contrats de Travail
- **Champs** : `type` (CDI, CDD, Stage), `startDate`, `endDate`, `salary`
- **Relation** : 1:1 avec `employees`

### B. Recrutement

#### `job_offers` - Offres d'Emploi
- **Champs** : `title`, `description`, `postedDate`, `status`
- **Relations** : `departmentId`

#### `candidates` - Candidats
- **Champs** : `firstName`, `lastName`, `email`, `cvUrl`

#### `applications` - Candidatures
- **Champs** : `status`, `interviewDate`, `notes`
- **Relations** : `candidateId`, `jobOfferId`

### C. Formations

#### `trainings` - Formations
- **Champs** : `title`, `description`, `startDate`, `endDate`

#### `employee_trainings` - Participation aux Formations
- **Champs** : `status` (inscrit, terminé, annulé)
- **Relations** : `employeeId`, `trainingId`

### D. Gestion des Congés

#### `leave_types` - Types de Congés
- **Champs** : `name` (CP, Maladie, RTT), `description`

#### `leaves` - Demandes de Congés
- **Champs** : `startDate`, `endDate`, `status`, `commentaire`
- **Relations** : `employeeId`, `leaveTypeId`

### E. Paie & Comptabilité

#### `payrolls` - Fiches de Paie
- **Champs** : `month`, `year`, `basicSalary`, `overtime`, `deductions`, `netSalary`
- **Relations** : `employeeId`

#### `invoices` - Factures
- **Champs** : `number`, `amount`, `dueDate`, `status`

### F. Communication Interne

#### `messages` - Messages Privés
- **Champs** : `content`, `timestamp`, `isRead`
- **Relations** : `senderId`, `receiverId` (vers `employees`)

#### `announcements` - Annonces
- **Champs** : `title`, `content`, `date`, `isActive`
- **Relations** : `postedBy` (vers `employees`)

### G. Sécurité & Rôles

#### `roles` - Rôles Utilisateurs
- **Champs** : `name`, `permissions` (JSON)
- **Rôles** : Admin, RH, Manager, Employé

#### `users` - Utilisateurs Système
- **Champs** : `username`, `password`, `roleId`
- **Relations** : `employeeId`, `roleId`

### H. Utilitaires

#### `documents` - Documents
- **Champs** : `type`, `url`, `nom`
- **Relations** : `employeeId`

#### `notifications` - Notifications
- **Champs** : `message`, `type`, `isRead`
- **Relations** : `employeeId`

#### `audit_logs` - Logs d'Audit
- **Champs** : `action`, `table`, `recordId`, `changes`

## 🔗 Relations Principales

### Hiérarchie des Employés
```sql
employees.managerId → employees.id (auto-relation)
```

### Relations Départementales
```sql
employees.departmentId → departments.id
employees.jobTitleId → job_titles.id
```

### Gestion des Congés
```sql
leaves.employeeId → employees.id
leaves.leaveTypeId → leave_types.id
```

### Sécurité
```sql
users.employeeId → employees.id
users.roleId → roles.id
```

## 🚀 Scripts de Migration

### Initialisation de la Base
```bash
# Réinitialiser complètement la base de données
npm run db:reset

# Ou étape par étape
npm run migrate  # Créer les tables
npm run seed     # Insérer les données de base
```

### Données de Base Créées
- **Rôles** : Admin, RH, Manager, Employé
- **Départements** : RH, Informatique, Marketing, Finance, Commercial
- **Postes** : Directeur RH, Développeur, Chef de Projet, etc.
- **Types de Congés** : CP, Maladie, RTT, Maternité, Paternité, Formation

## 📈 Avantages de cette Modélisation

1. **Normalisation** : Évite la redondance des données
2. **Flexibilité** : Facilite l'ajout de nouveaux types (congés, postes, etc.)
3. **Traçabilité** : Audit complet des actions
4. **Sécurité** : Gestion fine des permissions
5. **Évolutivité** : Structure extensible pour de nouvelles fonctionnalités

## 🔄 Prochaines Étapes

1. **Mise à jour des routes** pour utiliser les nouveaux modèles
2. **Adaptation du frontend** aux nouvelles structures
3. **Tests** des nouvelles fonctionnalités
4. **Migration des données existantes** si nécessaire 