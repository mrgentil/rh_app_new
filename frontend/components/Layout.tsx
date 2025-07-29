import { useState } from 'react';
import Sidebar from './Sidebar';
import { FaSearch, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { SuspensionNotification } from './SuspensionNotification';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      <SuspensionNotification />
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              
              {/* Search */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {darkMode ? (
                  <FaSun className="h-5 w-5 text-gray-600" />
                ) : (
                  <FaMoon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.email || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Rôle'}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Se déconnecter"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 