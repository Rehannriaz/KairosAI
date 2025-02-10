import { pool } from '../utils/database'; // Use the pool from your database.ts

const getUserPrimaryResume = async (userId: string): Promise<any> => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.name, r.location, r.email, r.phone, 
              r.professional_summary, r.skills, r.employment_history, 
              r.education, r.preferences 
       FROM resumes r
       JOIN user_primary_resume upr ON r.id = upr.resume_id
       WHERE upr.user_id = $1;`,
      [userId]
    );
    return result.rows[0];
  } catch (error: any) {
    console.error('Error fetching primary resume:', error.message);
    throw error;
  }
};

const getUserResumes = async (userId: string): Promise<any> => {
  try {
    const result = await pool.query(
      'SELECT id,name,location,email,phone,professional_summary,skills,employment_history,education,preferences FROM resumes where user_id=$1;',
      [userId]
    );
    return result.rows;
  } catch (error: any) {
    console.error('Error fetching jobs:', error.message);
    throw error;
  }
};
const getUserResumesEmbeddings = async (userId: string): Promise<any> => {
  try {
    const result = await pool.query(
      `SELECT r.embedding 
       FROM resumes r
       JOIN user_primary_resume upr ON r.id = upr.resume_id
       WHERE upr.user_id = $1;`,
      [userId]
    );
    return result.rows;
  } catch (error: any) {
    console.error('Error fetching jobs:', error.message);
    throw error;
  }
};

export default {
  getUserPrimaryResume,
  getUserResumes,
  getUserResumesEmbeddings,
};
