import feedbackServices from '../services/feedback.services';
import { UserJWT } from '../types/UserTypes';

const getInterviewWithFeedback = async (req: any, res: any) => {
  const user = req.user;
  const { interviewId } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = await feedbackServices.getInterviewWithFeedback(
      interviewId,
      user
    );
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const saveFeedback = async (req: any, res: any) => {
  const user = req.user as UserJWT;
  const { interviewId } = req.params;
  const feedbackData = req.body;

  try {
    const saved = await feedbackServices.saveFeedback(
      interviewId,
      user,
      feedbackData
    );
    return res
      .status(200)
      .json({ message: 'Feedback saved successfully', feedbackId: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const getInterviewsWithFeedbackStatus = async (req: any, res: any) => {
  const user = req.user as UserJWT;

  try {
    const data = await feedbackServices.getInterviewsWithFeedbackStatus(user);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteFeedback = async (req: any, res: any) => {
  const user = req.user as UserJWT;
  const { feedbackId } = req.params;

  try {
    await feedbackServices.deleteFeedback(feedbackId, user);
    return res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const generateAIFeedback = async (req: any, res: any) => {
  const user = req.user as UserJWT;
  const { interviewId } = req.params;

  try {
    const generated = await feedbackServices.generateAIFeedback(
      interviewId,
      user
    );
    return res.status(200).json(generated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export default {
  getInterviewWithFeedback,
  saveFeedback,
  getInterviewsWithFeedbackStatus,
  deleteFeedback,
  generateAIFeedback,
};
