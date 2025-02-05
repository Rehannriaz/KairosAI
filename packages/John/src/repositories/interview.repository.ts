import { pool } from '../utils/database';
import { get } from 'http';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getChatCompletion = async (messages: any[]): Promise<string> => {
  try {
    return 'testing';
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages,
    // });
    // return completion.choices[0]?.message?.content || 'No response from AI.';
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
    console.log('job and user', jobId, userId);
    // Fetch all chats for the given job ID (Replace with actual database call)
    const result = await pool.query(
      'SELECT * FROM mock_interview WHERE job_id = $1 AND user_id = $2',
      [jobId, userId]
    );
    return result.rows.length ? result.rows : null;
  } catch (error: any) {
    console.error('Error fetching chats:', error.message);
    throw new Error('Failed to fetch chats.');
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
      'SELECT * FROM mock_interview WHERE job_id = $1 AND interview_id = $2 and user_id = $3',
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
    console.log('job and user', jobID, userId);
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

export default {
  getChatCompletion,
  getAllChatsForJob,
  getChatForJob,
  initiateInterview,
  updateInterviewData,
};
