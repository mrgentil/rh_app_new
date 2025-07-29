# 🧪 Test des Pages Utilisateur

## 🎯 **Objectif du Test**

Vérifier que les pages de détail et d'édition utilisateur affichent correctement toutes les informations employé après création d'un utilisateur.

## 📋 **Scénarios de Test**

### **Test 1 : Création d'utilisateur avec informations employé complètes**

#### **Étapes :**
1. **Accéder** à `/users`
2. **Cliquer** sur "Créer un utilisateur"
3. **Remplir** le formulaire avec :
   - Nom d'utilisateur : `testuser1`
   - Email : `testuser1@example.com`
   - Rôle : `Admin`
   - Prénom : `Jean`
   - Nom : `Dupont`
   - Téléphone : `0123456789`
   - Adresse : `123 Rue de la Paix, 75001 Paris`
   - Date de naissance : `1990-01-15`
   - Date d'embauche : `2023-01-01`
   - Statut : `Actif`
4. **Cliquer** sur "Créer"
5. **Vérifier** que l'utilisateur apparaît dans la liste
6. **Cliquer** sur l'icône 👁️ pour voir les détails

#### **Résultats attendus :**
- ✅ L'utilisateur est créé avec succès
- ✅ L'email de réinitialisation est envoyé
- ✅ La page de détail affiche toutes les informations employé
- ✅ Les informations sont correctes et complètes

---

### **Test 2 : Vérification de la page de détail**

#### **Étapes :**
1. **Accéder** à la page de détail de l'utilisateur créé
2. **Vérifier** chaque section

#### **Résultats attendus :**

##### **Section "Informations de base"**
- ✅ Nom d'utilisateur : `testuser1`
- ✅ Email : `testuser1@example.com`
- ✅ Rôle : `Admin`
- ✅ Statut : `Actif` (badge vert)

##### **Section "Informations employé"**
- ✅ Nom complet : `Jean Dupont`
- ✅ Téléphone : `0123456789`
- ✅ Adresse : `123 Rue de la Paix, 75001 Paris`
- ✅ Date de naissance : `15 janvier 1990`
- ✅ Date d'embauche : `1er janvier 2023`
- ✅ Statut employé : `Actif`

##### **Section "Sécurité et accès"**
- ✅ Dernière connexion : `Jamais connecté`
- ✅ Compte créé le : Date actuelle
- ✅ Permissions : Liste des permissions du rôle Admin

##### **Section "Actions rapides"**
- ✅ Bouton "Réinitialiser mot de passe" fonctionnel
- ✅ Bouton "Suspendre" fonctionnel
- ✅ Bouton "Supprimer" fonctionnel

---

### **Test 3 : Test de la page d'édition**

#### **Étapes :**
1. **Cliquer** sur le bouton "Modifier" dans la page de détail
2. **Vérifier** que tous les champs sont pré-remplis
3. **Modifier** quelques informations :
   - Téléphone : `0987654321`
   - Adresse : `456 Avenue des Champs, 75008 Paris`
   - Statut employé : `En congé`
4. **Cliquer** sur "Enregistrer"
5. **Retourner** à la page de détail

#### **Résultats attendus :**
- ✅ Tous les champs sont pré-remplis avec les bonnes valeurs
- ✅ Les modifications sont sauvegardées
- ✅ La page de détail affiche les nouvelles informations
- ✅ Le statut employé a changé à "En congé"

---

### **Test 4 : Test des actions rapides**

#### **Test 4.1 : Réinitialisation de mot de passe**
1. **Cliquer** sur "Réinitialiser mot de passe"
2. **Confirmer** l'action
3. **Vérifier** qu'un email est envoyé

#### **Test 4.2 : Suspension d'utilisateur**
1. **Cliquer** sur "Suspendre"
2. **Entrer** une raison : `Test de suspension`
3. **Confirmer** l'action
4. **Vérifier** que le statut change à "Suspendu"

#### **Test 4.3 : Réactivation d'utilisateur**
1. **Cliquer** sur "Réactiver"
2. **Confirmer** l'action
3. **Vérifier** que le statut redevient "Actif"

---

### **Test 5 : Test de validation**

#### **Test 5.1 : Validation des champs obligatoires**
1. **Essayer** de créer un utilisateur sans nom d'utilisateur
2. **Essayer** de créer un utilisateur sans email
3. **Essayer** de créer un utilisateur sans rôle

#### **Test 5.2 : Validation du mot de passe**
1. **Aller** à la page d'édition
2. **Entrer** un mot de passe de moins de 8 caractères
3. **Entrer** une confirmation différente
4. **Vérifier** les messages d'erreur

#### **Résultats attendus :**
- ✅ Les champs obligatoires sont validés
- ✅ Les messages d'erreur s'affichent correctement
- ✅ Le formulaire ne se soumet pas avec des données invalides

---

## 🔧 **Tests Techniques**

### **Test 6 : Vérification des données backend**

#### **Étapes :**
1. **Créer** un utilisateur via l'interface
2. **Vérifier** dans la base de données :
   ```sql
   SELECT * FROM Users WHERE username = 'testuser1';
   SELECT * FROM Employees WHERE email = 'testuser1@example.com';
   ```

#### **Résultats attendus :**
- ✅ L'utilisateur existe dans la table `Users`
- ✅ L'employé existe dans la table `Employees`
- ✅ Les relations sont correctement établies
- ✅ Toutes les données sont sauvegardées

---

### **Test 7 : Test des permissions**

#### **Étapes :**
1. **Se connecter** avec un compte non-admin
2. **Essayer** d'accéder à `/users/1`
3. **Essayer** d'accéder à `/users/1/edit`

#### **Résultats attendus :**
- ✅ Redirection vers `/unauthorized`
- ✅ Accès refusé pour les non-admins

---

## 🐛 **Cas d'Erreur à Tester**

### **Test 8 : Gestion des erreurs**

#### **Test 8.1 : Utilisateur inexistant**
1. **Accéder** à `/users/999999`
2. **Vérifier** le message d'erreur

#### **Test 8.2 : Données invalides**
1. **Essayer** de créer un utilisateur avec un email invalide
2. **Essayer** de créer un utilisateur avec un nom d'utilisateur existant

#### **Test 8.3 : Erreur réseau**
1. **Désactiver** le backend
2. **Essayer** d'accéder aux pages
3. **Vérifier** les messages d'erreur

---

## 📊 **Métriques de Performance**

### **Test 9 : Performance**

#### **Mesures à effectuer :**
- ⏱️ Temps de chargement de la page de détail
- ⏱️ Temps de chargement de la page d'édition
- ⏱️ Temps de sauvegarde des modifications
- 📊 Taille des requêtes réseau

#### **Résultats attendus :**
- ✅ Temps de chargement < 2 secondes
- ✅ Temps de sauvegarde < 1 seconde
- ✅ Pas d'erreurs dans la console

---

## 🎯 **Checklist de Validation**

### **Fonctionnalités**
- [ ] Création d'utilisateur avec informations employé complètes
- [ ] Affichage correct de toutes les informations dans la page de détail
- [ ] Édition complète des informations utilisateur et employé
- [ ] Actions rapides fonctionnelles (suspension, réactivation, suppression)
- [ ] Validation des formulaires
- [ ] Gestion des erreurs

### **Interface**
- [ ] Design responsive sur mobile, tablette et desktop
- [ ] Badges de statut colorés et informatifs
- [ ] Actions rapides accessibles
- [ ] Navigation intuitive
- [ ] Feedback utilisateur (toasts, loading states)

### **Sécurité**
- [ ] Authentification requise
- [ ] Permissions admin vérifiées
- [ ] Validation côté client et serveur
- [ ] Protection CSRF

### **Performance**
- [ ] Chargement rapide des pages
- [ ] Optimisation des requêtes
- [ ] Pas d'erreurs console
- [ ] Expérience utilisateur fluide

---

## 🚀 **Instructions de Test**

### **Prérequis :**
1. **Backend** démarré sur le port 3001
2. **Frontend** démarré sur le port 3000
3. **Base de données** accessible
4. **Compte admin** créé

### **Exécution :**
1. **Suivre** les scénarios de test dans l'ordre
2. **Documenter** les résultats
3. **Signaler** les bugs trouvés
4. **Valider** chaque fonctionnalité

---

**🎯 Objectif : S'assurer que toutes les informations employé s'affichent correctement après création d'un utilisateur !** 