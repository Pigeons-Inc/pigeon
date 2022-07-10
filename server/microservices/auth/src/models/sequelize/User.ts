import { DataTypes } from 'sequelize';
import User from '../interfaces/User';
import db from '../../repository/db';

const User = db.define<User>('User', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  hash: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
  },
});

export default User;
