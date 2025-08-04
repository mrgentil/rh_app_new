import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { Objective, Employee, Team, Project } from '../models';

const router = express.Router();

// GET /api/objectives - Liste des objectifs
router.get('/', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const user = (req as any).user;
    let whereClause: any = {};

    // Les Managers ne voient que les objectifs de leurs équipes ou qu'ils ont assignés
    if (user.role === 'Manager') {
      whereClause = {
        [require('sequelize').Op.or]: [
          { assignedBy: user.employeeId },
          { employeeId: user.employeeId }
        ]
      };
    }

    const objectives = await Objective.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Employee,
          as: 'assignedByEmployee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Team,
          attributes: ['id', 'name']
        },
        {
          model: Project,
          attributes: ['id', 'name']
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    res.json(objectives);
  } catch (error) {
    console.error('Erreur lors de la récupération des objectifs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/objectives/:id - Détails d'un objectif
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const objective = await Objective.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Employee,
          as: 'assignedByEmployee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Team,
          attributes: ['id', 'name']
        },
        {
          model: Project,
          attributes: ['id', 'name']
        }
      ]
    });

    if (!objective) {
      return res.status(404).json({ error: 'Objectif non trouvé' });
    }

    // Vérifier les permissions
    if (user.role === 'Manager' && 
        objective.assignedBy !== user.employeeId && 
        objective.employeeId !== user.employeeId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(objective);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'objectif:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/objectives - Créer un objectif
router.post('/', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const { title, description, type, employeeId, teamId, projectId, priority, dueDate } = req.body;
    const user = (req as any).user;

    if (!title || !type || !dueDate) {
      return res.status(400).json({ error: 'Titre, type et date d\'échéance requis' });
    }

    // Vérifier les permissions pour les Managers
    if (user.role === 'Manager') {
      if (type === 'individual' && employeeId) {
        // Vérifier que l'employé fait partie de l'équipe du manager
        const employee = await Employee.findByPk(employeeId);
        if (!employee || employee.managerId !== user.employeeId) {
          return res.status(403).json({ error: 'Vous ne pouvez assigner des objectifs qu\'à vos subordonnés' });
        }
      }
    }

    const objective = await Objective.create({
      title,
      description,
      type,
      employeeId,
      teamId,
      projectId,
      assignedBy: user.employeeId,
      priority: priority || 'medium',
      dueDate,
      status: 'pending',
      progress: 0
    });

    res.status(201).json(objective);
  } catch (error) {
    console.error('Erreur lors de la création de l\'objectif:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/objectives/:id - Modifier un objectif
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, status, progress } = req.body;
    const user = (req as any).user;

    const objective = await Objective.findByPk(id);
    if (!objective) {
      return res.status(404).json({ error: 'Objectif non trouvé' });
    }

    // Vérifier les permissions
    if (user.role === 'Manager' && objective.assignedBy !== user.employeeId) {
      return res.status(403).json({ error: 'Vous ne pouvez modifier que les objectifs que vous avez assignés' });
    }

    await objective.update({
      title,
      description,
      priority,
      dueDate,
      status,
      progress
    });

    res.json(objective);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'objectif:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/objectives/employee/:employeeId - Objectifs d'un employé
router.get('/employee/:employeeId', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const user = (req as any).user;

    // Vérifier les permissions pour les Managers
    if (user.role === 'Manager') {
      const employee = await Employee.findByPk(employeeId);
      if (!employee || employee.managerId !== user.employeeId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }

    const objectives = await Objective.findAll({
      where: { employeeId },
      include: [
        {
          model: Employee,
          as: 'assignedByEmployee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Team,
          attributes: ['id', 'name']
        },
        {
          model: Project,
          attributes: ['id', 'name']
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    res.json(objectives);
  } catch (error) {
    console.error('Erreur lors de la récupération des objectifs de l\'employé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/objectives/team/:teamId - Objectifs d'une équipe
router.get('/team/:teamId', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const { teamId } = req.params;
    const user = (req as any).user;

    // Vérifier les permissions pour les Managers
    if (user.role === 'Manager') {
      const team = await Team.findByPk(teamId);
      if (!team || team.managerId !== user.employeeId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }

    const objectives = await Objective.findAll({
      where: { teamId },
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Employee,
          as: 'assignedByEmployee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          attributes: ['id', 'name']
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    res.json(objectives);
  } catch (error) {
    console.error('Erreur lors de la récupération des objectifs de l\'équipe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router; 