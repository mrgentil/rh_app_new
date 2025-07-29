import { User, Employee, Role, JobTitle, Department } from '../models';
import { emailService } from './emailService';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface CreateUserData {
  // Informations utilisateur (obligatoires)
  username: string;
  email: string;
  
  // Informations employé (obligatoires)
  firstName: string;
  lastName: string;
  phone: string;
  roleId: number;        // Rôle obligatoire
  departmentId: number;  // Département obligatoire
  jobTitleId: number;    // Fonction obligatoire
  
  // Informations optionnelles
  address?: string;
  birthDate?: string;
  hireDate?: string;
  status?: string;
  managerId?: number;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  roleId?: number;
  employeeId?: number;
  isActive?: boolean;
  // Informations employé
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  hireDate?: string;
  status?: string;
}

export interface UserWithDetails {
  id: number;
  username: string;
  email: string;
  roleId: number;
  roleName: string;
  employeeId?: number;
  employeeName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Informations employé complètes
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    hireDate?: string;
    status: string;
  };
  // Informations rôle complètes
  role?: {
    id: number;
    name: string;
    permissions: string;
  };
}

class UserService {
  // Créer un nouvel utilisateur avec notification par email
  async createUser(userData: CreateUserData): Promise<UserWithDetails> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        where: { username: userData.username }
      });

      if (existingUser) {
        throw new Error('Un utilisateur avec ce nom d\'utilisateur existe déjà');
      }

      // Générer un mot de passe temporaire sécurisé
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Créer l'employé avec toutes les informations obligatoires
      const employeeData: any = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        jobTitleId: userData.jobTitleId,
        departmentId: userData.departmentId,
        status: userData.status || 'actif'
      };

      // Ajouter les champs optionnels seulement s'ils sont définis
      if (userData.address) employeeData.address = userData.address;
      if (userData.birthDate) employeeData.birthDate = userData.birthDate;
      if (userData.hireDate) employeeData.hireDate = userData.hireDate;
      if (userData.managerId) employeeData.managerId = userData.managerId;

      const employee = await Employee.create(employeeData);
      const employeeId = employee.id;

      // Créer l'utilisateur (inactif par défaut)
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        roleId: userData.roleId,
        employeeId: employeeId,
        isActive: false // Utilisateur inactif jusqu'à activation
      });

      // Récupérer les détails complets
      const userWithDetails = await this.getUserById(user.id);
      if (!userWithDetails) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      // Envoyer l'email de création de compte
      const resetToken = emailService.generateResetToken(user.id, userData.email);
      try {
        await emailService.sendPasswordResetEmail(
          userData.email,
          userData.username,
          resetToken
        );
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de création:', emailError);
        // Continuer même si l'email échoue
      }

      return userWithDetails;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<UserWithDetails[]> {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'birthDate', 'hireDate', 'status']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'permissions']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return users.map(user => {
        const employee = (user as any).Employee;
        const role = (user as any).Role;

        return {
          id: user.id,
          username: user.username,
          email: employee?.email || user.username,
          roleId: user.roleId,
          roleName: role?.name || 'Inconnu',
          employeeId: user.employeeId,
          employeeName: employee 
            ? `${employee.firstName} ${employee.lastName}`
            : undefined,
          isActive: user.isActive !== false,
          createdAt: user.createdAt!,
          updatedAt: user.updatedAt!,
          // Informations employé complètes
          employee: employee ? {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            address: employee.address,
            birthDate: employee.birthDate,
            hireDate: employee.hireDate,
            status: employee.status
          } : undefined,
          // Informations rôle complètes
          role: role ? {
            id: role.id,
            name: role.name,
            permissions: role.permissions
          } : undefined
        };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: number): Promise<UserWithDetails | null> {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'birthDate', 'hireDate', 'status']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'permissions']
          }
        ]
      });

      if (!user) return null;

      const employee = (user as any).Employee;
      const role = (user as any).Role;

      return {
        id: user.id,
        username: user.username,
        email: employee?.email || user.username,
        roleId: user.roleId,
        roleName: role?.name || 'Inconnu',
        employeeId: user.employeeId,
        employeeName: employee 
          ? `${employee.firstName} ${employee.lastName}`
          : undefined,
        isActive: user.isActive !== false,
        createdAt: user.createdAt!,
        updatedAt: user.updatedAt!,
        // Informations employé complètes
        employee: employee ? {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          address: employee.address,
          birthDate: employee.birthDate,
          hireDate: employee.hireDate,
          status: employee.status
        } : undefined,
        // Informations rôle complètes
        role: role ? {
          id: role.id,
          name: role.name,
          permissions: role.permissions
        } : undefined
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(id: number, userData: UpdateUserData): Promise<UserWithDetails> {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'birthDate', 'hireDate', 'status']
          }
        ]
      });
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier si le nouveau nom d'utilisateur existe déjà
      if (userData.username && userData.username !== user.username) {
        const existingUser = await User.findOne({
          where: { username: userData.username }
        });
        if (existingUser) {
          throw new Error('Un utilisateur avec ce nom d\'utilisateur existe déjà');
        }
      }

      // Extraire les données utilisateur et employé
      const userUpdateData: any = {};
      const employeeUpdateData: any = {};

      // Données utilisateur
      if (userData.username) userUpdateData.username = userData.username;
      if (userData.email) userUpdateData.email = userData.email;
      if (userData.roleId) userUpdateData.roleId = userData.roleId;
      if (userData.employeeId) userUpdateData.employeeId = userData.employeeId;
      if (userData.isActive !== undefined) userUpdateData.isActive = userData.isActive;

      // Données employé
      if (userData.firstName) employeeUpdateData.firstName = userData.firstName;
      if (userData.lastName) employeeUpdateData.lastName = userData.lastName;
      if (userData.phone) employeeUpdateData.phone = userData.phone;
      if (userData.address) employeeUpdateData.address = userData.address;
      if (userData.birthDate) employeeUpdateData.birthDate = userData.birthDate;
      if (userData.hireDate) employeeUpdateData.hireDate = userData.hireDate;
      if (userData.status) employeeUpdateData.status = userData.status;

      // Mettre à jour l'utilisateur
      await user.update(userUpdateData);

      // Mettre à jour l'employé si il existe et qu'il y a des données à mettre à jour
      if (Object.keys(employeeUpdateData).length > 0) {
        const employee = (user as any).Employee;
        if (employee) {
          await employee.update(employeeUpdateData);
        } else if (userData.employeeId) {
          // Créer un nouvel employé si l'utilisateur n'en a pas
          const newEmployee = await Employee.create({
            id: userData.employeeId,
            ...employeeUpdateData
          });
          await user.update({ employeeId: newEmployee.id });
        }
      }

      const updatedUser = await this.getUserById(id);
      if (!updatedUser) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }

      return updatedUser;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  // Suspendre un utilisateur
  async suspendUser(id: number, reason?: string): Promise<UserWithDetails> {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      await user.update({ isActive: false });

      // Envoyer l'email de suspension
      const email = (user as any).Employee?.email;
      if (email && email.includes('@')) {
        try {
          await emailService.sendAccountSuspendedEmail(
            email,
            user.username,
            reason
          );
          console.log(`✅ Email de suspension envoyé à ${email}`);
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email de suspension:', emailError);
        }
      } else {
        console.warn(`Aucun email valide trouvé pour l'utilisateur ${user.username}. Suspension sans notification email.`);
      }

      // Log pour audit
      console.log(`🔒 Utilisateur ${user.username} (ID: ${user.id}) suspendu. Raison: ${reason || 'Aucune raison spécifiée'}`);

      const suspendedUser = await this.getUserById(id);
      if (!suspendedUser) {
        throw new Error('Erreur lors de la suspension de l\'utilisateur');
      }

      return suspendedUser;
    } catch (error) {
      console.error('Erreur lors de la suspension de l\'utilisateur:', error);
      throw error;
    }
  }

  // Réactiver un utilisateur
  async reactivateUser(id: number): Promise<UserWithDetails> {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      await user.update({ isActive: true });

      // Envoyer l'email de réactivation
      const email = (user as any).Employee?.email;
      if (email && email.includes('@')) {
        try {
          await emailService.sendAccountReactivatedEmail(email, user.username);
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email de réactivation:', emailError);
        }
      } else {
        console.warn(`Aucun email valide trouvé pour l'utilisateur ${user.username}. Réactivation sans notification email.`);
      }

      const reactivatedUser = await this.getUserById(id);
      if (!reactivatedUser) {
        throw new Error('Erreur lors de la réactivation de l\'utilisateur');
      }

      return reactivatedUser;
    } catch (error) {
      console.error('Erreur lors de la réactivation de l\'utilisateur:', error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUser(id: number, currentUserId?: number): Promise<void> {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Empêcher l'utilisateur de se supprimer lui-même
      if (currentUserId && user.id === currentUserId) {
        throw new Error('Vous ne pouvez pas supprimer votre propre compte');
      }

      // Envoyer l'email de suppression avant de supprimer l'utilisateur
      const email = (user as any).Employee?.email;
      
      // Vérifier que l'email est valide avant d'envoyer
      if (email && email.includes('@')) {
        try {
          await emailService.sendAccountDeletedEmail(email, user.username);
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email de suppression:', emailError);
          // Continuer la suppression même si l'email échoue
        }
      } else {
        console.warn(`Aucun email valide trouvé pour l'utilisateur ${user.username}. Suppression sans notification email.`);
      }

      await user.destroy();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  // Réinitialiser le mot de passe d'un utilisateur
  async resetUserPassword(id: number): Promise<void> {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Générer un nouveau mot de passe temporaire
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      await user.update({ password: hashedPassword });

      // Envoyer l'email de réinitialisation
      const email = (user as any).Employee?.email;
      if (email && email.includes('@')) {
        try {
          const resetToken = emailService.generateResetToken(user.id, email);
          await emailService.sendPasswordResetEmail(email, user.username, resetToken);
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', emailError);
          throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
        }
      } else {
        throw new Error('Aucun email valide trouvé pour cet utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }

  // Définir un nouveau mot de passe avec token et activer l'utilisateur
  async setNewPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = emailService.verifyResetToken(token);
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Pour les nouveaux utilisateurs qui définissent leur mot de passe pour la première fois,
      // on ne vérifie pas le statut isActive car ils sont créés avec isActive: false
      // et doivent pouvoir définir leur mot de passe pour activer leur compte

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ 
        password: hashedPassword,
        isActive: true // Activer l'utilisateur après définition du mot de passe
      });
    } catch (error) {
      console.error('Erreur lors de la définition du nouveau mot de passe:', error);
      throw error;
    }
  }

  // Rechercher des utilisateurs
  async searchUsers(query: string): Promise<UserWithDetails[]> {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email'],
            where: {
              [require('sequelize').Op.or]: [
                { firstName: { [require('sequelize').Op.like]: `%${query}%` } },
                { lastName: { [require('sequelize').Op.like]: `%${query}%` } },
                { email: { [require('sequelize').Op.like]: `%${query}%` } }
              ]
            }
          },
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ],
        where: {
          [require('sequelize').Op.or]: [
            { username: { [require('sequelize').Op.like]: `%${query}%` } }
          ]
        },
        order: [['createdAt', 'DESC']]
      });

      return users.map(user => ({
        id: user.id,
        username: user.username,
        email: (user as any).Employee?.email || user.username,
        roleId: user.roleId,
        roleName: (user as any).Role?.name || 'Inconnu',
        employeeId: user.employeeId,
        employeeName: (user as any).Employee 
          ? `${(user as any).Employee.firstName} ${(user as any).Employee.lastName}`
          : undefined,
        isActive: user.isActive !== false,
        createdAt: user.createdAt!,
        updatedAt: user.updatedAt!
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des utilisateurs
  async getUserStats(): Promise<{
    total: number;
    active: number;
    suspended: number;
    byRole: { [key: string]: number };
  }> {
    try {
      const total = await User.count();
      const active = await User.count({ where: { isActive: true } });
      const suspended = await User.count({ where: { isActive: false } });

      const usersByRole = await User.findAll({
        include: [
          {
            model: Role,
            attributes: ['name']
          }
        ]
      });

      const byRole: { [key: string]: number } = {};
      usersByRole.forEach(user => {
        const roleName = (user as any).Role?.name || 'Inconnu';
        byRole[roleName] = (byRole[roleName] || 0) + 1;
      });

      return {
        total,
        active,
        suspended,
        byRole
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 