import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface JobOfferAttributes {
  id: number;
  title: string;
  description: string;
  departmentId: number;
  postedDate: Date;
  status: string; // ouverte, fermée
  createdAt?: Date;
  updatedAt?: Date;
}

interface JobOfferCreationAttributes extends Optional<JobOfferAttributes, 'id'> {}

export class JobOffer extends Model<JobOfferAttributes, JobOfferCreationAttributes> implements JobOfferAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public departmentId!: number;
  public postedDate!: Date;
  public status!: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    department: Association<JobOffer, any>;
    applications: Association<JobOffer, any>;
  };
}

JobOffer.init(
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
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    postedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('ouverte', 'fermée'),
      allowNull: false,
      defaultValue: 'ouverte',
    },
  },
  {
    sequelize,
    modelName: 'JobOffer',
    tableName: 'job_offers',
    timestamps: true,
  }
); 