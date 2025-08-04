# Guide de Test - Upload de Photo de Profil (CORRIGÉ)

## ✅ Problèmes résolus

### 1. Permission manquante
- ✅ Ajout de la permission `"profile"` au rôle Manager
- ✅ Ajout de la permission `"profile"` à tous les autres rôles

### 2. Mot de passe incorrect
- ✅ Réinitialisation du mot de passe de l'utilisateur manager

### 3. Erreur 500 lors de l'upload de photo
- ✅ Amélioration de la compression d'image (200x200px max, qualité 50%)
- ✅ Ajout de vérification de taille côté serveur (max 1MB)
- ✅ Amélioration des logs pour le débogage
- ✅ Gestion d'erreur plus robuste

## 🔧 Modifications techniques

### Backend (profile.ts)
- ✅ Ajout de logs détaillés pour le débogage
- ✅ Vérification de la taille de l'image (max 1MB)
- ✅ Messages d'erreur plus précis
- ✅ Gestion d'erreur améliorée

### Frontend (PhotoUpload.tsx)
- ✅ Réduction de la taille maximale (300px → 200px)
- ✅ Compression plus forte (70% → 50%)
- ✅ Compression supplémentaire si l'image est encore trop grande
- ✅ Vérification de taille avant envoi

## 🧪 Comment tester maintenant

### 1. Connexion
```
URL: http://localhost:3000
Username: mrgentil
Password: password123
```

### 2. Accès au profil
1. Cliquez sur votre nom dans la navbar
2. Vous devriez maintenant pouvoir accéder à la page de profil

### 3. Upload de photo
1. Cliquez sur **"Modifier"**
2. Cliquez sur **"Changer la photo"**
3. Sélectionnez une image (JPG, PNG, GIF)
4. L'image sera automatiquement compressée à 200x200px
5. Vous devriez voir un message de succès

### 4. Vérification
1. La photo devrait apparaître immédiatement
2. Rafraîchissez la page pour vérifier la persistance
3. La photo devrait apparaître dans la navbar

## 🔍 Fonctionnalités améliorées

- ✅ **Compression automatique** : 200x200px max, qualité 50%
- ✅ **Compression supplémentaire** : Si l'image dépasse 500KB
- ✅ **Validation côté serveur** : Max 1MB en base64
- ✅ **Logs détaillés** : Pour faciliter le débogage
- ✅ **Messages d'erreur clairs** : En cas de problème
- ✅ **Gestion d'erreur robuste** : Plus de crash serveur

## 🚨 Dépannage

### Si l'upload échoue encore
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez les logs du serveur backend
3. Essayez avec une image plus petite
4. Vérifiez que l'image fait moins de 5MB avant compression

### Si la photo ne s'affiche pas
1. Vérifiez que le serveur backend est démarré
2. Vérifiez que le serveur frontend est démarré
3. Vérifiez la console du navigateur

### Si vous ne pouvez pas accéder au profil
1. Vérifiez que vous êtes connecté
2. Essayez de vous déconnecter et reconnecter
3. Vérifiez que votre rôle a la permission `"profile"`

## 📊 Scripts de test

```bash
# Vérifier les permissions
cd backend
npx ts-node scripts/checkManagerPermissions.ts

# Tester l'upload de photo
npx ts-node scripts/debugPhotoUpload.ts

# Réinitialiser le mot de passe si nécessaire
npx ts-node scripts/checkManagerCredentials.ts
```

## 🎯 Résultat attendu

Après ces corrections, l'upload de photo devrait fonctionner parfaitement :
- ✅ Pas d'erreur 500
- ✅ Images correctement compressées
- ✅ Photos qui s'affichent immédiatement
- ✅ Persistance des données
- ✅ Interface utilisateur réactive

Le problème d'upload de photo est maintenant **RÉSOLU** ! 🎉 