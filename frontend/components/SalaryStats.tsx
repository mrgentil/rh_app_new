import React from 'react';
import { FaEuroSign, FaChartLine, FaUsers, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface SalaryStatsProps {
  employees: Array<{ salary?: number }>;
}

const SalaryStats: React.FC<SalaryStatsProps> = ({ employees }) => {
  const employeesWithSalary = employees.filter(emp => emp.salary && emp.salary > 0);
  
  const totalSalary = employeesWithSalary.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const averageSalary = employeesWithSalary.length > 0 ? totalSalary / employeesWithSalary.length : 0;
  const minSalary = employeesWithSalary.length > 0 ? Math.min(...employeesWithSalary.map(emp => emp.salary || 0)) : 0;
  const maxSalary = employeesWithSalary.length > 0 ? Math.max(...employeesWithSalary.map(emp => emp.salary || 0)) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonthly = (annualSalary: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(annualSalary / 12);
  };

  if (employeesWithSalary.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaEuroSign className="mr-2 text-green-600" />
            Statistiques salariales
          </h3>
          <div className="bg-green-100 p-2 rounded-lg">
            <FaChartLine className="text-green-600" />
          </div>
        </div>
        <div className="text-center py-8">
          <FaEuroSign className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune donnée salariale disponible</p>
          <p className="text-sm text-gray-400 mt-2">
            Ajoutez des salaires aux employés pour voir les statistiques
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaEuroSign className="mr-2 text-green-600" />
          Statistiques salariales
        </h3>
        <div className="bg-green-100 p-2 rounded-lg">
          <FaChartLine className="text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salaire moyen */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Salaire moyen</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(averageSalary)}</p>
              <p className="text-xs text-blue-600">Mensuel: {formatMonthly(averageSalary)}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <FaUsers className="text-blue-700" />
            </div>
          </div>
        </div>

        {/* Masse salariale */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Masse salariale</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(totalSalary)}</p>
              <p className="text-xs text-green-600">Annuel total</p>
            </div>
            <div className="bg-green-200 p-3 rounded-lg">
              <FaEuroSign className="text-green-700" />
            </div>
          </div>
        </div>

        {/* Salaire minimum */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Salaire minimum</p>
              <p className="text-xl font-bold text-yellow-900">{formatCurrency(minSalary)}</p>
              <p className="text-xs text-yellow-600">Mensuel: {formatMonthly(minSalary)}</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-lg">
              <FaArrowDown className="text-yellow-700" />
            </div>
          </div>
        </div>

        {/* Salaire maximum */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Salaire maximum</p>
              <p className="text-xl font-bold text-purple-900">{formatCurrency(maxSalary)}</p>
              <p className="text-xs text-purple-600">Mensuel: {formatMonthly(maxSalary)}</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-lg">
              <FaArrowUp className="text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{employeesWithSalary.length}</p>
            <p className="text-sm text-gray-600">Employés avec salaire</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{employees.length - employeesWithSalary.length}</p>
            <p className="text-sm text-gray-600">Sans salaire défini</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((employeesWithSalary.length / employees.length) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Taux de complétude</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryStats; 