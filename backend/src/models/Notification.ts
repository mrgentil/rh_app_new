import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface NotificationAttributes {
  id: number;
  employeeId: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public employeeId!: number;
  public type!: string;
  public message!: string;
  public isRead!: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<Notification, any>;
  };
}

Notification.init({
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    autoIncrement: true, 
    primaryKey: true 
  },
  employeeId: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  message: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  isRead: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: true,
});
