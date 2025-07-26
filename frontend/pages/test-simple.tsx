import Head from 'next/head';

export default function TestSimplePage() {
  return (
    <>
      <Head>
        <title>Test Simple - RH App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              ✅ Frontend OK !
            </h1>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Test Réussi
                </h3>
                <p className="text-green-700">
                  Le frontend Next.js fonctionne parfaitement.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Test de Navigation
                </h3>
                <div className="space-y-2">
                  <a 
                    href="/login" 
                    className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Aller à la page de login
                  </a>
                  <a 
                    href="/" 
                    className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Aller à la page d'accueil
                  </a>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  Informations
                </h3>
                <div className="text-yellow-700 text-sm space-y-1">
                  <p><strong>URL actuelle:</strong> /test-simple</p>
                  <p><strong>Frontend:</strong> http://localhost:3000</p>
                  <p><strong>Backend:</strong> http://localhost:3001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 