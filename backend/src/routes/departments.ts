import { Router } from 'express';
import { Department, Employee } from '../models';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// GET all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName', 'email', 'status']
        }
      ]
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET one department with detailed employee information
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [
        {
          model: Employee,
          attributes: [
            'id', 
            'firstName', 
            'lastName', 
            'email', 
            'phone',
            'status', 
            'hireDate',
            'birthDate',
            'address'
          ],
          include: [
            {
              model: require('../models/JobTitle').JobTitle,
              attributes: ['title', 'description']
            }
          ]
        }
      ]
    });
    
    if (!department) {
      return res.status(404).json({ error: 'Département non trouvé' });
    }
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// CREATE department
router.post('/', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du département' });
  }
});

// UPDATE department
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Département non trouvé' });
    }
    
    await department.update(req.body);
    res.json(department);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de mise à jour' });
  }
});

// GET employees of a specific department
router.get('/:id/employees', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { departmentId: req.params.id },
      attributes: [
        'id', 
        'firstName', 
        'lastName', 
        'email', 
        'phone',
        'status', 
        'hireDate',
        'birthDate',
        'address'
      ],
      include: [
        {
          model: require('../models/JobTitle').JobTitle,
          attributes: ['title', 'description']
        }
      ],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });
    
    res.json({
      departmentId: req.params.id,
      employeeCount: employees.length,
      employees: employees
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE department
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Département non trouvé' });
    }
    
    // Vérifier s'il y a des employés dans ce département
    const employeeCount = await Employee.count({ where: { departmentId: req.params.id } });
    if (employeeCount > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer le département car il contient des employés' 
      });
    }
    
    await department.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router; 