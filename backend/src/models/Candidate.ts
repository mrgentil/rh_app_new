import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface CandidateAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cvUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CandidateCreationAttributes extends Optional<CandidateAttributes, 'id'> {}

export class Candidate extends Model<CandidateAttributes, CandidateCreationAttributes> implements CandidateAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public cvUrl?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    applications: Association<Candidate, any>;
  };
}

Candidate.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Candidate',
    tableName: 'candidates',
    timestamps: true,
  }
); 