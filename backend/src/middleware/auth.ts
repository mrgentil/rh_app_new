import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Role, Employee } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export interface AuthRequest extends Request {
  user?: any;
}

export async function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
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
    if (!req.user || !req.user.permissions) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    const userPermissions = JSON.parse(req.user.permissions);
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission) || userPermissions.includes('all')
    );
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }
    
    next();
  };
}
