import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaUsers, FaBuilding, FaUserShield, FaCog, FaChartBar, FaBell, FaSearch, 
  FaBars, FaHome, FaCalendarAlt, FaMoneyBillWave, FaFileAlt, FaEnvelope,
  FaCog as FaSettings, FaSignOutAlt, FaUser, FaTachometerAlt, FaClipboardList
} from 'react-icons/fa';
import Head from 'next/head';
import DepartmentsManagement from '../../components/admin/DepartmentsManagement';
import RolesManagement from '../../components/admin/RolesManagement';

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaTachometerAlt />, active: true },
    { id: 'employees', name: 'Employés', icon: <FaUsers /> },
    { id: 'departments', name: 'Départements', icon: <FaBuilding /> },
    { id: 'roles', name: 'Rôles', icon: <FaUserShield /> },
    { id: 'leaves', name: 'Congés', icon: <FaCalendarAlt /> },
    { id: 'payroll', name: 'Paie', icon: <FaMoneyBillWave /> },
    { id: 'documents', name: 'Documents', icon: <FaFileAlt /> },
    { id: 'messages', name: 'Messages', icon: <FaEnvelope /> },
    { id: 'reports', name: 'Rapports', icon: <FaChartBar /> },
    { id: 'settings', name: 'Paramètres', icon: <FaSettings /> },
  ];

  const tabs: Tab[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <FaTachometerAlt className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Employés</dt>
                    <dd className="text-2xl font-bold text-gray-900">156</dd>
                    <dd className="text-sm text-green-600">+12% ce mois</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaBuilding className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Départements</dt>
                    <dd className="text-2xl font-bold text-gray-900">8</dd>
                    <dd className="text-sm text-green-600">+1 nouveau</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCalendarAlt className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Congés en cours</dt>
                    <dd className="text-2xl font-bold text-gray-900">12</dd>
                    <dd className="text-sm text-red-600">-3 cette semaine</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaMoneyBillWave className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Masse salariale</dt>
                    <dd className="text-2xl font-bold text-gray-900">€2.5M</dd>
                    <dd className="text-sm text-green-600">+5% ce mois</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des employés</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique d'évolution</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par département</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique circulaire</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
            <div className="space-y-4">
              {[
                { action: 'Nouvel employé ajouté', user: 'John Doe', time: 'Il y a 2h' },
                { action: 'Congé approuvé', user: 'Jane Smith', time: 'Il y a 4h' },
                { action: 'Document uploadé', user: 'Bob Johnson', time: 'Il y a 6h' },
                { action: 'Paie calculée', user: 'Système', time: 'Il y a 1j' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">par {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'employees',
      name: 'Employés',
      icon: <FaUsers className="w-5 h-5" />,
      component: (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Gestion des Employés</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Nouvel Employé
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'John Doe', dept: 'IT', role: 'Développeur', status: 'Actif' },
                  { name: 'Jane Smith', dept: 'RH', role: 'Manager', status: 'Actif' },
                  { name: 'Bob Johnson', dept: 'Marketing', role: 'Analyste', status: 'En congé' }
                ].map((employee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.dept}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Modifier</button>
                      <button className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'departments',
      name: 'Départements',
      icon: <FaBuilding className="w-5 h-5" />,
      component: <DepartmentsManagement />
    },
    {
      id: 'roles',
      name: 'Rôles',
      icon: <FaUserShield className="w-5 h-5" />,
      component: <RolesManagement />
    },
    {
      id: 'leaves',
      name: 'Congés',
      icon: <FaCalendarAlt className="w-5 h-5" />,
      component: (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Gestion des Congés</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Nouvelle Demande
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'John Doe', type: 'Congé annuel', start: '2024-01-15', end: '2024-01-20', status: 'Approuvé' },
                  { name: 'Jane Smith', type: 'Maladie', start: '2024-01-10', end: '2024-01-12', status: 'En attente' },
                  { name: 'Bob Johnson', type: 'Congé parental', start: '2024-02-01', end: '2024-02-28', status: 'Refusé' }
                ].map((leave, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.start}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.end}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        leave.status === 'Approuvé' ? 'bg-green-100 text-green-800' : 
                        leave.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Voir</button>
                      <button className="text-green-600 hover:text-green-900 mr-3">Approuver</button>
                      <button className="text-red-600 hover:text-red-900">Refuser</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'payroll',
      name: 'Paie',
      icon: <FaMoneyBillWave className="w-5 h-5" />,
      component: (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Gestion de la Paie</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Calculer Paie
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire Brut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'John Doe', gross: '3500€', net: '2800€', period: 'Janvier 2024', status: 'Payé' },
                  { name: 'Jane Smith', gross: '4200€', net: '3360€', period: 'Janvier 2024', status: 'En cours' },
                  { name: 'Bob Johnson', gross: '3800€', net: '3040€', period: 'Janvier 2024', status: 'En attente' }
                ].map((payroll, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payroll.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payroll.gross}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payroll.net}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payroll.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payroll.status === 'Payé' ? 'bg-green-100 text-green-800' : 
                        payroll.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Voir</button>
                      <button className="text-green-600 hover:text-green-900">Payer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: <FaFileAlt className="w-5 h-5" />,
      component: (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Gestion des Documents</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Upload Document
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Contrat CDI.pdf', type: 'Contrat', size: '2.5 MB', date: '2024-01-15' },
              { name: 'Bulletin de paie.pdf', type: 'Paie', size: '1.2 MB', date: '2024-01-10' },
              { name: 'Certificat formation.pdf', type: 'Formation', size: '3.1 MB', date: '2024-01-08' },
              { name: 'Avenant contrat.pdf', type: 'Contrat', size: '1.8 MB', date: '2024-01-05' },
              { name: 'Attestation travail.pdf', type: 'Attestation', size: '0.9 MB', date: '2024-01-03' },
              { name: 'Règlement intérieur.pdf', type: 'Règlement', size: '4.2 MB', date: '2024-01-01' }
            ].map((doc, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                    <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                    <p className="text-xs text-gray-400">{doc.date}</p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Télécharger</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: <FaEnvelope className="w-5 h-5" />,
      component: (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Nouveau Message
            </button>
          </div>
          <div className="space-y-4">
            {[
              { from: 'John Doe', subject: 'Demande de congé', message: 'Bonjour, je souhaite poser des congés...', date: 'Il y a 2h', unread: true },
              { from: 'Jane Smith', subject: 'Question RH', message: 'Pouvez-vous me renseigner sur...', date: 'Il y a 4h', unread: false },
              { from: 'Bob Johnson', subject: 'Document manquant', message: 'Il manque le document suivant...', date: 'Il y a 1j', unread: true }
            ].map((msg, index) => (
              <div key={index} className={`p-4 border rounded-lg ${msg.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{msg.from}</h4>
                      {msg.unread && <span className="h-2 w-2 bg-blue-600 rounded-full"></span>}
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-1">{msg.subject}</p>
                    <p className="text-sm text-gray-500 mt-1 truncate">{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{msg.date}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Répondre</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      name: 'Rapports',
      icon: <FaChartBar className="w-5 h-5" />,
      component: (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Rapports</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Nouveau Rapport
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Rapport employés', type: 'Mensuel', status: 'Généré' },
              { name: 'Rapport congés', type: 'Trimestriel', status: 'En cours' },
              { name: 'Rapport paie', type: 'Mensuel', status: 'Généré' },
              { name: 'Rapport formation', type: 'Annuel', status: 'En attente' },
              { name: 'Rapport performance', type: 'Semestriel', status: 'Généré' },
              { name: 'Rapport budget', type: 'Annuel', status: 'En cours' }
            ].map((report, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-500">{report.type}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                      report.status === 'Généré' ? 'bg-green-100 text-green-800' : 
                      report.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Voir</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Télécharger</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: <FaSettings className="w-5 h-5" />,
      component: (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Paramètres de l'Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Paramètres Généraux</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Notifications par email</span>
                  <button className="bg-blue-600 w-12 h-6 rounded-full relative">
                    <div className="bg-white w-4 h-4 rounded-full absolute top-1 right-1"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Mode sombre</span>
                  <button className="bg-gray-300 w-12 h-6 rounded-full relative">
                    <div className="bg-white w-4 h-4 rounded-full absolute top-1 left-1"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auto-sauvegarde</span>
                  <button className="bg-blue-600 w-12 h-6 rounded-full relative">
                    <div className="bg-white w-4 h-4 rounded-full absolute top-1 right-1"></div>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Sécurité</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Changer le mot de passe</div>
                  <div className="text-sm text-gray-500">Mettre à jour votre mot de passe</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Authentification à deux facteurs</div>
                  <div className="text-sm text-gray-500">Activer la 2FA</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Sessions actives</div>
                  <div className="text-sm text-gray-500">Gérer les connexions</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!mounted) {
    return (
      <>
        <Head>
          <title>Administration - RH App</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Administration - RH App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
          <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
            <h1 className="text-xl font-bold text-white">RH App</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* User section at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.employee?.firstName?.[0]}{user?.employee?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {user?.employee?.firstName} {user?.employee?.lastName}
                </p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white"
                title="Déconnexion"
              >
                <FaSignOutAlt className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-margin duration-300 ease-in-out`}>
          {/* Top bar */}
          <div className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-500 hover:text-gray-700 lg:hidden"
                >
                  <FaBars className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <FaBell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </>
  );
} 