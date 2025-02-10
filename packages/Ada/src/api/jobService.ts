import { pollyBaseURL } from '@/config';
import { getJWT } from '@/lib/Sessions';

class JobService {
  async getAllJobs(page = 1, limit = 6) {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(
        `${pollyBaseURL}/jobs?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch jobs.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error Getting Jobs:', error);
      throw error;
    }
  }

  async getRecommendedJobs() {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${pollyBaseURL}/jobs/recommended-jobs/5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recommended jobs.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error Getting Recommended Jobs ', error);
      throw error; // Propagate the error for further handling
    }
  }

  async getJobById(jobID: string) {
    try {
      console.log('hello');
      const jwtToken = await getJWT();
      const response = await fetch(`${pollyBaseURL}/jobs/${jobID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error Getting Job ', error);
      throw error; // Propagate the error for further handling
    }
  }
}

const jobServiceInstance = new JobService();
export default jobServiceInstance;
