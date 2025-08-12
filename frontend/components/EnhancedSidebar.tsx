import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { ProtectedLink } from './PermissionGuard';
import { PERMISSIONS } from '../types/permissions';
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
  FaTasks,
  FaProjectDiagram,
  FaComments,
  FaClock,
  FaTrophy,
  FaPoll,
  FaChartBar,
  FaRocket,
  FaGraduationCap,
  FaHandshake,
  FaRobot,
  FaMobileAlt
} from 'react-icons/fa';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  permission?: string;
  roles?: string[];
  category?: string;
}

export default function EnhancedSidebar() {
  const router = useRouter();
  const { user } = useAuth();
  const role = (user?.role || (user as any)?.roleName || '').toLowerCase();
  const [teamStats, setTeamStats] = useState({ totalMembers: 0, pendingLeaves: 0 });

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  // Charger les statistiques pour les Managers
  useEffect(() => {
    if (role === 'manager' || role === 'admin' || role === 'administrateur') {
      // Simulation des statistiques - à remplacer par un vrai appel API
      setTeamStats({
        totalMembers: 8,
        pendingLeaves: 3
      });
    }
  }, [role]);

  // Menu items
  const getMenuItemsForRole = () => {
    // Vue optimisée uniquement pour Manager
    if (role === 'manager') {
      return [
        // Dashboard Manager (UN SEUL)
        {
          href: '/manager',
          label: 'Dashboard Manager',
          icon: FaHome,
          category: 'core'
        },
        {
          href: '/profile',
          label: 'Mon Profil',
          icon: FaUser,
          category: 'core'
        },
        
        // Gestion d'équipe - Essentiels uniquement
        {
          href: '/manager/team-management',
          label: 'Gestion d\'Équipe',
          icon: FaUserCog,
          category: 'team'
        },
        {
          href: '/manager/team-performance',
          label: 'Performance Équipe',
          icon: FaChartBar,
          category: 'team'
        },
        
        // Approbations - Essentielles
        {
          href: '/manager/leave-requests',
          label: 'Demandes de Congés',
          icon: FaCalendarAlt,
          category: 'approvals'
        },
        {
          href: '/manager/time-approvals',
          label: 'Validation Temps',
          icon: FaClock,
          category: 'approvals'
        },
        
        // Projets
        {
          href: '/manager/projects',
          label: 'Projets d\'Équipe',
          icon: FaProjectDiagram,
          category: 'projects'
        },
        
        // Rapports
        {
          href: '/manager/reports',
          label: 'Rapports',
          icon: FaFileAlt,
          category: 'reports'
        }
      ];
    }
    
    // Menu complet (Admin/Administrateur et autres rôles non-manager)
    return [
      // Core RH
      {
        href: '/',
        label: 'Tableau de bord',
        icon: FaHome,
        category: 'core'
      },
      {
        href: '/profile',
        label: 'Mon Profil',
        icon: FaUser,
        category: 'core'
      },
      {
        href: '/notifications',
        label: 'Notifications',
        icon: FaBell,
        category: 'core'
      },
      {
        href: '/mobile',
        label: 'Application Mobile',
        icon: FaMobileAlt,
        category: 'communication'
      },
      
      // Gestion des personnes
      {
        href: '/employes',
        label: 'Employés',
        icon: FaUsers,
        permission: PERMISSIONS.EMPLOYEES.VIEW,
        category: 'people'
      },
      {
        href: '/users',
        label: 'Utilisateurs',
        icon: FaUserCog,
        permission: PERMISSIONS.USERS.VIEW,
        category: 'people'
      },
      {
        href: '/recruitment',
        label: 'Recrutement (ATS)',
        icon: FaHandshake,
        category: 'people'
      },
      {
        href: '/teams',
        label: 'Équipes',
        icon: FaUserFriends,
        permission: PERMISSIONS.EMPLOYEES.VIEW,
        category: 'people'
      },
      
      // Projets et Tâches (NOUVEAU)
      {
        href: '/projects',
        label: 'Projets',
        icon: FaProjectDiagram,
        permission: PERMISSIONS.PROJECTS.VIEW,
        category: 'projects'
      },
      {
        href: '/tasks',
        label: 'Tâches Kanban',
        icon: FaTasks,
        permission: PERMISSIONS.TASKS.VIEW,
        category: 'projects'
      },
      {
        href: '/time-tracking',
        label: 'Suivi du Temps',
        icon: FaClock,
        permission: PERMISSIONS.TIME_TRACKING.VIEW,
        category: 'projects'
      },
      
      // Communication (NOUVEAU)
      {
        href: '/chat',
        label: 'Chat & Messages',
        icon: FaComments,
        permission: PERMISSIONS.COMMUNICATION.CHAT_VIEW,
        category: 'communication'
      },
      {
        href: '/channels',
        label: 'Canaux',
        icon: FaBell,
        permission: PERMISSIONS.COMMUNICATION.CHANNELS_VIEW,
        category: 'communication'
      },
      
      // RH Traditionnel
      {
        href: '/conges',
        label: 'Congés',
        icon: FaCalendarAlt,
        permission: PERMISSIONS.LEAVES.VIEW,
        category: 'hr'
      },
      {
        href: '/paie',
        label: 'Paie',
        icon: FaMoneyCheckAlt,
        permission: PERMISSIONS.PAYROLL.VIEW,
        category: 'hr'
      },
      {
        href: '/formations',
        label: 'Formations',
        icon: FaGraduationCap,
        permission: PERMISSIONS.EMPLOYEES.VIEW,
        category: 'hr'
      },
      {
        href: '/wellness',
        label: 'Gamification & Bien-être',
        icon: FaTrophy,
        category: 'wellness'
      },
      {
        href: '/automation',
        label: 'Automatisation & IA',
        icon: FaRobot,
        category: 'admin'
      },
      {
        href: '/analytics',
        label: 'Analytics',
        icon: FaChartBar,
        category: 'analytics'
      },
      
      // Administration
      {
        href: '/departments',
        label: 'Départements',
        icon: FaBuilding,
        permission: PERMISSIONS.DEPARTMENTS.VIEW,
        category: 'admin'
      },
      {
        href: '/roles',
        label: 'Rôles',
        icon: FaShieldAlt,
        permission: PERMISSIONS.ROLES.VIEW,
        category: 'admin'
      },
      {
        href: '/documents',
        label: 'Documents',
        icon: FaFileAlt,
        permission: PERMISSIONS.DOCUMENTS.VIEW,
        category: 'admin'
      },
      {
        href: '/audit-logs',
        label: 'Logs d\'audit',
        icon: FaClipboardList,
        permission: PERMISSIONS.AUDIT.VIEW,
        category: 'admin'
      },
      {
        href: '/settings',
        label: 'Configuration',
        icon: FaCog,
        roles: ['Admin', 'Administrateur'],
        category: 'admin'
      }
    ];
  };
  
  const menuItems = getMenuItemsForRole();

  // Grouper les items par catégorie - Version optimisée pour Manager
  const getCategoriesForRole = () => {
    if (role === 'manager') {
      return {
        core: { label: 'Accueil', items: [] as MenuItem[] },
        team: { label: 'Mon Équipe', items: [] as MenuItem[] },
        approvals: { label: 'Approbations', items: [] as MenuItem[] },
        projects: { label: 'Projets', items: [] as MenuItem[] },
        reports: { label: 'Rapports', items: [] as MenuItem[] }
      };
    }
    
    return {
      core: { label: 'Accueil', items: [] as MenuItem[] },
      people: { label: 'Équipe', items: [] as MenuItem[] },
      projects: { label: 'Projets & Tâches', items: [] as MenuItem[] },
      communication: { label: 'Communication', items: [] as MenuItem[] },
      hr: { label: 'Ressources Humaines', items: [] as MenuItem[] },
      wellness: { label: 'Bien-être & Gamification', items: [] as MenuItem[] },
      analytics: { label: 'Analytics & Rapports', items: [] as MenuItem[] },
      management: { label: '👨‍💼 Espace Manager', items: [] as MenuItem[] },
      financial: { label: '💰 Espace CFO', items: [] as MenuItem[] },
      executive: { label: '🚀 Espace CEO', items: [] as MenuItem[] },
      consultant: { label: '🤝 Espace Consultant', items: [] as MenuItem[] },
      learning: { label: '🎓 Espace Stagiaire', items: [] as MenuItem[] },
      admin: { label: 'Administration', items: [] as MenuItem[] }
    };
  };
  
  const categories = getCategoriesForRole();

  // Organiser les items par catégorie
  menuItems.forEach((item: MenuItem) => {
    const category = item.category || 'core';
    if (categories && categories[category as keyof typeof categories]) {
      categories[category as keyof typeof categories].items.push(item);
    }
  });

  // Fonction pour vérifier si un utilisateur peut voir un item
  const canViewItem = (item: MenuItem): boolean => {
    // Les Admin(s) voient tout
    if (role === 'admin' || role === 'administrateur') return true;
    // Si pas de permission spécifiée, accessible à tous
    if (!item.permission && !item.roles) return true;
    
    // Vérifier les rôles spécifiques
    if (item.roles && user?.role) {
      return item.roles.includes(user.role);
    }
    
    // Vérifier les permissions
    if (item.permission && user?.permissions) {
      try {
        const userPermissions = Array.isArray(user.permissions) 
          ? user.permissions 
          : JSON.parse(user.permissions);
        return userPermissions.includes(item.permission) || userPermissions.includes('all');
      } catch {
        return false;
      }
    }
    
    return false;
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex-shrink-0 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center">
          <FaRocket className="mr-2 text-blue-400" />
          RH SaaS
        </h1>
        {user && (
          <div className="text-sm text-gray-400 mt-2">
            <p>Connecté en tant que</p>
            <p className="font-semibold text-blue-300">{user.role || 'Utilisateur'}</p>
          </div>
        )}
      </div>
      
      <nav className="space-y-6">
        {Object.entries(categories).map(([categoryKey, category]) => {
          const visibleItems = category.items.filter(canViewItem);
          
          if (visibleItems.length === 0) return null;
          
          return (
            <div key={categoryKey}>
              {categoryKey !== 'core' && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {category.label}
                </h3>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm ${
                        isActive(item.href)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      {/* Statistique Manager */}
      {(user?.role === 'Manager' || user?.role === 'Admin') && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">📊 Mon Équipe</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-100">Membres actifs</span>
              <span className="text-sm font-bold text-white">{teamStats.totalMembers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-100">Congés en attente</span>
              <span className="text-sm font-bold text-yellow-200">{teamStats.pendingLeaves}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Badge de version SaaS */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center">
        <p className="text-xs font-semibold">🚀 SaaS Edition</p>
        <p className="text-xs text-blue-100">Manager Dashboard</p>
      </div>
    </div>
  );
}
