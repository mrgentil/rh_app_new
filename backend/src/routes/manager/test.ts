import { Router } from 'express';
import { authenticateJWT, authorizePermissions, AuthRequest } from '../../middleware/auth';

const router = Router();

/**
 * GET /api/manager/test/auth
 * Route de test pour diagnostiquer l'authentification Manager
 */
router.get('/auth', async (req: AuthRequest, res) => {
  try {
    console.log('🧪 Test route - Headers reçus:', req.headers);
    console.log('🧪 Test route - Cookies reçus:', req.cookies);
    
    res.json({
      success: true,
      message: 'Route de test accessible sans authentification',
      timestamp: new Date().toISOString(),
      headers: {
        authorization: req.headers.authorization ? 'PRÉSENT' : 'ABSENT',
        cookie: req.headers.cookie ? 'PRÉSENT' : 'ABSENT'
      }
    });
  } catch (error: any) {
    console.error('❌ Erreur dans la route de test:', error);
    res.status(500).json({ error: 'Erreur de test', details: error.message });
  }
});

/**
 * GET /api/manager/test/auth-required
 * Route de test avec authentification requise
 */
router.get('/auth-required', 
  authenticateJWT,
  async (req: AuthRequest, res) => {
    try {
      console.log('🔐 Test route avec auth - Utilisateur:', {
        id: req.user?.id,
        username: req.user?.username,
        employeeId: req.user?.employeeId,
        roleName: req.user?.roleName,
        permissions: req.user?.permissions ? 'PRÉSENT' : 'ABSENT'
      });
      
      res.json({
        success: true,
        message: 'Authentification réussie',
        user: {
          id: req.user?.id,
          username: req.user?.username,
          employeeId: req.user?.employeeId,
          roleName: req.user?.roleName,
          hasPermissions: !!req.user?.permissions
        }
      });
    } catch (error: any) {
      console.error('❌ Erreur dans la route de test avec auth:', error);
      res.status(500).json({ error: 'Erreur de test avec auth', details: error.message });
    }
  }
);

/**
 * GET /api/manager/test/permissions
 * Route de test avec permissions Manager
 */
router.get('/permissions', 
  authenticateJWT,
  authorizePermissions('employees:view_team'),
  async (req: AuthRequest, res) => {
    try {
      console.log('🔑 Test route avec permissions - Utilisateur:', {
        id: req.user?.id,
        username: req.user?.username,
        roleName: req.user?.roleName,
        permissions: req.user?.permissions
      });
      
      const userPermissions = req.user?.permissions ? JSON.parse(req.user.permissions) : [];
      
      res.json({
        success: true,
        message: 'Permissions validées',
        user: {
          id: req.user?.id,
          username: req.user?.username,
          roleName: req.user?.roleName,
          permissions: userPermissions,
          hasTeamViewPermission: userPermissions.includes('employees:view_team') || userPermissions.includes('all')
        }
      });
    } catch (error: any) {
      console.error('❌ Erreur dans la route de test avec permissions:', error);
      res.status(500).json({ error: 'Erreur de test avec permissions', details: error.message });
    }
  }
);

/**
 * GET /api/manager/test/user-info
 * Route pour afficher toutes les informations utilisateur
 */
router.get('/user-info', 
  authenticateJWT,
  async (req: AuthRequest, res) => {
    try {
      res.json({
        success: true,
        message: 'Informations utilisateur complètes',
        fullUser: req.user,
        parsedPermissions: req.user?.permissions ? JSON.parse(req.user.permissions) : null
      });
    } catch (error: any) {
      console.error('❌ Erreur dans la route user-info:', error);
      res.status(500).json({ error: 'Erreur user-info', details: error.message });
    }
  }
);

export default router;
