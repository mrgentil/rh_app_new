import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Role, Employee } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export interface AuthRequest extends Request {
  user?: any;
}

export async function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  console.log('🔐 Middleware d\'authentification - Cookies reçus:', req.cookies);
  console.log('🔐 Middleware d\'authentification - Headers Authorization:', req.headers.authorization);
  
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  console.log('🔐 Token extrait:', token ? 'PRÉSENT' : 'ABSENT');
  
  if (!token) {
    console.log('❌ Aucun token trouvé - Retour 401');
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Récupérer l'utilisateur avec ses relations
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Role, attributes: ['name', 'permissions'] },
        { model: Employee, attributes: ['firstName', 'lastName', 'email', 'status'] }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Compte suspendu. Contactez votre administrateur.',
        suspended: true
      });
    }
    
    req.user = {
      ...decoded,
      roleName: (user as any).Role?.name,
      permissions: (user as any).Role?.permissions,
      employee: (user as any).Employee
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.roleName)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
  };
}

export function authorizePermissions(...permissions: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log('🔑 Vérification des permissions - Utilisateur:', {
      id: req.user?.id,
      roleName: req.user?.roleName,
      permissions: req.user?.permissions
    });
    console.log('🔑 Permissions requises:', permissions);
    
    if (!req.user || !req.user.permissions) {
      console.log('❌ Pas d\'utilisateur ou pas de permissions');
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    try {
      const userPermissions = JSON.parse(req.user.permissions);
      console.log('🔑 Permissions utilisateur parsées:', userPermissions);
      
      // Vérifier si l'utilisateur a la permission "all" ou une permission spécifique
      const hasAllPermission = userPermissions.includes('all');
      const hasSpecificPermission = permissions.some(permission => 
        userPermissions.includes(permission)
      );
      
      console.log('🔑 Résultat vérification:', {
        hasAllPermission,
        hasSpecificPermission,
        finalResult: hasAllPermission || hasSpecificPermission
      });
      
      if (!hasAllPermission && !hasSpecificPermission) {
        console.log('❌ Permissions insuffisantes');
        return res.status(403).json({ 
          error: 'Permissions insuffisantes',
          required: permissions,
          userPermissions: userPermissions
        });
      }
      
      console.log('✅ Permissions validées');
      next();
    } catch (error) {
      console.error('❌ Erreur lors du parsing des permissions:', error);
      return res.status(500).json({ error: 'Erreur de vérification des permissions' });
    }
  };
}
