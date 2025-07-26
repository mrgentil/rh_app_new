import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from './sequelize';

interface InvoiceAttributes {
  id: number;
  number: string;
  amount: number;
  dueDate: Date;
  status: string; // payée, en retard, annulée
  createdAt?: Date;
  updatedAt?: Date;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id'> {}

export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public number!: string;
  public amount!: number;
  public dueDate!: Date;
  public status!: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Sequelize associations
  public static associations: {
    // À étendre selon les besoins
  };
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('payée', 'en retard', 'annulée'),
      allowNull: false,
      defaultValue: 'en retard',
    },
  },
  {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    timestamps: true,
  }
); 