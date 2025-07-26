import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface PayrollAttributes {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  fichePaieUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PayrollCreationAttributes extends Optional<PayrollAttributes, 'id'> {}

export class Payroll extends Model<PayrollAttributes, PayrollCreationAttributes> implements PayrollAttributes {
  public id!: number;
  public employeeId!: number;
  public month!: number;
  public year!: number;
  public basicSalary!: number;
  public overtime!: number;
  public deductions!: number;
  public netSalary!: number;
  public fichePaieUrl?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<Payroll, any>;
  };
}

Payroll.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    basicSalary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    overtime: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    deductions: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    netSalary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fichePaieUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Payroll',
    tableName: 'payrolls',
    timestamps: true,
  }
);

