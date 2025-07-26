import Head from 'next/head';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Page Non Trouvée - RH App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-red-600">404</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Page Non Trouvée
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            La page que vous recherchez n'existe pas.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center space-y-4">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaHome className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Page précédente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 