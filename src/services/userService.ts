/* eslint-disable @typescript-eslint/no-var-requires */
import tokenService from '../services/tokenService';

const bcrypt = require('bcryptjs');
const { User } = require('../db/models');

interface UserData {
    accessToken: string;
    refreshToken: string;
    id: number,
    fullName: string,
    email: string,
}

class UserService {
  async registration(fullName:string, email:string, password:string): Promise<void> {
    try {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const [user, created] = await User.findOrCreate(
        {
          where: { email },
          defaults: {
            email,
            password: bcrypt.hashSync(password, 9),
            fullName,
          },
        },
      );
      if (!created) {
        throw new Error('User already exists');
      }
    } catch (err) {
      if (err instanceof Error) { // экземпляр класса
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  async login(email: string, password: string): Promise<UserData> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('user not found');
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('invalid password');
      }
      const userFront = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      };
      const tokens = await tokenService.generateTokens({ ...userFront });
      await tokenService.saveToken(user, tokens.refreshToken);
      return { ...tokens, ...userFront };
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  async refresh(refreshToken: string): Promise<UserData> {
    try {
      if (!refreshToken) {
        throw new Error('Invalid refresh token');
      }
      const userData = await tokenService.validateRefreshToken(refreshToken);
      const tokenFromDB = await tokenService.findToken(refreshToken);
      if (!tokenFromDB || !userData) {
        throw new Error('Invalid refresh token');
      }
      const user = await User.findByPk(tokenFromDB.dataValues.userId);
      const userFront: {
        id: number,
        fullName: string,
        email: string,
      } = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      };
      const tokens = await tokenService.generateTokens({ ...userFront });
      await tokenService.saveToken(user, tokens.refreshToken);
      return { ...tokens, ...userFront };
    } catch (err) {
      if (err instanceof Error) { // экземпляр класса
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      if (!refreshToken) {
        throw new Error('You are already logged out');
      }
      await tokenService.removeToken(refreshToken);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }
}

export default new UserService();
