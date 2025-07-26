import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    // Navigation vers le profil
    router.push('/profile');
  };

  const handleSettings = () => {
    // Navigation vers les paramètres
    router.push('/settings');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-indigo-600">RH App</h1>
            </div>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.employee?.firstName} {user.employee?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProfile}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Profil"
                >
                  <FaUser className="h-4 w-4" />
                </button>
                
                <button
                  onClick={handleSettings}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Paramètres"
                >
                  <FaCog className="h-4 w-4" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Déconnexion"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 