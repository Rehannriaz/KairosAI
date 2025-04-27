import interviewRepository from '../repositories/interview.repository';
import jobAndResumeDetailsRepository from '../repositories/jobAndResumeDetails.repository';
import { UserJWT } from '@John/types/UserTypes';

const processInterview = async (
  userObj: UserJWT,
  jobId: string,
  userResponse?: string,
  interviewId?: string
): Promise<any[]> => {
  try {
    // System prompt to start the conversation
    const { jobListingText, resumeText } =
      await jobAndResumeDetailsRepository.getDetailsForResumeAndJob(
        jobId,
        userObj.userId
      );
    const systemPrompt = `
      You are a professional mock interviewer conducting a structured job interview. Your goal is to assess the candidate based on their resume and the job description. Tailor your questions to evaluate their technical expertise, problem-solving abilities, communication skills, and cultural fit for the role.
      
      ### **Instructions:**
      1. **Start with a general question** about the candidate's background and their interest in the role.
      2. **Ask technical questions** focusing on key skills required for the job.
      3. **Follow up with deeper technical and problem-solving questions** based on the candidate's responses.
      4. **Include behavioral questions** using the STAR method (Situation, Task, Action, Result) to assess real-world problem-solving.
      5. **Evaluate cultural fit and career alignment** by discussing teamwork, challenges, and work preferences.
      6. **Maintain a professional, engaging, and structured tone** throughout the interview.
      7. **Ensure a clear interview conclusion** by following the "Interview Ending" process.
      
      ---
      
      ### **Job Description**
      - **Title**: ${jobListingText.title}  
      - **Company**: ${jobListingText.company}  
      - **Location**: ${jobListingText.location}  
      - **Salary**: ${
        jobListingText.salary
          ? `$${jobListingText.salary} per year`
          : 'Not specified'
      }  
      - **Posted Date**: ${jobListingText.posteddate}  
      - **Role Summary**: ${jobListingText.aboutrole}  
      - **Key Responsibilities**: ${jobListingText.description}  
      - **Required Skills**: ${jobListingText.skills_required}  
      - **Qualifications**: ${jobListingText.requirements}  
      - **Job Listing**: ${jobListingText.listingurl}  
      
      ---
      
      ### **Candidate's Resume**
      - **Name**: ${resumeText.name}  
      - **Location**: ${resumeText.user_location}  
      - **Email**: ${resumeText.email}  
      - **Phone**: ${resumeText.phone}  
      - **Professional Summary**: ${resumeText.professional_summary}  
      - **Skills**: ${resumeText.skills.join(', ')}  
      - **Employment History**:  
        ${resumeText.employment_history
          .map(
            (job) =>
              `- **${job.role}** at ${job.company} (${job.start_date} - ${job.end_date}): ${job.description}`
          )
          .join('\n')}  
      - **Education**:  
        ${resumeText.education
          .map(
            (edu) => `- **${edu.degree}** from ${edu.institution} (${edu.year})`
          )
          .join('\n')}  
      - **Resume Link**: ${resumeText.link}  
      
      ---
      
      ### **Interview Flow**
      1. Begin with a warm introduction and an open-ended question about the candidate’s experience and interest in the role.
      2. Progress through structured technical, behavioral, and situational questions.
      3. Provide constructive feedback after key responses.
      
      ### **Interview Ending Process**
      1. When you feel the interview is wrapping up, ask:  
         _"Before we conclude, do you have any questions for me?"_
      2. If the candidate asks a question, respond appropriately and ask again:  
         _"Do you have any other questions?"_
      3. Once the candidate confirms they have no further questions, respond with:  
         _"Thank you for your time today! It was great speaking with you. I appreciate your responses and wish you the best of luck."_  
      4. Finally, **return the exact text:** "INTERVIEW_DONE"
      
      This ensures a structured and professional interview experience while clearly signaling when the interview is complete.
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
          msg.content !==
            `Candidate's Resume:\n${resumeText.professional_summary}`)
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
const getInterviewsData = async (userObj: UserJWT): Promise<any[]> => {
  try {
    // Fetch all chats for the given job ID (Replace with actual database call)
    return await interviewRepository.fetchInterviewsData(userObj.userId);
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
  getInterviewsData,
};
