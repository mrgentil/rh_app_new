# 🔧 Guide de Dépannage - RH App

## 🚨 Erreurs Courantes et Solutions

### 1. Erreur "SecurityError: The operation is insecure"

**Symptômes :**
- Erreur lors de la navigation entre les pages
- Problème de redirection après connexion

**Solutions :**
1. **Utiliser le script PowerShell** : `start-app.ps1` au lieu du script batch
2. **Redémarrer les serveurs** dans l'ordre :
   - Backend d'abord
   - Frontend ensuite
3. **Vider le cache du navigateur** (Ctrl+F5)
4. **Utiliser un navigateur différent** (Chrome, Firefox, Edge)

### 2. Erreur "Missing script: dev"

**Symptômes :**
- `npm run dev` ne fonctionne pas
- Script non trouvé

**Solutions :**
1. **Vérifier le répertoire** : Assurez-vous d'être dans le bon dossier
   ```bash
   cd backend    # Pour le backend
   cd frontend   # Pour le frontend
   ```
2. **Installer les dépendances** :
   ```bash
   npm install
   ```
3. **Vérifier package.json** : Le script "dev" doit être présent

### 3. Erreur de connexion à la base de données

**Symptômes :**
- Erreur "Connection refused"
- Impossible de se connecter à MySQL

**Solutions :**
1. **Vérifier que MySQL est démarré** (via Laragon)
2. **Vérifier les paramètres de connexion** dans `.env`
3. **Créer la base de données** :
   ```bash
   cd backend
   npm run migrate
   npm run seed
   npm run create-admin
   ```

### 4. Erreur "Port already in use"

**Symptômes :**
- Port 3001 ou 3000 déjà utilisé
- Impossible de démarrer les serveurs

**Solutions :**
1. **Trouver et arrêter le processus** :
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```
2. **Changer le port** dans les fichiers de configuration
3. **Redémarrer l'ordinateur**

### 5. Erreur "Module not found"

**Symptômes :**
- Erreur d'import de modules
- Composants non trouvés

**Solutions :**
1. **Installer les dépendances manquantes** :
   ```bash
   npm install react-icons
   npm install axios
   ```
2. **Vérifier les imports** dans les fichiers
3. **Redémarrer le serveur de développement**

## 🔍 Diagnostic

### Vérifier l'état des serveurs

1. **Backend** :
   ```bash
   cd backend
   npm run simple-test
   ```

2. **Frontend** :
   - Ouvrir http://localhost:3000
   - Vérifier la console du navigateur (F12)

### Logs utiles

1. **Backend** : Regarder les logs dans le terminal
2. **Frontend** : Console du navigateur (F12)
3. **Base de données** : Logs MySQL dans Laragon

## 🚀 Démarrage Recommandé

### Option 1: Script PowerShell (Recommandé)
```powershell
.\start-app.ps1
```

### Option 2: Démarrage manuel
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (après 5 secondes)
cd frontend
npm run dev
```

## 🔑 Identifiants de Test

- **Username:** `admin`
- **Password:** `admin123`

## 📞 Support

Si les problèmes persistent :

1. **Vérifiez les prérequis** :
   - Node.js 16+
   - MySQL 8.0+
   - npm ou yarn

2. **Redémarrez tout** :
   - Arrêtez tous les serveurs
   - Redémarrez Laragon
   - Relancez les serveurs

3. **Vérifiez les ports** :
   - 3001 (Backend)
   - 3000 (Frontend)
   - 3306 (MySQL)

4. **Testez l'API** :
   ```bash
   cd backend
   npm run simple-test
   ```

## 🎯 Solutions Rapides

### Problème de navigation
- Utilisez `window.location.href` au lieu de `router.push()`
- Ajoutez des délais avec `setTimeout()`

### Problème d'authentification
- Vérifiez que l'utilisateur admin existe
- Recréez l'admin : `npm run create-admin`

### Problème de base de données
- Remigrez : `npm run migrate`
- Reseedez : `npm run seed`

### Problème de dépendances
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez : `npm install` 