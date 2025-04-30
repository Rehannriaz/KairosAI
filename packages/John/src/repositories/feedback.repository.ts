import { pool } from '../utils/database';

// Add this new function to get interview data with feedback
const getInterviewWithFeedback = async (
  interviewId: string,
  userId: string
): Promise<any> => {
  try {
    // First, get the interview data with job details
    const interviewResult = await pool.query(
      `SELECT 
        mi.interview_id,
        mi.date,
        mi.interview_data,
        mi.status,
        j.title,
        j.company
      FROM mock_interview mi
      JOIN jobs j ON mi.job_id = j.job_id
      WHERE mi.interview_id = $1 AND mi.user_id = $2`,
      [interviewId, userId]
    );

    if (!interviewResult.rows.length) {
      return null;
    }

    const interviewData = interviewResult.rows[0];

    // Then, get the feedback for this interview
    const feedbackResult = await pool.query(
      `SELECT 
        feedback_id,
        rating,
        strengths,
        improvements,
        tips,
        created_date
      FROM interview_feedback
      WHERE interview_id = $1 AND user_id = $2`,
      [interviewId, userId]
    );

    // Format the data to match the frontend structure
    const formattedData = {
      interview_id: interviewData.interview_id,
      title: `${interviewData.company} Mock Interview`,
      date: new Date(interviewData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      chatHistory: interviewData.interview_data || [],
      status: interviewData.status,
    };

    // Add feedback if it exists
    if (feedbackResult.rows.length) {
      const feedback = feedbackResult.rows[0];
      return {
        ...formattedData,
        feedback_id: feedback.feedback_id,
        rating: parseFloat(feedback.rating) || 0,
        feedback: {
          strengths: feedback.strengths || [],
          improvements: feedback.improvements || [],
          tips: feedback.tips || [],
        },
      };
    }

    // Return without feedback if none exists
    return formattedData;
  } catch (error: any) {
    console.error('Error fetching interview with feedback:', error.message);
    throw new Error('Failed to fetch interview data with feedback.');
  }
};

// Add function to save feedback
const saveFeedback = async (
  interviewId: string,
  userId: string,
  feedbackData: {
    rating: number;
    strengths: string[];
    improvements: string[];
    tips: string[];
  }
): Promise<any> => {
  try {
    // Check if feedback already exists
    const existingFeedback = await pool.query(
      'SELECT feedback_id FROM interview_feedback WHERE interview_id = $1 AND user_id = $2',
      [interviewId, userId]
    );

    let result;

    if (existingFeedback.rows.length) {
      // Update existing feedback
      result = await pool.query(
        `UPDATE interview_feedback 
         SET rating = $1, strengths = $2, improvements = $3, tips = $4, updated_date = CURRENT_TIMESTAMP
         WHERE interview_id = $5 AND user_id = $6
         RETURNING feedback_id`,
        [
          feedbackData.rating,
          JSON.stringify(feedbackData.strengths),
          JSON.stringify(feedbackData.improvements),
          JSON.stringify(feedbackData.tips),
          interviewId,
          userId,
        ]
      );
    } else {
      // Insert new feedback
      result = await pool.query(
        `INSERT INTO interview_feedback 
         (interview_id, user_id, rating, strengths, improvements, tips)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING feedback_id`,
        [
          interviewId,
          userId,
          feedbackData.rating,
          JSON.stringify(feedbackData.strengths),
          JSON.stringify(feedbackData.improvements),
          JSON.stringify(feedbackData.tips),
        ]
      );
    }

    return result.rows[0];
  } catch (error: any) {
    console.error('Error saving feedback:', error.message);
    throw new Error('Failed to save interview feedback.');
  }
};

// Function to get all interviews with their feedback status
const getInterviewsWithFeedbackStatus = async (
  userId: string
): Promise<any> => {
  try {
    const result = await pool.query(
      `SELECT 
        mi.interview_id,
        mi.job_id,
        mi.date,
        mi.status,
        j.title AS job_title,
        j.company,
        CASE WHEN f.feedback_id IS NOT NULL THEN true ELSE false END AS has_feedback,
        f.rating
      FROM mock_interview mi
      JOIN jobs j ON mi.job_id = j.job_id
      LEFT JOIN interview_feedback f ON mi.interview_id = f.interview_id AND mi.user_id = f.user_id
      WHERE mi.user_id = $1
      ORDER BY mi.date DESC`,
      [userId]
    );

    return result.rows;
  } catch (error: any) {
    console.error(
      'Error fetching interviews with feedback status:',
      error.message
    );
    throw new Error('Failed to fetch interviews with feedback status.');
  }
};

// Function to delete feedback
const deleteFeedback = async (
  feedbackId: string,
  userId: string
): Promise<void> => {
  try {
    await pool.query(
      'DELETE FROM interview_feedback WHERE feedback_id = $1 AND user_id = $2',
      [feedbackId, userId]
    );
  } catch (error: any) {
    console.error('Error deleting feedback:', error.message);
    throw new Error('Failed to delete feedback.');
  }
};

export default {
  getInterviewWithFeedback,
  getInterviewsWithFeedbackStatus,
  saveFeedback,
  deleteFeedback,
};
