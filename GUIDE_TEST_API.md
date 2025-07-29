# Guide de Test de l'API Employés

## 🚀 Étapes pour tester l'API

### 1. Démarrer le Backend

Dans PowerShell, exécutez ces commandes **une par une** :

```powershell
cd backend
npm install
npm run dev
```

Vous devriez voir :
```
🚀 Backend démarré sur http://localhost:3001
📊 Health check: http://localhost:3001/health
🔗 API Base: http://localhost:3001/api
```

### 2. Ajouter des données de test

Dans un **nouveau terminal PowerShell** :

```powershell
cd backend
npm run seed
```

Puis ajoutez des employés de test :

```powershell
npx ts-node src/scripts/addTestEmployees.ts
```

### 3. Démarrer le Frontend

Dans un **troisième terminal PowerShell** :

```powershell
cd frontend
npm install
npm run dev
```

Vous devriez voir :
```
ready - started server on 0.0.0.0:3000
```

### 4. Tester l'API

1. **Ouvrez votre navigateur** et allez sur : `http://localhost:3000/test-api`
2. **Vérifiez les résultats** des tests
3. **Allez sur** : `http://localhost:3000/employes`

## 🔍 Diagnostic des Problèmes

### Si le backend ne démarre pas :

1. **Vérifiez la base de données** :
   ```powershell
   cd backend
   npm run test-connection
   ```

2. **Vérifiez les variables d'environnement** dans `backend/.env`

### Si le frontend ne démarre pas :

1. **Vérifiez les dépendances** :
   ```powershell
   cd frontend
   npm install
   ```

2. **Vérifiez le port 3000** n'est pas utilisé

### Si l'API ne répond pas :

1. **Testez directement** : `http://localhost:3001/health`
2. **Vérifiez les logs** du backend
3. **Vérifiez CORS** dans `backend/src/index.ts`

### Si les données ne s'affichent pas :

1. **Vérifiez la console** du navigateur (F12)
2. **Vérifiez l'onglet Network** pour les erreurs
3. **Testez l'API** sur `/test-api`

## 📋 Checklist de Vérification

- [ ] Backend démarré sur port 3001
- [ ] Frontend démarré sur port 3000
- [ ] Base de données connectée
- [ ] Données de test ajoutées
- [ ] API `/health` répond
- [ ] API `/api/employees` répond
- [ ] Page `/test-api` fonctionne
- [ ] Page `/employes` affiche les données

## 🛠️ Commandes Utiles

```powershell
# Vérifier la connexion DB
cd backend; npm run test-connection

# Voir les tables
cd backend; npm run check-tables

# Ajouter des employés de test
cd backend; npx ts-node src/scripts/addTestEmployees.ts

# Vérifier les utilisateurs
cd backend; npm run check-users
```

## 🔧 Résolution des Erreurs Courantes

### Erreur "Cannot find module"
```powershell
npm install
```

### Erreur "Port already in use"
```powershell
# Trouver le processus
netstat -ano | findstr :3000
# Tuer le processus
taskkill /PID [PID] /F
```

### Erreur "Database connection failed"
- Vérifiez que MySQL/MariaDB est démarré
- Vérifiez les paramètres dans `.env`

### Erreur CORS
- Vérifiez que le frontend est sur `http://localhost:3000`
- Vérifiez la configuration CORS dans le backend

## 📞 Support

Si vous avez des erreurs spécifiques, partagez :
1. Le message d'erreur exact
2. Les logs du terminal
3. Les erreurs de la console navigateur 