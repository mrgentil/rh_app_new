import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface LeaveTypeAttributes {
  id: number;
  name: string; // CP, Maladie, RTT
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeaveTypeCreationAttributes extends Optional<LeaveTypeAttributes, 'id'> {}

export class LeaveType extends Model<LeaveTypeAttributes, LeaveTypeCreationAttributes> implements LeaveTypeAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    leaves: Association<LeaveType, any>;
  };
}

LeaveType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'LeaveType',
    tableName: 'leave_types',
    timestamps: true,
  }
); 