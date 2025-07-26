import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// GET /api/audit?userId=&action=&table=&date=&limit=&offset=
router.get('/', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  const { userId, action, table, date, limit = 50, offset = 0 } = req.query;
  const where: any = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (table) where.table = table;
  if (date) {
    // Filtre sur la date (YYYY-MM-DD)
    const start = new Date(date as string);
    const end = new Date(date as string);
    end.setDate(end.getDate() + 1);
    where.createdAt = { $gte: start, $lt: end };
  }
  try {
    const total = await AuditLog.count({ where });
    const logs = await AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json({ logs, total });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lecture logs' });
  }
});

export default router;
