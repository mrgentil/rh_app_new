import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';
import { ToastProvider } from '../components/ToastProvider';

// Liste des routes publiques
const publicRoutes = ['/login', '/unauthorized', '/reset-password'];

export default function App({ Component, pageProps, router }: AppProps) {
  const isPublic = publicRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <ToastProvider>
        {isPublic ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </ToastProvider>
    </AuthProvider>
  );
}
