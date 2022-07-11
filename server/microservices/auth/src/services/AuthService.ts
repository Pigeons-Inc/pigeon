import TokenService from './TokenService';
import User from '../models/sequelize/User';
import bcrypt from 'bcrypt';
import ApiError from '../models/exceptions/ApiError';
import UserDTO from '../models/interfaces/UserDTO';
import TokenStore from '../models/sequelize/TokenStore';

export default class AuthService {
  private tokenService: TokenService = new TokenService();
  public async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, <string>process.env.PASSWORD_SALT);
    const user = await User.create({ email, hash, isActivated: false });
    return this.tokenService.generateTokens(user);
  }

  public async login(email: string, password: string) {
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
    const user = await User.findOne({ where: { id } });
    if (!user) throw ApiError.badRequest('Invalid id');
    if (user.isActivated)
      throw ApiError.badRequest('User is already activated');
    await user.update({ isActivated: true });
  }
}
