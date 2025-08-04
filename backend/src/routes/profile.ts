import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import { Department } from '../models/Department';
import { JobTitle } from '../models/JobTitle';
import { Role } from '../models/Role';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Récupérer le profil de l'utilisateur connecté
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findByPk(userId, {
      include: [
        { model: Role }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Construire l'objet profil de manière sécurisée
    const profile: any = {
      id: user.id,
      username: user.username,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      country: user.country || 'France',
      photoUrl: user.photoUrl || '',
      salary: user.salary || 0,
      emergencyContact: {
        name: user.emergencyContactName || '',
        phone: user.emergencyContactPhone || '',
        relationship: user.emergencyContactRelationship || ''
      },
      professional: {
        department: '',
        position: '',
        role: '',
        hireDate: null,
        status: '',
        employeeType: ''
      },
      employeeId: user.employeeId
    };

    // Ajouter les données de l'employé si elles existent
    if (user.employeeId) {
      const employee = await Employee.findByPk(user.employeeId, {
        include: [
          { model: Department },
          { model: JobTitle }
        ]
      });
      
      if (employee) {
        profile.firstName = profile.firstName || employee.firstName || '';
        profile.lastName = profile.lastName || employee.lastName || '';
        profile.email = profile.email || employee.email || '';
        profile.phone = profile.phone || employee.phone || '';
        profile.address = profile.address || employee.address || '';
        profile.city = profile.city || (employee as any).city || '';
        profile.postalCode = profile.postalCode || (employee as any).postalCode || '';
        profile.country = profile.country || (employee as any).country || 'France';
        profile.photoUrl = profile.photoUrl || employee.photoUrl || '';
        profile.salary = profile.salary || employee.salary || 0;
        profile.emergencyContact.name = profile.emergencyContact.name || (employee as any).emergencyContactName || '';
        profile.emergencyContact.phone = profile.emergencyContact.phone || (employee as any).emergencyContactPhone || '';
        profile.emergencyContact.relationship = profile.emergencyContact.relationship || (employee as any).emergencyContactRelationship || '';
        
        profile.professional = {
          department: (employee as any).Department?.name || '',
          position: (employee as any).JobTitle?.title || '',
          role: (user as any).Role?.name || '',
          hireDate: employee.hireDate,
          status: employee.status || '',
          employeeType: employee.employeeType || ''
        };
      }
    }

    res.json(profile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le profil de l'utilisateur connecté
router.put('/me', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const updateData = req.body;
    
    console.log('🔧 Mise à jour du profil - User ID:', userId);
    console.log('🔧 Données reçues:', updateData);

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier les permissions
    const isAdmin = userRole === 'Admin' || userRole === 'RH';
    
    // Mettre à jour les informations utilisateur (toujours autorisé)
    const userUpdateData: any = {};
    
    if (updateData.email) userUpdateData.email = updateData.email;
    if (updateData.firstName) userUpdateData.firstName = updateData.firstName;
    if (updateData.lastName) userUpdateData.lastName = updateData.lastName;
    if (updateData.phone) userUpdateData.phone = updateData.phone;
    if (updateData.address) userUpdateData.address = updateData.address;
    if (updateData.city) userUpdateData.city = updateData.city;
    if (updateData.postalCode) userUpdateData.postalCode = updateData.postalCode;
    if (updateData.country) userUpdateData.country = updateData.country;
    if (updateData.photoUrl) userUpdateData.photoUrl = updateData.photoUrl;
    if (updateData.emergencyContactName) userUpdateData.emergencyContactName = updateData.emergencyContactName;
    if (updateData.emergencyContactPhone) userUpdateData.emergencyContactPhone = updateData.emergencyContactPhone;
    if (updateData.emergencyContactRelationship) userUpdateData.emergencyContactRelationship = updateData.emergencyContactRelationship;

    console.log('🔧 Données utilisateur à mettre à jour:', userUpdateData);
    await user.update(userUpdateData);

    // Mettre à jour les informations employé si elles existent
    if (user.employeeId) {
      const employee = await Employee.findByPk(user.employeeId);
      if (employee) {
        const employeeUpdateData: any = {};
        
        // Informations personnelles (toujours autorisées)
        if (updateData.email) employeeUpdateData.email = updateData.email;
        if (updateData.firstName) employeeUpdateData.firstName = updateData.firstName;
        if (updateData.lastName) employeeUpdateData.lastName = updateData.lastName;
        if (updateData.phone) employeeUpdateData.phone = updateData.phone;
        if (updateData.address) employeeUpdateData.address = updateData.address;
        if (updateData.city) employeeUpdateData.city = updateData.city;
        if (updateData.postalCode) employeeUpdateData.postalCode = updateData.postalCode;
        if (updateData.country) employeeUpdateData.country = updateData.country;
        if (updateData.photoUrl) employeeUpdateData.photoUrl = updateData.photoUrl;
        if (updateData.emergencyContactName) employeeUpdateData.emergencyContactName = updateData.emergencyContactName;
        if (updateData.emergencyContactPhone) employeeUpdateData.emergencyContactPhone = updateData.emergencyContactPhone;
        if (updateData.emergencyContactRelationship) employeeUpdateData.emergencyContactRelationship = updateData.emergencyContactRelationship;

        // Informations professionnelles (admin seulement)
        if (isAdmin) {
          if (updateData.departmentId) employeeUpdateData.departmentId = updateData.departmentId;
          if (updateData.jobTitleId) employeeUpdateData.jobTitleId = updateData.jobTitleId;
          if (updateData.salary) employeeUpdateData.salary = updateData.salary;
          if (updateData.status) employeeUpdateData.status = updateData.status;
          if (updateData.employeeType) employeeUpdateData.employeeType = updateData.employeeType;
        }

        console.log('🔧 Données employé à mettre à jour:', employeeUpdateData);
        await employee.update(employeeUpdateData);
        console.log('✅ Employé mis à jour avec succès');
      }
    }

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Changer le mot de passe
router.put('/me/password', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe actuel
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Upload de photo de profil
router.post('/me/photo', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { photoUrl } = req.body;

    console.log('🔧 Upload photo - User ID:', userId);
    console.log('🔧 Taille de l\'image:', photoUrl ? photoUrl.length : 0, 'caractères');

    if (!photoUrl) {
      return res.status(400).json({ message: 'URL de photo requise' });
    }

    // Vérifier la taille de l'image (max 1MB en base64)
    if (photoUrl.length > 1024 * 1024) {
      console.log('❌ Image trop grande:', photoUrl.length, 'caractères');
      return res.status(400).json({ message: 'Image trop grande. Taille maximale: 1MB' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('🔧 Mise à jour de la photo pour l\'utilisateur:', user.username);

    // Mettre à jour la photo dans la table users
    await user.update({ photoUrl });

    // Mettre à jour la photo dans la table employees si elle existe
    if (user.employeeId) {
      const employee = await Employee.findByPk(user.employeeId);
      if (employee) {
        console.log('🔧 Mise à jour de la photo pour l\'employé:', employee.firstName, employee.lastName);
        await employee.update({ photoUrl });
      }
    }

    console.log('✅ Photo mise à jour avec succès');
    res.json({ message: 'Photo de profil mise à jour avec succès', photoUrl });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload de photo:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'upload de photo' });
  }
});

export default router; 