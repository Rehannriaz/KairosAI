import {
  Application,
  ApplicationNote,
  ApplicationStatus,
} from '@/types/application-tracker';

export const ApplicationTrackerService = {
  // Fetch all applications for a user
  async getApplications(userId: string): Promise<Application[]> {
    try {
      const response = await fetch(
        `/api/application-tracker?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch applications');
      }

      const data = await response.json();
      return data.applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Create a new application
  async createApplication(
    applicationData: Partial<Application> & { user_id: string; notes?: string }
  ): Promise<Application> {
    try {
      const response = await fetch('/api/application-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create application');
      }

      const data = await response.json();
      return data.application;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Update an existing application
  async updateApplication(
    applicationData: Partial<Application> & { id: string }
  ): Promise<Application> {
    try {
      const response = await fetch('/api/application-tracker', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update application');
      }

      const data = await response.json();
      return data.application;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  // Delete an application
  async deleteApplication(id: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `/api/application-tracker?id=${id}&userId=${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete application');
      }

      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Fetch notes for an application
  async getNotes(applicationId: string): Promise<ApplicationNote[]> {
    try {
      const response = await fetch(
        `/api/application-tracker/notes?applicationId=${applicationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notes');
      }

      const data = await response.json();
      return data.notes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  // Add a note to an application
  async addNote(applicationId: string, note: string): Promise<ApplicationNote> {
    try {
      const response = await fetch('/api/application-tracker/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_id: applicationId, note }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add note');
      }

      const data = await response.json();
      return data.note;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  // Update a note
  async updateNote(id: string, note: string): Promise<ApplicationNote> {
    try {
      const response = await fetch('/api/application-tracker/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, note }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update note');
      }

      const data = await response.json();
      return data.note;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  // Delete a note
  async deleteNote(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/application-tracker/notes?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete note');
      }

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },
};
