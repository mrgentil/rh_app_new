import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface EmployeeAttributes {
  id: number;
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
  status: string; // actif, suspendu, démissionnaire, licencié
  photoUrl?: string;
  salary?: number; // Salaire brut annuel
  contractEndDate?: Date; // Pour les stagiaires et contrats temporaires
  employeeType?: string; // permanent, stagiaire, cdi, cdd
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> {}

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
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
  public status!: string;
  public photoUrl?: string;
  public salary?: number;
  public contractEndDate?: Date;
  public employeeType?: string;
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
    status: {
      type: DataTypes.ENUM('actif', 'suspendu', 'démissionnaire', 'licencié'),
      allowNull: false,
      defaultValue: 'actif',
    },
    photoUrl: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
  }
);
