import feedbackController from '../controllers/feedback.controller';
import { Router } from 'express';

class FeedbackRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get feedback for a specific interview
    this.router.get(
      '/:interviewId',
      feedbackController.getInterviewWithFeedback
    );

    // Save or update feedback
    this.router.post('/:interviewId', feedbackController.saveFeedback);

    // Delete feedback by ID
    this.router.delete('/:feedbackId', feedbackController.deleteFeedback);

    // Get all interviews with their feedback status for current user
    this.router.get('/', feedbackController.getInterviewsWithFeedbackStatus);

    // Generate AI feedback for an interview
    this.router.post(
      '/generate/:interviewId',
      feedbackController.generateAIFeedback
    );
  }
}

export default new FeedbackRoutes().router;
