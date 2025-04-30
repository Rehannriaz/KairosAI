import { Answer, Question } from '@/types/additional-questions';
import axios from 'axios';

class AdditionalQuestionsService {
  /**
   * Fetch the list of additional questions for a resume application
   * @returns A promise that resolves to an array of questions
   */
  async getAdditionalQuestions(): Promise<Question[]> {
    try {
      const response = await axios.get(`/api/additional-questions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching additional questions:', error);
      throw error;
    }
  }

  /**
   * Retrieve a user's previous responses to additional questions
   * @param userId The ID of the user
   * @param resumeId The ID of the resume (optional)
   * @returns A promise that resolves to the user's answers, or null if none exist
   */
  async getUsersPreviousResponse(
    userId: string | null
  ): Promise<Answer[] | null> {
    if (!userId) {
      console.warn('User ID is null or undefined, skipping fetch');
      return null;
    }

    try {
      const response = await axios.get(
        `/api/additional-questions/responses/${userId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // No previous responses found
      }
      console.error('Error fetching user responses:', error);
      throw error;
    }
  }

  /**
   * Submit a user's responses to additional questions
   * @param userId The ID of the user
   * @param answers The user's answers to the questions
   * @param resumeId The ID of the resume (optional)
   * @returns A promise that resolves when the submission is complete
   */
  async submitUsersResponse(
    userId: string | null,
    answers: Answer[]
  ): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required to submit responses');
    }

    try {
      await axios.post(`/api/additional-questions/responses/${userId}`, {
        userId,
        answers,
      });
    } catch (error) {
      console.error('Error submitting user responses:', error);
      throw error;
    }
  }
}

const additionalQuestionsService = new AdditionalQuestionsService();

export default additionalQuestionsService;
