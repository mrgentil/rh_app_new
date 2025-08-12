import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProtectedSection } from './PermissionGuard';
import { PERMISSIONS } from '../types/permissions';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyCheckAlt, 
  FaTasks,
  FaProjectDiagram,
  FaComments,
  FaTrophy,
  FaChartBar,
  FaClock,
  FaPoll,
  FaRocket,
  FaGraduationCap
} from 'react-icons/fa';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  permission?: string;
  roles?: string[];
}

export default function RoleBasedDashboardEnhanced() {
  const { user } = useAuth();

  // Cartes de statistiques selon les rôles
  const dashboardCards: DashboardCard[] = [
    // Cartes pour tous
    {
      title: 'Mes Tâches',
      value: '8',
      icon: FaTasks,
      color: 'blue',
    },
    {
      title: 'Mes Congés Restants',
      value: '15 jours',
      icon: FaCalendarAlt,
      color: 'green',
    },
    
    // Cartes Manager
    {
      title: 'Équipe Active',
      value: '12',
      icon: FaUsers,
      color: 'purple',
      permission: PERMISSIONS.EMPLOYEES.VIEW,
    },
    {
      title: 'Projets en Cours',
      value: '5',
      icon: FaProjectDiagram,
      color: 'indigo',
      permission: PERMISSIONS.PROJECTS.VIEW,
    },
    {
      title: 'Messages Non Lus',
      value: '23',
      icon: FaComments,
      color: 'yellow',
      permission: PERMISSIONS.COMMUNICATION.CHAT_VIEW,
    },
    
    // Cartes RH
    {
      title: 'Employés Actifs',
      value: '124',
      icon: FaUsers,
      color: 'blue',
      permission: PERMISSIONS.EMPLOYEES.VIEW,
    },
    {
      title: 'Congés en Attente',
      value: '7',
      icon: FaCalendarAlt,
      color: 'orange',
      permission: PERMISSIONS.LEAVES.VIEW_ALL,
    },
    {
      title: 'Processus Paie',
      value: 'En cours',
      icon: FaMoneyCheckAlt,
      color: 'green',
      permission: PERMISSIONS.PAYROLL.VIEW_ALL,
    },
    
    // Cartes CFO/CEO
    {
      title: 'Masse Salariale',
      value: '2.5M €',
      icon: FaMoneyCheckAlt,
      color: 'green',
      roles: ['CFO', 'CEO', 'Admin'],
    },
    {
      title: 'Budget Projets',
      value: '450K €',
      icon: FaChartBar,
      color: 'purple',
      roles: ['CFO', 'CEO', 'Admin'],
    },
    
    // Cartes Gamification
    {
      title: 'Mes Points',
      value: '1,250',
      icon: FaTrophy,
      color: 'yellow',
      permission: PERMISSIONS.GAMIFICATION.BADGES_VIEW,
    },
    {
      title: 'Temps Travaillé',
      value: '38h',
      icon: FaClock,
      color: 'indigo',
      permission: PERMISSIONS.TIME_TRACKING.VIEW,
    },
    {
      title: 'Sondages Actifs',
      value: '3',
      icon: FaPoll,
      color: 'pink',
      permission: PERMISSIONS.SURVEYS.VIEW,
    }
  ];

  // Fonction pour vérifier si un utilisateur peut voir une carte
  const canViewCard = (card: DashboardCard): boolean => {
    if (!card.permission && !card.roles) return true;
    
    if (card.roles && user?.role) {
      return card.roles.includes(user.role);
    }
    
    if (card.permission && user?.permissions) {
      try {
        const userPermissions = Array.isArray(user.permissions) 
          ? user.permissions 
          : JSON.parse(user.permissions);
        return userPermissions.includes(card.permission) || userPermissions.includes('all');
      } catch {
        return false;
      }
    }
    
    return false;
  };

  const visibleCards = dashboardCards.filter(canViewCard);

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="space-y-8">
      {/* En-tête personnalisé selon le rôle */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour {user?.username || 'Utilisateur'} ! 👋
        </h1>
        <p className="text-blue-100">
          Tableau de bord {user?.role || 'Utilisateur'} - 
          {user?.role === 'Admin' && ' Gestion complète du système'}
          {user?.role === 'RH' && ' Gestion des ressources humaines'}
          {user?.role === 'Manager' && ' Gestion d\'équipe et projets'}
          {user?.role === 'CFO' && ' Vue financière et budgétaire'}
          {user?.role === 'CEO' && ' Vue stratégique globale'}
          {user?.role === 'Employee' && ' Espace personnel et collaboratif'}
          {user?.role === 'Consultant' && ' Accès projets et documents'}
          {user?.role === 'Stagiaire' && ' Formation et intégration'}
        </p>
      </div>

      {/* Grille de cartes statistiques */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCards.map((card, index) => {
            const IconComponent = card.icon;
            const colorClass = colorClasses[card.color as keyof typeof colorClasses] || colorClasses.blue;
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${colorClass}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sections spécialisées selon les rôles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section Projets & Tâches */}
        <ProtectedSection 
          permission={PERMISSIONS.PROJECTS.VIEW}
          title="Projets Récents"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaProjectDiagram className="mr-2 text-blue-600" />
              Mes Projets Actifs
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Refonte Site Web</p>
                  <p className="text-sm text-gray-600">75% complété</p>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Migration SaaS</p>
                  <p className="text-sm text-gray-600">45% complété</p>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </ProtectedSection>

        {/* Section Analytics Financiers - CFO */}
        <ProtectedSection 
          roles={['CFO', 'CEO', 'Admin']}
          title="Analytics Financiers"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-green-600" />
              Performance Financière
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Budget RH Utilisé</span>
                <span className="font-semibold text-green-600">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROI Projets</span>
                <span className="font-semibold text-blue-600">+15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Économies Réalisées</span>
                <span className="font-semibold text-purple-600">125K €</span>
              </div>
            </div>
          </div>
        </ProtectedSection>

        {/* Section Manager - Gestion d'Équipe */}
        <ProtectedSection 
          roles={['Manager', 'Admin']}
          title="Gestion d'Équipe"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaUsers className="mr-2 text-blue-600" />
              Mon Équipe
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Équipe Active</p>
                  <p className="text-sm text-gray-600">12 membres</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">100%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Objectifs Atteints</p>
                  <p className="text-sm text-gray-600">Ce mois</p>
                </div>
                <div className="text-2xl font-bold text-green-600">85%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Congés en Attente</p>
                  <p className="text-sm text-gray-600">À valider</p>
                </div>
                <div className="text-2xl font-bold text-yellow-600">3</div>
              </div>
            </div>
          </div>
        </ProtectedSection>

        {/* Section CEO - Vue Stratégique */}
        <ProtectedSection 
          roles={['CEO', 'Admin']}
          title="Vue Stratégique"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaRocket className="mr-2 text-purple-600" />
              Performance Globale
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">94%</div>
                <p className="text-sm text-gray-600">Satisfaction Client</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">+22%</div>
                <p className="text-sm text-gray-600">Croissance CA</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">156</div>
                <p className="text-sm text-gray-600">Employés</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">12</div>
                <p className="text-sm text-gray-600">Projets Actifs</p>
              </div>
            </div>
          </div>
        </ProtectedSection>

        {/* Section Consultant - Mes Projets */}
        <ProtectedSection 
          roles={['Consultant', 'Admin']}
          title="Mes Projets Client"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaProjectDiagram className="mr-2 text-indigo-600" />
              Projets en Cours
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Audit Système Client A</p>
                  <p className="text-sm text-gray-600">Échéance: 15 Mars</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">En cours</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Formation Équipe Client B</p>
                  <p className="text-sm text-gray-600">Échéance: 28 Mars</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Planifié</span>
              </div>
            </div>
          </div>
        </ProtectedSection>

        {/* Section Stagiaire - Apprentissage */}
        <ProtectedSection 
          roles={['Stagiaire', 'Admin']}
          title="Mon Parcours d'Apprentissage"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-green-600" />
              Progression
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Formation Technique</span>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Compétences Métier</span>
                  <span className="text-sm text-gray-600">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Prochaine évaluation: 20 Mars</p>
                <p className="text-xs text-yellow-600">Avec votre mentor Sarah Martin</p>
              </div>
            </div>
          </div>
        </ProtectedSection>

        {/* Section Communication */}
        <ProtectedSection 
          permission={PERMISSIONS.COMMUNICATION.CHAT_VIEW}
          title="Communication"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaComments className="mr-2 text-yellow-600" />
              Messages Récents
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-600">Réunion projet demain ?</p>
                </div>
                <span className="text-xs text-gray-400">2min</span>
              </div>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  MS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Marie Smith</p>
                  <p className="text-xs text-gray-600">Rapport terminé ✅</p>
                </div>
                <span className="text-xs text-gray-400">5min</span>
              </div>
            </div>
          </div>
        </ProtectedSection>

        {/* Section Gamification */}
        <ProtectedSection 
          permission={PERMISSIONS.GAMIFICATION.BADGES_VIEW}
          title="Gamification"
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-600" />
              Mes Récompenses
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-xs font-medium">Top Performer</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-xs font-medium">Collaborateur</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-xs font-medium">Objectifs</p>
              </div>
            </div>
          </div>
        </ProtectedSection>
      </div>
    </div>
  );
}
