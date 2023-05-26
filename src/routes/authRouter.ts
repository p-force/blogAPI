import express from 'express';
import { check } from 'express-validator';
import authController from '../controllers/authController';

const router = express.Router();

router.post(
  '/registration',
  [check('email', 'Введите корректный email').isEmail(), check('password', 'Длина пароля не может быть меньше 6 символов').isLength({ min: 6, max: 12 })],
  authController.registration,
);

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.route('*')
  .get(authController.errorPage)
  .post(authController.errorPage)
  .delete(authController.errorPage)
  .put(authController.errorPage);

export default router;
