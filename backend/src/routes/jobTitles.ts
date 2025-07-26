import { Router } from 'express';
import { JobTitle, Employee } from '../models';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// GET all job titles
router.get('/', async (req, res) => {
  try {
    const jobTitles = await JobTitle.findAll({
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName', 'email', 'status']
        }
      ]
    });
    res.json(jobTitles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET one job title
router.get('/:id', async (req, res) => {
  try {
    const jobTitle = await JobTitle.findByPk(req.params.id, {
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName', 'email', 'status', 'hireDate']
        }
      ]
    });
    
    if (!jobTitle) {
      return res.status(404).json({ error: 'Poste non trouvé' });
    }
    
    res.json(jobTitle);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// CREATE job title
router.post('/', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const jobTitle = await JobTitle.create(req.body);
    res.status(201).json(jobTitle);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du poste' });
  }
});

// UPDATE job title
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req, res) => {
  try {
    const jobTitle = await JobTitle.findByPk(req.params.id);
    if (!jobTitle) {
      return res.status(404).json({ error: 'Poste non trouvé' });
    }
    
    await jobTitle.update(req.body);
    res.json(jobTitle);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de mise à jour' });
  }
});

// DELETE job title
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  try {
    const jobTitle = await JobTitle.findByPk(req.params.id);
    if (!jobTitle) {
      return res.status(404).json({ error: 'Poste non trouvé' });
    }
    
    // Vérifier s'il y a des employés avec ce poste
    const employeeCount = await Employee.count({ where: { jobTitleId: req.params.id } });
    if (employeeCount > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer le poste car il est attribué à des employés' 
      });
    }
    
    await jobTitle.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router; 