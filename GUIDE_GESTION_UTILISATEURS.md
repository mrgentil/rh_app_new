# Guide de Gestion des Utilisateurs avec Notifications par Email

## 🎯 Vue d'ensemble

Ce système de gestion des utilisateurs offre un CRUD complet avec notifications automatiques par email pour :
- **Création d'utilisateur** : Envoi d'un email pour définir le mot de passe
- **Suspension d'utilisateur** : Notification de suspension avec raison
- **Réactivation d'utilisateur** : Notification de réactivation
- **Suppression d'utilisateur** : Notification de suppression définitive

## 📧 Configuration Email

### Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env` du backend :

```env
# Configuration Email (Mailtrap)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=3f4f39b2ec163b
EMAIL_PASS=a3218bdf1ff3a1

# URL du frontend pour les liens dans les emails
FRONTEND_URL=http://localhost:3000

# Clé secrète JWT pour les tokens de réinitialisation
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Test de la configuration email

```bash
cd backend
npm run test-user-management
```

## 🚀 Fonctionnalités

### 1. Création d'utilisateur

**Processus :**
1. L'administrateur crée un utilisateur via l'interface
2. Un mot de passe temporaire sécurisé est généré automatiquement
3. Un email est envoyé à l'utilisateur avec un lien de réinitialisation
4. L'utilisateur clique sur le lien et définit son mot de passe

**API :**
```http
POST /api/users
Content-Type: application/json
Authorization: Bearer <token>

{
  "username": "john.doe",
  "email": "john.doe@company.com",
  "roleId": 2,
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Suspension d'utilisateur

**Processus :**
1. L'administrateur suspend un utilisateur
2. Un email de notification est envoyé à l'utilisateur
3. L'utilisateur ne peut plus se connecter

**API :**
```http
PUT /api/users/{id}/suspend
Content-Type: application/json
Authorization: Bearer <token>

{
  "reason": "Violation des règles de sécurité"
}
```

### 3. Réactivation d'utilisateur

**Processus :**
1. L'administrateur réactive un utilisateur
2. Un email de notification est envoyé à l'utilisateur
3. L'utilisateur peut se reconnecter avec ses identifiants

**API :**
```http
PUT /api/users/{id}/reactivate
Authorization: Bearer <token>
```

### 4. Suppression d'utilisateur

**Processus :**
1. L'administrateur supprime un utilisateur
2. Un email de notification est envoyé avant la suppression
3. L'utilisateur est définitivement supprimé

**API :**
```http
DELETE /api/users/{id}
Authorization: Bearer <token>
```

### 5. Réinitialisation de mot de passe

**Processus :**
1. L'administrateur demande une réinitialisation
2. Un email avec un nouveau lien est envoyé à l'utilisateur
3. L'utilisateur définit un nouveau mot de passe

**API :**
```http
PUT /api/users/{id}/reset-password
Authorization: Bearer <token>
```

## 🎨 Interface Utilisateur

### Page de gestion des utilisateurs (`/users`)

**Fonctionnalités :**
- ✅ Tableau des utilisateurs avec filtres
- ✅ Statistiques en temps réel
- ✅ Recherche par nom, email, rôle
- ✅ Filtres par rôle et statut
- ✅ Actions rapides (voir, modifier, suspendre, supprimer)
- ✅ Modal de création d'utilisateur
- ✅ Notifications d'erreur/succès

### Page de réinitialisation de mot de passe (`/reset-password`)

**Fonctionnalités :**
- ✅ Validation en temps réel du mot de passe
- ✅ Critères de sécurité affichés
- ✅ Confirmation du mot de passe
- ✅ Interface responsive et moderne

## 🔧 Services Backend

### EmailService (`backend/src/services/emailService.ts`)

**Méthodes principales :**
- `sendPasswordResetEmail()` : Email de création/réinitialisation
- `sendAccountSuspendedEmail()` : Notification de suspension
- `sendAccountDeletedEmail()` : Notification de suppression
- `sendAccountReactivatedEmail()` : Notification de réactivation
- `generateResetToken()` : Génération de token JWT
- `verifyResetToken()` : Vérification de token

### UserService (`backend/src/services/userService.ts`)

**Méthodes principales :**
- `createUser()` : Création avec notification email
- `suspendUser()` : Suspension avec notification
- `reactivateUser()` : Réactivation avec notification
- `deleteUser()` : Suppression avec notification
- `resetUserPassword()` : Réinitialisation avec email
- `searchUsers()` : Recherche avancée
- `getUserStats()` : Statistiques

## 🔒 Sécurité

### Tokens JWT
- Expiration : 24 heures
- Signature : HMAC SHA256
- Payload : userId, email, type

### Validation des mots de passe
- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial

### Permissions
- Seuls les administrateurs peuvent gérer les utilisateurs
- Audit log de toutes les actions
- Validation des données côté serveur

## 📊 Statistiques

Le système fournit des statistiques en temps réel :
- Total d'utilisateurs
- Utilisateurs actifs
- Utilisateurs suspendus
- Répartition par rôle

## 🧪 Tests

### Script de test automatique
```bash
cd backend
npm run test-user-management
```

### Tests manuels
1. Créer un utilisateur via l'interface
2. Vérifier l'email dans Mailtrap
3. Cliquer sur le lien de réinitialisation
4. Définir un nouveau mot de passe
5. Tester la connexion

## 🐛 Dépannage

### Problèmes courants

**1. Emails non envoyés**
- Vérifier les variables d'environnement EMAIL_*
- Tester la connexion SMTP
- Vérifier les logs du serveur

**2. Tokens expirés**
- Vérifier la variable JWT_SECRET
- S'assurer que l'horloge du serveur est synchronisée

**3. Erreurs de base de données**
- Vérifier la connexion à la base de données
- S'assurer que les tables existent
- Vérifier les associations entre modèles

### Logs utiles

```bash
# Logs du serveur backend
cd backend
npm run dev

# Logs des emails
# Vérifier la console pour les messages de succès/erreur
```

## 📝 Exemples d'utilisation

### Créer un utilisateur via l'API

```javascript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    username: 'john.doe',
    email: 'john.doe@company.com',
    roleId: 2,
    firstName: 'John',
    lastName: 'Doe'
  })
});

const result = await response.json();
console.log(result.message); // "Utilisateur créé avec succès. Un email a été envoyé..."
```

### Suspendre un utilisateur

```javascript
const response = await fetch(`/api/users/${userId}/suspend`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    reason: 'Violation des règles de sécurité'
  })
});
```

## 🎉 Conclusion

Ce système de gestion des utilisateurs offre une solution complète et sécurisée avec :
- ✅ Notifications automatiques par email
- ✅ Interface utilisateur moderne
- ✅ API REST complète
- ✅ Sécurité renforcée
- ✅ Audit trail complet
- ✅ Statistiques en temps réel

Pour commencer, configurez vos variables d'environnement et testez la création d'un premier utilisateur ! 