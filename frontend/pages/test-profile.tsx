import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function TestProfile() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Test - Page de Profil
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            ✅ Page de Profil Créée
          </h2>
          <p className="text-green-700">
            La page de profil permettant à chaque utilisateur de modifier ses informations est maintenant disponible !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🎯 Fonctionnalités du Profil
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Informations personnelles</strong> : Prénom, nom, email</li>
              <li>• <strong>Coordonnées</strong> : Téléphone, adresse complète</li>
              <li>• <strong>Contact d'urgence</strong> : Personne à contacter</li>
              <li>• <strong>Sécurité</strong> : Changement de mot de passe</li>
              <li>• <strong>Activité</strong> : Historique des actions</li>
              <li>• <strong>Photo de profil</strong> : Upload et gestion</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔗 Accès au Profil
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Navigation</strong> : Lien "Mon Profil" dans le menu</li>
              <li>• <strong>URL directe</strong> : <code>/profile</code></li>
              <li>• <strong>Accessible à tous</strong> : Tous les rôles peuvent modifier leur profil</li>
              <li>• <strong>Mode édition</strong> : Bouton "Modifier" pour activer l'édition</li>
              <li>• <strong>Sauvegarde</strong> : Boutons "Sauvegarder" et "Annuler"</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🚀 Test de la Page de Profil
          </h3>
          <p className="text-blue-700 mb-4">
            Testez maintenant la page de profil avec les fonctionnalités suivantes :
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/profile"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Accéder au profil
            </Link>
            <Link 
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            📋 Instructions de Test
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Cliquez sur "Accéder au profil"</li>
            <li>Vérifiez que toutes les informations s'affichent correctement</li>
            <li>Cliquez sur "Modifier" pour activer le mode édition</li>
            <li>Modifiez quelques champs (email, téléphone, adresse)</li>
            <li>Cliquez sur "Sauvegarder" pour enregistrer les modifications</li>
            <li>Testez les différents onglets (Personnel, Contact, Sécurité, etc.)</li>
            <li>Vérifiez que le lien "Mon Profil" apparaît dans la navigation</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
} 