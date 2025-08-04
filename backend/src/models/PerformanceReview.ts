import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface PerformanceReviewAttributes {
  id: number;
  employeeId: number; // Employé évalué
  reviewerId: number; // Manager qui fait l'évaluation
  reviewType: string; // annual, quarterly, probation, project
  reviewDate: Date;
  nextReviewDate?: Date;
  overallRating: number; // 1-5
  performanceScore: number; // 0-100
  strengths?: string;
  areasForImprovement?: string;
  goals?: string;
  comments?: string;
  status: string; // draft, submitted, approved, completed
  isSelfReview: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PerformanceReviewCreationAttributes extends Optional<PerformanceReviewAttributes, 'id' | 'isSelfReview'> {}

export class PerformanceReview extends Model<PerformanceReviewAttributes, PerformanceReviewCreationAttributes> implements PerformanceReviewAttributes {
  public id!: number;
  public employeeId!: number;
  public reviewerId!: number;
  public reviewType!: string;
  public reviewDate!: Date;
  public nextReviewDate?: Date;
  public overallRating!: number;
  public performanceScore!: number;
  public strengths?: string;
  public areasForImprovement?: string;
  public goals?: string;
  public comments?: string;
  public status!: string;
  public isSelfReview!: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<PerformanceReview, any>;
    reviewer: Association<PerformanceReview, any>;
    criteria: Association<PerformanceReview, any>;
  };
}

PerformanceReview.init(
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
    reviewerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    reviewType: {
      type: DataTypes.ENUM('annual', 'quarterly', 'probation', 'project'),
      allowNull: false,
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nextReviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    overallRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    performanceScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    strengths: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    areasForImprovement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    goals: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'approved', 'completed'),
      allowNull: false,
      defaultValue: 'draft',
    },
    isSelfReview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'PerformanceReview',
    tableName: 'performance_reviews',
    timestamps: true,
  }
);

export default PerformanceReview; 