import { arthurBaseURL } from '@/config';
import { getJWT } from '@/lib/Sessions';

class ResumeService {
  async uploadResume(file: File) {
    try {
      const jwtToken = await getJWT();
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

      return await response.json();
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  async getUserResumes() {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${arthurBaseURL}/resumes`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error;
    }
  }

  async getResumeById(id: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${arthurBaseURL}/resumes/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  }

  async updateResume(id: string, resumeData: any) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${arthurBaseURL}/resumes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error('Failed to update resume');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  }

  async setResumeAsPrimary(resumeId: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(
        `${arthurBaseURL}/resumes/primary/${resumeId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update resume');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  }

  async deleteResume(id: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${arthurBaseURL}/resumes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

  async optimizeResumeText(text: string, section: string) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${arthurBaseURL}/resumes/optimize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, section }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize resume text');
      }

      return await response.json();
    } catch (error) {
      console.error('Error optimizing resume text:', error);
      throw error;
    }
  }
}

const resumeServiceInstance = new ResumeService();
export default resumeServiceInstance;
