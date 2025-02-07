import { Router } from 'express';
import jobController from '../controllers/job.controller';

class JobRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', jobController.getAllJobs);
    this.router.post('/', jobController.scrapeJobs);
    this.router.get('/:id', jobController.getJobById);
    this.router.get('/recommended-jobs', jobController.getNRecommendedJobs);
  }
}

export default new JobRoutes().router;
