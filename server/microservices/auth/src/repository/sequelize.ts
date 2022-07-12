import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const databaseName = process.env.POSTGRES_DATABASE_NAME || 'postgres';
const username = process.env.POSTGRES_USERNAME || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';
const sequelize = new Sequelize(databaseName, username, password, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  sync: { alter: process.env.ALTER_SYNC === 'true' },
});

sequelize
  .authenticate()
  .then(async () => {
    console.log(
      'Connection to auth database has been established successfully.'
    );
    await sequelize.sync();
  })
  .catch((err) => {
    throw new Error('Unable to connect to the database:', err);
  });

export default sequelize;
