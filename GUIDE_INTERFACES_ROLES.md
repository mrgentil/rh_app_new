# Guide des Interfaces Adaptées aux Rôles

## Vue d'ensemble

Ce système permet de créer des interfaces qui s'adaptent automatiquement selon le rôle et les permissions de l'utilisateur connecté. Il offre une expérience utilisateur personnalisée et sécurisée.

## Architecture du système

### 1. Système de Permissions

Le système utilise un ensemble de permissions granulaires définies dans `backend/src/types/permissions.ts` :

```typescript
export const PERMISSIONS = {
  EMPLOYEES: {
    VIEW: 'employees:view',
    CREATE: 'employees:create',
    EDIT: 'employees:edit',
    DELETE: 'employees:delete',
    VIEW_SALARY: 'employees:view_salary',
    EDIT_SALARY: 'employees:edit_salary',
    VIEW_PERSONAL: 'employees:view_personal',
    EDIT_PERSONAL: 'employees:edit_personal',
  },
  // ... autres modules
}
```

### 2. Rôles Prédéfinis

Quatre rôles principaux avec leurs permissions :

- **Admin** : Accès complet à toutes les fonctionnalités
- **RH** : Gestion des employés, utilisateurs, congés, paie
- **Manager** : Gestion de son équipe et approbation des congés
- **Employee** : Accès limité à ses propres données

## Composants disponibles

### 1. RoleBasedNavigation

Navigation qui s'adapte selon le rôle de l'utilisateur.

```tsx
import RoleBasedNavigation from '../components/RoleBasedNavigation';

// Dans votre Sidebar
<RoleBasedNavigation />
```

**Fonctionnalités :**
- Affiche uniquement les liens autorisés
- Badges pour les notifications (ex: congés à approuver)
- Indication visuelle de la page active

### 2. RoleBasedDashboard

Tableau de bord adaptatif avec statistiques et actions rapides.

```tsx
import RoleBasedDashboard from '../components/RoleBasedDashboard';

// Dans votre page d'accueil
<RoleBasedDashboard />
```

**Fonctionnalités :**
- Cartes de statistiques selon les permissions
- Actions rapides personnalisées
- Liens directs vers les fonctionnalités autorisées

### 3. PermissionGuard

Composant de protection pour les éléments d'interface.

```tsx
import { PermissionGuard, CreateButton, EditButton, DeleteButton } from '../components/PermissionGuard';

// Protection simple
<PermissionGuard permission={PERMISSIONS.EMPLOYEES.CREATE}>
  <button>Ajouter un employé</button>
</PermissionGuard>

// Boutons prédéfinis
<CreateButton permission={PERMISSIONS.EMPLOYEES.CREATE}>
  Ajouter un employé
</CreateButton>

// Section protégée avec fallback
<ProtectedSection 
  title="Gestion des employés"
  permission={PERMISSIONS.EMPLOYEES.VIEW}
  fallback={<p>Accès non autorisé</p>}
>
  {/* Contenu protégé */}
</ProtectedSection>
```

## Utilisation pratique

### 1. Protection des pages

```tsx
// pages/employes/index.tsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function EmployeesPage() {
  return (
    <ProtectedRoute 
      allowedRoles={['Admin', 'RH']}
      allowedPermissions={[PERMISSIONS.EMPLOYEES.VIEW]}
    >
      <Layout>
        {/* Contenu de la page */}
      </Layout>
    </ProtectedRoute>
  );
}
```

### 2. Protection des actions

```tsx
// Dans un composant de liste d'employés
<div className="flex space-x-2">
  <ViewButton permission={PERMISSIONS.EMPLOYEES.VIEW}>
    Voir
  </ViewButton>
  
  <EditButton permission={PERMISSIONS.EMPLOYEES.EDIT}>
    Modifier
  </EditButton>
  
  <DeleteButton permission={PERMISSIONS.EMPLOYEES.DELETE}>
    Supprimer
  </DeleteButton>
</div>
```

### 3. Affichage conditionnel

```tsx
// Afficher des informations selon les permissions
<PermissionGuard permission={PERMISSIONS.EMPLOYEES.VIEW_SALARY}>
  <div className="salary-info">
    <p>Salaire: {employee.salary} €</p>
  </div>
</PermissionGuard>

<PermissionGuard permission={PERMISSIONS.EMPLOYEES.VIEW_PERSONAL}>
  <div className="personal-info">
    <p>Adresse: {employee.address}</p>
    <p>Téléphone: {employee.phone}</p>
  </div>
</PermissionGuard>
```

## Initialisation du système

### 1. Créer les rôles

```bash
# Dans le dossier backend
npm run ts-node scripts/initializeRoles.ts
```

### 2. Assigner des rôles aux utilisateurs

```typescript
// Via l'API ou directement en base
const user = await User.create({
  username: 'john.doe',
  password: 'hashedPassword',
  roleId: 2, // ID du rôle RH
  // ... autres champs
});
```

## Exemples d'interfaces par rôle

### Admin
- **Navigation** : Tous les modules disponibles
- **Dashboard** : Statistiques complètes, actions d'administration
- **Actions** : Création, modification, suppression de tout

### RH
- **Navigation** : Employés, utilisateurs, départements, paie, congés
- **Dashboard** : Statistiques RH, gestion des employés
- **Actions** : Gestion complète des employés et utilisateurs

### Manager
- **Navigation** : Mon équipe, congés à approuver, documents
- **Dashboard** : Statistiques de l'équipe, demandes en attente
- **Actions** : Approbation des congés, gestion de l'équipe

### Employee
- **Navigation** : Mon profil, mes congés, documents
- **Dashboard** : Mes congés restants, notifications
- **Actions** : Demande de congés, consultation de documents

## Bonnes pratiques

### 1. Vérification côté serveur

Toujours vérifier les permissions côté serveur, même si l'interface les cache :

```typescript
// Dans vos routes API
router.get('/employees', 
  authenticateJWT, 
  authorizePermissions(PERMISSIONS.EMPLOYEES.VIEW),
  async (req, res) => {
    // Logique de la route
  }
);
```

### 2. Messages d'erreur appropriés

```tsx
<ProtectedSection
  permission={PERMISSIONS.EMPLOYEES.VIEW}
  fallback={
    <div className="text-center py-8">
      <p className="text-gray-500">
        Vous n'avez pas les permissions pour accéder à cette section.
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
      </p>
    </div>
  }
>
  {/* Contenu protégé */}
</ProtectedSection>
```

### 3. Tests des permissions

```typescript
// Test des permissions dans vos composants
const hasPermission = (permission: string): boolean => {
  if (!user?.permissions) return false;
  
  try {
    const userPermissions = Array.isArray(user.permissions) 
      ? user.permissions 
      : JSON.parse(user.permissions);
    
    return userPermissions.includes(permission) || userPermissions.includes('all');
  } catch {
    return false;
  }
};
```

## Personnalisation

### 1. Ajouter de nouvelles permissions

```typescript
// Dans backend/src/types/permissions.ts
export const PERMISSIONS = {
  // ... permissions existantes
  NEW_MODULE: {
    VIEW: 'new_module:view',
    CREATE: 'new_module:create',
    EDIT: 'new_module:edit',
    DELETE: 'new_module:delete',
  }
};
```

### 2. Créer de nouveaux rôles

```typescript
// Ajouter dans ROLE_PERMISSIONS
export const ROLE_PERMISSIONS = {
  // ... rôles existants
  NEW_ROLE: [
    PERMISSIONS.NEW_MODULE.VIEW,
    PERMISSIONS.NEW_MODULE.CREATE,
    // ... autres permissions
  ]
};
```

### 3. Composants personnalisés

```tsx
// Créer des composants spécialisés
export function CustomActionButton({ children, permission, ...props }) {
  return (
    <PermissionGuard permission={permission}>
      <button
        {...props}
        className="custom-button-styles"
      >
        {children}
      </button>
    </PermissionGuard>
  );
}
```

## Dépannage

### Problèmes courants

1. **Permissions non reconnues**
   - Vérifier que les permissions sont bien définies dans le fichier types
   - S'assurer que l'utilisateur a bien le rôle assigné

2. **Interface ne s'adapte pas**
   - Vérifier que le hook useAuth retourne bien les permissions
   - Contrôler que les permissions sont au bon format (JSON string ou array)

3. **Erreurs de compilation**
   - S'assurer que les imports des permissions sont corrects
   - Vérifier que les types TypeScript sont bien définis

### Debug

```tsx
// Ajouter des logs pour débugger
console.log('User:', user);
console.log('Permissions:', user?.permissions);
console.log('Role:', user?.role);

// Dans PermissionGuard
console.log('Checking permission:', permission);
console.log('User has permission:', hasPermission());
```

## Conclusion

Ce système d'interfaces adaptées aux rôles offre une solution complète et flexible pour gérer les accès utilisateurs. Il permet de créer des expériences utilisateur personnalisées tout en maintenant la sécurité de l'application.

Pour commencer, utilisez les composants fournis et adaptez-les selon vos besoins spécifiques. N'oubliez pas de toujours vérifier les permissions côté serveur pour une sécurité optimale. 