import { Router } from 'express';
import { Employee, User, Notification, JobTitle, Department, Contract, Role } from '../models';
import { authenticateJWT, authorizeRoles, AuthRequest } from '../middleware/auth';
import PDFDocument from 'pdfkit';

const router = Router();

// EXPORT CSV employés
router.get('/export/csv', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: JobTitle, attributes: ['title'] },
        { model: Department, attributes: ['name'] },
        { model: Contract, attributes: ['type', 'salary'] }
      ]
    });
    
    const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
    const csvWriter = createCsvWriter({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'firstName', title: 'Prénom' },
        { id: 'lastName', title: 'Nom' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Téléphone' },
        { id: 'jobTitle', title: 'Poste' },
        { id: 'department', title: 'Département' },
        { id: 'contractType', title: 'Type de contrat' },
        { id: 'salary', title: 'Salaire' },
        { id: 'hireDate', title: 'Date d\'embauche' },
        { id: 'status', title: 'Statut' },
        { id: 'createdAt', title: 'Créé le' }
      ]
    });
    
    const records = employees.map(e => ({
      ...e.toJSON(),
      jobTitle: (e as any).JobTitle?.title || '',
      department: (e as any).Department?.name || '',
      contractType: (e as any).Contract?.type || '',
      salary: (e as any).Contract?.salary || '',
      hireDate: e.hireDate ? new Date(e.hireDate).toLocaleDateString() : '',
      createdAt: e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ''
    }));
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="employes.csv"');
    res.send(csvWriter.getHeaderString() + csvWriter.stringifyRecords(records));
  } catch (error) {
    res.status(500).json({ error: 'Erreur export CSV' });
  }
});

// EXPORT Excel employés
router.get('/export/excel', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: JobTitle, attributes: ['title'] },
        { model: Department, attributes: ['name'] },
        { model: Contract, attributes: ['type', 'salary'] }
      ]
    });
    
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employés');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 6 },
      { header: 'Prénom', key: 'firstName', width: 20 },
      { header: 'Nom', key: 'lastName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Téléphone', key: 'phone', width: 15 },
      { header: 'Poste', key: 'jobTitle', width: 20 },
      { header: 'Département', key: 'department', width: 20 },
      { header: 'Type de contrat', key: 'contractType', width: 15 },
      { header: 'Salaire', key: 'salary', width: 12 },
      { header: 'Date d\'embauche', key: 'hireDate', width: 18 },
      { header: 'Statut', key: 'status', width: 12 },
      { header: 'Créé le', key: 'createdAt', width: 15 }
    ];
    
    employees.forEach(e => {
      worksheet.addRow({
        ...e.toJSON(),
        jobTitle: (e as any).JobTitle?.title || '',
        department: (e as any).Department?.name || '',
        contractType: (e as any).Contract?.type || '',
        salary: (e as any).Contract?.salary || '',
        hireDate: e.hireDate ? new Date(e.hireDate).toLocaleDateString() : '',
        createdAt: e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ''
      });
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="employes.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur export Excel' });
  }
});

// GET all employees with relations
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: JobTitle, attributes: ['title', 'description'] },
        { model: Department, attributes: ['name', 'description'] },
        { model: Contract, attributes: ['type', 'startDate', 'endDate', 'salary'] },
        { 
          model: Employee, 
          as: 'manager', 
          attributes: ['firstName', 'lastName', 'email'] 
        }
      ]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET one employee with relations
router.get('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: JobTitle, attributes: ['title', 'description'] },
        { model: Department, attributes: ['name', 'description'] },
        { model: Contract, attributes: ['type', 'startDate', 'endDate', 'salary'] },
        { 
          model: Employee, 
          as: 'manager', 
          attributes: ['firstName', 'lastName', 'email'] 
        },
        { 
          model: Employee, 
          as: 'subordinates', 
          attributes: ['firstName', 'lastName', 'email', 'status'] 
        }
      ]
    });
    
    if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// EXPORT PDF contrat de travail
router.get('/:id/contrat', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: JobTitle, attributes: ['title'] },
        { model: Department, attributes: ['name'] },
        { model: Contract, attributes: ['type', 'startDate', 'salary'] }
      ]
    });
    
    if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="contrat_${employee.id}.pdf"`);
    
    const doc = new PDFDocument();
    doc.pipe(res);
    
    doc.fontSize(22).text('Contrat de travail', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Nom: ${employee.lastName}`);
    doc.text(`Prénom: ${employee.firstName}`);
    doc.text(`Email: ${employee.email}`);
    doc.text(`Téléphone: ${employee.phone}`);
    doc.text(`Poste: ${(employee as any).JobTitle?.title || ''}`);
    doc.text(`Département: ${(employee as any).Department?.name || ''}`);
    doc.text(`Type de contrat: ${(employee as any).Contract?.type || ''}`);
    doc.text(`Salaire: ${(employee as any).Contract?.salary || ''} €`);
    doc.text(`Date d'embauche: ${employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : ''}`);
    doc.text(`Statut: ${employee.status || ''}`);
    doc.text(`Créé le: ${employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : ''}`);
    doc.moveDown();
    doc.fontSize(12).text('Ce contrat de travail est conclu entre la société et le salarié mentionné ci-dessus. Les conditions particulières sont à consulter auprès du service RH.');
    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur export PDF contrat' });
  }
});

// CREATE employee
router.post('/', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req: AuthRequest, res) => {
  try {
    // Vérification supplémentaire : seul un Admin peut créer un employé avec le rôle Admin
    if (req.user.roleName === 'RH' && req.body.roleId) {
      // On récupère le rôle demandé
      const role = await Role.findByPk(req.body.roleId);
      if (role && role.name === 'Admin') {
        return res.status(403).json({ error: 'Seul un Admin peut créer un autre Admin.' });
      }
    }

    // Générer le matricule automatiquement
    const lastEmployee = await Employee.findOne({
      order: [['id', 'DESC']]
    });
    
    let nextMatricule = 'EMP001';
    if (lastEmployee && lastEmployee.matricule) {
      const lastNumber = parseInt(lastEmployee.matricule.replace('EMP', ''));
      nextMatricule = `EMP${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Préparer les données de l'employé
    const employeeData = {
      ...req.body,
      matricule: nextMatricule,
      // S'assurer que managerId est null si non spécifié pour éviter l'erreur de contrainte
      managerId: req.body.managerId || null
    };

    // Créer l'employé
    const employee = await Employee.create(employeeData);
    
    // Déterminer le rôle par défaut selon le type d'employé
    let defaultRoleId = null;
    
    if (req.body.roleId) {
      // Si un rôle est spécifié explicitement, l'utiliser
      defaultRoleId = req.body.roleId;
    } else {
      // Sinon, déterminer le rôle par défaut selon le type d'employé
      const employeeType = req.body.employeeType || 'permanent';
      
      if (employeeType === 'stagiaire') {
        const stagiaireRole = await Role.findOne({ where: { name: 'Stagiaire' } });
        defaultRoleId = stagiaireRole?.id;
      } else {
        const employeRole = await Role.findOne({ where: { name: 'Employé' } });
        defaultRoleId = employeRole?.id;
      }
    }
    
    // Créer automatiquement un compte utilisateur pour TOUS les employés
    if (defaultRoleId) {
      const role = await Role.findByPk(defaultRoleId);
      if (role) {
        // Générer un mot de passe temporaire (l'employé devra le changer à sa première connexion)
        const tempPassword = Math.random().toString(36).slice(-8);
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        await User.create({
          employeeId: employee.id,
          username: employee.email,
          password: hashedPassword,
          roleId: defaultRoleId
        });

        // Notifier l'employé de la création de son compte
        console.log(`✅ Compte utilisateur créé pour ${employee.email}`);
        console.log(`🔑 Mot de passe temporaire: ${tempPassword}`);
        console.log(`👤 Rôle attribué: ${role.name}`);
        console.log(`🆔 Matricule: ${employee.matricule}`);
      }
    }
    
    // Notifie tous les admins RH
    const admins = await User.findAll({ 
      include: [{ model: Role, where: { name: 'Admin' } }]
    });
    
    for (const admin of admins) {
      if (admin.employeeId) {
        await Notification.create({
          employeeId: admin.employeeId,
          type: 'EMPLOYE',
          message: `Nouvel employé créé : ${employee.firstName} ${employee.lastName} (${employee.matricule})`,
          isRead: false
        });
      }
    }
    
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('CREATE', 'Employee', employee.id, JSON.stringify(req.body), req);
    
    res.status(201).json(employee);
  } catch (error) {
    console.error('Erreur création employé:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: "Erreur lors de la création de l'employé", details: message });
  }
});

// UPDATE employee
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req: AuthRequest, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    // Vérification supplémentaire : seul un Admin peut modifier un employé pour le passer Admin
    if (req.user.roleName === 'RH' && req.body.roleId) {
      const role = await Role.findByPk(req.body.roleId);
      if (role && role.name === 'Admin') {
        return res.status(403).json({ error: 'Seul un Admin peut promouvoir un employé en Admin.' });
      }
    }
    await employee.update(req.body);
    
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('UPDATE', 'Employee', employee.id, JSON.stringify(req.body), req);
    
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Erreur de mise à jour', details: error });
  }
});

// DELETE employee
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req: AuthRequest, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    
    await employee.destroy();
    
    // Audit log
    const { logAudit } = require('../middleware/auditLog');
    await logAudit('DELETE', 'Employee', employee.id, '', req);
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
