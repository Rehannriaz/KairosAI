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
});

const connectToDatabase = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log('Connected to the PostgreSQL database');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
export { pool }; // Exporting the pool for query execution
