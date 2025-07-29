# 📋 Guide des Autorisations - Gestion des Employés

## 🎯 **Vue d'ensemble**

Ce guide documente les règles d'autorisation (RBAC - Role-Based Access Control) mises en place pour la gestion des employés dans l'application RH.

## 👥 **Rôles et Permissions**

### **Admin** 🔴
- **Peut créer** : Tous les types d'employés (Admin, RH, Manager, Comptable, Employé)
- **Peut modifier** : Tous les employés
- **Peut supprimer** : Tous les employés
- **Peut promouvoir** : N'importe quel employé en Admin
- **Accès complet** : Toutes les fonctionnalités

### **RH (Ressources Humaines)** 🟡
- **Peut créer** : RH, Manager, Comptable, Employé (mais PAS Admin)
- **Peut modifier** : Tous les employés sauf les Admin
- **Peut supprimer** : Aucun employé
- **Peut promouvoir** : Aucun employé en Admin
- **Accès limité** : Gestion des employés non-admin

### **Manager** 🟢
- **Peut créer** : Aucun employé
- **Peut modifier** : Aucun employé
- **Peut supprimer** : Aucun employé
- **Accès lecture** : Voir les employés de son équipe

### **Comptable** 🔵
- **Peut créer** : Aucun employé
- **Peut modifier** : Aucun employé
- **Peut supprimer** : Aucun employé
- **Accès lecture** : Voir les employés pour la paie

### **Employé** ⚪
- **Peut créer** : Aucun employé
- **Peut modifier** : Aucun employé
- **Peut supprimer** : Aucun employé
- **Accès lecture** : Voir ses propres informations
- **Peut voir** : Tous les autres employés
- **Peut demander** : Des congés

### **Stagiaire** 🟠
- **Peut créer** : Aucun employé
- **Peut modifier** : Aucun employé
- **Peut supprimer** : Aucun employé
- **Accès lecture** : Voir ses propres informations
- **Peut voir** : Tous les autres employés
- **Durée limitée** : Contrat temporaire (3-6 mois)
- **Pas de congés** : Ne peut pas demander de congés
- **Compte utilisateur** : Automatiquement créé avec mot de passe temporaire

## 🛡️ **Sécurité Backend**

### **Routes protégées**
```typescript
// Création d'employé
router.post('/', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  // Vérification supplémentaire : seul un Admin peut créer un Admin
  if (req.user.roleName === 'RH' && req.body.roleId) {
    const role = await Role.findByPk(req.body.roleId);
    if (role && role.name === 'Admin') {
      return res.status(403).json({ error: 'Seul un Admin peut créer un autre Admin.' });
    }
  }
  // ... création de l'employé
});

// Modification d'employé
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  // Vérification supplémentaire : seul un Admin peut promouvoir en Admin
  if (req.user.roleName === 'RH' && req.body.roleId) {
    const role = await Role.findByPk(req.body.roleId);
    if (role && role.name === 'Admin') {
      return res.status(403).json({ error: 'Seul un Admin peut promouvoir un employé en Admin.' });
    }
  }
  // ... modification de l'employé
});

// Suppression d'employé
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  // Seul un Admin peut supprimer un employé
});
```

### **Création automatique de compte utilisateur**
- Lors de la création d'un employé avec un `roleId`, un compte utilisateur est automatiquement créé
- Mot de passe temporaire généré automatiquement
- L'employé devra changer son mot de passe à sa première connexion

## 🎨 **Interface Frontend**

### **Affichage conditionnel des boutons**
```typescript
// Bouton "Nouvel Employé"
const canEdit = user && (user.roleName === 'Admin' || user.roleName === 'RH');
{canEdit && (
  <Link href="/employes/nouveau" className="btn-primary">
    Nouvel Employé
  </Link>
)}

// Boutons d'action sur les cartes employés
{canEdit && (
  <>
    <Link href={`/employes/${emp.id}/edit`}>Modifier</Link>
    {user.roleName === 'Admin' && (
      <button onClick={() => handleDelete(emp.id)}>Supprimer</button>
    )}
  </>
)}
```

### **Restrictions dans les formulaires**
```typescript
// Sélection de rôle limitée pour les RH
const canCreateAdmin = user.roleName === 'Admin';
{canCreateAdmin && (
  <select name="roleId">
    <option value="">Aucun compte utilisateur</option>
    {availableRoles.map(role => (
      <option key={role.id} value={role.id}>{role.name}</option>
    ))}
  </select>
)}

// Message d'information pour les RH
{!canCreateAdmin && user?.roleName === 'RH' && (
  <div className="info-box">
    <strong>Note :</strong> En tant que RH, vous ne pouvez pas créer de comptes administrateurs.
  </div>
)}
```

## 📊 **Matrice des Permissions**

| Action | Admin | RH | Manager | Comptable | Employé | Stagiaire |
|--------|-------|----|---------|-----------|---------|-----------|
| **Créer Admin** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Créer RH** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Créer Manager** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Créer Comptable** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Créer Employé** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Créer Stagiaire** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Modifier Admin** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Modifier autres** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Supprimer** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Voir tous** | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ |
| **Demander congés** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

⚠️ = Lecture limitée selon les règles métier

## 🔧 **Services Frontend**

### **RoleService**
```typescript
// Récupère les rôles disponibles selon les permissions
async getAvailableRolesForEmployeeCreation(userRole: string): Promise<Role[]> {
  const allRoles = await this.getAllRoles();
  
  if (userRole === 'RH') {
    return allRoles.filter(role => role.name !== 'Admin');
  }
  
  if (userRole === 'Admin') {
    return allRoles;
  }
  
  return []; // Pas de permission
}
```

## 🚀 **Workflow de Création d'Employé**

1. **Admin ou RH** accède à `/employes/nouveau`
2. **Remplit le formulaire** avec les informations de l'employé
3. **Sélectionne le type d'employé** (permanent, CDI, CDD, stagiaire)
4. **Le rôle est automatiquement attribué** selon le type (Stagiaire → rôle Stagiaire, autres → rôle Employé)
5. **Soumet le formulaire**
6. **Backend vérifie** les permissions
7. **Crée l'employé** dans la base de données
8. **Crée automatiquement** un compte utilisateur pour TOUS les employés
9. **Génère un mot de passe** temporaire
10. **Notifie les admins** de la création
11. **Redirige vers** la liste des employés

## 🆕 **Nouveautés - Tous Connectés**

### **Changements majeurs :**
- ✅ **Tous les employés ont un compte utilisateur** (obligatoire)
- ✅ **Rôle automatique** selon le type d'employé
- ✅ **Nouveau rôle "Stagiaire"** avec permissions limitées
- ✅ **Types d'employés** : permanent, CDI, CDD, stagiaire
- ✅ **Durée de contrat** pour les contrats temporaires
- ✅ **Mot de passe temporaire** généré automatiquement

## 🔒 **Bonnes Pratiques de Sécurité**

1. **Vérification côté serveur** : Toutes les vérifications d'autorisation sont faites côté backend
2. **Interface adaptative** : Le frontend s'adapte aux permissions de l'utilisateur
3. **Messages informatifs** : Les utilisateurs comprennent pourquoi certaines options sont indisponibles
4. **Audit trail** : Toutes les actions sont loggées
5. **Validation des données** : Vérification des permissions avant traitement

## 📝 **Notes d'Implémentation**

- Les vérifications de rôles utilisent `user.roleName` (pas `user.role`)
- Les permissions sont vérifiées à la fois côté frontend (UI) et backend (API)
- Les messages d'erreur sont explicites pour guider l'utilisateur
- Le système est extensible pour ajouter de nouveaux rôles ou permissions

---

*Dernière mise à jour : [Date actuelle]* 