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
  async streamChat(
    userResponse: string,
    interviewID: string,
    jobID: string,
    onChunk: (chunk: string) => void
  ) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${johnBaseURL}/interview/stream`, {
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
        throw new Error(`Error: ${response.status}`);
      }

      // Get the readable stream from the response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      // Text decoder to convert uint8array to string
      const decoder = new TextDecoder();

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and pass it to the callback
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }

      // Save the completed interview in the background
      await this.saveStreamedInterview(userResponse, interviewID, jobID);
    } catch (error) {
      console.error('Error streaming chat from server: ', error);
      throw error;
    }
  }

  // Method to save the completed streamed interview
  async saveStreamedInterview(
    userResponse: string,
    interviewID: string,
    jobID: string
  ) {
    try {
      const jwtToken = await getJWT();

      await fetch(`${johnBaseURL}/interview/save-stream`, {
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
    } catch (error) {
      console.error('Error saving streamed interview: ', error);
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
  async getInterviewsData() {
    try {
      const jwtToken = await getJWT();
      const response = await fetch(
        `${johnBaseURL}/interview/getInterviewsData`,
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
      console.error('Error getting Interview Data from server: ', error);
      throw error; // Propagate the error for further handling
    }
  }
  async deleteChatForSpecificJob(chatID: string) {
    try {
      const jwtToken = await getJWT();
      const response = await fetch(`${johnBaseURL}/interview/${chatID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Something went wrong.`);
      }
      return;
    } catch (error) {
      console.error('Error deleting chat from server: ', error);
      throw error;
    }
  }
}

const chatServiceInstance = new ChatService();
export default chatServiceInstance;
