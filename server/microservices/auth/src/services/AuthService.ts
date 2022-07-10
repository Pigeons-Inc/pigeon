import TokenService from './TokenService';
import db from '../repository/db';
import User from '../models/sequelize/User';
import { createHmac } from 'crypto';
import ApiError from '../models/exceptions/ApiError';
import UserDTO from '../models/interfaces/UserDTO';
import TokenStore from '../models/sequelize/TokenStore';

export default class AuthService {
  private tokenService: TokenService;
  constructor() {
    this.tokenService = new TokenService();
    db.sync();
  }

  public async register(email: string, password: string) {
    try {
      const hash = createHmac('sha256', process.env.PASSWORD_SECRET || 'secret')
        .update(password)
        .digest('hex');
      const user = await User.create({ email, hash, isActivated: false });
      return this.tokenService.generateTokens(user);
    } catch (e) {
      throw ApiError.unauthorized(<Error>e);
    }
  }

  public async login(email: string, password: string) {
    try {
      const hash = createHmac('sha256', process.env.PASSWORD_SECRET || 'secret')
        .update(password)
        .digest('hex');
      const user = await User.findOne({ where: { email, hash } });
      if (!user) throw ApiError.unauthorized('Invalid email or password');
      return this.tokenService.generateTokens(user);
    } catch (e) {
      throw ApiError.unauthorized(<Error>e);
    }
  }

  public async logout(token: string) {
    if (!token) throw ApiError.unauthorized('No token in cookies found');
    const decoded = this.tokenService.decodeToken<UserDTO>(token);
    await TokenStore.destroy({ where: { id: decoded.id } });
  }

  public async validate(token: string, isRefreshToken = false) {
    const secret = isRefreshToken
      ? process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'
      : process.env.ACCESS_TOKEN_SECRET || 'access_secret';
    const decoded = this.tokenService.validateToken<UserDTO>(token, secret);
    const userInDB = await User.findOne({
      where: { id: decoded.id, email: decoded.email, hash: decoded.hash },
    });
    if (!userInDB) throw ApiError.unauthorized('Invalid token');
    return decoded;
  }

  public async refresh(token: string) {
    if (!token) throw ApiError.unauthorized('No token in cookies found');
    const decoded = await this.validate(token, true);
    return this.tokenService.generateTokens(decoded);
  }

  public async activate(id: string) {
    if (!id) throw ApiError.badRequest('No id provided');
    const user = await User.findOne({ where: { id } });
    if (!user) throw ApiError.badRequest('Invalid id');
    if (user.isActivated)
      throw ApiError.badRequest('User is already activated');
    await user.update({ isActivated: true });
  }
}
