import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface ContractAttributes {
  id: number;
  type: string; // CDI, CDD, Stage, etc.
  startDate: Date;
  endDate?: Date;
  salary: number;
  employeeId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractCreationAttributes extends Optional<ContractAttributes, 'id'> {}

export class Contract extends Model<ContractAttributes, ContractCreationAttributes> implements ContractAttributes {
  public id!: number;
  public type!: string;
  public startDate!: Date;
  public endDate?: Date;
  public salary!: number;
  public employeeId!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<Contract, any>;
  };
}

Contract.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true, // Un employé ne peut avoir qu'un seul contrat actif
    },
  },
  {
    sequelize,
    modelName: 'Contract',
    tableName: 'contracts',
    timestamps: true,
  }
); 