import { DataTypes } from 'sequelize';
import ITokenStore from '../interfaces/TokenStore';
import db from '../../repository/sequelize';
import User from './User';

const TokenStore = db.define<ITokenStore>('TokenStore', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  token: {
    type: DataTypes.TEXT,
  },
});

TokenStore.hasOne(User, { foreignKey: 'id' });

export default TokenStore;
