import { authBaseURL, johnBaseURL } from '@/config';
import { getJWT } from '@/lib/Sessions';

class ChatService {
  async postChat(userResponse: string, interviewID: string, jobID: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${johnBaseURL}/interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          userResponse: userResponse,
          interviewID: interviewID,
          jobID: jobID,
        }),
      });

      if (!response.ok) {
        throw new Error(`Invalid Email or Password, Please try again.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error Sending Chat to server: ', error);
      throw error; // Propagate the error for further handling
    }
  }
  async initateChatForSpecificJob(jobID: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(
        `${johnBaseURL}/interview/initiateInterview/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ jobID: jobID }),
        }
      );

      if (!response.ok) {
        throw new Error(`Something went wrong.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error Initiating Chat to server: ', error);
      throw error; // Propagate the error for further handling
    }
  }
  async getAllChatsForSpecificJob(jobID: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${johnBaseURL}/interview/${jobID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Something went wrong.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting Chats from server: ', error);
      throw error; // Propagate the error for further handling
    }
  }
  async getChatForSpecificJob(jobID: string, chatID: string) {
    try {
      const jwtToken = await getJWT();
      const response = await fetch(
        `${johnBaseURL}/interview/${jobID}/${chatID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Something went wrong.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting Chat from server: ', error);
      throw error; // Propagate the error for further handling
    }
  }
}

const chatServiceInstance = new ChatService();
export default chatServiceInstance;
