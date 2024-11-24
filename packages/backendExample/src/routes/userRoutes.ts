import { Router } from 'express';
import userController from '../controllers/user.controller';

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', userController.getAllUsers);
    this.router.get('/:id', userController.getUserById);
    this.router.post('/', userController.createUser);
    this.router.put('/:id', userController.updateUser);
    this.router.delete('/:id', userController.deleteUser);
  }
}

export default new UserRoutes().router;
