import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { validateEmail } from '../utils/utils';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config';

const getAllUsers = async (): Promise<IUser[]> => {
  return await userRepository.findAllUsers();
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return await userRepository.findUserById(id);
};
const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await userRepository.findUserByEmail(email);
};

const createUser = async (userData: IUser): Promise<IUser> => {
  // Validate email format
  if (!validateEmail(userData.email)) {
    throw new Error('Invalid email format.');
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

  // Store the hashed password and other user data
  const newUser = { ...userData, password: hashedPassword };

  // Call the userRepository to save the user in the database
  return await userRepository.createUser(newUser);
};

const updateUser = async (
  id: string,
  userData: Partial<IUser>
): Promise<IUser | null> => {
  return await userRepository.updateUser(id, userData);
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  return await userRepository.deleteUser(id);
};

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
