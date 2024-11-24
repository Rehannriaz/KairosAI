import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';

const getAllUsers = async (): Promise<IUser[]> => {
  return await userRepository.findAllUsers();
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return await userRepository.findUserById(id);
};

const createUser = async (userData: IUser): Promise<IUser> => {
  return await userRepository.createUser(userData);
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
  createUser,
  updateUser,
  deleteUser,
};
