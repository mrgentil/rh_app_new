import { Router } from 'express';
import { Leave } from '../models/Leave';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// GET all leaves
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.findAll();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET one leave
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Congé non trouvé' });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// CREATE leave (employee request)
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('CREATE', 'Leave', leave.id, JSON.stringify(req.body), req);
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de création', details: error });
  }
});

// UPDATE leave (manager validation)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Congé non trouvé' });
    await leave.update(req.body);
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('UPDATE', 'Leave', leave.id, JSON.stringify(req.body), req);
    res.json(leave);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de mise à jour', details: error });
  }
});

// DELETE leave
router.delete('/:id', authenticateJWT, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Congé non trouvé' });
    await leave.destroy();
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('DELETE', 'Leave', leave.id, '', req);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH validate leave
router.patch('/:id/valider', authenticateJWT, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Congé non trouvé' });
    await leave.update({ status: 'VALIDE' });
    // Crée une notification pour l'utilisateur concerné
    if (leave.employeeId) {
      const user = await User.findOne({ where: { employeeId: leave.employeeId } });
      if (user) {
        await Notification.create({
          employeeId: user.id,
          type: 'CONGE',
          message: 'Votre congé a été validé',
          isRead: false
        });
      }
    }
    res.json(leave);
  } catch (error) {
    res.status(400).json({ error: 'Erreur validation congé' });
  }
});

// PATCH refuse leave
router.patch('/:id/refuser', authenticateJWT, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Congé non trouvé' });
    await leave.update({ status: 'REFUSE' });
    // Crée une notification pour l'utilisateur concerné
    if (leave.employeeId) {
      const user = await User.findOne({ where: { employeeId: leave.employeeId } });
      if (user) {
        await Notification.create({
          employeeId: user.id,
          type: 'CONGE',
          message: 'Votre congé a été refusé',
          isRead: false
        });
      }
    }
    res.json(leave);
  } catch (error) {
    res.status(400).json({ error: 'Erreur refus congé' });
  }
});

export default router;
