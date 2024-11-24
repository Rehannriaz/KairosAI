import { Request, Response } from 'express';
import userServices from '../services/user.services';

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userServices.getAllUsers();
    console.log('reached here', users);
    res.status(200).json(users);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userServices.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userServices.createUser(req.body);
    res.status(201).json(user);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userServices.updateUser(req.params.id, req.body);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userServices.deleteUser(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: Error | any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
