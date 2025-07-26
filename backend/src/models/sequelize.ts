import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  'my_rh_app',
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  }
); 