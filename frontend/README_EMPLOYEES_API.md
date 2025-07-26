# Intégration API Employés - Frontend

Ce document décrit l'intégration complète de l'API des employés avec le frontend Next.js.

## Architecture

### 1. Service API (`services/employeeService.ts`)

Le service centralisé gère toutes les opérations CRUD avec l'API backend :

```typescript
// Configuration
const API_BASE_URL = '/api'; // Utilise les rewrites Next.js

// Types TypeScript
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // ... autres propriétés
}

// Service principal
export const employeeService = {
  getAllEmployees(): Promise<Employee[]>,
  getEmployeeById(id: number): Promise<Employee>,
  createEmployee(data: CreateEmployeeData): Promise<Employee>,
  updateEmployee(id: number, data: UpdateEmployeeData): Promise<Employee>,
  deleteEmployee(id: number): Promise<void>,
  // ... autres méthodes
};
```

### 2. Hook personnalisé (`hooks/useEmployees.tsx`)

Hook React pour gérer l'état des employés :

```typescript
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Méthodes CRUD avec gestion d'état automatique
  const fetchEmployees = useCallback(async () => { /* ... */ }, []);
  const createEmployee = useCallback(async (data) => { /* ... */ }, []);
  // ... autres méthodes
  
  return { employees, loading, error, fetchEmployees, createEmployee, /* ... */ };
}
```

### 3. Composants

#### EmployeeTable (`components/EmployeeTable.tsx`)
- Tableau interactif avec tri et recherche
- Actions CRUD intégrées
- Gestion des permissions

#### Pages principales :
- `/employes` - Vue grille (cartes)
- `/employes/table` - Vue tableau
- `/employes/nouveau` - Création d'employé
- `/employes/[id]` - Détails d'un employé

## Fonctionnalités

### ✅ Opérations CRUD complètes
- **Create** : Création d'employés avec formulaire complet
- **Read** : Affichage liste + détails avec relations
- **Update** : Modification d'employés existants
- **Delete** : Suppression avec confirmation

### ✅ Export de données
- Export CSV des employés
- Export Excel des employés
- Téléchargement de contrats PDF

### ✅ Interface utilisateur
- Vue grille (cartes) et tableau
- Recherche et filtrage
- Tri par colonnes
- Gestion des permissions (Admin/RH)

### ✅ Gestion d'erreurs
- Intercepteurs axios pour erreurs 401
- Messages d'erreur utilisateur
- États de chargement

## Configuration

### 1. Rewrites Next.js (`next.config.js`)

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',
    },
  ];
}
```

### 2. Authentification

Le service utilise `withCredentials: true` pour les cookies de session.

### 3. Types TypeScript

Tous les types sont définis dans `services/employeeService.ts` :
- `Employee` - Employé complet avec relations
- `CreateEmployeeData` - Données pour création
- `UpdateEmployeeData` - Données pour mise à jour

## Utilisation

### Dans un composant

```typescript
import { useEmployees } from '../hooks/useEmployees';
import { employeeService } from '../services/employeeService';

function MyComponent() {
  const { employees, loading, error, createEmployee } = useEmployees();
  
  const handleCreate = async (data) => {
    try {
      await createEmployee(data);
      // L'état est automatiquement mis à jour
    } catch (error) {
      // Gestion d'erreur
    }
  };
  
  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      <EmployeeList employees={employees} />
    </div>
  );
}
```

### Export de données

```typescript
import { downloadUtils } from '../services/employeeService';

// Export CSV
await downloadUtils.downloadEmployeesCSV();

// Export Excel
await downloadUtils.downloadEmployeesExcel();

// Contrat PDF
await downloadUtils.downloadEmployeeContract(employeeId, employeeName);
```

## Permissions

Les permissions sont gérées via le hook `useAuth` :

```typescript
const { user } = useAuth();
const canEdit = user && (user.role === 'Admin' || user.role === 'RH');
const canDelete = user && user.role === 'Admin';
```

## Endpoints API utilisés

- `GET /api/employees` - Liste des employés
- `GET /api/employees/:id` - Détails d'un employé
- `POST /api/employees` - Créer un employé
- `PUT /api/employees/:id` - Modifier un employé
- `DELETE /api/employees/:id` - Supprimer un employé
- `GET /api/employees/export/csv` - Export CSV
- `GET /api/employees/export/excel` - Export Excel
- `GET /api/employees/:id/contrat` - Contrat PDF

## Gestion des erreurs

1. **Erreurs réseau** : Interceptées par axios
2. **Erreurs 401** : Redirection automatique vers `/login`
3. **Erreurs métier** : Affichées à l'utilisateur
4. **États de chargement** : Gérés automatiquement

## Améliorations futures

- [ ] Pagination côté serveur
- [ ] Filtres avancés (date, département, etc.)
- [ ] Upload de photos d'employés
- [ ] Notifications en temps réel
- [ ] Mode hors ligne
- [ ] Tests unitaires et d'intégration 