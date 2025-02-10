import { Pool } from 'pg';
import dotenv from 'dotenv';
import { DB, DB_PORT, HOST, PASSWORD, USERNAME } from '../config/index';

dotenv.config();

const pool = new Pool({
  user: USERNAME,
  host: HOST,
  database: DB,
  password: PASSWORD,
  port: DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Use `true` for production with proper CA
  },
});

const connectToDatabase = async (): Promise<void> => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await pool.connect();
      console.log('Connected to the PostgreSQL database');
      return;
    } catch (error) {
      attempt++;
      console.error(`Database connection attempt ${attempt} failed:`, error);

      if (attempt >= maxRetries) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }

      // Wait for a short delay before retrying (e.g., 2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

export default connectToDatabase;
export { pool }; // Exporting the pool for query execution
