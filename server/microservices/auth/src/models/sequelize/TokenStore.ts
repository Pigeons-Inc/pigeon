import { DataTypes } from 'sequelize';
import TokenStore from '../interfaces/TokenStore';
import db from '../../repository/db';
import User from './User';

const TokenStore = db.define<TokenStore>('TokenStore', {
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
