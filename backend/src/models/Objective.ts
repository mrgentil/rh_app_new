import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface ObjectiveAttributes {
  id: number;
  title: string;
  description?: string;
  type: string; // team, individual, project
  employeeId?: number; // Pour objectifs individuels
  teamId?: number; // Pour objectifs d'équipe
  projectId?: number; // Pour objectifs de projet
  assignedBy: number; // Manager qui assigne l'objectif
  status: string; // pending, in_progress, completed, cancelled
  priority: string; // low, medium, high, critical
  dueDate: Date;
  completionDate?: Date;
  progress: number; // 0-100
  createdAt?: Date;
  updatedAt?: Date;
}

interface ObjectiveCreationAttributes extends Optional<ObjectiveAttributes, 'id' | 'progress'> {}

export class Objective extends Model<ObjectiveAttributes, ObjectiveCreationAttributes> implements ObjectiveAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public type!: string;
  public employeeId?: number;
  public teamId?: number;
  public projectId?: number;
  public assignedBy!: number;
  public status!: string;
  public priority!: string;
  public dueDate!: Date;
  public completionDate?: Date;
  public progress!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<Objective, any>;
    team: Association<Objective, any>;
    project: Association<Objective, any>;
    assignedByEmployee: Association<Objective, any>;
    updates: Association<Objective, any>;
  };
}

Objective.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('team', 'individual', 'project'),
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    assignedBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },
  {
    sequelize,
    modelName: 'Objective',
    tableName: 'objectives',
    timestamps: true,
  }
);

export default Objective; 