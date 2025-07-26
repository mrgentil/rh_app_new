import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Head from 'next/head';

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirection simple et unique
  useEffect(() => {
    if (!mounted || loading) return;

    const redirectTimer = setTimeout(() => {
      if (!isAuthenticated) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (user?.role) {
        let targetUrl = '/employee';
        
        switch (user.role) {
          case 'Admin':
            targetUrl = '/admin';
            break;
          case 'RH':
            targetUrl = '/rh';
            break;
          case 'Manager':
            targetUrl = '/manager';
            break;
        }
        
        if (typeof window !== 'undefined') {
          window.location.href = targetUrl;
        }
      }
    }, 500);

    return () => clearTimeout(redirectTimer);
  }, [mounted, loading, isAuthenticated, user]);

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

  // Page de redirection
  return (
    <>
      <Head>
        <title>RH App - Redirection...</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    </>
  );
}
