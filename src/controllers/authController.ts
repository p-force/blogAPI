import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import userService from '../services/userService';

class AuthController {
  async registration(req: Request, res: Response): Promise<Response> {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors: validationErrors.array() });
      }
      const {
        password, fullName, email,
      } = req.body;
      await userService.registration(fullName, email, password);
      return res.status(200).json({ message: 'User registered' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Registration Error' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      return res.json(userData);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Login Error' });
    }
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      return res.json(userData);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'Logout success' });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Logout Error' });
    }
  }

  async errorPage(req: Request, res: Response): Promise<Response> {
    return res.status(404).json({ message: 'Page not found' });
  }
}

export default new AuthController();
