import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, Role, Employee, JobTitle, Department } from '../models';

const router = Router();

// Route pour créer l'utilisateur administrateur par défaut
router.post('/create-admin', async (req, res) => {
  try {
    // Vérifier si l'utilisateur admin existe déjà
    const existingAdmin = await User.findOne({
      where: { username: 'admin' },
      include: [Role, Employee]
    });

    if (existingAdmin) {
      return res.json({
        success: true,
        message: 'L\'utilisateur administrateur existe déjà',
        user: {
          username: existingAdmin.username,
          role: (existingAdmin as any).Role?.name,
          id: existingAdmin.id,
          email: (existingAdmin as any).Employee?.email
        }
      });
    }

    // Récupérer le rôle Admin
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      return res.status(400).json({ success: false, error: 'Le rôle Admin n\'existe pas' });
    }

    // Récupérer un poste et un département existants
    const jobTitle = await JobTitle.findOne();
    const department = await Department.findOne();
    if (!jobTitle || !department) {
      return res.status(400).json({ success: false, error: 'Aucun poste ou département trouvé. Veuillez d\'abord lancer le seed.' });
    }

    // Créer un employé admin
    const adminEmployee = await Employee.create({
      firstName: 'Admin',
      lastName: 'Système',
      email: 'admin@rh-app.com',
      phone: '0123456789',
      status: 'actif',
      hireDate: new Date(),
      birthDate: new Date('1990-01-01'),
      jobTitleId: jobTitle.id,
      departmentId: department.id
    });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'utilisateur administrateur
    const adminUser = await User.create({
      username: 'admin',
      password: hashedPassword,
      roleId: adminRole.id,
      employeeId: adminEmployee.id
    });

    res.json({
      success: true,
      message: 'Utilisateur administrateur créé avec succès !',
      user: {
        username: adminUser.username,
        role: (adminUser as any).Role?.name || 'Admin',
        id: adminUser.id,
        email: adminEmployee.email
      },
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur admin:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'utilisateur administrateur'
    });
  }
});

export default router; 