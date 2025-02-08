import { pool } from '../utils/database';
import { IResume } from '../models/resume.model';

const uploadUserResume = async (
  userId: string,
  parsedJson: any,
  embeddings: any[]
) => {
  try {
    await pool.query(
      `INSERT INTO resumes 
      (user_id, name, location, email, phone, professional_summary, skills, employment_history, education, preferences, embedding) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        userId,
        parsedJson.name,
        parsedJson.location,
        parsedJson.email,
        parsedJson.phone,
        parsedJson.professional_summary,
        parsedJson.skills, // Assuming this is an array of strings (text[])
        JSON.stringify(parsedJson.employment_history), // Convert JSON to string for jsonb
        JSON.stringify(parsedJson.education), // Convert JSON to string for jsonb
        JSON.stringify(parsedJson.preferences), // Convert JSON to string for jsonb
        JSON.stringify(embeddings), // Convert JSON to string for jsonb
      ]
    );
  } catch (error: any) {
    console.error('Error uploading resume:', error.message);
    throw new Error('Failed to upload resume.');
  }
};

const getUserResumes = async (userId: string) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  } catch (error: any) {
    console.error('Error fetching resumes:', error.message);
    throw new Error('Failed to fetch resumes.');
  }
};

const updateResume = async (id: string, resumeData: Partial<IResume>) => {
  try {
    if (Object.keys(resumeData).length === 0) {
      throw new Error('No fields provided for update.');
    }

    // Convert employment_history to JSON string if it exists
    if (resumeData.employment_history) {
      resumeData.employment_history = JSON.stringify(resumeData.employment_history);
    }

    const fields = Object.keys(resumeData);
    const values = Object.values(resumeData);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    const result = await pool.query(
      `UPDATE resumes SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      throw new Error('Resume not found or update failed.');
    }

    return result.rows[0];
  } catch (error: any) {
    console.error('Error updating resume:', error.message);
    throw new Error('Failed to update resume.');
  }
};


const deleteResume = async (id: string) => {
  try {
    const result = await pool.query(
      'DELETE FROM resumes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Resume not found or delete failed.');
    }

    return result.rows[0];
  } catch (error: any) {
    console.error('Error deleting resume:', error.message);
    throw new Error('Failed to delete resume.');
  }
};

const findResumeById = async (id: string) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Resume not found.');
    }

    return result.rows[0];
  } catch (error: any) {
    console.error('Error fetching resume by ID:', error.message);
    throw new Error('Failed to fetch resume.');
  }
};

export default {
  getUserResumes,
  uploadUserResume,
  updateResume,
  deleteResume,
  findResumeById
};
