import { Router } from 'express';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// GET all users (admin only)
router.get('/', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: Employee }] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET one user (admin or self)
router.get('/:id', authenticateJWT, async (req: any, res) => {
  if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  const user = await User.findByPk(req.params.id, { include: [{ model: Employee }] });
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json(user);
});

// CREATE user (admin only)
router.post('/', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('CREATE', 'User', user.id, JSON.stringify(req.body), req);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de création', details: error });
  }
});

// UPDATE user (admin or self)
router.put('/:id', authenticateJWT, async (req: any, res) => {
  if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);
  await user.update(req.body);
  // Audit log
  const { logAudit } = require('../middleware/auditLog');
  await logAudit('UPDATE', 'User', user.id, JSON.stringify(req.body), req);
  res.json(user);
});

// DELETE user (admin only)
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  await user.destroy();
  // Audit log
  const { logAudit } = require('../middleware/auditLog');
  await logAudit('DELETE', 'User', user.id, '', req);
  res.status(204).end();
});

export default router;
