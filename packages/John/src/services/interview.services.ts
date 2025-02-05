import interviewRepository from '../repositories/interview.repository';
import jobListingText from '../constants/job-listing.json';
import resumeText from '../constants/resume-text.json';
import { User } from '../models/userTypes';

let interviewHistory: { role: string; content: string }[] = [];

const processInterview = async (
  userResponse?: string,
  interviewId?: string,
  userObj?: User,
  jobId?: string
): Promise<any[]> => {
  try {
    const systemPrompt = `
You are a mock interviewer. Use the candidate's resume and job description to ask interview questions and evaluate their answers. 
Job: ${jobListingText.details}
Resume: ${resumeText.details}.
Ask follow-up questions based on the candidate's responses and maintain a professional tone.
`;

    // Reinitialize if history is too long
    if (interviewHistory.length > 50) {
      console.warn('Resetting interview history to prevent overload.');
      interviewHistory = [];
    }

    // Initialize chat history if empty
    if (interviewHistory.length === 0) {
      interviewHistory.push({ role: 'system', content: systemPrompt });
      interviewHistory.push({
        role: 'user',
        content: `Candidate's Resume:\n${resumeText.details}`,
      });
    }

    // Add user's response to the chat history
    if (userResponse) {
      interviewHistory.push({ role: 'user', content: userResponse });
    }

    // Get AI-generated response
    const botResponse = await interviewRepository.getChatCompletion(
      interviewHistory
    );

    // Append the AI's response to the history
    interviewHistory.push({ role: 'assistant', content: botResponse });

    // Filter out system prompt and resume content
    const filteredHistory = interviewHistory.filter(
      (msg) =>
        msg.role !== 'system' &&
        (msg.role !== 'user' ||
          msg.content !== `Candidate's Resume:\n${resumeText.details}`)
    );

    // Prepare the updated interview data to save into the database
    const updatedInterviewData = JSON.stringify(filteredHistory);

    // Update the interview_data in the database (replace with actual query)
    if (interviewId && userObj && jobId) {
      await interviewRepository.updateInterviewData(
        interviewId,
        userObj.userId,
        jobId,
        updatedInterviewData
      );
    }

    return filteredHistory; // Only return the filtered conversation
  } catch (error: any) {
    console.error('Error in processInterview:', error.message);
    throw error; // Let the controller handle the error
  }
};

const fetchChatsForJob = async (
  jobID: string,
  userObj: User
): Promise<any[]> => {
  try {
    // Fetch all chats for the given job ID (Replace with actual database call)
    return await interviewRepository.getAllChatsForJob(jobID, userObj.userId);
  } catch (error: any) {
    console.error('Error fetching chats:', error.message);
    throw new Error('Failed to fetch chats.');
  }
};

const fetchChatForJob = async (
  jobID: string,
  chatID: string,
  userObj: User
): Promise<any> => {
  try {
    return await interviewRepository.getChatForJob(
      jobID,
      chatID,
      userObj.userId
    );
  } catch (error: any) {
    console.error('Error fetching chat:', error.message);
    throw new Error('Failed to fetch chat.');
  }
};
const initiateInterview = async (
  jobID: string,
  userObj: User
): Promise<any> => {
  try {
    return await interviewRepository.initiateInterview(jobID, userObj.userId);
  } catch (error: any) {
    console.error('Error in initiateInterview:', error.message);
    throw new Error('Failed to initiate interview.');
  }
};
export default {
  processInterview,
  fetchChatsForJob,
  fetchChatForJob,
  initiateInterview,
};
