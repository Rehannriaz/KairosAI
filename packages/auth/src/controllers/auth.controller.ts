import { Request, Response } from 'express';
import userServices from '../services/auth.services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: 'Name, email, and password are required.' });
      return;
    }

    // Pass data to service for further processing (hashing and email validation)
    const user = await userServices.createUser({
      name,
      email,
      password,
      role: 'user',
    });

    // Return the created user details
    res.status(201).json(user);
  } catch (error: Error | any) {
    // Handle specific types of errors
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ error: 'Invalid data provided. Please check your input.' });
    } else {
      res
        .status(500)
        .json({ error: error.message || 'An unexpected error occurred.' });
    }
  }
};

// Login Controller
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the required fields are provided
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    // Validate user credentials
    const user = await userServices.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        userName: user.name,
        email: user.email,
        role: user.role,
      }, // Payload
      JWT_SECRET as string, // Secret key (ensure you have this in your environment)
      { expiresIn: '1h' } // Token expiration time
    );

    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevent JavaScript access
      secure: true, // Use secure cookies in production
      // sameSite: 'strict', // Prevent CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    // Return user details (without password) in the response
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ error: error.message || 'An unexpected error occurred.' });
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {};

const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    // sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logout successful' });
};

export default {
  login,
  signup,
  logout,
  authenticate,
};
