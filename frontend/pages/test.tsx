import Head from 'next/head';

export default function TestPage() {
  return (
    <>
      <Head>
        <title>Test - RH App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ✅ Frontend Fonctionnel !
            </h1>
            
            <div className="space-y-4 text-left">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Test Réussi
                </h3>
                <p className="text-green-700">
                  Le frontend Next.js fonctionne correctement.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Prochaines Étapes
                </h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• <a href="/login" className="underline">Aller à la page de login</a></li>
                  <li>• Vérifier que le backend fonctionne</li>
                  <li>• Tester la connexion</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  URLs de Test
                </h3>
                <div className="text-yellow-700 space-y-1">
                  <p><strong>Frontend:</strong> http://localhost:3000</p>
                  <p><strong>Backend:</strong> http://localhost:3001</p>
                  <p><strong>Login:</strong> http://localhost:3000/login</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Aller à la page de login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 