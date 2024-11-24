import { Router } from 'express';
import interviewController from '../controllers/interview.controller';

class InterviewRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', interviewController.startInterview);
  }
}

export default new InterviewRoutes().router;
