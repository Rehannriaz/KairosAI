import feedbackRepository from '../repositories/feedback.repository';
import { UserJWT } from '../types/UserTypes';

interface FeedbackData {
  rating: number;
  strengths: string[];
  improvements: string[];
  tips: string[];
}

/**
 * Fetches an interview with its associated feedback
 * @param interviewId The ID of the interview
 * @param userObj The user JWT object
 * @returns The interview data with feedback if available
 */
const getInterviewWithFeedback = async (
  interviewId: string,
  userObj: UserJWT
): Promise<any> => {
  try {
    return await feedbackRepository.getInterviewWithFeedback(
      interviewId,
      userObj.userId
    );
  } catch (error: any) {
    console.error('Error fetching interview with feedback:', error.message);
    throw new Error('Failed to fetch interview with feedback.');
  }
};

/**
 * Saves or updates feedback for an interview
 * @param interviewId The ID of the interview
 * @param userObj The user JWT object
 * @param feedbackData The feedback data to save
 * @returns The feedback ID
 */
const saveFeedback = async (
  interviewId: string,
  userObj: UserJWT,
  feedbackData: FeedbackData
): Promise<any> => {
  try {
    return await feedbackRepository.saveFeedback(
      interviewId,
      userObj.userId,
      feedbackData
    );
  } catch (error: any) {
    console.error('Error saving feedback:', error.message);
    throw new Error('Failed to save feedback.');
  }
};

/**
 * Gets all interviews with their feedback status for a user
 * @param userObj The user JWT object
 * @returns List of interviews with feedback status
 */
const getInterviewsWithFeedbackStatus = async (
  userObj: UserJWT
): Promise<any> => {
  try {
    return await feedbackRepository.getInterviewsWithFeedbackStatus(
      userObj.userId
    );
  } catch (error: any) {
    console.error(
      'Error fetching interviews with feedback status:',
      error.message
    );
    throw new Error('Failed to fetch interviews with feedback status.');
  }
};

/**
 * Deletes feedback by ID
 * @param feedbackId The ID of the feedback to delete
 * @param userObj The user JWT object
 */
const deleteFeedback = async (
  feedbackId: string,
  userObj: UserJWT
): Promise<void> => {
  try {
    await feedbackRepository.deleteFeedback(feedbackId, userObj.userId);
  } catch (error: any) {
    console.error('Error deleting feedback:', error.message);
    throw new Error('Failed to delete feedback.');
  }
};

/**
 * Generates AI feedback for an interview
 * @param interviewId The ID of the interview to analyze
 * @param userObj The user JWT object
 * @returns Generated feedback data
 */
const generateAIFeedback = async (
  interviewId: string,
  userObj: UserJWT
): Promise<FeedbackData> => {
  try {
    // Get the interview data first
    const interviewData = await feedbackRepository.getInterviewWithFeedback(
      interviewId,
      userObj.userId
    );

    if (
      !interviewData ||
      !interviewData.chatHistory ||
      interviewData.chatHistory.length === 0
    ) {
      throw new Error('Interview data not found or chat history is empty');
    }

    // This is where you'd call your AI service to analyze the chat
    // For now, we'll return mock data
    // TODO: Replace with actual AI service call

    const mockFeedback: FeedbackData = {
      rating: 7.5,
      strengths: [
        'You were concise in your responses',
        'You showed up for the interview',
      ],
      improvements: [
        'Your responses were too brief and lacked detail',
        "You didn't properly introduce yourself when prompted",
        'You should provide more context about your experience and skills',
        "Try to engage more with the interviewer's questions",
      ],
      tips: [
        'Prepare a 30-second elevator pitch about yourself',
        'Use the STAR method (Situation, Task, Action, Result) for answering behavioral questions',
        'Research the company before the interview',
        'Practice common interview questions out loud',
        'Ask thoughtful questions at the end of the interview',
      ],
    };

    // Save this generated feedback
    await feedbackRepository.saveFeedback(
      interviewId,
      userObj.userId,
      mockFeedback
    );

    return mockFeedback;
  } catch (error: any) {
    console.error('Error generating AI feedback:', error.message);
    throw new Error('Failed to generate AI feedback.');
  }
};

export default {
  getInterviewWithFeedback,
  saveFeedback,
  getInterviewsWithFeedbackStatus,
  deleteFeedback,
  generateAIFeedback,
};
