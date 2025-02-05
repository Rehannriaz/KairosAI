import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { JWT_SECRET } from '../config';
export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

    if (!token) {
      res.status(401).json({ error: 'Authorization token is missing.' });
      return;
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
        return;
      }

      console.log('req', req);
      // Attach user information to the request object
      // req.user = decoded;
      res.status(200).json({ message: 'User authenticated successfully.' });

      next();
    });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ error: error.message || 'An unexpected error occurred.' });
  }
};
