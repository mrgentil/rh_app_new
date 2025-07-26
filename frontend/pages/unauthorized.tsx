import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Accès Non Autorisé - RH App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <FaLock className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accès Non Autorisé
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Rôle actuel : <span className="font-medium text-gray-900">{user?.role || 'Non défini'}</span>
                </p>
                {user?.employee && (
                  <p className="text-sm text-gray-600 mt-1">
                    Employé : {user.employee.firstName} {user.employee.lastName}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaHome className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </button>
                
                <button
                  onClick={() => router.back()}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaArrowLeft className="mr-2 h-4 w-4" />
                  Page précédente
                </button>
              </div>

              <div className="mt-6">
                <p className="text-xs text-gray-500">
                  Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 