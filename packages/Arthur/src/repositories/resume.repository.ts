import { pool } from '../utils/database';

const uploadUserResume = async (
  userId: string,
  parsedJson: any,
  embeddings: any[]
) => {
  try {
    await pool.query(
      `INSERT INTO resumes 
      (user_id, name, location, email, phone, professional_summary, skills, employment_history, education, preferences,embedding) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)`,
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

const getUserResumes = async (userId: number) => {
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

export default { getUserResumes, uploadUserResume };
