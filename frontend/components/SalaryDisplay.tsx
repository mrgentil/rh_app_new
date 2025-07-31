import React, { useState } from 'react';
import { FaEuroSign, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface SalaryDisplayProps {
  salary?: number;
  onSalaryChange: (salary: number) => void;
  editable?: boolean;
  disabled?: boolean;
}

export default function SalaryDisplay({ 
  salary, 
  onSalaryChange, 
  editable = true,
  disabled = false 
}: SalaryDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(salary?.toString() || '');

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonthlySalary = (annualSalary: number) => {
    const monthly = annualSalary / 12;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(monthly);
  };

  const handleEdit = () => {
    if (!disabled && editable) {
      setIsEditing(true);
      setEditValue(salary?.toString() || '');
    }
  };

  const handleSave = () => {
    const numericValue = parseFloat(editValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onSalaryChange(numericValue);
      setIsEditing(false);
    } else {
      alert('Veuillez entrer un montant valide');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(salary?.toString() || '');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaEuroSign className="mr-2 text-green-600" />
          Informations salariales
        </h3>
        
        {editable && !disabled && !isEditing && (
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaEdit className="text-sm" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salaire annuel brut (€)
            </label>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 45000"
              min="0"
              step="100"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <FaSave className="text-xs" />
              <span>Sauvegarder</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="text-xs" />
              <span>Annuler</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {salary ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Salaire annuel brut :</span>
                <span className="text-lg font-semibold text-green-600">
                  {formatSalary(salary)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Salaire mensuel brut :</span>
                <span className="text-md font-medium text-gray-800">
                  {formatMonthlySalary(salary)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Salaire mensuel net (est.) :</span>
                <span className="text-md font-medium text-gray-800">
                  {formatMonthlySalary(salary * 0.75)} {/* Estimation 75% du brut */}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <FaEuroSign className="text-2xl mx-auto mb-2 text-gray-300" />
              <p>Aucun salaire défini</p>
              {editable && !disabled && (
                <button
                  onClick={handleEdit}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Ajouter un salaire
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 