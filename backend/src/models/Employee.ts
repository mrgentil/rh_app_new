import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface EmployeeAttributes {
  id: number;
  matricule: string; // Nouveau champ matricule
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  birthDate: Date;
  hireDate: Date;
  jobTitleId?: number;
  departmentId?: number;
  managerId?: number; // Auto-relation pour la hiérarchie
  teamId?: number; // Équipe de l'employé
  status: string; // actif, suspendu, démissionnaire, licencié
  photoUrl?: string;
  salary?: number; // Salaire brut annuel
  contractEndDate?: Date; // Pour les stagiaires et contrats temporaires
  employeeType?: string; // permanent, stagiaire, cdi, cdd
  city?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id' | 'matricule'> {}

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
  public matricule!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public address?: string;
  public birthDate!: Date;
  public hireDate!: Date;
  public jobTitleId?: number;
  public departmentId?: number;
  public managerId?: number;
  public teamId?: number;
  public status!: string;
  public photoUrl?: string;
  public salary?: number;
  public contractEndDate?: Date;
  public employeeType?: string;
  public city?: string;
  public postalCode?: string;
  public country?: string;
  public emergencyContactName?: string;
  public emergencyContactPhone?: string;
  public emergencyContactRelationship?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    jobTitle: Association<Employee, any>;
    department: Association<Employee, any>;
    contract: Association<Employee, any>;
    manager: Association<Employee, any>;
    subordinates: Association<Employee, any>;
    documents: Association<Employee, any>;
    leaves: Association<Employee, any>;
    payrolls: Association<Employee, any>;
    user: Association<Employee, any>;
    employeeTrainings: Association<Employee, any>;
    sentMessages: Association<Employee, any>;
    receivedMessages: Association<Employee, any>;
    announcements: Association<Employee, any>;
  };
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    matricule: {
      type: DataTypes.STRING,
      allowNull: true, // Temporairement nullable pour permettre la génération automatique
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    jobTitleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    managerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('actif', 'suspendu', 'démissionnaire', 'licencié'),
      allowNull: false,
      defaultValue: 'actif',
    },
    photoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Salaire brut annuel en euros',
    },
    contractEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employeeType: {
      type: DataTypes.ENUM('permanent', 'stagiaire', 'cdi', 'cdd'),
      allowNull: true,
      defaultValue: 'permanent',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'France',
    },
    emergencyContactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactRelationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
    hooks: {
      beforeCreate: async (employee: Employee) => {
        // Générer le matricule automatiquement si non fourni
        if (!employee.matricule) {
          const lastEmployee = await Employee.findOne({
            order: [['id', 'DESC']]
          });
          
          let nextMatricule = 'EMP001';
          if (lastEmployee && lastEmployee.matricule) {
            const lastNumber = parseInt(lastEmployee.matricule.replace('EMP', ''));
            nextMatricule = `EMP${String(lastNumber + 1).padStart(3, '0')}`;
          }
          
          employee.matricule = nextMatricule;
        }
      }
    }
  }
);
