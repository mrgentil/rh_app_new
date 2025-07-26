import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface JobTitleAttributes {
  id: number;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface JobTitleCreationAttributes extends Optional<JobTitleAttributes, 'id'> {}

export class JobTitle extends Model<JobTitleAttributes, JobTitleCreationAttributes> implements JobTitleAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employees: Association<JobTitle, any>;
  };
}

JobTitle.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
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
    modelName: 'JobTitle',
    tableName: 'job_titles',
    timestamps: true,
  }
); 