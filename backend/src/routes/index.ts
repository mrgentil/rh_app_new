import { Router } from 'express';
import authRoutes from './auth';
import employeeRoutes from './employes';
import leaveRoutes from './conges';
import payrollRoutes from './paie';
import documentRoutes from './documents';
import userRoutes from './users';
import notificationRoutes from './notifications';
import auditRoutes from './audit';
import setupRoutes from './setup';
import departmentRoutes from './departments';
import jobTitleRoutes from './jobTitles';
import roleRoutes from './roles';
import profileRoutes from './profile';
import teamRoutes from './teams';
import objectiveRoutes from './objectives';
import managerEmployeeRoutes from './manager/employees';
import managerTeamRoutes from './manager/teamManagement';
import managerTestRoutes from './manager/test';

const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes des employés
router.use('/employees', employeeRoutes);

// Routes des congés
router.use('/leaves', leaveRoutes);

// Routes de la paie
router.use('/payroll', payrollRoutes);

// Routes des documents
router.use('/documents', documentRoutes);

// Routes des utilisateurs
router.use('/users', userRoutes);

// Routes des notifications
router.use('/notifications', notificationRoutes);

// Routes d'audit
router.use('/audit', auditRoutes);

// Routes de configuration
router.use('/setup', setupRoutes);

// Nouvelles routes
router.use('/departments', departmentRoutes);
router.use('/job-titles', jobTitleRoutes);
router.use('/roles', roleRoutes);

// Routes du profil utilisateur
router.use('/profile', profileRoutes);

// Routes de gestion d'équipe et management
router.use('/teams', teamRoutes);
router.use('/objectives', objectiveRoutes);

// Routes Manager
router.use('/manager/employees', managerEmployeeRoutes);
router.use('/manager/team-management', managerTeamRoutes);
router.use('/manager/test', managerTestRoutes);

export default router;
