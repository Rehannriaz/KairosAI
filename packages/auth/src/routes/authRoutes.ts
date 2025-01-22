import { Router } from 'express';
import authController from '../controllers/auth.controller';

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/signup', authController.signup);
    this.router.post('/login', authController.login);
    this.router.post('/logout', authController.logout);
    this.router.post('/authenticate', authController.authenticate);
  }
}

export default new AuthRoutes().router;
