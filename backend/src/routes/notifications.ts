import { Router } from 'express';
import { Notification } from '../models/Notification';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// GET notifications for user
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const employeeId = req.user!.id;
    const notifs = await Notification.findAll({ where: { employeeId }, order: [['createdAt', 'DESC']] });
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create notification
router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const notif = await Notification.create({ ...req.body, employeeId: req.user!.id });
    res.status(201).json(notif);
  } catch (error) {
    res.status(400).json({ error: 'Erreur création notification' });
  }
});

// PATCH mark as read
router.patch('/:id/isRead', authenticateJWT, async (req, res) => {
  try {
    const notif = await Notification.findByPk(req.params.id);
    if (!notif) return res.status(404).json({ error: 'Notification non trouvée' });
    await notif.update({ isRead: true });
    res.json(notif);
  } catch (error) {
    res.status(400).json({ error: 'Erreur' });
  }
});

// DELETE notification
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const notif = await Notification.findByPk(req.params.id);
    if (!notif) return res.status(404).json({ error: 'Notification non trouvée' });
    await notif.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur suppression' });
  }
});

export default router;
