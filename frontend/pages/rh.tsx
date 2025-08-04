import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyCheckAlt, 
  FaUserPlus,
  FaUserCog,
  FaFileAlt,
  FaChartLine,
  FaBell,
  FaBuilding,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  avatar?: string;
}

interface PayrollRecord {
  id: number;
  employeeName: string;
  employeeId: number;
  month: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

interface LeaveRequest {
  id: number;
  employeeName: string;
  employeeId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  days: number;
}

interface RHStats {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  pendingLeaves: number;
  totalPayroll: number;
  averageSalary: number;
}

export default function RHDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<RHStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    newHires: 0,
    pendingLeaves: 0,
    totalPayroll: 0,
    averageSalary: 0
  });

  useEffect(() => {
    loadRHData();
  }, []);

  const loadRHData = async () => {
    // Simuler des données d'employés
    const mockEmployees: Employee[] = [
      { id: 1, name: 'Marie Dubois', position: 'Développeur Senior', department: 'IT', email: 'marie.dubois@company.com', phone: '01 23 45 67 89', hireDate: '2022-03-15', salary: 65000, status: 'active' },
      { id: 2, name: 'Jean Martin', position: 'Développeur Frontend', department: 'IT', email: 'jean.martin@company.com', phone: '01 23 45 67 90', hireDate: '2023-01-10', salary: 55000, status: 'active' },
      { id: 3, name: 'Sophie Bernard', position: 'Designer UX/UI', department: 'Design', email: 'sophie.bernard@company.com', phone: '01 23 45 67 91', hireDate: '2022-08-20', salary: 58000, status: 'active' },
      { id: 4, name: 'Pierre Durand', position: 'Développeur Backend', department: 'IT', email: 'pierre.durand@company.com', phone: '01 23 45 67 92', hireDate: '2021-11-05', salary: 62000, status: 'on_leave' },
      { id: 5, name: 'Emma Leroy', position: 'Testeur QA', department: 'Quality', email: 'emma.leroy@company.com', phone: '01 23 45 67 93', hireDate: '2023-06-12', salary: 48000, status: 'active' },
      { id: 6, name: 'Lucas Moreau', position: 'DevOps Engineer', department: 'IT', email: 'lucas.moreau@company.com', phone: '01 23 45 67 94', hireDate: '2022-12-01', salary: 70000, status: 'active' },
      { id: 7, name: 'Chloé Roux', position: 'Product Owner', department: 'Product', email: 'chloe.roux@company.com', phone: '01 23 45 67 95', hireDate: '2021-09-15', salary: 75000, status: 'active' },
      { id: 8, name: 'Thomas Simon', position: 'Scrum Master', department: 'Agile', email: 'thomas.simon@company.com', phone: '01 23 45 67 96', hireDate: '2022-05-20', salary: 68000, status: 'active' },
      { id: 9, name: 'Julie Petit', position: 'Marketing Manager', department: 'Marketing', email: 'julie.petit@company.com', phone: '01 23 45 67 97', hireDate: '2023-03-01', salary: 72000, status: 'active' },
      { id: 10, name: 'Marc Blanc', position: 'Sales Representative', department: 'Sales', email: 'marc.blanc@company.com', phone: '01 23 45 67 98', hireDate: '2023-08-15', salary: 45000, status: 'active' }
    ];

    const mockPayrollRecords: PayrollRecord[] = [
      { id: 1, employeeName: 'Marie Dubois', employeeId: 1, month: '2024-07', baseSalary: 65000, bonuses: 5000, deductions: 12000, netSalary: 58000, status: 'paid' },
      { id: 2, employeeName: 'Jean Martin', employeeId: 2, month: '2024-07', baseSalary: 55000, bonuses: 3000, deductions: 10000, netSalary: 48000, status: 'paid' },
      { id: 3, employeeName: 'Sophie Bernard', employeeId: 3, month: '2024-07', baseSalary: 58000, bonuses: 4000, deductions: 11000, netSalary: 51000, status: 'paid' },
      { id: 4, employeeName: 'Lucas Moreau', employeeId: 6, month: '2024-07', baseSalary: 70000, bonuses: 6000, deductions: 14000, netSalary: 62000, status: 'processed' },
      { id: 5, employeeName: 'Chloé Roux', employeeId: 7, month: '2024-07', baseSalary: 75000, bonuses: 7000, deductions: 15000, netSalary: 67000, status: 'pending' }
    ];

    const mockLeaveRequests: LeaveRequest[] = [
      { id: 1, employeeName: 'Marie Dubois', employeeId: 1, type: 'Congés payés', startDate: '2024-08-15', endDate: '2024-08-23', status: 'pending', reason: 'Vacances d\'été en famille', days: 7 },
      { id: 2, employeeName: 'Jean Martin', employeeId: 2, type: 'Congés payés', startDate: '2024-09-02', endDate: '2024-09-06', status: 'approved', reason: 'Mariage de ma sœur', days: 5 },
      { id: 3, employeeName: 'Sophie Bernard', employeeId: 3, type: 'Congé maladie', startDate: '2024-07-25', endDate: '2024-07-26', status: 'approved', reason: 'Grippe', days: 2 },
      { id: 4, employeeName: 'Emma Leroy', employeeId: 5, type: 'Congés payés', startDate: '2024-08-30', endDate: '2024-09-13', status: 'pending', reason: 'Voyage en Asie', days: 10 },
      { id: 5, employeeName: 'Thomas Simon', employeeId: 8, type: 'Congé parental', startDate: '2024-10-01', endDate: '2024-12-31', status: 'pending', reason: 'Naissance de mon enfant', days: 65 }
    ];

    setEmployees(mockEmployees);
    setPayrollRecords(mockPayrollRecords);
    setLeaveRequests(mockLeaveRequests);
    
    const totalSalary = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    setStats({
      totalEmployees: mockEmployees.length,
      activeEmployees: mockEmployees.filter(e => e.status === 'active').length,
      newHires: mockEmployees.filter(e => new Date(e.hireDate) > new Date('2024-01-01')).length,
      pendingLeaves: mockLeaveRequests.filter(l => l.status === 'pending').length,
      totalPayroll: totalSalary,
      averageSalary: Math.round(totalSalary / mockEmployees.length)
    });
  };

  const handleLeaveAction = (leaveId: number, action: 'approve' | 'reject') => {
    setLeaveRequests(prev => 
      prev.map(leave => 
        leave.id === leaveId 
          ? { ...leave, status: action === 'approve' ? 'approved' : 'rejected' }
          : leave
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: FaChartLine },
    { id: 'employees', name: 'Employés', icon: FaUsers },
    { id: 'payroll', name: 'Paie', icon: FaMoneyCheckAlt },
    { id: 'leaves', name: 'Congés', icon: FaCalendarAlt },
    { id: 'recruitment', name: 'Recrutement', icon: FaUserPlus },
    { id: 'documents', name: 'Documents', icon: FaFileAlt }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Espace RH</h1>
          <p className="text-gray-600 mt-2">
            Gestion des ressources humaines, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaUsers className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Employés</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaUserPlus className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Nouveaux recrutements</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.newHires}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FaClock className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Congés en attente</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaMoneyCheckAlt className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Masse salariale</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPayroll.toLocaleString()} €</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <FaChartLine className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Salaire moyen</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageSalary.toLocaleString()} €</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <FaBuilding className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Départements</p>
                    <p className="text-2xl font-bold text-gray-900">6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques et rapports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Répartition par département</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">IT</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="text-sm font-medium">4</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Design</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm font-medium">1</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Marketing</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm font-medium">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Activités récentes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Nouvel employé recruté</p>
                        <p className="text-xs text-gray-600">Marc Blanc - Sales Representative</p>
                        <p className="text-xs text-gray-500">Il y a 2 semaines</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Congé approuvé</p>
                        <p className="text-xs text-gray-600">Jean Martin - 5 jours</p>
                        <p className="text-xs text-gray-500">Il y a 1 semaine</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Paie traitée</p>
                        <p className="text-xs text-gray-600">Mois de juillet 2024</p>
                        <p className="text-xs text-gray-500">Il y a 3 jours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestion des employés</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                <FaUserPlus className="w-4 h-4" />
                <span>Ajouter un employé</span>
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.salary.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                            {employee.status === 'active' ? 'Actif' : 
                             employee.status === 'inactive' ? 'Inactif' : 'En congé'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestion de la paie</h3>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
                <FaMoneyCheckAlt className="w-4 h-4" />
                <span>Traiter la paie</span>
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire de base</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Déductions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payrollRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employeeName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.baseSalary.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{record.bonuses.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-{record.deductions.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.netSalary.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                            {record.status === 'pending' ? 'En attente' : 
                             record.status === 'processed' ? 'Traité' : 'Payé'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Gestion des congés</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {leaveRequests.map((leave) => (
                  <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                            {leave.status === 'pending' ? 'En attente' : 
                             leave.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                          </div>
                          <span className="text-sm text-gray-600">{leave.type}</span>
                        </div>
                        <p className="font-medium text-gray-900">{leave.employeeName}</p>
                        <p className="text-sm text-gray-600">{leave.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {leave.startDate} → {leave.endDate} ({leave.days} jours)
                        </p>
                      </div>
                      {leave.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'approve')}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center space-x-1"
                          >
                            <FaCheckCircle className="w-3 h-3" />
                            <span>Approuver</span>
                          </button>
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'reject')}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center space-x-1"
                          >
                            <FaTimesCircle className="w-3 h-3" />
                            <span>Rejeter</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recruitment' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recrutement</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                <FaUserPlus className="w-4 h-4" />
                <span>Nouveau poste</span>
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <FaUserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Module de recrutement en cours de développement</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Documents RH</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Gestion des documents en cours de développement</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 