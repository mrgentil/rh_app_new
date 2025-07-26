import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUsers, FaCalendarAlt, FaMoneyCheckAlt, FaCog, FaSignOutAlt, FaBell, FaSearch } from 'react-icons/fa';
import { MdDashboard, MdPerson } from 'react-icons/md';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <FaUsers className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-900">Velzon RH</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8 ml-10">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <MdDashboard className="text-lg" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/employes"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/employes') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FaUsers className="text-lg" />
                <span>Employés</span>
              </Link>

              <Link
                href="/conges"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/conges') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FaCalendarAlt className="text-lg" />
                <span>Congés</span>
              </Link>

              <Link
                href="/paie"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/paie') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FaMoneyCheckAlt className="text-lg" />
                <span>Paie</span>
              </Link>

              <Link
                href="/users"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/users') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <MdPerson className="text-lg" />
                <span>Utilisateurs</span>
              </Link>
            </div>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <FaBell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
              </button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <Link
            href="/"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MdDashboard className="text-lg" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/employes"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/employes') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FaUsers className="text-lg" />
            <span>Employés</span>
          </Link>

          <Link
            href="/conges"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/conges') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FaCalendarAlt className="text-lg" />
            <span>Congés</span>
          </Link>

          <Link
            href="/paie"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/paie') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FaMoneyCheckAlt className="text-lg" />
            <span>Paie</span>
          </Link>

          <Link
            href="/users"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/users') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MdPerson className="text-lg" />
            <span>Utilisateurs</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
