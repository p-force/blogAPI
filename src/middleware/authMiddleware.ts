/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import tokenService from '../services/tokenService';

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authorizationHeader = req.headers.authorization;
    if (typeof authorizationHeader === 'string') {
      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        throw new Error('Unauthorized error');
      }
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        throw new Error('Unauthorized error');
      }
      return next();
    }
    throw new Error('Unauthorized error');
  } catch (error) {
    next(error);
  }
}
