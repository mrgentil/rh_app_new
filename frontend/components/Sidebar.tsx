import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { 
  FaHome, 
  FaUsers, 
  FaUser, 
  FaCalendarAlt, 
  FaMoneyCheckAlt, 
  FaFileAlt, 
  FaShieldAlt, 
  FaClipboardList, 
  FaCog, 
  FaBuilding,
  FaUserCog,
  FaBell,
  FaUserFriends,
  FaBullseye,
  FaTasks
} from 'react-icons/fa';

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex-shrink-0">
      <div className="mb-8">
        <h1 className="text-xl font-bold">RH App</h1>
        {user && (
          <p className="text-sm text-gray-400 mt-2">
            Connecté en tant que {user.role || 'Utilisateur'}
          </p>
        )}
      </div>
      
      <nav className="space-y-2">
        <Link
          href="/"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaHome className="w-5 h-5" />
          <span>Tableau de bord</span>
        </Link>

        <Link
          href="/profile"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/profile')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaUser className="w-5 h-5" />
          <span>Mon Profil</span>
        </Link>

        {(user?.role === 'Admin' || user?.role === 'RH') && (
          <Link
            href="/employes"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/employes')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaUsers className="w-5 h-5" />
            <span>Employés</span>
          </Link>
        )}

        {(user?.role === 'Admin' || user?.role === 'RH') && (
          <Link
            href="/users"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/users')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaUserCog className="w-5 h-5" />
            <span>Utilisateurs</span>
          </Link>
        )}

        {(user?.role === 'Admin' || user?.role === 'RH' || user?.role === 'Manager') && (
          <Link
            href="/teams"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/teams')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaUserFriends className="w-5 h-5" />
            <span>Équipes</span>
          </Link>
        )}

        {(user?.role === 'Admin' || user?.role === 'RH' || user?.role === 'Manager') && (
          <Link
            href="/objectives"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/objectives')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaBullseye className="w-5 h-5" />
            <span>Objectifs</span>
          </Link>
        )}

        {(user?.role === 'Admin' || user?.role === 'RH' || user?.role === 'Manager') && (
          <Link
            href="/projects"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/projects')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaTasks className="w-5 h-5" />
            <span>Projets</span>
          </Link>
        )}

        {user?.role === 'Admin' && (
          <Link
            href="/departments"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/departments')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaBuilding className="w-5 h-5" />
            <span>Départements</span>
          </Link>
        )}

        {user?.role === 'Admin' && (
          <Link
            href="/roles"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/roles')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaShieldAlt className="w-5 h-5" />
            <span>Rôles</span>
          </Link>
        )}

        <Link
          href="/conges"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/conges')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaCalendarAlt className="w-5 h-5" />
          <span>Congés</span>
        </Link>

        {(user?.role === 'Admin' || user?.role === 'RH') && (
          <Link
            href="/paie"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/paie')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaMoneyCheckAlt className="w-5 h-5" />
            <span>Paie</span>
          </Link>
        )}

        <Link
          href="/documents"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/documents')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaFileAlt className="w-5 h-5" />
          <span>Documents</span>
        </Link>

        {user?.role === 'Admin' && (
          <Link
            href="/audit-logs"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/audit-logs')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaClipboardList className="w-5 h-5" />
            <span>Logs d'audit</span>
          </Link>
        )}

        <Link
          href="/notifications"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/notifications')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaBell className="w-5 h-5" />
          <span>Notifications</span>
        </Link>

        {user?.role === 'Admin' && (
          <Link
            href="/settings"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/settings')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaCog className="w-5 h-5" />
            <span>Configuration</span>
          </Link>
        )}
      </nav>
    </div>
  );
} 