import jwt, { JwtPayload } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Refresh, User } = require('../db/models');

class TokenService {
  async generateTokens(payload: {id: number, fullName: string, email: string}):
  Promise<{ accessToken: string, refreshToken: string }> {
    const accessToken = jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  async saveToken(newUser: typeof User, refreshToken: string): Promise<void> {
    const data = newUser.dataValues.id;
    const tokenData = await Refresh.findOne({ where: { userId: data } });
    if (tokenData !== null) {
      throw new Error('You are already logged in');
    } else {
      await Refresh.create({ refreshToken, userId: data });
    }
  }

  async removeToken(refreshToken: string): Promise<void> {
    const token = await Refresh.findOne({ where: { refreshToken } });
    if (token) {
      await Refresh.destroy({ where: { refreshToken } });
    }
  }

  async findToken(refreshToken: string): Promise<typeof Refresh | null> {
    const token = await Refresh.findOne({ where: { refreshToken } });
    return token;
  }

  validateAccessToken(token: string): string | JwtPayload | null {
    try {
      const userData = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
      return userData;
    } catch (err) {
      return null;
    }
  }

  validateRefreshToken(token: string): string | JwtPayload | null {
    try {
      const userData = jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`);
      return userData;
    } catch (err) {
      return null;
    }
  }
}

export default new TokenService();
