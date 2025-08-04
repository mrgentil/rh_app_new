import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { Team, Employee, Department, Objective, Project } from '../models';

const router = express.Router();

// GET /api/teams - Liste des équipes (Manager voit ses équipes, RH voit tout)
router.get('/', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const user = (req as any).user;
    let whereClause: any = {};

    // Les Managers ne voient que leurs équipes
    if (user.role === 'Manager') {
      whereClause.managerId = user.employeeId;
    }

    const teams = await Team.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Department,
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'members',
          attributes: ['id', 'firstName', 'lastName', 'email', 'status'],
          where: { status: 'actif' }
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json(teams);
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/teams/:id - Détails d'une équipe
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const team = await Team.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Department,
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'members',
          attributes: ['id', 'firstName', 'lastName', 'email', 'status', 'jobTitleId', 'hireDate'],
          include: [
            {
              model: require('./JobTitle').JobTitle,
              attributes: ['title']
            }
          ]
        },
        {
          model: Objective,
          where: { status: ['pending', 'in_progress'] },
          required: false
        },
        {
          model: Project,
          where: { status: ['planning', 'active'] },
          required: false
        }
      ]
    });

    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    // Vérifier les permissions
    if (user.role === 'Manager' && team.managerId !== user.employeeId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(team);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'équipe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/teams - Créer une équipe
router.post('/', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const { name, description, managerId, departmentId } = req.body;

    if (!name || !managerId) {
      return res.status(400).json({ error: 'Nom et manager requis' });
    }

    // Vérifier que le manager existe
    const manager = await Employee.findByPk(managerId);
    if (!manager) {
      return res.status(400).json({ error: 'Manager non trouvé' });
    }

    const team = await Team.create({
      name,
      description,
      managerId,
      departmentId,
      status: 'active'
    });

    res.status(201).json(team);
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/teams/:id - Modifier une équipe
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, managerId, departmentId, status } = req.body;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    await team.update({
      name,
      description,
      managerId,
      departmentId,
      status
    });

    res.json(team);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'équipe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/teams/:id/members - Membres d'une équipe
router.get('/:id/members', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    // Vérifier les permissions
    if (user.role === 'Manager' && team.managerId !== user.employeeId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const members = await Employee.findAll({
      where: { teamId: id },
      include: [
        {
          model: require('../models').JobTitle,
          attributes: ['title']
        },
        {
          model: require('../models').Department,
          attributes: ['name']
        }
      ],
      order: [['firstName', 'ASC']]
    });

    res.json(members);
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/teams/:id/members - Ajouter un membre à l'équipe
router.post('/:id/members', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employé non trouvé' });
    }

    await employee.update({ teamId: parseInt(id) });

    res.json({ message: 'Membre ajouté à l\'équipe' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/teams/:id/members/:employeeId - Retirer un membre de l'équipe
router.delete('/:id/members/:employeeId', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const { id, employeeId } = req.params;

    const employee = await Employee.findByPk(employeeId);
    if (!employee || employee.teamId !== parseInt(id)) {
      return res.status(404).json({ error: 'Membre non trouvé dans cette équipe' });
    }

    await employee.update({ teamId: undefined });

    res.json({ message: 'Membre retiré de l\'équipe' });
  } catch (error) {
    console.error('Erreur lors du retrait du membre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router; 