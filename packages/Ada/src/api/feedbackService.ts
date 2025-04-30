import { johnBaseURL } from '@/config';
import { getJWT } from '@/lib/Sessions';

class FeedbackService {
  async getInterviewWithFeedback(interviewId: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${johnBaseURL}/feedback/${interviewId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch feedback');

      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  }

  async saveFeedback(interviewId: string, feedbackData: any) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${johnBaseURL}/feedback/${interviewId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) throw new Error('Failed to save feedback');

      return await response.json();
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  }

  async deleteFeedback(feedbackId: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${johnBaseURL}/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete feedback');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }

  async getFeedbackStatus() {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${johnBaseURL}/feedback`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch feedback status');

      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback status:', error);
      throw error;
    }
  }

  async generateAIFeedback(interviewId: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(
        `${johnBaseURL}/feedback/generate/${interviewId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to generate AI feedback');

      return await response.json();
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      throw error;
    }
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
