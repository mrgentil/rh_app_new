import { Router } from 'express';
import { Role, User } from '../models';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// GET all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET one role
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    if (!role) {
      return res.status(404).json({ error: 'Rôle non trouvé' });
    }
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// CREATE role
router.post('/', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du rôle' });
  }
});

// UPDATE role
router.put('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Rôle non trouvé' });
    }
    
    await role.update(req.body);
    res.json(role);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de mise à jour' });
  }
});

// DELETE role
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Rôle non trouvé' });
    }
    
    // Vérifier s'il y a des utilisateurs avec ce rôle
    const userCount = await User.count({ where: { roleId: req.params.id } });
    if (userCount > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer le rôle car il est attribué à des utilisateurs' 
      });
    }
    
    await role.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router; 