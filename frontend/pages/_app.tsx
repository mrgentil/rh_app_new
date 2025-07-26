import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

// Liste des routes publiques
const publicRoutes = ['/login', '/unauthorized'];

export default function App({ Component, pageProps, router }: AppProps) {
  const isPublic = publicRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {isPublic ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
