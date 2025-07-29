import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const SuspensionNotification = () => {
  const { user, logout } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    // Vérification périodique du statut (toutes les 30 secondes)
    const checkStatus = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Si l'utilisateur est maintenant suspendu
          if (!userData.isActive && user.isActive) {
            showError('Votre compte a été suspendu. Vous allez être déconnecté.');
            setTimeout(() => {
              logout();
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
      }
    };

    const interval = setInterval(checkStatus, 30000); // 30 secondes
    return () => clearInterval(interval);
  }, [user, logout, showError]);

  return null; // Ce composant ne rend rien visuellement
}; 