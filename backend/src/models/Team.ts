import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface TeamAttributes {
  id: number;
  name: string;
  description?: string;
  managerId: number; // Manager de l'équipe
  departmentId?: number;
  status: string; // active, inactive, archived
  createdAt?: Date;
  updatedAt?: Date;
}

interface TeamCreationAttributes extends Optional<TeamAttributes, 'id'> {}

export class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public managerId!: number;
  public departmentId?: number;
  public status!: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    manager: Association<Team, any>;
    department: Association<Team, any>;
    members: Association<Team, any>;
    objectives: Association<Team, any>;
    projects: Association<Team, any>;
  };
}

Team.init(
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
    managerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
    timestamps: true,
  }
);

export default Team; 