import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  userId: number;
  userName: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  return jwt.decode(token) as DecodedToken | null; // Type assertion to DecodedToken
};

export const getUsername = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedJWT = decodeToken(token);
      if (decodedJWT) {
        return String(decodedJWT.userName);
      }
    }
  } else {
    return null;
  }
};

export const getUserId = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedJWT = decodeToken(token);
      if (decodedJWT) {
        return String(decodedJWT.userId);
      }
    }
  } else {
    return null;
  }
};
