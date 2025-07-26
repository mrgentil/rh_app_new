import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './sequelize';

interface AuditLogAttributes {
  id: number;
  userId: number | null;
  action: string;
  table: string;
  rowId: number | null;
  details: string;
  createdAt?: Date;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'userId' | 'rowId' | 'details' | 'createdAt'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes {
  public id!: number;
  public userId!: number | null;
  public action!: string;
  public table!: string;
  public rowId!: number | null;
  public details!: string;
  public readonly createdAt!: Date;
}

AuditLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING, allowNull: false },
    table: { type: DataTypes.STRING, allowNull: false },
    rowId: { type: DataTypes.INTEGER, allowNull: true },
    details: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: 'AuditLog', tableName: 'audit_logs', timestamps: false }
);
