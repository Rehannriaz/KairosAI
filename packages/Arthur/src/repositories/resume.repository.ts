import { pool } from '../utils/database';

class ResumeRepository {
  static async getUserResumes(userId: number) {
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
  }
}

export default ResumeRepository;
