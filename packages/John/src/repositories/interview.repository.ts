import { pool } from '../utils/database';
import { get } from 'http';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getChatCompletion = async (messages: any[]): Promise<string> => {
  try {
    // return 'testing';
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });
    return completion.choices[0]?.message?.content || 'No response from AI.';
  } catch (error: any) {
    // Log error details
    console.error(
      'Error communicating with OpenAI:',
      error.response?.data || error.message
    );

    if (error.response) {
      // Specific error from OpenAI API
      throw new Error(
        `OpenAI API Error: ${error.response.status} - ${error.response.data?.error?.message}`
      );
    }

    // General error
    throw new Error('Failed to generate interview response.');
  }
};

const getAllChatsForJob = async (
  jobId: string,
  userId: string
): Promise<any> => {
  try {
    // Fetch all chats for the given job ID (Replace with actual database call)
    const result = await pool.query(
      'SELECT * FROM jobs j JOIN mock_interview mi ON j.job_id = mi.job_id WHERE mi.job_id = $1 AND mi.user_id = $2',
      [jobId, userId]
    );

    return result.rows.length ? result.rows : null;
  } catch (error: any) {
    console.error('Error fetching chats:', error.message);
    throw new Error('Failed to fetch chats.');
  }
};
const fetchInterviewsData = async (userId: string): Promise<any> => {
  try {
    const result = await pool.query(
      `SELECT 
        mi.user_id,
        mi.job_id,
        j.title AS job_title, 
        j.company AS job_company, 
        array_agg(mi.date) AS interview_dates, 
        array_agg(mi.interview_id) AS interview_ids, 
        array_agg(mi.status) AS statuses
      FROM mock_interview mi
      JOIN jobs j ON mi.job_id = j.job_id
      WHERE mi.user_id = $1
      GROUP BY mi.user_id, mi.job_id, j.title, j.company;`,
      [userId]
    );

    return result.rows.length ? result.rows : null;
  } catch (error: any) {
    console.error('Error fetching interviews:', error.message);
    throw new Error('Failed to fetch interview data.');
  }
};

const getChatForJob = async (
  jobId: string,
  chatId: string,
  userId: string
): Promise<any> => {
  try {
    // Fetch a specific chat based on jobId and chatId (Replace with actual database call)
    const result = await pool.query(
      'SELECT  mi.*,  j.title,  j.company,  j.location,  j.salary FROM mock_interview mi JOIN jobs j ON mi.job_id = j.job_id WHERE mi.job_id = $1  AND mi.interview_id = $2  AND mi.user_id = $3;',
      [jobId, chatId, userId]
    );
    return result.rows.length ? result.rows[0] : null;
  } catch (error: any) {
    console.error('Error fetching chat:', error.message);
    throw new Error('Failed to fetch chat.');
  }
};

const initiateInterview = async (
  jobID: string,
  userId: string
): Promise<any> => {
  try {
    // Initiate an interview for the given job ID (Replace with actual database call)
    const result = await pool.query(
      'INSERT INTO mock_interview (job_id,user_id) VALUES ($1,$2) RETURNING *',
      [jobID, userId]
    );
    return result.rows.length ? result.rows[0] : null;
  } catch (error: any) {
    console.error('Error in initiateInterview:', error.message);
    throw new Error('Failed to initiate interview.');
  }
};

const updateInterviewData = async (
  interviewId: string,
  userId: string,
  jobId: string,
  updatedInterviewData: string
): Promise<any> => {
  // Update the interview data for the given interview ID (Replace with actual database call)
  try {
    await pool.query(
      'UPDATE mock_interview SET interview_data = $1 WHERE interview_id = $2 AND user_id = $3 AND job_id = $4',
      [updatedInterviewData, interviewId, userId, jobId]
    );
  } catch (error: any) {
    console.error('Error in updateInterviewData:', error.message);
    throw new Error('Failed to update interview data.');
  }
};
const getInterviewData = async (
  interviewId: string,
  userId: string,
  jobId: string
): Promise<any> => {
  try {
    const result = await pool.query(
      'SELECT interview_data FROM mock_interview WHERE interview_id = $1 AND user_id = $2 AND job_id = $3',
      [interviewId, userId, jobId]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null; // If no interview data exists
  } catch (error: any) {
    console.error('Error fetching interview data:', error.message);
    throw new Error('Failed to fetch interview data.');
  }
};

const deleteChatForJob = async (
  chatID: string,
  userId: string
): Promise<any> => {
  try {
    await pool.query(
      'DELETE FROM mock_interview WHERE interview_id = $1 AND user_id = $2',
      [chatID, userId]
    );
  } catch (error: any) {
    console.error('Error deleting chat:', error.message);
    throw new Error('Failed to delete chat.');
  }
};
const updateInterviewStatus = async (
  interviewId: string,
  userId: string,
  jobId: string,
  status: string
): Promise<void> => {
  try {
    // Update the interview status
    await pool.query(
      'UPDATE mock_interview SET status = $1 WHERE interview_id = $2 AND user_id = $3 AND job_id = $4',
      [status, interviewId, userId, jobId]
    );
  } catch (error: any) {
    console.error('Error updating interview status:', error.message);
    throw new Error('Failed to update interview status.');
  }
};
const streamChatCompletion = async (
  messages: any[],
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    console.log('streamChatCompletion called with messages:', messages);

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error('Error in streamChatCompletion:', error);
    throw error;
  }
};

export default {
  getChatCompletion,
  getAllChatsForJob,
  getChatForJob,
  initiateInterview,
  updateInterviewData,
  getInterviewData,
  deleteChatForJob,
  fetchInterviewsData,
  streamChatCompletion,
  updateInterviewStatus,
};
