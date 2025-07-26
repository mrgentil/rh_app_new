import Link from 'next/link';
import { FaHome, FaUsers, FaCalendarAlt, FaMoneyCheckAlt, FaUserCog, FaBuilding } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex-shrink-0">
      <div className="mb-8">
        <h1 className="text-xl font-bold">RH App</h1>
      </div>
      
      <nav className="space-y-2">
        <Link href="/" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <FaHome className="mr-3" />
          <span>Dashboard</span>
        </Link>
        
        <Link href="/employes" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <FaUsers className="mr-3" />
          <span>Employés</span>
        </Link>
        
        <Link href="/departments" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <FaBuilding className="mr-3" />
          <span>Départements</span>
        </Link>
        
        <Link href="/conges" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <FaCalendarAlt className="mr-3" />
          <span>Congés</span>
        </Link>
        
        <Link href="/paie" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <FaMoneyCheckAlt className="mr-3" />
          <span>Paie</span>
        </Link>
        
        <Link href="/users" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
          <FaUserCog className="mr-3" />
          <span>Utilisateurs</span>
        </Link>
      </nav>
    </div>
  );
} 