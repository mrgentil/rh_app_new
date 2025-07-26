import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Document } from '../models/Document';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST upload document
router.post('/', authenticateJWT, upload.single('file'), async (req: any, res) => {
  try {
    const { employeeId, type, nom } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
    const document = await Document.create({
      employeeId,
      type,
      nom,
      url: `/uploads/${req.file.filename}`,
    });
    // Notifie l'utilisateur lié à l'employé
    const user = await User.findOne({ where: { employeeId } });
    if (user && user.employeeId) {
      await Notification.create({
        employeeId: user.employeeId,
        type: 'DOCUMENT',
        message: 'Nouveau document ajouté à votre dossier',
        isRead: false
      });
    }
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: 'Erreur upload', details: error });
  }
});

// GET all documents for an employee
router.get('/employe/:employeeId', authenticateJWT, async (req, res) => {
  try {
    const docs = await Document.findAll({ where: { employeeId: req.params.employeeId } });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE document
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document non trouvé' });
    // remove file from disk
    const filePath = path.join(__dirname, '../../', doc.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await doc.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
