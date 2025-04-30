import feedbackRepository from '../repositories/feedback.repository';
import { UserJWT } from '../types/UserTypes';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

interface FeedbackData {
  rating: number;
  strengths: string[];
  improvements: string[];
  tips: string[];
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert career coach providing mock interview feedback. Your only job is to return objective, constructive, and helpful feedback as structured JSON. YOU MUST RESPOND ONLY WITH VALID JSON and nothing else. The format is:
  
  {
    "rating": number, // from 1 to 10
    "strengths": [string],
    "improvements": [string],
    "tips": [string]
  }
  
  Always ensure your response is strictly valid JSON. Do not include explanations or text outside the JSON block.`,
      },
      {
        role: 'user',
        content: `Here is the mock interview transcript. Analyze it and give feedback.
  
  ${interviewData.chatHistory
    .map(
      (msg: any) =>
        `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
    )
    .join('\n')}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.5,
    });

    const raw = completion.choices[0].message.content;

    let feedback: FeedbackData;
    try {
      if (raw === null) {
        throw new Error('OpenAI returned null content.');
      }
      feedback = JSON.parse(raw);
    } catch (err) {
      console.error('Invalid JSON from OpenAI:', raw);
      throw new Error('OpenAI returned invalid JSON.');
    }

    // Optional: validate structure manually if needed
    if (
      typeof feedback.rating !== 'number' ||
      !Array.isArray(feedback.strengths) ||
      !Array.isArray(feedback.improvements) ||
      !Array.isArray(feedback.tips)
    ) {
      throw new Error('Invalid feedback format received from OpenAI.');
    }

    await feedbackRepository.saveFeedback(
      interviewId,
      userObj.userId,
      feedback
    );

    return feedback;
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
