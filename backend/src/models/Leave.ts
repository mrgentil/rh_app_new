import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface LeaveAttributes {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  startDate: Date;
  endDate: Date;
  status: string; // en attente, approuvé, refusé
  commentaire?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeaveCreationAttributes extends Optional<LeaveAttributes, 'id'> {}

export class Leave extends Model<LeaveAttributes, LeaveCreationAttributes> implements LeaveAttributes {
  public id!: number;
  public employeeId!: number;
  public leaveTypeId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public status!: string;
  public commentaire?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<Leave, any>;
    leaveType: Association<Leave, any>;
  };
}

Leave.init(
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
    leaveTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('en attente', 'approuvé', 'refusé'),
      allowNull: false,
      defaultValue: 'en attente',
    },
    commentaire: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Leave',
    tableName: 'leaves',
    timestamps: true,
  }
);
