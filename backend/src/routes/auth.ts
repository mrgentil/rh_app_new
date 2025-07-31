import { Router } from 'express';
import { User, Employee, Role } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Middleware pour vérifier le token
const authenticateToken = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Role, attributes: ['name', 'permissions'] },
        { model: Employee, attributes: ['firstName', 'lastName', 'email', 'status', 'photoUrl'] }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }
    
    const user = await User.findOne({ 
      where: { username },
      include: [
        { model: Role, attributes: ['name', 'permissions'] },
        { model: Employee, attributes: ['firstName', 'lastName', 'email', 'status', 'photoUrl'] }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        roleId: user.roleId, 
        roleName: (user as any).Role?.name,
        employeeId: user.employeeId 
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.cookie('token', token, { 
      httpOnly: true, 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 jour
    });
    
    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        role: (user as any).Role?.name,
        permissions: (user as any).Role?.permissions,
        employeeId: user.employeeId,
        isActive: user.isActive,
        photoUrl: user.photoUrl || (user as any).Employee?.photoUrl,
        firstName: (user as any).Employee?.firstName,
        lastName: (user as any).Employee?.lastName,
        employee: (user as any).Employee ? {
          firstName: (user as any).Employee.firstName,
          lastName: (user as any).Employee.lastName,
          email: (user as any).Employee.email,
          status: (user as any).Employee.status,
          photoUrl: (user as any).Employee.photoUrl
        } : null
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les infos de l'utilisateur connecté
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    console.log('🔍 Récupération utilisateur ID:', userId);
    
    // Récupérer l'utilisateur avec ses relations
    const user = await User.findByPk(userId, {
      include: [
        { model: Role, attributes: ['name', 'permissions'] },
        { model: Employee, attributes: ['firstName', 'lastName', 'email', 'status', 'photoUrl'] }
      ]
    });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const responseData = {
      id: user.id,
      username: user.username,
      role: (user as any).Role?.name,
      permissions: (user as any).Role?.permissions,
      employeeId: user.employeeId,
      isActive: user.isActive,
      photoUrl: user.photoUrl || (user as any).Employee?.photoUrl,
      firstName: (user as any).Employee?.firstName,
      lastName: (user as any).Employee?.lastName,
      employee: (user as any).Employee ? {
        firstName: (user as any).Employee.firstName,
        lastName: (user as any).Employee.lastName,
        email: (user as any).Employee.email,
        status: (user as any).Employee.status,
        photoUrl: (user as any).Employee.photoUrl
      } : null
    };
    
    console.log('📤 Données utilisateur envoyées:', {
      id: responseData.id,
      username: responseData.username,
      photoUrl: responseData.photoUrl,
      firstName: responseData.firstName,
      lastName: responseData.lastName,
      employeePhotoUrl: responseData.employee?.photoUrl
    });
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

export default router; 