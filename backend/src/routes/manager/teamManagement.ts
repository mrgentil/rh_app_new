import { Router } from 'express';
import { Op } from 'sequelize';
import { authenticateJWT, authorizePermissions, AuthRequest } from '../../middleware/auth';
import { Employee, Team, Department, JobTitle, User } from '../../models';

const router = Router();

/**
 * GET /api/manager/team-management/test-auth
 * Route de test pour diagnostiquer l'authentification
 */
router.get('/test-auth', 
  authenticateJWT, 
  async (req: AuthRequest, res) => {
    try {
      console.log('🧪 Route de test - Utilisateur authentifié:', {
        userId: req.user?.id,
        username: req.user?.username,
        employeeId: req.user?.employeeId,
        roleName: req.user?.roleName,
        permissions: req.user?.permissions
      });
      
      res.json({
        success: true,
        message: 'Authentification réussie',
        user: {
          id: req.user?.id,
          username: req.user?.username,
          employeeId: req.user?.employeeId,
          roleName: req.user?.roleName
        }
      });
    } catch (error: any) {
      console.error('❌ Erreur dans la route de test:', error);
      res.status(500).json({ error: 'Erreur de test' });
    }
  }
);

/**
 * GET /api/manager/team-management/my-teams
 * Récupère toutes les équipes gérées par le manager connecté
 * Permission: employees:view_team
 */
router.get('/my-teams', 
  authenticateJWT, 
  authorizePermissions('employees:view_team'), 
  async (req: AuthRequest, res) => {
    try {
      console.log('👤 Utilisateur connecté:', {
        userId: req.user.id,
        username: req.user.username,
        employeeId: req.user.employeeId,
        roles: req.user.roles
      });
      
      const managerId = req.user.employeeId;
      
      if (!managerId) {
        console.error('❌ Aucun employeeId trouvé pour l\'utilisateur:', req.user.username);
        return res.status(400).json({
          success: false,
          error: 'Votre compte utilisateur n\'est pas lié à un employé. Contactez l\'administrateur pour associer votre compte à un profil employé.',
          details: 'MISSING_EMPLOYEE_ID'
        });
      }

      console.log('🔍 Recherche des équipes pour le manager ID:', managerId);
      // 1) Équipes dont l'utilisateur est le manager (créateur)
      const managedTeams = await Team.findAll({
        where: { 
          managerId,
          status: { [Op.ne]: 'archived' }
        },
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name']
          }
        ],
        order: [['name', 'ASC']]
      });

      // 2) Équipe dont l'utilisateur est membre (si applicable)
      const meAsEmployee = await Employee.findOne({ where: { id: managerId } });
      let memberTeams: any[] = [];
      if (meAsEmployee && (meAsEmployee as any).teamId) {
        const teamId = (meAsEmployee as any).teamId;
        const team = await Team.findOne({
          where: { id: teamId, status: { [Op.ne]: 'archived' } },
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        });
        if (team) {
          memberTeams = [team];
        }
      }

      // Fusionner les listes en supprimant les doublons par id
      const teamMap = new Map<number, any>();
      [...managedTeams, ...memberTeams].forEach((t) => {
        teamMap.set(t.id, t);
      });
      const teams = Array.from(teamMap.values());

      // Compter les membres de chaque équipe
      const teamsWithMemberCount = await Promise.all(
        teams.map(async (team) => {
          const memberCount = await Employee.count({
            where: { 
              teamId: team.id,
              status: { [Op.ne]: 'deleted' }
            }
          });

          return {
            id: team.id,
            name: team.name,
            description: team.description,
            departmentId: team.departmentId,
            department: (team as any).department?.name || '',
            memberCount
          };
        })
      );

      res.json({ 
        success: true, 
        data: teamsWithMemberCount,
        total: teamsWithMemberCount.length 
      });
    } catch (error: any) {
      console.error('❌ Erreur détaillée lors de la récupération des équipes:', {
        message: error?.message || 'Erreur inconnue',
        stack: error?.stack || 'Stack non disponible',
        name: error?.name || 'Nom d\'erreur non disponible'
      });
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des équipes',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined 
      });
    }
  }
);

/**
 * GET /api/manager/team-management/team/:teamId/members
 * Récupère tous les membres d'une équipe spécifique
 * Permission: employees:view_team
 */
router.get('/team/:teamId/members', 
  authenticateJWT, 
  authorizePermissions('employees:view_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      const teamId = parseInt(req.params.teamId);

      // Vérifier que le manager a accès à cette équipe
      const team = await Team.findOne({
        where: { 
          id: teamId,
          managerId
        }
      });

      if (!team) {
        return res.status(403).json({ 
          success: false, 
          error: 'Accès refusé à cette équipe' 
        });
      }

      const members = await Employee.findAll({
        where: { 
          teamId,
          status: { [Op.ne]: 'deleted' }
        },
        include: [
          {
            model: JobTitle,
            as: 'jobTitle',
            attributes: ['id', 'title']
          },
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name']
          }
        ],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      const formattedMembers = members.map(member => ({
        id: member.id,
        matricule: member.matricule,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        jobTitle: (member as any).jobTitle?.title || '',
        department: (member as any).department?.name || '',
        status: member.status,
        hireDate: member.hireDate,
        photoUrl: member.photoUrl
      }));

      res.json({ 
        success: true, 
        data: {
          team: {
            id: team.id,
            name: team.name,
            description: team.description
          },
          members: formattedMembers
        },
        total: formattedMembers.length 
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des membres de l\'équipe' 
      });
    }
  }
);

/**
 * GET /api/manager/team-management/available-employees
 * Récupère tous les employés disponibles pour être ajoutés à une équipe
 * Permission: employees:view_team
 */
router.get('/available-employees', 
  authenticateJWT, 
  authorizePermissions('employees:view_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      const { search, departmentId, excludeTeamId } = req.query;

      // Construire les conditions de recherche
      const whereConditions: any = {
        status: { [Op.in]: ['actif', 'active'] },
        [Op.or]: [
          { teamId: null }, // Employés sans équipe
          { teamId: { [Op.ne]: excludeTeamId } } // Employés d'autres équipes (si on veut permettre les transferts)
        ]
      };

      // Filtre par recherche (nom, prénom, email)
      if (search) {
        whereConditions[Op.or] = [
          ...whereConditions[Op.or],
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { matricule: { [Op.like]: `%${search}%` } }
        ];
      }

      // Filtre par département
      if (departmentId) {
        whereConditions.departmentId = departmentId;
      }

      const availableEmployees = await Employee.findAll({
        where: whereConditions,
        include: [
          {
            model: JobTitle,
            as: 'jobTitle',
            attributes: ['id', 'title']
          },
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name']
          },
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name'],
            required: false
          }
        ],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
        limit: 50 // Limiter pour éviter trop de résultats
      });

      const formattedEmployees = availableEmployees.map(emp => ({
        id: emp.id,
        matricule: emp.matricule,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        jobTitle: (emp as any).jobTitle?.title || '',
        department: (emp as any).department?.name || '',
        currentTeam: (emp as any).team?.name || 'Aucune équipe',
        photoUrl: emp.photoUrl,
        status: emp.status
      }));

      res.json({ 
        success: true, 
        data: formattedEmployees,
        total: formattedEmployees.length 
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des employés disponibles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des employés disponibles' 
      });
    }
  }
);

/**
 * POST /api/manager/team-management/team/:teamId/add-member
 * Ajoute un employé à une équipe
 * Permission: employees:edit_team
 */
router.post('/team/:teamId/add-member', 
  authenticateJWT, 
  authorizePermissions('employees:edit_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      const teamId = parseInt(req.params.teamId);
      const { employeeId } = req.body;

      if (!employeeId) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID de l\'employé requis' 
        });
      }

      // Vérifier que le manager a accès à cette équipe
      const team = await Team.findOne({
        where: { 
          id: teamId,
          managerId
        }
      });

      if (!team) {
        return res.status(403).json({ 
          success: false, 
          error: 'Accès refusé à cette équipe' 
        });
      }

      // Vérifier que l'employé existe et est disponible
      const employee = await Employee.findOne({
        where: { 
          id: employeeId,
          status: { [Op.in]: ['actif', 'active'] }
        }
      });

      if (!employee) {
        return res.status(404).json({ 
          success: false, 
          error: 'Employé non trouvé ou inactif' 
        });
      }

      // Ajouter l'employé à l'équipe
      await employee.update({ 
        teamId: teamId,
        managerId: managerId // Optionnel: définir aussi le manager direct
      });

      res.json({ 
        success: true, 
        message: `${employee.firstName} ${employee.lastName} a été ajouté(e) à l'équipe ${team.name}`,
        data: {
          employeeId: employee.id,
          teamId: team.id,
          teamName: team.name
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'ajout du membre à l\'équipe' 
      });
    }
  }
);

/**
 * DELETE /api/manager/team-management/team/:teamId/remove-member/:employeeId
 * Retire un employé d'une équipe
 * Permission: employees:edit_team
 */
router.delete('/team/:teamId/remove-member/:employeeId', 
  authenticateJWT, 
  authorizePermissions('employees:edit_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      const teamId = parseInt(req.params.teamId);
      const employeeId = parseInt(req.params.employeeId);

      // Vérifier que le manager a accès à cette équipe
      const team = await Team.findOne({
        where: { 
          id: teamId,
          managerId
        }
      });

      if (!team) {
        return res.status(403).json({ 
          success: false, 
          error: 'Accès refusé à cette équipe' 
        });
      }

      // Vérifier que l'employé est dans cette équipe
      const employee = await Employee.findOne({
        where: { 
          id: employeeId,
          teamId: teamId
        }
      });

      if (!employee) {
        return res.status(404).json({ 
          success: false, 
          error: 'Employé non trouvé dans cette équipe' 
        });
      }

      // Retirer l'employé de l'équipe
      await employee.update({ 
        teamId: undefined,
        managerId: undefined
      });

      res.json({ 
        success: true, 
        message: `${employee.firstName} ${employee.lastName} a été retiré(e) de l'équipe ${team.name}`,
        data: {
          employeeId: employee.id,
          teamId: team.id
        }
      });
    } catch (error) {
      console.error('Erreur lors du retrait du membre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors du retrait du membre de l\'équipe' 
      });
    }
  }
);

export default router;
