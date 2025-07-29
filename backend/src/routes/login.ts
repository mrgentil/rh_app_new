import { Router } from 'express';
import { User } from '../models/User';
import { Role } from '../models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Role, as: 'Role' }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Votre compte est suspendu. Contactez votre administrateur.',
        suspended: true
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ 
      id: user.id, 
      roleId: user.roleId, 
      employeeId: user.employeeId 
    }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ 
      token, 
      role: (user as any).Role?.name || 'User',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

export default router;
