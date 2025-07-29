import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Head from 'next/head';
import Layout from '../components/Layout';
import { FaUsers, FaBuilding, FaCalendarAlt, FaMoneyCheckAlt, FaUserCog, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirection vers login si non authentifié
  useEffect(() => {
    if (!mounted || loading) return;

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [mounted, loading, isAuthenticated]);

  // Afficher un loader pendant le chargement
  if (!mounted || loading) {
    return (
      <>
        <Head>
          <title>RH App - Chargement...</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de l'application...</p>
          </div>
        </div>
      </>
    );
  }

  // Si non authentifié, afficher le loader de redirection
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>RH App - Redirection...</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirection vers la connexion...</p>
          </div>
        </div>
      </>
    );
  }

  // Page d'accueil avec dashboard
  return (
    <>
      <Head>
        <title>RH App - Tableau de bord</title>
      </Head>
      <Layout>
        <div className="p-6">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenue, {user?.username || 'Utilisateur'} !
            </h1>
            <p className="text-gray-600">
              Gérez vos ressources humaines depuis ce tableau de bord centralisé.
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaUsers className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employés</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FaBuilding className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Départements</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FaCalendarAlt className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Congés en cours</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FaMoneyCheckAlt className="text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paie du mois</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modules principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/employes" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <FaUsers className="text-2xl" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Gestion des Employés</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Consultez, ajoutez et gérez tous les employés de l'entreprise.
                </p>
                <div className="text-blue-600 font-medium group-hover:text-blue-700">
                  Accéder →
                </div>
              </div>
            </Link>

            <Link href="/departments" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                    <FaBuilding className="text-2xl" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Départements</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Organisez la structure de votre entreprise par départements.
                </p>
                <div className="text-green-600 font-medium group-hover:text-green-700">
                  Accéder →
                </div>
              </div>
            </Link>

            <Link href="/conges" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200 transition-colors">
                    <FaCalendarAlt className="text-2xl" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Gestion des Congés</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Gérez les demandes de congés et les absences du personnel.
                </p>
                <div className="text-yellow-600 font-medium group-hover:text-yellow-700">
                  Accéder →
                </div>
              </div>
            </Link>

            <Link href="/paie" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <FaMoneyCheckAlt className="text-2xl" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Gestion de la Paie</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Calculez et gérez les salaires et les bulletins de paie.
                </p>
                <div className="text-purple-600 font-medium group-hover:text-purple-700">
                  Accéder →
                </div>
              </div>
            </Link>

            <Link href="/users" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                    <FaUserCog className="text-2xl" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Utilisateurs</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Gérez les comptes utilisateurs et les permissions d'accès.
                </p>
                <div className="text-indigo-600 font-medium group-hover:text-indigo-700">
                  Accéder →
                </div>
              </div>
            </Link>

            <Link href="/roles" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                    <FaChartLine className="text-2xl" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Rôles & Permissions</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Configurez les rôles et les permissions d'accès au système.
                </p>
                <div className="text-red-600 font-medium group-hover:text-red-700">
                  Accéder →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
