# 📧 Guide de Configuration Gmail SMTP

## 🚨 Erreur d'authentification Gmail

L'erreur `535-5.7.8 Username and Password not accepted` indique que les identifiants Gmail ne sont pas corrects.

## 🔧 Solution : Configuration Gmail SMTP

### 1. **Activez l'authentification à 2 facteurs**
1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur "Sécurité"
3. Activez "Validation en 2 étapes"

### 2. **Générez un mot de passe d'application**
1. Dans "Sécurité", cliquez sur "Mots de passe d'application"
2. Sélectionnez "Autre (nom personnalisé)"
3. Entrez "RH App" comme nom
4. Copiez le mot de passe généré (16 caractères)

### 3. **Configurez les variables d'environnement**

#### Option A : Utilisez le script automatique
```bash
cd backend
.\setup-gmail-env.bat
```

#### Option B : Configuration manuelle
Créez/modifiez le fichier `backend/.env` :
```env
# Configuration Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votreemail@gmail.com
EMAIL_PASS=votre_mot_de_passe_d_application
```

### 4. **Testez la configuration**
```bash
npm run test-email
```

## 🔍 Diagnostic des problèmes

### Vérifiez les utilisateurs sans email
```bash
npm run fix-emails
```

### Problèmes courants :
- ❌ **Mot de passe normal** : Utilisez un mot de passe d'application
- ❌ **2FA désactivé** : Activez la validation en 2 étapes
- ❌ **Email incorrect** : Vérifiez l'adresse email
- ❌ **Utilisateurs sans email** : Corrigez les employés dans la base

## 📋 Checklist de configuration

- [ ] Authentification à 2 facteurs activée
- [ ] Mot de passe d'application généré
- [ ] Variables d'environnement configurées
- [ ] Test email réussi
- [ ] Utilisateurs avec emails valides

## 🎯 Résultat attendu

Après configuration correcte :
- ✅ Emails envoyés directement à Gmail
- ✅ Notifications de création/suppression/suspension
- ✅ Liens d'activation fonctionnels
- ✅ Pas d'erreurs d'authentification 