import { Router } from 'express';
import { Payroll } from '../models/Payroll';
import { User } from '../models/User';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import PDFDocument from 'pdfkit';

const router = Router();

// GET all payrolls
router.get('/', async (req, res) => {
  try {
    const paies = await Payroll.findAll();
    res.json(paies);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET payroll by id
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const paie = await Payroll.findByPk(req.params.id);
    if (!paie) return res.status(404).json({ error: 'Paie non trouvée' });
    res.json(paie);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// EXPORT PDF fiche de paie
router.get('/:id/pdf', authenticateJWT, async (req, res) => {
  try {
    const paie = await Payroll.findByPk(req.params.id);
    if (!paie) return res.status(404).json({ error: 'Paie non trouvée' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="paie_${paie.id}.pdf"`);
    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(22).text('Fiche de paie', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${paie.id}`);
    doc.text(`Employé ID: ${paie.employeeId}`);
    doc.text(`Période: ${paie.month} ${paie.year}`);
    doc.text(`Montant: ${paie.netSalary} €`);
    doc.text(`Créée le: ${paie.createdAt ? new Date(paie.createdAt).toLocaleDateString() : ''}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur export PDF' });
  }
});

// CREATE payroll
router.post('/', authenticateJWT, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const paie = await Payroll.create(req.body);
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('CREATE', 'Payroll', paie.id, JSON.stringify(req.body), req);
    res.status(201).json(paie);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de création', details: error });
  }
});

// UPDATE payroll
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const paie = await Payroll.findByPk(req.params.id);
    if (!paie) return res.status(404).json({ error: 'Paie non trouvée' });
    await paie.update(req.body);
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('UPDATE', 'Payroll', paie.id, JSON.stringify(req.body), req);
    res.json(paie);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de mise à jour', details: error });
  }
});

// DELETE payroll
router.delete('/:id', authenticateJWT, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const paie = await Payroll.findByPk(req.params.id);
    if (!paie) return res.status(404).json({ error: 'Paie non trouvée' });
    await paie.destroy();
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('DELETE', 'Payroll', paie.id, '', req);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
