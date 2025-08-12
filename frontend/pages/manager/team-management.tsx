import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

// Icônes SVG statiques pour éviter les problèmes d'hydratation
const Users = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Plus = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14"/>
    <path d="M12 5v14"/>
  </svg>
);

const Search = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

const UserPlus = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" x2="20" y1="8" y2="14"/>
    <line x1="23" x2="17" y1="11" y2="11"/>
  </svg>
);

const UserMinus = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="23" x2="17" y1="11" y2="11"/>
  </svg>
);

const Filter = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </svg>
);

const ChevronRight = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

const AlertCircle = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

const CheckCircle = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <path d="M9 11l3 3L22 4"/>
  </svg>
);

const X = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6L6 18"/>
    <path d="M6 6l12 12"/>
  </svg>
);

const Tag = ({ className = "", ...props }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.002 2.002 0 0 0 2.828 0l7.172-7.172a2.002 2.002 0 0 0 0-2.828L12.586 2.586Z"/>
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
  </svg>
);
import managerTeamService, { 
  Team, 
  TeamMember, 
  AvailableEmployee, 
  TeamWithMembers 
} from '../../services/managerTeamService';

interface TeamManagementPageProps {}

const TeamManagementPage: React.FC<TeamManagementPageProps> = () => {
  // États principaux
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<AvailableEmployee[]>([]);
  
  // États de chargement et erreurs
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les modales et interactions
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  // Saisie en mode tag @utilisateur
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // États pour la création d'équipe
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    departmentId: ''
  });

  // Charger les équipes au montage
  useEffect(() => {
    loadTeams();
  }, []);

  // Charger les employés disponibles quand la modale s'ouvre
  useEffect(() => {
    if (showAddMemberModal && selectedTeam) {
      loadAvailableEmployees();
    }
  }, [showAddMemberModal, selectedTeam]);

  // Génère un handle type @prenom.nom ou @matricule si disponible
  const getEmployeeHandle = (emp: AvailableEmployee) => {
    if (emp.matricule) return `@${emp.matricule}`;
    const slug = `${emp.firstName}.${emp.lastName}`
      .toLowerCase()
      .replace(/\s+/g, '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
    return `@${slug}`;
  };

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await managerTeamService.getMyTeams();
      setTeams(response.data);
    } catch (error: any) {
      console.error('Erreur loadTeams:', error);
      
      // Diagnostic détaillé de l'erreur
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Erreur inconnue';
        
        switch (status) {
          case 401:
            setError('🔒 Non autorisé - Veuillez vous reconnecter');
            break;
          case 403:
            setError('🚫 Accès refusé - Permissions insuffisantes pour voir les équipes');
            break;
          case 404:
            setError('🔍 Aucune équipe trouvée - Vous n\'avez pas encore d\'équipes assignées');
            break;
          case 500:
            setError('⚠️ Erreur serveur - Problème technique temporaire');
            break;
          default:
            setError(`❌ Erreur ${status}: ${message}`);
        }
      } else if (error.request) {
        setError('🌐 Problème de connexion - Vérifiez votre connexion internet');
      } else {
        setError('❌ Erreur lors du chargement des équipes');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async (team: Team) => {
    try {
      setMembersLoading(true);
      setSelectedTeam(team);
      const response = await managerTeamService.getTeamMembers(team.id);
      setTeamMembers(response.data.members);
    } catch (error) {
      setError('Erreur lors du chargement des membres');
      console.error('Erreur loadTeamMembers:', error);
    } finally {
      setMembersLoading(false);
    }
  };

  const loadAvailableEmployees = async () => {
    try {
      setAvailableLoading(true);
      const response = await managerTeamService.getAvailableEmployees({
        search: searchTerm,
        excludeTeamId: selectedTeam?.id
      });
      setAvailableEmployees(response.data);
    } catch (error) {
      console.error('Erreur loadAvailableEmployees:', error);
    } finally {
      setAvailableLoading(false);
    }
  };

  // Filtrer les employés disponibles selon le terme de recherche
  const filteredAvailableEmployees = availableEmployees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      employee.matricule?.toLowerCase().includes(searchLower)
    );
  });

  // Suggestions pour l'input tag (basé sur tagInput sans le @ et non déjà sélectionnés)
  const tagQuery = tagInput.replace(/^@/, '').toLowerCase();
  const tagSuggestions = availableEmployees
    .filter(e => !selectedEmployees.includes(e.id))
    .filter(e =>
      !tagQuery
        ? true
        : (
            e.firstName.toLowerCase().includes(tagQuery) ||
            e.lastName.toLowerCase().includes(tagQuery) ||
            e.email.toLowerCase().includes(tagQuery) ||
            (e.matricule ? e.matricule.toLowerCase().includes(tagQuery) : false)
          )
    )
    .slice(0, 8);

  const handleAddMembers = async () => {
    if (!selectedTeam || selectedEmployees.length === 0) return;

    try {
      const promises = selectedEmployees.map(employeeId =>
        managerTeamService.addMemberToTeam(selectedTeam.id, employeeId)
      );
      
      await Promise.all(promises);
      
      showNotification('success', `${selectedEmployees.length} membre(s) ajouté(s) avec succès`);
      setSelectedEmployees([]);
      setShowAddMemberModal(false);
      
      // Recharger les données
      await loadTeamMembers(selectedTeam);
      await loadTeams();
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'ajout des membres');
      console.error('Erreur handleAddMembers:', error);
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (!selectedTeam) return;

    if (confirm(`Êtes-vous sûr de vouloir retirer ${member.firstName} ${member.lastName} de l'équipe ?`)) {
      try {
        await managerTeamService.removeMemberFromTeam(selectedTeam.id, member.id);
        showNotification('success', `${member.firstName} ${member.lastName} retiré(e) de l'équipe`);
        
        // Recharger les données
        await loadTeamMembers(selectedTeam);
        await loadTeams();
      } catch (error) {
        showNotification('error', 'Erreur lors du retrait du membre');
        console.error('Erreur handleRemoveMember:', error);
      }
    }
  };

  const toggleEmployeeSelection = (employeeId: number) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      showNotification('error', 'Le nom de l\'équipe est requis');
      return;
    }

    try {
      // Ici vous devrez ajouter l'appel API pour créer une équipe
      // await managerTeamService.createTeam(newTeam);
      
      showNotification('success', `Équipe "${newTeam.name}" créée avec succès`);
      setShowCreateTeamModal(false);
      setNewTeam({ name: '', description: '', departmentId: '' });
      
      // Recharger les équipes
      await loadTeams();
    } catch (error) {
      showNotification('error', 'Erreur lors de la création de l\'équipe');
      console.error('Erreur handleCreateTeam:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion d'équipe</h1>
            <p className="text-gray-600">Gérez les membres de vos équipes</p>
          </div>
          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer une équipe
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des équipes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Mes équipes ({teams.length})
              </h2>
            </div>
            <div className="p-4">
              {teams.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucune équipe trouvée
                </p>
              ) : (
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      onClick={() => loadTeamMembers(team)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTeam?.id === team.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-500">{team.department}</p>
                          <p className="text-xs text-gray-400">
                            {team.memberCount} membre(s)
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails de l'équipe sélectionnée */}
        <div className="lg:col-span-2">
          {selectedTeam ? (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedTeam.name}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedTeam.description}</p>
                  </div>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter des membres
                  </button>
                </div>
              </div>

              <div className="p-4">
                {membersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun membre dans cette équipe</p>
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                      Ajouter le premier membre
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            {member.photoUrl ? (
                              <img
                                src={member.photoUrl}
                                alt={`${member.firstName} ${member.lastName}`}
                                className="h-10 w-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <span className="text-gray-600 font-medium">
                                  {member.firstName[0]}{member.lastName[0]}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {member.firstName} {member.lastName}
                              </h3>
                              <p className="text-sm text-gray-500">{member.jobTitle}</p>
                              <p className="text-xs text-gray-400">{member.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Retirer de l'équipe"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {member.department}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            member.status === 'actif' || member.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une équipe
              </h3>
              <p className="text-gray-500">
                Choisissez une équipe dans la liste pour voir et gérer ses membres
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modale d'ajout de membres */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ajouter des membres à "{selectedTeam?.name}"
                </h3>
                <button
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setSelectedEmployees([]);
                    setSearchTerm('');
                    setTagInput('');
                    setShowSuggestions(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Saisie rapide par tags @utilisateur */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ajouter des membres via @tags
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tapez @ puis le nom, l'email ou le matricule..."
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(!!tagInput)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagSuggestions.length > 0) {
                        // Ajouter le premier suggéré avec Entrée
                        const chosen = tagSuggestions[0];
                        toggleEmployeeSelection(chosen.id);
                        setTagInput('');
                        setShowSuggestions(false);
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      }
                    }}
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {showSuggestions && tagSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {tagSuggestions.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            toggleEmployeeSelection(s.id);
                            setTagInput('');
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          {s.photoUrl ? (
                            <img src={s.photoUrl} alt="avatar" className="h-6 w-6 rounded-full object-cover" />
                          ) : (
                            <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-700">
                              {(s.firstName[0] + s.lastName[0]).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              {s.firstName} {s.lastName} <span className="text-gray-400">{getEmployeeHandle(s)}</span>
                            </div>
                            <div className="text-xs text-gray-500">{s.email} • {s.jobTitle}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Affichage des tags (chips) sélectionnés */}
                {selectedEmployees.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEmployees.map(id => {
                      const emp = availableEmployees.find(e => e.id === id);
                      if (!emp) return null;
                      return (
                        <span key={id} className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {getEmployeeHandle(emp)}
                          <button
                            onClick={() => toggleEmployeeSelection(id)}
                            className="text-indigo-500 hover:text-indigo-700"
                            title="Retirer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Barre de recherche classique */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Employés sélectionnés */}
              {selectedEmployees.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedEmployees.length} employé(s) sélectionné(s)
                    </span>
                    <button
                      onClick={() => setSelectedEmployees([])}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {availableLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredAvailableEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun employé disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAvailableEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => toggleEmployeeSelection(employee.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedEmployees.includes(employee.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        {employee.photoUrl ? (
                          <img
                            src={employee.photoUrl}
                            alt={`${employee.firstName} ${employee.lastName}`}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600 font-medium">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">{employee.jobTitle}</p>
                          <p className="text-xs text-gray-400">{employee.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          <Tag className="h-3 w-3 mr-1" />
                          {employee.department}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          {employee.currentTeam}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedEmployees([]);
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddMembers}
                disabled={selectedEmployees.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Ajouter {selectedEmployees.length > 0 ? `(${selectedEmployees.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de création d'équipe */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Créer une nouvelle équipe
                </h3>
                <button
                  onClick={() => {
                    setShowCreateTeamModal(false);
                    setNewTeam({ name: '', description: '', departmentId: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'équipe *
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Équipe Développement Frontend"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description de l'équipe et de ses responsabilités..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <select
                    value={newTeam.departmentId}
                    onChange={(e) => setNewTeam({ ...newTeam, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un département</option>
                    <option value="1">Développement</option>
                    <option value="2">Marketing</option>
                    <option value="3">Ventes</option>
                    <option value="4">RH</option>
                    <option value="5">Finance</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateTeamModal(false);
                  setNewTeam({ name: '', description: '', departmentId: '' });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeam.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Créer l'équipe
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default TeamManagementPage;
