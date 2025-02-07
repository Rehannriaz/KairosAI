import { JwtPayload } from 'jsonwebtoken';

export interface DecodedToken extends JwtPayload {
  userId: number;
  userName: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}
