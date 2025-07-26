# 🚀 Guide de Démarrage - RH App

## ✅ Méthode Simple (Recommandée)

### **Étape 1: Arrêter les processus existants**
```bash
taskkill /f /im node.exe
```

### **Étape 2: Démarrer le Backend**
Ouvrez un **nouveau terminal** et tapez :
```bash
cd backend
npm run dev
```

**Attendez** que vous voyiez :
```
Server running on port 3001
```

### **Étape 3: Démarrer le Frontend**
Ouvrez un **autre terminal** et tapez :
```bash
cd frontend
npm run dev
```

**Attendez** que vous voyiez :
```
Ready in X.Xs
```

### **Étape 4: Tester l'Application**
1. **Ouvrez** http://localhost:3000
2. **Si ça ne marche pas**, testez http://localhost:3000/test
3. **Videz le cache** : Ctrl+Shift+R
4. **Connectez-vous** avec `admin` / `admin123`

## 🔧 Scripts Automatiques

### **Script Robuste**
```bash
.\start-robust.bat
```

### **Script Manuel**
```bash
.\start-manual.bat
```

## 🌐 URLs de Test

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:3001
- **Page de test** : http://localhost:3000/test
- **Page de login** : http://localhost:3000/login

## 🔑 Identifiants

- **Username** : `admin`
- **Password** : `admin123`

## 🛠️ Diagnostic

### **Si le Backend ne démarre pas**
```bash
cd backend
npm run simple-test
```

### **Si le Frontend ne se charge pas**
1. Videz le cache : Ctrl+Shift+R
2. Testez avec un autre navigateur
3. Vérifiez les logs dans le terminal

### **Si vous ne voyez pas la page de login**
1. Allez directement à http://localhost:3000/login
2. Testez http://localhost:3000/test
3. Vérifiez que les deux serveurs sont démarrés

## 🎯 Fonctionnalités Disponibles

✅ **Interface d'Administration** - Page avec onglets  
✅ **Système d'Authentification** - Connexion sécurisée  
✅ **API Backend** - Toutes les routes fonctionnelles  
✅ **Base de Données** - Connectée et opérationnelle  

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** dans les terminaux
2. **Redémarrez** complètement l'application
3. **Videz le cache** du navigateur
4. **Testez** avec un autre navigateur

## 🎉 Succès !

Une fois connecté, vous devriez voir :
- Interface d'administration moderne
- Onglets pour les différentes sections
- Fonctionnalités CRUD complètes
- Navigation fluide sans erreurs

---

**🎯 L'application est prête à être utilisée !** 