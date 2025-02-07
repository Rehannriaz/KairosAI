import interviewRepository from '../repositories/interview.repository';
import jobListingText from '../constants/job-listing.json';
import resumeText from '../constants/resume-text.json';
import { UserJWT } from 'common/src/types/UserTypes';

let interviewHistory: { role: string; content: string }[] = [];

const processInterview = async (
  userResponse?: string,
  interviewId?: string,
  userObj?: UserJWT,
  jobId?: string
): Promise<any[]> => {
  try {
    const systemPrompt = `
You are a mock interviewer. Use the candidate's resume and job description to ask interview questions and evaluate their answers. 
Job: ${jobListingText.details}
Resume: ${resumeText.details}.
Ask follow-up questions based on the candidate's responses and maintain a professional tone.
`;

    // Fetch existing interview history from the database (if exists)
    let interviewHistory: { role: string; content: string }[] = [];
    if (interviewId && userObj && jobId) {
      const interviewData = await interviewRepository.getInterviewData(
        interviewId,
        userObj.userId,
        jobId
      );
      console.log('interviewData', interviewData);

      if (interviewData && interviewData.interview_data) {
        // Check if interview_data is a string before parsing
        let interviewDataParsed;
        try {
          interviewDataParsed =
            typeof interviewData.interview_data === 'string'
              ? JSON.parse(interviewData.interview_data)
              : interviewData.interview_data; // No need to parse if it's already an object
        } catch (error: any) {
          console.error('Error parsing interview data:', error.message);
          interviewDataParsed = []; // Fallback to an empty array if parsing fails
        }

        interviewHistory = interviewDataParsed;
        console.log('interviewhist', interviewHistory);
      } else {
        // Initialize if no history exists
        interviewHistory.push({ role: 'system', content: systemPrompt });
      }
    }

    // Add the user's response if provided
    if (userResponse) {
      interviewHistory.push({ role: 'user', content: userResponse });
    }

    // Get AI's response based on the current history
    const botResponse = await interviewRepository.getChatCompletion(
      interviewHistory
    );

    // Append the AI's response to the history
    interviewHistory.push({ role: 'assistant', content: botResponse });

    // Filter out system prompt and resume content for final storage
    const filteredHistory = interviewHistory.filter(
      (msg) =>
        msg.role !== 'system' &&
        (msg.role !== 'user' ||
          msg.content !== `Candidate's Resume:\n${resumeText.details}`)
    );

    // Prepare the updated interview data to save into the database
    console.log('updatedInterviewData', filteredHistory);
    const updatedInterviewData = JSON.stringify(filteredHistory);
    // Update the interview data in the database
    if (interviewId && userObj && jobId) {
      await interviewRepository.updateInterviewData(
        interviewId,
        userObj.userId,
        jobId,
        updatedInterviewData
      );
    }

    return filteredHistory; // Return the filtered conversation
  } catch (error: any) {
    console.error('Error in processInterview:', error.message);
    throw error; // Let the controller handle the error
  }
};

const fetchChatsForJob = async (
  jobID: string,
  userObj: UserJWT
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
  userObj: UserJWT
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
  userObj: UserJWT
): Promise<any> => {
  try {
    return await interviewRepository.initiateInterview(jobID, userObj.userId);
  } catch (error: any) {
    console.error('Error in initiateInterview:', error.message);
    throw new Error('Failed to initiate interview.');
  }
};
const deleteChatForJob = async (
  chatID: string,
  userObj: UserJWT
): Promise<any> => {
  try {
    return await interviewRepository.deleteChatForJob(chatID, userObj.userId);
  } catch (error: any) {
    console.error('Error deleting chat:', error.message);
    throw new Error('Failed to delete chat.');
  }
};

export default {
  processInterview,
  fetchChatsForJob,
  fetchChatForJob,
  initiateInterview,
  deleteChatForJob,
};
