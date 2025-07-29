import { useState } from 'react';
import RoleManagementModal from '../components/RoleManagementModal';

export default function TestRoleModal() {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (data: any) => {
    console.log('Données du rôle:', data);
    alert(`Rôle créé: ${data.name} avec ${JSON.parse(data.permissions).length} permissions`);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Test du Modal de Gestion des Rôles</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions de test</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Cliquez sur le bouton "Ouvrir Modal" ci-dessous</li>
            <li>Testez les rôles templates (Administrateur, RH, Manager, Employé)</li>
            <li>Modifiez les permissions en cochant/décochant des cases</li>
            <li>Cliquez sur "Créer le rôle" pour voir les données</li>
          </ol>
          
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ouvrir Modal
          </button>
        </div>

        {showModal && (
          <RoleManagementModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            loading={false}
          />
        )}
      </div>
    </div>
  );
} 