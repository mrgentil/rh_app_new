import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface UserAttributes {
  id: number;
  employeeId?: number;
  username: string;
  email?: string;
  password: string;
  roleId: number;
  isActive?: boolean;
  photoUrl?: string;
  salary?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public employeeId?: number;
  public username!: string;
  public email?: string;
  public password!: string;
  public roleId!: number;
  public isActive?: boolean;
  public photoUrl?: string;
  public salary?: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    employee: Association<User, any>;
    role: Association<User, any>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    photoUrl: {
      type: DataTypes.STRING(10000),
      allowNull: true,
      comment: 'URL de la photo de profil (peut contenir des données base64)',
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Salaire brut annuel en euros',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);
