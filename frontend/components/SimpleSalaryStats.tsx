import React from 'react';
import { FaEuroSign } from 'react-icons/fa';

interface SimpleSalaryStatsProps {
  employees: Array<{ salary?: number }>;
}

const SimpleSalaryStats: React.FC<SimpleSalaryStatsProps> = ({ employees }) => {
  const employeesWithSalary = employees.filter(emp => emp.salary && emp.salary > 0);
  
  const totalSalary = employeesWithSalary.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const averageSalary = employeesWithSalary.length > 0 ? totalSalary / employeesWithSalary.length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaEuroSign className="mr-2 text-green-600" />
          Statistiques salariales
        </h3>
      </div>

      {employeesWithSalary.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(averageSalary)}</p>
            <p className="text-sm text-gray-600">Salaire moyen</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSalary)}</p>
            <p className="text-sm text-gray-600">Masse salariale</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{employeesWithSalary.length}</p>
            <p className="text-sm text-gray-600">Avec salaire</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <FaEuroSign className="text-3xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Aucune donnée salariale</p>
        </div>
      )}
    </div>
  );
};

export default SimpleSalaryStats; 