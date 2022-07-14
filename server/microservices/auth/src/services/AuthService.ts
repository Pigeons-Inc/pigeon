/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import bcrypt from 'bcrypt';
// Unccomment this when email and profile services are ready
// import { request } from 'undici';
import sequelize from '../repository/sequelize';
import TokenService from './TokenService';
import User from '../models/sequelize/User';
import ApiError from '../models/exceptions/ApiError';
import UserDTO from '../models/interfaces/UserDTO';
import TokenStore from '../models/sequelize/TokenStore';
import Validator from '../utils/Validator';

export default class AuthService {
  private tokenService: TokenService = new TokenService();

  public async validateCredentials(email: string, password: string) {
    const validator = new Validator();
    validator.validateEmail(email).validatePassword(password).submit();
  }

  public async register(email: string, password: string) {
    await this.validateCredentials(email, password);
    const hash = await bcrypt.hash(password, <string>process.env.PASSWORD_SALT);
    const transaction = await sequelize.transaction();
    const user = await User.create(
      { email, hash, isActivated: false },
      { transaction }
    );
    /**
     * Unccomment this when email and profile services are ready
     */
    // try {
    //   const { statusCode: messageStatus } = await request(
    //     process.env.MAIL_SERVICE_ACTIVATION_URL ||
    //       'http://localhost:3002/send?activation=true',
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         link: `${
    //           process.env.GATEWAY_URL || 'http://localhost:3000'
    //         }/auth/activate?id=${user.id}`,
    //       }),
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'api-secret': <string>process.env.API_SECRET,
    //       },
    //     }
    //   );
    //   if (messageStatus !== 200) throw new Error('Mail service issue');
    //   const { statusCode: profileStatus } = await request(
    //     process.env.PROFILE_SERVICE_URL || 'http://localhost:3003/profile',
    //     {
    //       method: 'POST',
    //       body: JSON.stringify(user),
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'api-secret': <string>process.env.API_SECRET,
    //       },
    //     }
    //   );
    //   if (profileStatus !== 201) throw new Error('Profile service issue');
    // } catch (e) {
    //   await transaction.rollback();
    //   throw e;
    // }
    await transaction.commit();
    return this.tokenService.generateTokens(user);
  }

  public async login(email: string, password: string) {
    await this.validateCredentials(email, password);
    const hash = await bcrypt.hash(password, <string>process.env.PASSWORD_SALT);
    const user = await User.findOne({ where: { email, hash } });
    if (!user) throw ApiError.unauthorized('Invalid email or password');
    return this.tokenService.generateTokens(user);
  }

  public async logout(token: string) {
    if (!token) throw ApiError.badRequest('No token in cookies found');
    const decoded = this.tokenService.decodeToken<UserDTO>(token);
    await TokenStore.destroy({ where: { id: decoded.id } });
  }

  public async validate(token: string, isRefreshToken = false) {
    if (!token) throw ApiError.unauthorized('No token provided');
    const secret = isRefreshToken
      ? <string>process.env.REFRESH_TOKEN_SECRET
      : <string>process.env.ACCESS_TOKEN_SECRET;
    const decoded = this.tokenService.validateToken<UserDTO>(token, secret);
    const userInDB = await User.findOne({
      where: { id: decoded.id, email: decoded.email, hash: decoded.hash },
    });
    if (!userInDB) throw ApiError.unauthorized('Invalid token');
    if (!userInDB.isActivated)
      throw ApiError.unauthorized('User is not activated yet');
    return decoded;
  }

  public async refresh(token: string) {
    if (!token) throw ApiError.badRequest('No token in cookies found');
    const decoded = await this.validate(token, true);
    return this.tokenService.generateTokens(decoded);
  }

  public async activate(id: string) {
    if (!id) throw ApiError.badRequest('No id provided');
    let user;
    try {
      user = await User.findOne({ where: { id } });
    } catch {
      throw ApiError.badRequest('Invalid id');
    }
    if (!user) throw ApiError.badRequest('User is not in DB');
    if (user.isActivated)
      throw ApiError.badRequest('User is already activated');
    await user.update({ isActivated: true });
  }
}
