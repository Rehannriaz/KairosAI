import { pollyBaseURL } from '@/config';
import { getJWT } from '@/lib/Sessions';

// Define filter interface
interface JobFilters {
  locations?: string[];
  isRemote?: boolean | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  categories?: string[];
}

class JobService {
  async getAllJobs(page = 1, limit = 6, filters?: JobFilters) {
    try {
      console.log('Getting jobs with filters:', filters);
      const jwtToken = await getJWT();
      
      // Build URL with query parameters
      let url = `${pollyBaseURL}/jobs?page=${page}&limit=${limit}`;
      
      // Add filter parameters if they exist
      if (filters) {
        // Add locations filter
        if (filters.locations && filters.locations.length > 0) {
          filters.locations.forEach(location => {
            url += `&locations[]=${encodeURIComponent(location)}`;
          });
        }
        
        // Add remote filter
        if (filters.isRemote !== null && filters.isRemote !== undefined) {
          url += `&isRemote=${filters.isRemote}`;
        }
        
        // Add salary range filters
        if (filters.minSalary) {
          url += `&minSalary=${filters.minSalary}`;
        }
        if (filters.maxSalary) {
          url += `&maxSalary=${filters.maxSalary}`;
        }
        
        // Add job categories filter
        if (filters.categories && filters.categories.length > 0) {
          filters.categories.forEach(category => {
            url += `&categories[]=${encodeURIComponent(category)}`;
          });
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

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

      const response = await fetch(`${pollyBaseURL}/jobs/recommended-jobs/6`, {
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
  
  async getAvailableLocations() {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${pollyBaseURL}/jobs/locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch locations.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error Getting Locations ', error);
      throw error;
    }
  }

  async getJobCategories() {
    try {
      const jwtToken = await getJWT();

      const response = await fetch(`${pollyBaseURL}/jobs/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job categories.`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error Getting Job Categories ', error);
      throw error;
    }
  }
}

const jobServiceInstance = new JobService();
export default jobServiceInstance;