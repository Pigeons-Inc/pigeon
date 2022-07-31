/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export default interface TokenStore
  extends Model<
    InferAttributes<TokenStore>,
    InferCreationAttributes<TokenStore>
  > {
  id: string;
  token: string;
}
