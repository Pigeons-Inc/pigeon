import Tokens from '../models/Tokens';
import * as jwt from 'jsonwebtoken';
import TokenStore from '../models/sequelize/TokenStore';
import ApiError from '../models/exceptions/ApiError';
import UserDTO from '../models/interfaces/UserDTO';

export default class TokenService {
  public async generateTokens(user: UserDTO): Promise<Tokens> {
    const payload = { id: user.id, email: user.email, hash: user.hash };
    const accessToken = jwt.sign(
      payload,
      <string>process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30m',
      }
    );
    const refreshToken = jwt.sign(
      payload,
      <string>process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '30d',
      }
    );

    const finded = await TokenStore.findOne({ where: { id: user.id } });
    if (finded) {
      await finded.update({ token: refreshToken });
    } else {
      await TokenStore.create({ id: user.id, token: refreshToken });
    }
    return { accessToken, refreshToken };
  }

  public decodeToken<T>(token: string) {
    return <T>jwt.decode(token);
  }

  public validateToken<T = unknown>(token: string, secret: string) {
    try {
      return <T>jwt.verify(token, secret);
    } catch (e) {
      throw ApiError.unauthorized('Token has expired or is not valid');
    }
  }
}
