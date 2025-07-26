import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface EmployeeTrainingAttributes {
  id: number;
  employeeId: number;
  trainingId: number;
  status: string; // inscrit, terminé, annulé
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeTrainingCreationAttributes extends Optional<EmployeeTrainingAttributes, 'id'> {}

export class EmployeeTraining extends Model<EmployeeTrainingAttributes, EmployeeTrainingCreationAttributes> implements EmployeeTrainingAttributes {
  public id!: number;
  public employeeId!: number;
  public trainingId!: number;
  public status!: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<EmployeeTraining, any>;
    training: Association<EmployeeTraining, any>;
  };
}

EmployeeTraining.init(
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
    trainingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('inscrit', 'terminé', 'annulé'),
      allowNull: false,
      defaultValue: 'inscrit',
    },
  },
  {
    sequelize,
    modelName: 'EmployeeTraining',
    tableName: 'employee_trainings',
    timestamps: true,
  }
); 