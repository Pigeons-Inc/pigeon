/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const databaseName = process.env.POSTGRES_DB || 'postgres';
const username = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';
const sequelize = new Sequelize(databaseName, username, password, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  sync: { alter: process.env.ALTER_SYNC === 'true' },
  logging: false,
});

export default sequelize;
