import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface AnnouncementAttributes {
  id: number;
  title: string;
  content: string;
  postedBy: number; // FK vers Employee
  date: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AnnouncementCreationAttributes extends Optional<AnnouncementAttributes, 'id'> {}

export class Announcement extends Model<AnnouncementAttributes, AnnouncementCreationAttributes> implements AnnouncementAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public postedBy!: number;
  public date!: Date;
  public isActive!: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    author: Association<Announcement, any>;
  };
}

Announcement.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postedBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Announcement',
    tableName: 'announcements',
    timestamps: true,
  }
); 