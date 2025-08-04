import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { 
  PermissionGuard, 
  CreateButton, 
  EditButton, 
  DeleteButton, 
  ViewButton,
  ProtectedSection 
} from '../components/PermissionGuard';
import { PERMISSIONS } from '../types/permissions';

export default function ExampleRoleBasedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exemple d'interfaces adaptées aux rôles</h1>
          <p className="text-gray-600 mt-2">
            Cette page démontre comment les interfaces s'adaptent selon le rôle de l'utilisateur.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Rôle actuel :</strong> {user?.role || 'Non défini'}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Permissions :</strong> {user?.permissions ? 
                (Array.isArray(user.permissions) ? user.permissions.join(', ') : user.permissions) 
                : 'Aucune'
              }
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'employees', label: 'Gestion des employés' },
              { id: 'users', label: 'Gestion des utilisateurs' },
              { id: 'leaves', label: 'Gestion des congés' },
              { id: 'payroll', label: 'Gestion de la paie' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {/* Onglet Employés */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <ProtectedSection
                title="Gestion des employés"
                permission={PERMISSIONS.EMPLOYEES.VIEW}
                fallback={
                  <div className="text-center py-8">
                    <p className="text-gray-500">Vous n'avez pas les permissions pour voir cette section.</p>
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Actions disponibles</h4>
                    <div className="mt-3 space-y-2">
                      <CreateButton permission={PERMISSIONS.EMPLOYEES.CREATE}>
                        Ajouter un employé
                      </CreateButton>
                      <ViewButton permission={PERMISSIONS.EMPLOYEES.VIEW}>
                        Voir les employés
                      </ViewButton>
                      <EditButton permission={PERMISSIONS.EMPLOYEES.EDIT}>
                        Modifier
                      </EditButton>
                      <DeleteButton permission={PERMISSIONS.EMPLOYEES.DELETE}>
                        Supprimer
                      </DeleteButton>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Informations salariales</h4>
                    <div className="mt-3 space-y-2">
                      <PermissionGuard permission={PERMISSIONS.EMPLOYEES.VIEW_SALARY}>
                        <button className="w-full bg-green-100 text-green-800 px-3 py-2 rounded text-sm">
                          Voir les salaires
                        </button>
                      </PermissionGuard>
                      <PermissionGuard permission={PERMISSIONS.EMPLOYEES.EDIT_SALARY}>
                        <button className="w-full bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm">
                          Modifier les salaires
                        </button>
                      </PermissionGuard>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Informations personnelles</h4>
                    <div className="mt-3 space-y-2">
                      <PermissionGuard permission={PERMISSIONS.EMPLOYEES.VIEW_PERSONAL}>
                        <button className="w-full bg-purple-100 text-purple-800 px-3 py-2 rounded text-sm">
                          Voir les infos personnelles
                        </button>
                      </PermissionGuard>
                      <PermissionGuard permission={PERMISSIONS.EMPLOYEES.EDIT_PERSONAL}>
                        <button className="w-full bg-orange-100 text-orange-800 px-3 py-2 rounded text-sm">
                          Modifier les infos personnelles
                        </button>
                      </PermissionGuard>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Statistiques</h4>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Total employés: 24</p>
                      <p className="text-sm text-gray-600">Actifs: 22</p>
                      <p className="text-sm text-gray-600">En congé: 2</p>
                    </div>
                  </div>
                </div>
              </ProtectedSection>
            </div>
          )}

          {/* Onglet Utilisateurs */}
          {activeTab === 'users' && (
            <ProtectedSection
              title="Gestion des utilisateurs"
              permission={PERMISSIONS.USERS.VIEW}
              fallback={
                <div className="text-center py-8">
                  <p className="text-gray-500">Vous n'avez pas les permissions pour gérer les utilisateurs.</p>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Actions utilisateurs</h4>
                  <div className="mt-3 space-y-2">
                    <CreateButton permission={PERMISSIONS.USERS.CREATE}>
                      Créer un utilisateur
                    </CreateButton>
                    <ViewButton permission={PERMISSIONS.USERS.VIEW}>
                      Voir les utilisateurs
                    </ViewButton>
                    <EditButton permission={PERMISSIONS.USERS.EDIT}>
                      Modifier un utilisateur
                    </EditButton>
                    <DeleteButton permission={PERMISSIONS.USERS.DELETE}>
                      Supprimer un utilisateur
                    </DeleteButton>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Gestion des comptes</h4>
                  <div className="mt-3 space-y-2">
                    <PermissionGuard permission={PERMISSIONS.USERS.SUSPEND}>
                      <button className="w-full bg-red-100 text-red-800 px-3 py-2 rounded text-sm">
                        Suspendre un compte
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission={PERMISSIONS.USERS.ACTIVATE}>
                      <button className="w-full bg-green-100 text-green-800 px-3 py-2 rounded text-sm">
                        Réactiver un compte
                      </button>
                    </PermissionGuard>
                  </div>
                </div>
              </div>
            </ProtectedSection>
          )}

          {/* Onglet Congés */}
          {activeTab === 'leaves' && (
            <ProtectedSection
              title="Gestion des congés"
              permission={PERMISSIONS.LEAVES.VIEW}
              fallback={
                <div className="text-center py-8">
                  <p className="text-gray-500">Vous n'avez pas les permissions pour voir les congés.</p>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Demandes de congés</h4>
                  <div className="mt-3 space-y-2">
                    <CreateButton permission={PERMISSIONS.LEAVES.CREATE}>
                      Nouvelle demande
                    </CreateButton>
                    <ViewButton permission={PERMISSIONS.LEAVES.VIEW}>
                      Voir mes congés
                    </ViewButton>
                    <EditButton permission={PERMISSIONS.LEAVES.EDIT}>
                      Modifier une demande
                    </EditButton>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Approbation des congés</h4>
                  <div className="mt-3 space-y-2">
                    <PermissionGuard permission={PERMISSIONS.LEAVES.VIEW_ALL}>
                      <button className="w-full bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm">
                        Voir toutes les demandes
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission={PERMISSIONS.LEAVES.APPROVE}>
                      <button className="w-full bg-green-100 text-green-800 px-3 py-2 rounded text-sm">
                        Approuver une demande
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission={PERMISSIONS.LEAVES.REJECT}>
                      <button className="w-full bg-red-100 text-red-800 px-3 py-2 rounded text-sm">
                        Rejeter une demande
                      </button>
                    </PermissionGuard>
                  </div>
                </div>
              </div>
            </ProtectedSection>
          )}

          {/* Onglet Paie */}
          {activeTab === 'payroll' && (
            <ProtectedSection
              title="Gestion de la paie"
              permission={PERMISSIONS.PAYROLL.VIEW}
              fallback={
                <div className="text-center py-8">
                  <p className="text-gray-500">Vous n'avez pas les permissions pour accéder à la paie.</p>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Gestion des salaires</h4>
                  <div className="mt-3 space-y-2">
                    <CreateButton permission={PERMISSIONS.PAYROLL.CREATE}>
                      Créer une fiche de paie
                    </CreateButton>
                    <ViewButton permission={PERMISSIONS.PAYROLL.VIEW}>
                      Voir ma fiche de paie
                    </ViewButton>
                    <EditButton permission={PERMISSIONS.PAYROLL.EDIT}>
                      Modifier une fiche
                    </EditButton>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Traitement de la paie</h4>
                  <div className="mt-3 space-y-2">
                    <PermissionGuard permission={PERMISSIONS.PAYROLL.VIEW_ALL}>
                      <button className="w-full bg-purple-100 text-purple-800 px-3 py-2 rounded text-sm">
                        Voir toutes les fiches
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission={PERMISSIONS.PAYROLL.PROCESS}>
                      <button className="w-full bg-indigo-100 text-indigo-800 px-3 py-2 rounded text-sm">
                        Traiter la paie du mois
                      </button>
                    </PermissionGuard>
                  </div>
                </div>
              </div>
            </ProtectedSection>
          )}
        </div>
      </div>
    </Layout>
  );
} 