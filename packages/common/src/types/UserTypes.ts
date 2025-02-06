export interface UserJWT {
  userId: string;
  userName: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
