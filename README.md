# 🏢 RH App - Application de Gestion des Ressources Humaines

Une application moderne de gestion RH avec interface web responsive et API REST complète.

## 🚀 Démarrage Rapide

### Option 1: Script automatique (Recommandé)

```bash
# Double-cliquez sur le fichier
start-app.bat
```

### Option 2: Démarrage manuel

#### 1. Backend (Port 3001)

```bash
cd backend
npm install
npm run dev
```

#### 2. Frontend (Port 3000)

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Identifiants de Test

* **Username:** `admin`
* **Password:** `admin123`

## 📋 Fonctionnalités

### 🔐 Gestion des Rôles
* Création et modification de rôles
* Gestion des permissions détaillées
* Interface intuitive avec checkboxes
* Validation des suppressions

### 🏢 Gestion des Départements
* CRUD complet des départements
* Affichage en grille avec cartes
* Compteur d'employés par département
* Interface modale pour édition
* Vue détaillée des membres du département

### 👥 Gestion des Employés
* Tableau avec recherche en temps réel
* Actions rapides (Voir, Modifier, Supprimer)
* Statuts colorés (Actif, Suspendu, etc.)
* Résumé statistique
* Informations complètes (âge, ancienneté, etc.)
* Filtres par département et statut

### 🛡️ Sécurité
* Authentification JWT avec cookies
* Protection des routes par rôle
* Page d'erreur pour accès non autorisés
* Redirection automatique selon le rôle

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
* **Framework:** Express.js
* **Base de données:** MySQL avec Sequelize ORM
* **Authentification:** JWT + bcrypt
* **API:** RESTful avec validation

### Frontend (Next.js + React)
* **Framework:** Next.js avec TypeScript
* **Styling:** Tailwind CSS
* **État:** Context API + Hooks
* **Icônes:** React Icons

## 📊 Base de Données

### Tables Principales
* `users` - Utilisateurs du système
* `employees` - Employés de l'entreprise
* `roles` - Rôles et permissions
* `departments` - Départements
* `job_titles` - Postes
* `contracts` - Contrats de travail
* `leaves` - Congés
* `payrolls` - Fiches de paie

### Relations
* Employé ↔ Département (N:1)
* Employé ↔ Poste (N:1)
* Employé ↔ Contrat (1:1)
* Utilisateur ↔ Rôle (N:1)
* Utilisateur ↔ Employé (1:1)

## 🎨 Interface Utilisateur

### Design
* Interface moderne et responsive
* Navigation par onglets
* Modales pour les formulaires
* États de chargement avec spinners
* Messages d'erreur informatifs

### Composants
* `ProtectedRoute` - Sécurisation des pages
* `RolesManagement` - Gestion des rôles
* `DepartmentsManagement` - Gestion des départements
* `EmployeesManagement` - Gestion des employés
* `Navigation` - Barre de navigation

## 🔧 Scripts Utiles

### Backend
```bash
npm run dev          # Démarrage en mode développement
npm run migrate      # Migration de la base de données
npm run seed         # Peuplement initial des données
npm run create-admin # Création de l'utilisateur admin
npm run simple-test  # Test de l'API
```

### Frontend
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run start        # Démarrage en production
```

## 🌐 URLs

* **Frontend:** http://localhost:3000
* **Backend API:** http://localhost:3001
* **Health Check:** http://localhost:3001/health

## 📝 API Endpoints

### Authentification
* `POST /api/auth/login` - Connexion
* `POST /api/auth/logout` - Déconnexion
* `GET /api/auth/me` - Informations utilisateur

### Rôles
* `GET /api/roles` - Liste des rôles
* `POST /api/roles` - Créer un rôle
* `PUT /api/roles/:id` - Modifier un rôle
* `DELETE /api/roles/:id` - Supprimer un rôle

### Départements
* `GET /api/departments` - Liste des départements
* `GET /api/departments/:id` - Détails d'un département
* `GET /api/departments/:id/employees` - Employés d'un département
* `POST /api/departments` - Créer un département
* `PUT /api/departments/:id` - Modifier un département
* `DELETE /api/departments/:id` - Supprimer un département

### Employés
* `GET /api/employees` - Liste des employés
* `GET /api/employees/:id` - Détails d'un employé
* `POST /api/employees` - Créer un employé
* `PUT /api/employees/:id` - Modifier un employé
* `DELETE /api/employees/:id` - Supprimer un employé

## 🔒 Sécurité

### Authentification
* Tokens JWT stockés dans des cookies httpOnly
* Expiration automatique des tokens
* Validation côté serveur

### Autorisation
* Vérification des rôles sur chaque route
* Protection des composants React
* Redirection automatique pour accès non autorisés

## 🚀 Déploiement

### Prérequis
* Node.js 16+
* MySQL 8.0+
* npm ou yarn

### Variables d'Environnement

```bash
# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=my_rh_app
JWT_SECRET=your_secret_key
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📞 Support

Pour toute question ou problème :

1. Vérifiez que les deux serveurs sont démarrés
2. Consultez les logs dans les terminaux
3. Testez l'API avec `npm run simple-test`

## 🎯 Prochaines Étapes

* Module de gestion des congés
* Module de paie
* Export PDF/Excel
* Notifications en temps réel
* Dashboard avec graphiques
* Gestion des documents

## 📝 Changelog

### Version 1.0.0
* ✅ Authentification JWT
* ✅ Gestion des rôles et permissions
* ✅ Gestion des départements
* ✅ Gestion des employés
* ✅ Interface responsive
* ✅ API REST complète
* ✅ Sécurité et autorisation

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 