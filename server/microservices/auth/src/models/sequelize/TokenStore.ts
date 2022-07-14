/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import { DataTypes } from 'sequelize';
import ITokenStore from '../interfaces/TokenStore';
import db from '../../repository/sequelize';

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

export default TokenStore;
