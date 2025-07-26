# 🚀 Routes Backend - Application RH

## 📋 Routes Mises à Jour

### 🔐 Authentification (`/auth`)
- **POST** `/login` - Connexion avec username/password
- **GET** `/me` - Informations utilisateur connecté
- **POST** `/logout` - Déconnexion

**Changements :**
- Utilise `username` au lieu de `email`
- Inclut les relations `Role` et `Employee`
- Retourne les permissions du rôle

### 👥 Employés (`/employees`)
- **GET** `/` - Liste des employés avec relations
- **GET** `/:id` - Détails d'un employé avec relations
- **POST** `/` - Créer un employé
- **PUT** `/:id` - Modifier un employé
- **DELETE** `/:id` - Supprimer un employé
- **GET** `/export/csv` - Export CSV
- **GET** `/export/excel` - Export Excel
- **GET** `/:id/contrat` - Export PDF contrat

**Changements :**
- Inclut les relations `JobTitle`, `Department`, `Contract`
- Inclut la hiérarchie manager/subordinates
- Utilise les nouveaux champs (`firstName`, `lastName`, etc.)

### 🏢 Départements (`/departments`) - **NOUVEAU**
- **GET** `/` - Liste des départements avec employés
- **GET** `/:id` - Détails d'un département
- **POST** `/` - Créer un département
- **PUT** `/:id` - Modifier un département
- **DELETE** `/:id` - Supprimer un département

### 💼 Postes (`/job-titles`) - **NOUVEAU**
- **GET** `/` - Liste des postes avec employés
- **GET** `/:id` - Détails d'un poste
- **POST** `/` - Créer un poste
- **PUT** `/:id` - Modifier un poste
- **DELETE** `/:id` - Supprimer un poste

## 🔧 Middleware Mise à Jour

### Authentification
- **authenticateJWT** : Vérifie le token et récupère l'utilisateur avec ses relations
- **authorizeRoles** : Vérifie les rôles (Admin, RH, Manager, Employé)
- **authorizePermissions** : Vérifie les permissions spécifiques

### Changements
- Utilise `roleName` au lieu de `role`
- Inclut les permissions du rôle
- Récupère automatiquement les relations `Role` et `Employee`

## 📊 Structure des Réponses

### Employé avec Relations
```json
{
  "id": 1,
  "firstName": "Admin",
  "lastName": "Système",
  "email": "admin@rh-app.com",
  "phone": "0123456789",
  "hireDate": "2024-01-01T00:00:00.000Z",
  "status": "actif",
  "JobTitle": {
    "title": "Directeur RH",
    "description": "Direction des ressources humaines"
  },
  "Department": {
    "name": "Ressources Humaines",
    "description": "Gestion du personnel"
  },
  "Contract": {
    "type": "CDI",
    "startDate": "2024-01-01T00:00:00.000Z",
    "salary": 50000
  },
  "manager": {
    "firstName": "Manager",
    "lastName": "Nom",
    "email": "manager@example.com"
  }
}
```

### Utilisateur Connecté
```json
{
  "id": 1,
  "username": "admin",
  "role": "Admin",
  "permissions": ["all"],
  "employeeId": 1,
  "employee": {
    "firstName": "Admin",
    "lastName": "Système",
    "email": "admin@rh-app.com",
    "status": "actif"
  }
}
```

## 🧪 Tests

### Script de Test
```bash
npm run test-routes
```

Teste :
1. Connexion Admin
2. Récupération des départements
3. Récupération des postes
4. Récupération des employés avec relations

## 🔑 Identifiants de Test
- **Username** : `admin`
- **Password** : `admin123`

## 🚀 Prochaines Étapes

1. **Tester les routes** avec le script de test
2. **Adapter le frontend** aux nouvelles structures
3. **Créer les routes manquantes** (congés, paie, etc.)
4. **Implémenter les nouvelles fonctionnalités** (recrutement, formations)

## 📝 Notes Importantes

- Toutes les routes utilisent maintenant la nouvelle modélisation
- Les relations sont automatiquement incluses dans les réponses
- La sécurité est basée sur les rôles et permissions
- Les exports (CSV, Excel, PDF) incluent les nouvelles données 