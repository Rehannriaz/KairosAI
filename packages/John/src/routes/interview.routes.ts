import interviewController from '../controllers/interview.controller';
import { Router } from 'express';

class InterviewRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', interviewController.startInterview);
    this.router.post('/stream', interviewController.streamInterview);
    this.router.post('/save-stream', interviewController.saveStreamedInterview);
    this.router.post(
      '/initiateInterview',
      interviewController.initiateInterview
    );
    this.router.get(
      '/getInterviewsData',
      interviewController.getInterviewsData
    );
    this.router.get('/:jobID', interviewController.getAllChatsForJob);
    this.router.get('/:jobID/:chatID', interviewController.getChatForJob);
    this.router.delete('/:chatID', interviewController.deleteChatForJob);
  }
}

export default new InterviewRoutes().router;
