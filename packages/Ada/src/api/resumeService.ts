import { arthurBaseURL } from '@/config';
import { getJWT } from '@/lib/Sessions';

class ResumeService {
  async uploadResume(file: File) {
    try {
      const jwtToken = await getJWT();

      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${arthurBaseURL}/resumes/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload resume.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }
}

const resumeServiceInstance = new ResumeService();
export default resumeServiceInstance;
