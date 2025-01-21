import { getChatCompletion } from '../repositories/interview.repository';
import jobListingText from '../constants/job-listing.json';
import resumeText from '../constants/resume-text.json';

let interviewHistory: { role: string; content: string }[] = [];

export const processInterview = async (
  userResponse?: string
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
    const botResponse = await getChatCompletion(interviewHistory);

    // Append the AI's response to the history
    interviewHistory.push({ role: 'assistant', content: botResponse });

    // Filter out system prompt and resume content
    const filteredHistory = interviewHistory.filter(
      (msg) =>
        msg.role !== 'system' &&
        (msg.role !== 'user' ||
          msg.content !== `Candidate's Resume:\n${resumeText.details}`)
    );

    return filteredHistory; // Only return the filtered conversation
  } catch (error: any) {
    console.error('Error in processInterview:', error.message);
    throw error; // Let the controller handle the error
  }
};
