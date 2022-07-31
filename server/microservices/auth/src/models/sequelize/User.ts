/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import { DataTypes } from 'sequelize';
import IUser from '../interfaces/User';
import db from '../../repository/sequelize';

const User = db.define<IUser>('User', {
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
    allowNull: false,
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
});

export default User;
