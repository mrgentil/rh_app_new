import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface ApplicationAttributes {
  id: number;
  candidateId: number;
  jobOfferId: number;
  status: string; // en cours, accepté, refusé
  interviewDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id'> {}

export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: number;
  public candidateId!: number;
  public jobOfferId!: number;
  public status!: string;
  public interviewDate?: Date;
  public notes?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    candidate: Association<Application, any>;
    jobOffer: Association<Application, any>;
  };
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    jobOfferId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('en cours', 'accepté', 'refusé'),
      allowNull: false,
      defaultValue: 'en cours',
    },
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    timestamps: true,
  }
); 