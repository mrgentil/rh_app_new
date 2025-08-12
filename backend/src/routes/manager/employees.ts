import { Router } from 'express';
import { Employee, User, JobTitle, Department, Contract, Team } from '../../models';
import { authenticateJWT, authorizePermissions, AuthRequest } from '../../middleware/auth';
import { Op } from 'sequelize';

const router = Router();

/**
 * GET /api/manager/employees/team
 * Permission: employees:view_team
 * Récupère tous les employés de l'équipe du manager
 */
router.get('/team', 
  authenticateJWT, 
  authorizePermissions('employees:view_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      
      // Récupérer les équipes gérées par ce manager
      const managedTeams = await Team.findAll({
        where: { managerId },
        attributes: ['id']
      });
      
      const teamIds = managedTeams.map(team => team.id);
      
      // Récupérer tous les employés des équipes gérées
      const employees = await Employee.findAll({
        where: {
          teamId: {
            [Op.in]: teamIds
          },
          status: {
            [Op.ne]: 'deleted'
          }
        },
        include: [
          { 
            model: JobTitle, 
            attributes: ['title', 'description'] 
          },
          { 
            model: Department, 
            attributes: ['name'] 
          },
          { 
            model: Contract, 
            attributes: ['type', 'salary', 'startDate', 'endDate'] 
          },
          {
            model: Team,
            attributes: ['name']
          }
        ],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      const formattedEmployees = employees.map(emp => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        jobTitle: (emp as any).JobTitle?.title || '',
        department: (emp as any).Department?.name || '',
        team: (emp as any).Team?.name || '',
        status: emp.status,
        hireDate: emp.hireDate,
        birthDate: emp.birthDate,
        address: emp.address,
        contractType: (emp as any).Contract?.type || '',
        salary: (emp as any).Contract?.salary || 0,
        profilePicture: emp.photoUrl
      }));

      res.json({
        success: true,
        data: formattedEmployees,
        total: formattedEmployees.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'équipe:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération de l\'équipe' 
      });
    }
  }
);

/**
 * GET /api/manager/employees/team/:id/personal
 * Permission: employees:view_personal_team
 * Récupère les informations personnelles détaillées d'un employé de l'équipe
 */
router.get('/team/:id/personal', 
  authenticateJWT, 
  authorizePermissions('employees:view_personal_team'), 
  async (req: AuthRequest, res) => {
    try {
      const employeeId = req.params.id;
      const managerId = req.user.employeeId;
      
      // Vérifier que l'employé fait partie de l'équipe du manager
      const managedTeams = await Team.findAll({
        where: { managerId },
        attributes: ['id']
      });
      
      const teamIds = managedTeams.map(team => team.id);
      
      const employee = await Employee.findOne({
        where: {
          id: employeeId,
          teamId: {
            [Op.in]: teamIds
          }
        },
        include: [
          { 
            model: JobTitle, 
            attributes: ['title', 'description', 'requirements'] 
          },
          { 
            model: Department, 
            attributes: ['name', 'description'] 
          },
          { 
            model: Contract, 
            attributes: ['type', 'salary', 'startDate', 'endDate', 'benefits'] 
          },
          {
            model: Team,
            attributes: ['name', 'description']
          }
        ]
      });

      if (!employee) {
        return res.status(404).json({ 
          success: false, 
          error: 'Employé non trouvé dans votre équipe' 
        });
      }

      const personalInfo = {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        birthDate: employee.birthDate,
        address: employee.address,
        emergencyContactName: employee.emergencyContactName,
        emergencyContactPhone: employee.emergencyContactPhone,
        emergencyContactRelationship: employee.emergencyContactRelationship,
        jobTitle: (employee as any).JobTitle,
        department: (employee as any).Department,
        team: (employee as any).Team,
        contract: (employee as any).Contract,
        status: employee.status,
        hireDate: employee.hireDate,
        profilePicture: employee.photoUrl
      };

      res.json({
        success: true,
        data: personalInfo
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des infos personnelles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des informations personnelles' 
      });
    }
  }
);

/**
 * POST /api/manager/employees/team
 * Permission: employees:create_team
 * Crée un nouvel employé dans l'équipe du manager
 */
router.post('/team', 
  authenticateJWT, 
  authorizePermissions('employees:create_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      const {
        firstName,
        lastName,
        email,
        phone,
        jobTitleId,
        departmentId,
        teamId,
        hireDate,
        birthDate,
        address,
        contractType,
        salary
      } = req.body;

      // Vérifier que l'équipe spécifiée est gérée par ce manager
      const team = await Team.findOne({
        where: {
          id: teamId,
          managerId
        }
      });

      if (!team) {
        return res.status(403).json({ 
          success: false, 
          error: 'Vous ne pouvez créer des employés que dans vos équipes' 
        });
      }

      // Vérifier que l'email n'existe pas déjà
      const existingEmployee = await Employee.findOne({
        where: { email }
      });

      if (existingEmployee) {
        return res.status(400).json({ 
          success: false, 
          error: 'Un employé avec cet email existe déjà' 
        });
      }

      // Créer l'employé
      const newEmployee = await Employee.create({
        firstName,
        lastName,
        email,
        phone,
        jobTitleId,
        departmentId,
        teamId,
        hireDate,
        birthDate,
        address,
        status: 'actif'
      });

      // Créer le contrat si des informations sont fournies
      if (contractType && salary) {
        await Contract.create({
          employeeId: newEmployee.id,
          type: contractType,
          salary,
          startDate: hireDate
        });
      }

      // Récupérer l'employé avec toutes les relations
      const employeeWithDetails = await Employee.findByPk(newEmployee.id, {
        include: [
          { model: JobTitle, attributes: ['title'] },
          { model: Department, attributes: ['name'] },
          { model: Contract, attributes: ['type', 'salary'] },
          { model: Team, attributes: ['name'] }
        ]
      });

      res.status(201).json({
        success: true,
        data: employeeWithDetails,
        message: 'Employé créé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la création de l\'employé' 
      });
    }
  }
);

/**
 * PUT /api/manager/employees/team/:id
 * Permission: employees:edit_team
 * Modifie un employé de l'équipe du manager
 */
router.put('/team/:id', 
  authenticateJWT, 
  authorizePermissions('employees:edit_team'), 
  async (req: AuthRequest, res) => {
    try {
      const employeeId = req.params.id;
      const managerId = req.user.employeeId;
      
      // Vérifier que l'employé fait partie de l'équipe du manager
      const managedTeams = await Team.findAll({
        where: { managerId },
        attributes: ['id']
      });
      
      const teamIds = managedTeams.map(team => team.id);
      
      const employee = await Employee.findOne({
        where: {
          id: employeeId,
          teamId: {
            [Op.in]: teamIds
          }
        }
      });

      if (!employee) {
        return res.status(404).json({ 
          success: false, 
          error: 'Employé non trouvé dans votre équipe' 
        });
      }

      // Mettre à jour l'employé
      await employee.update(req.body);

      // Récupérer l'employé mis à jour avec toutes les relations
      const updatedEmployee = await Employee.findByPk(employeeId, {
        include: [
          { model: JobTitle, attributes: ['title'] },
          { model: Department, attributes: ['name'] },
          { model: Contract, attributes: ['type', 'salary'] },
          { model: Team, attributes: ['name'] }
        ]
      });

      res.json({
        success: true,
        data: updatedEmployee,
        message: 'Employé mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la mise à jour de l\'employé' 
      });
    }
  }
);

/**
 * GET /api/manager/employees/team/export
 * Permission: employees:export_team
 * Exporte les données des employés de l'équipe (CSV/Excel)
 */
router.get('/team/export', 
  authenticateJWT, 
  authorizePermissions('employees:export_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      const format = req.query.format as string || 'csv';
      
      // Récupérer les équipes gérées par ce manager
      const managedTeams = await Team.findAll({
        where: { managerId },
        attributes: ['id']
      });
      
      const teamIds = managedTeams.map(team => team.id);
      
      // Récupérer tous les employés des équipes gérées
      const employees = await Employee.findAll({
        where: {
          teamId: {
            [Op.in]: teamIds
          },
          status: {
            [Op.ne]: 'deleted'
          }
        },
        include: [
          { model: JobTitle, attributes: ['title'] },
          { model: Department, attributes: ['name'] },
          { model: Contract, attributes: ['type', 'salary'] },
          { model: Team, attributes: ['name'] }
        ],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      if (format === 'csv') {
        const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
        const csvWriter = createCsvWriter({
          header: [
            { id: 'id', title: 'ID' },
            { id: 'firstName', title: 'Prénom' },
            { id: 'lastName', title: 'Nom' },
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Téléphone' },
            { id: 'jobTitle', title: 'Poste' },
            { id: 'department', title: 'Département' },
            { id: 'team', title: 'Équipe' },
            { id: 'contractType', title: 'Type de contrat' },
            { id: 'salary', title: 'Salaire' },
            { id: 'hireDate', title: 'Date d\'embauche' },
            { id: 'status', title: 'Statut' }
          ]
        });
        
        const records = employees.map(emp => ({
          id: emp.id,
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          jobTitle: (emp as any).JobTitle?.title || '',
          department: (emp as any).Department?.name || '',
          team: (emp as any).Team?.name || '',
          contractType: (emp as any).Contract?.type || '',
          salary: (emp as any).Contract?.salary || '',
          hireDate: emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('fr-FR') : '',
          status: emp.status
        }));
        
        const csvContent = csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="equipe_${new Date().toISOString().split('T')[0]}.csv"`);
        res.send('\uFEFF' + csvContent); // BOM pour UTF-8
      } else {
        // Format JSON par défaut
        res.json({
          success: true,
          data: employees.map(emp => ({
            id: emp.id,
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: emp.phone,
            jobTitle: (emp as any).JobTitle?.title || '',
            department: (emp as any).Department?.name || '',
            team: (emp as any).Team?.name || '',
            contractType: (emp as any).Contract?.type || '',
            salary: (emp as any).Contract?.salary || '',
            hireDate: emp.hireDate,
            status: emp.status
          })),
          total: employees.length,
          exportDate: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'export des données' 
      });
    }
  }
);

/**
 * GET /api/manager/employees/team/stats
 * Statistiques de l'équipe pour le manager
 */
router.get('/team/stats', 
  authenticateJWT, 
  authorizePermissions('employees:view_team'), 
  async (req: AuthRequest, res) => {
    try {
      const managerId = req.user.employeeId;
      
      // Récupérer les équipes gérées par ce manager
      const managedTeams = await Team.findAll({
        where: { managerId },
        attributes: ['id']
      });
      
      const teamIds = managedTeams.map(team => team.id);
      
      // Statistiques générales
      const totalEmployees = await Employee.count({
        where: {
          teamId: {
            [Op.in]: teamIds
          },
          status: {
            [Op.ne]: 'deleted'
          }
        }
      });

      const activeEmployees = await Employee.count({
        where: {
          teamId: {
            [Op.in]: teamIds
          },
          status: 'actif'
        }
      });

      const onLeaveEmployees = await Employee.count({
        where: {
          teamId: {
            [Op.in]: teamIds
          },
          status: 'congé'
        }
      });

      // Répartition par département
      const departmentStats = await Employee.findAll({
        where: {
          teamId: {
            [Op.in]: teamIds
          },
          status: {
            [Op.ne]: 'deleted'
          }
        },
        include: [
          { model: Department, attributes: ['name'] }
        ],
        attributes: ['departmentId'],
        group: ['departmentId', 'Department.id'],
        raw: true
      });

      // Répartition par poste
      const jobTitleStats = await Employee.findAll({
        where: {
          teamId: {
            [Op.in]: teamIds
          },
          status: {
            [Op.ne]: 'deleted'
          }
        },
        include: [
          { model: JobTitle, attributes: ['title'] }
        ],
        attributes: ['jobTitleId'],
        group: ['jobTitleId', 'JobTitle.id'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          total: totalEmployees,
          active: activeEmployees,
          onLeave: onLeaveEmployees,
          inactive: totalEmployees - activeEmployees - onLeaveEmployees,
          departments: departmentStats,
          jobTitles: jobTitleStats,
          teams: managedTeams.length
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des statistiques' 
      });
    }
  }
);

export default router;
