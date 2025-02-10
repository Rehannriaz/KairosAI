import { pool } from '../utils/database'; // Use the pool from your database.ts
import { IUser } from '../models/user.model';

// Fetch all users
const findAllUsers = async (): Promise<IUser[]> => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

// Fetch a user by ID
const findUserById = async (id: string): Promise<IUser | null> => {
  const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [
    id,
  ]);
  return result.rows.length ? result.rows[0] : null;
};
const findUserByEmail = async (id: string): Promise<IUser | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
};

// Create a new user
const createUser = async (userData: IUser): Promise<IUser> => {
  const { name, email, password, role } = userData;

  // Check if the email already exists in the database
  const emailCheckResult = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (emailCheckResult.rows.length > 0) {
    throw new Error('Email is already in use.');
  }

  // If email doesn't exist, proceed with inserting the new user
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, password, role]
  );

  return result.rows[0];
};

// Update an existing user
const updateUser = async (
  id: string,
  userData: Partial<IUser>
): Promise<IUser | null> => {
  const { name, email, password, role } = userData;
  const result = await pool.query(
    `UPDATE users 
     SET name = COALESCE($1, name), email = COALESCE($2, email), 
         password = COALESCE($3, password), role = COALESCE($4, role)
     WHERE user_id = $5 RETURNING *`,
    [name, email, password, role, id]
  );
  return result.rows.length ? result.rows[0] : null;
};

// Delete a user
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await pool.query(
    'DELETE FROM users WHERE user_id = $1 RETURNING *',
    [id]
  );
  return result.rows.length ? result.rows[0] : null;
};

export default {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
