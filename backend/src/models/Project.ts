import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface ProjectAttributes {
  id: number;
  name: string;
  description?: string;
  teamId?: number;
  managerId: number; // Manager responsable du projet
  status: string; // planning, active, on_hold, completed, cancelled
  priority: string; // low, medium, high, critical
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100
  budget?: number;
  client?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'progress'> {}

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public teamId?: number;
  public managerId!: number;
  public status!: string;
  public priority!: string;
  public startDate!: Date;
  public endDate?: Date;
  public progress!: number;
  public budget?: number;
  public client?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    team: Association<Project, any>;
    manager: Association<Project, any>;
    objectives: Association<Project, any>;
    tasks: Association<Project, any>;
    members: Association<Project, any>;
  };
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    managerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'planning',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
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
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
  }
);

export default Project; 