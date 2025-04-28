import { IResume } from '../models/resume.model';
import { pool } from '../utils/database';

const uploadUserResume = async (
  userId: string,
  parsedJson: any,
  embeddings: any[],
  file_url: string
): Promise<number> => {
  try {
    const result = await pool.query(
      `INSERT INTO resumes 
      (user_id, name, location, email, phone, linkedin, github, website, professional_summary, skills, employment_history, education, preferences, embedding, file_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *;`,
      [
        userId,
        parsedJson.name || null,
        parsedJson.location || null,
        parsedJson.email || null,
        parsedJson.phone || null,
        parsedJson.linkedin || null,
        parsedJson.github || null,
        parsedJson.website || null,
        parsedJson.professional_summary || null,
        parsedJson.skills || [], // Still assuming text[]
        JSON.stringify(parsedJson.employment_history || []),
        JSON.stringify(parsedJson.education || []),
        JSON.stringify(parsedJson.preferences || {}),
        JSON.stringify(embeddings),
        file_url,
      ]
    );
    return result.rows[0].id;
  } catch (error: any) {
    console.error('Error uploading resume:', error.message);
    throw new Error('Failed to upload resume.');
  }
};

const getUserResumes = async (userId: string) => {
  try {
    const result = await pool.query(
      `SELECT 
         r.id, r.user_id, r.name, r.location, r.email, r.phone, 
         r.professional_summary, r.skills, r.employment_history, 
         r.education, r.preferences, r.link, r.skill_level,r.uploaddate,r.file_url,r.linkedin, r.github, r.website,
         upr.resume_id AS primary_resume_id
       FROM resumes r
       LEFT JOIN user_primary_resume upr 
       ON r.user_id = upr.user_id
       WHERE r.user_id = $1`,
      [userId]
    );

    return result.rows;
  } catch (error: any) {
    console.error('Error fetching resumes:', error.message);
    throw new Error('Failed to fetch resumes.');
  }
};
const setPrimary = async (id: string, userId: string) => {
  try {
    const query = `
      UPDATE user_primary_resume 
      SET resume_id = $1 
      WHERE user_id = $2 
      RETURNING *;
    `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      throw new Error('Resume not found or update failed.');
    }

    return result.rows[0];
  } catch (error: any) {
    console.error('Error updating resume:', error.message);
    throw new Error('Failed to update resume.');
  }
};

const updateResume = async (id: string, resumeData: Partial<IResume>) => {
  try {
    if (Object.keys(resumeData).length === 0) {
      throw new Error('No fields provided for update.');
    }

    // Convert employment_history to JSON string if it exists
    if (resumeData.employment_history) {
      resumeData.employment_history = JSON.stringify(
        resumeData.employment_history
      );
    }
    if (resumeData.education) {
      resumeData.education = JSON.stringify(resumeData.education);
    }

    const fields = Object.keys(resumeData);
    const values = Object.values(resumeData);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    const result = await pool.query(
      `UPDATE resumes SET ${setClause} WHERE id = $${
        fields.length + 1
      } RETURNING *`,
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
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [
      id,
    ]);

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
  findResumeById,
  setPrimary,
};
