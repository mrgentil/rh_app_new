import { Router } from 'express';
import { userService, CreateUserData } from '../services/userService';
import { authenticateJWT, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/auditLog';
import '../models'; // Import pour charger les associations

const router = Router();

// GET all users (admin, RH and Manager only)
router.get('/', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req: AuthRequest, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET user statistics (admin, RH and Manager only)
router.get('/stats', authenticateJWT, authorizeRoles('Admin', 'RH', 'Manager'), async (req: AuthRequest, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET one user (admin, RH, Manager, or self)
router.get('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    if (req.user?.roleName !== 'Admin' && req.user?.roleName !== 'RH' && req.user?.roleName !== 'Manager' && req.user?.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const user = await userService.getUserById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// CREATE user (admin and RH only)
router.post('/', authenticateJWT, authorizeRoles('Admin', 'RH'), async (req: AuthRequest, res) => {
  try {
    const { 
      username, 
      email, 
      firstName, 
      lastName, 
      phone, 
      roleId, 
      departmentId, 
      jobTitleId,
      address,
      birthDate,
      hireDate,
      status,
      managerId
    } = req.body;

    // Validation des données obligatoires
    if (!username || !email || !firstName || !lastName || !phone || !roleId || !departmentId || !jobTitleId) {
      return res.status(400).json({ 
        error: 'Les champs username, email, firstName, lastName, phone, roleId, departmentId et jobTitleId sont obligatoires' 
      });
    }

    const userData: CreateUserData = {
      username,
      email,
      firstName,
      lastName,
      phone,
      roleId: parseInt(roleId),
      departmentId: parseInt(departmentId),
      jobTitleId: parseInt(jobTitleId),
      ...(address && { address }),
      ...(birthDate && { birthDate }),
      ...(hireDate && { hireDate }),
      ...(status && { status }),
      ...(managerId && { managerId: parseInt(managerId) })
    };

    const user = await userService.createUser(userData);
    
    // Audit log
    await logAudit('CREATE', 'User', user.id, JSON.stringify(userData), req);
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès. Un email d\'activation a été envoyé. L\'utilisateur doit activer son compte pour pouvoir se connecter.',
      user
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur de création' 
    });
  }
});

// UPDATE user (admin, RH, Manager, or self)
router.put('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    if (req.user?.roleName !== 'Admin' && req.user?.roleName !== 'RH' && req.user?.roleName !== 'Manager' && req.user?.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const userId = parseInt(req.params.id);
    const updateData = req.body;

    const user = await userService.updateUser(userId, updateData);
    
    // Audit log
    await logAudit('UPDATE', 'User', userId, JSON.stringify(updateData), req);
    
    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur de mise à jour' 
    });
  }
});

// DELETE user (admin only)
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user?.id;
    
    await userService.deleteUser(userId, currentUserId);
    
    // Audit log
    await logAudit('DELETE', 'User', userId, '', req);
    
    res.json({ message: 'Utilisateur supprimé avec succès. Un email de notification a été envoyé.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur de suppression' 
    });
  }
});

// Suspend user (admin only)
router.put('/:id/suspend', authenticateJWT, authorizeRoles('Admin'), async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { reason } = req.body;
    
    const user = await userService.suspendUser(userId, reason);
    
    // Audit log
    await logAudit('SUSPEND', 'User', userId, JSON.stringify({ reason }), req);
    
    res.json({
      message: 'Utilisateur suspendu avec succès. Un email de notification a été envoyé.',
      user
    });
  } catch (error) {
    console.error('Erreur lors de la suspension de l\'utilisateur:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur de suspension' 
    });
  }
});

// Reactivate user (admin only)
router.put('/:id/reactivate', authenticateJWT, authorizeRoles('Admin'), async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await userService.reactivateUser(userId);
    
  // Audit log
    await logAudit('REACTIVATE', 'User', userId, '', req);
    
    res.json({
      message: 'Utilisateur réactivé avec succès. Un email de notification a été envoyé.',
      user
    });
  } catch (error) {
    console.error('Erreur lors de la réactivation de l\'utilisateur:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur de réactivation' 
    });
  }
});

// Reset user password (admin only)
router.put('/:id/reset-password', authenticateJWT, authorizeRoles('Admin'), async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    await userService.resetUserPassword(userId);
    
    // Audit log
    await logAudit('RESET_PASSWORD', 'User', userId, '', req);
    
    res.json({ 
      message: 'Mot de passe réinitialisé avec succès. Un email a été envoyé à l\'utilisateur.' 
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur de réinitialisation' 
    });
  }
});

// Set new password with token (public route)
router.post('/set-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Token et nouveau mot de passe sont obligatoires' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'Le mot de passe doit contenir au moins 8 caractères' 
      });
    }

    await userService.setNewPassword(token, newPassword);
    
    res.json({ message: 'Mot de passe défini avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error('Erreur lors de la définition du mot de passe:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur lors de la définition du mot de passe' 
    });
  }
});

// Search users (admin only)
router.get('/search/:query', authenticateJWT, authorizeRoles('Admin'), async (req: AuthRequest, res) => {
  try {
    const { query } = req.params;
    const users = await userService.searchUsers(query);
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Toggle user status (admin only) - Legacy route for compatibility
router.put('/:id/status', authenticateJWT, authorizeRoles('Admin'), async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isActive } = req.body;
    
    if (isActive === false) {
      const user = await userService.suspendUser(userId);
      await logAudit('SUSPEND', 'User', userId, JSON.stringify({ reason: 'Suspension via toggle' }), req);
      res.json({
        message: 'Utilisateur suspendu avec succès',
        user
      });
    } else {
      const user = await userService.reactivateUser(userId);
      await logAudit('REACTIVATE', 'User', userId, '', req);
      res.json({
        message: 'Utilisateur réactivé avec succès',
        user
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut' 
    });
  }
});

export default router;
